import firebase_admin
from firebase_admin import credentials, db, auth
import bcrypt
import os
from utils.password_security import check_password
from utils.scrape_text import scrape_text_utils
from firebase_admin.exceptions import FirebaseError
import json

class Database:
    """
    Database class for managing user authentication, word bank, and word filtering
    functionalities using Firebase Realtime Database.
    """

    def __init__(self):
        """
        Initializes the Firebase app and references for users, words, and word banks.
        """
        base_dir = os.path.dirname(os.path.abspath(__file__))
        cred_path = os.path.join(base_dir, "./../config/firebaseKey.json")

        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred, {
                "databaseURL": "https://naucse-a8142-default-rtdb.europe-west1.firebasedatabase.app"
            })

        self.user_ref = db.reference("users")
        self.words_ref = db.reference("words")
        self.word_bank_ref = db.reference("users_word_bank")

    def loginUser(self, name, password):
        """
        Logs in a user by verifying their credentials.

        Args:
            name (str): Username of the user.
            password (str): Password of the user.

        Returns:
            dict or str: User details if successful, or an error string if authentication fails.
        """
        try:
            res = self.user_ref.order_by_child("name").equal_to(name).get()
            if res:
                for user_id, user_data in res.items():
                    hash_pass = user_data.get("password")
                    if hash_pass and bcrypt.checkpw(password.encode("utf-8"), hash_pass.encode("utf-8")):
                        return {"id": user_id, "name": user_data.get("name"), "level": user_data.get("level_id")}
                    else:
                        return "false-password"
            else:
                return "false-username"
        except Exception as e:
            return "false-error"

    def signupUser(self, name, email, level, password):
        """
        Signs up a new user and adds their details to the database.

        Args:
            name (str): Username of the user.
            email (str): Email address of the user.
            level (int): User's learning level.
            password (str): User's password.

        Returns:
            dict: Success message or an error dictionary.
        """
        try:
            if not check_password(password):
                return {"error": "password-security-low"}

            existing_email_user = self.user_ref.order_by_child("email").equal_to(email).get()
            if existing_email_user:
                return {"error": "email-used"}

            existing_name_user = self.user_ref.order_by_child("name").equal_to(name).get()
            if existing_name_user:
                return {"error": "username-used"}

            hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
            new_user_ref = self.user_ref.push({
                "name": name,
                "email": email,
                "password": hashed_password,
                "level_id": level,
            })
            user_id = new_user_ref.key

            self.word_bank_ref.push({
                "users_id": user_id,
                "words_id": []
            })

            return {"success": "Signup successful!"}

        except Exception as e:
            return {"error": f"unexpected-error: {str(e)}"}

    def checkUser(self, user_id):
        """
        Checks if a user exists in the database.

        Args:
            user_id (str): User ID to check.

        Returns:
            bool or str: True if the user exists, or an error string if not.
        """
        try:
            self.user_ref.child(user_id).get()
            return True
        except auth.UserNotFoundError:
            return "false-user-not-found"
        except FirebaseError:
            return "false-error"

    def filter_words(self, user_level, web_url, user_id):
        """
        Filters words from a website based on the user's level and known words.

        Args:
            user_level (int): User's level of english
            web_url (str): URL to scrape data from.
            user_id (str): User's ID.

        Returns:
            dict: Filtered words or an error dictionary.
        """
        try:
            web_words = scrape_text_utils(web_url)
            if not web_words:
                return {"error": "No words found in the provided URL."}

            known_words = self.get_user_word_bank(user_id)
            if isinstance(known_words, dict) and "error" in known_words:
                return known_words

            all_words_data = self.words_ref.get()
            if not all_words_data:
                return {"error": "No word data found in the database."}

            valid_words = {
                word_data['name']: int(word_data['level'])
                for word_id, word_data in all_words_data.items()
                if word_data['name'] not in known_words
            }

            filtered_words = {
                word: valid_words[word]
                for word in web_words
                if word in valid_words and valid_words[word] > int(user_level)
            }

            return filtered_words

        except Exception as e:
            return {"error": str(e)}

    def get_user_word_bank(self, user_id):
        """
        Retrieves the words from a user's word bank.

        Args:
            user_id (str): User's ID.

        Returns:
            list or dict: List of known words or an error dictionary.
        """
        try:
            user_word_bank = self.word_bank_ref.order_by_child("users_id").equal_to(user_id).get()

            if not user_word_bank:
                return {"error": "No words found in the user's word bank."}

            user_word_ids = set()
            for word_bank_entry in user_word_bank.values():
                words = word_bank_entry.get('words_id', [])
                if isinstance(words, list):
                    user_word_ids.update(words)
                else:
                    user_word_ids.add(words)

            all_words_data = self.words_ref.get()
            if not all_words_data:
                return {"error": "No word data found in the database."}

            known_words = [
                word_data['name']
                for word_id, word_data in all_words_data.items()
                if word_id in user_word_ids
            ]

            return known_words

        except Exception as e:
            return {"error": str(e)}

    def add_word_to_bank(self, user_id, word_id):
        """
        Adds a word to a user's word bank.

        Args:
            user_id (str): User's ID.
            word_id (str): Word's ID to be added.

        Returns:
            str: Success or error message.
        """
        try:
            word_bank_query = self.word_bank_ref.order_by_child("users_id").equal_to(user_id).get()

            if word_bank_query:
                for doc_id, doc_data in word_bank_query.items():
                    word_bank_ref = self.word_bank_ref.child(doc_id)
                    words_id = doc_data.get('words_id', [])

                    if not isinstance(words_id, list):
                        words_id = []

                    if word_id not in words_id:
                        words_id.append(word_id)
                        word_bank_ref.update({"words_id": words_id})
                    else:
                        return "Word already exists in user's word bank."
                return "Word added successfully!"
            else:
                return "User's word bank not found."
        except Exception as e:
            return "Failed to add word."

    def remove_word_from_bank(self, user_id, word_id):
        """
        Removes a word from a user's word bank.

        Args:
            user_id (str): User's ID.
            word_id (str): Word's ID to remove.

        Returns:
            dict: Success or error message.
        """
        try:
            word_bank_query = self.word_bank_ref.order_by_child("users_id").equal_to(user_id).get()

            if not word_bank_query:
                return {"error": "User's word bank not found."}

            for doc_id, doc_data in word_bank_query.items():
                word_bank_ref = self.word_bank_ref.child(doc_id)
                words_id = doc_data.get('words_id', [])

                if not isinstance(words_id, list):
                    words_id = []

                if word_id in words_id:
                    words_id.remove(word_id)
                    word_bank_ref.update({"words_id": words_id})
                    return {"message": "Word removed successfully."}
                else:
                    return {"error": "Word not found in user's word bank."}

            return {"error": "User's word bank not found."}

        except Exception as e:
            return {"error": f"Failed to remove word. Error: {str(e)}"}

    def check_word_id(self, word):
        """
        //ignore

        Args:
            word (str): Name of the word to check.

        Returns:
            str or bool: Word ID if found, or False if not found.
        """
        try:
            result = self.words_ref.order_by_child("name").equal_to(word).get()

            if result:
                word_id = next(iter(result.keys()))
                return word_id
            else:
                return False
        except Exception as e:
            return False


