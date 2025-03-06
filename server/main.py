from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from bs4 import BeautifulSoup
import requests
from db.database import Database
import re

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

db_conn = Database()
TRANSLATOR = pipeline("translation", model="Helsinki-NLP/opus-mt-en-cs")


"""
    Scrapes a website and filters words based on user's level.

    - url (str): URL of website.
    - user_id (str): User's ID.
    - level (str): The level of the user.

    :return: All of the words of the user.
"""
@app.route("/scrape", methods=["POST"])
def scrape_website():
    try:
        data = request.get_json()
        url = data.get("url")
        user_id = data.get("user_id")
        user_level = data.get("level")

        if not url or not user_level:
            return jsonify("error-no-url", 400)

        res = db_conn.filter_words(user_level, url, user_id)
        return jsonify(res)
    except Exception:
        return jsonify("error-unknown", 500)


"""
    Translates english words using trained model.

    - text (str): Text that should be translated.

    :return: The translated text.
"""
@app.route("/translate", methods=["POST"])
def translate_text():
    try:
        data = request.get_json()
        text = data.get("text", "")

        if not text:
            return jsonify("error-no-text", 400)

        translated_text = TRANSLATOR(text, max_length=256)[0]["translation_text"]
        return jsonify({"translated_text": translated_text})
    except Exception:
        return jsonify("error-unknown", 500)

"""
    Login check.

    - name (str): User's name / username.
    - password (str): User's password.

    :return: Validates if user exists and then returns it.
"""
@app.route("/loginuser", methods=["POST"])
def login_user():
    data = request.get_json()
    name = data.get("name")
    password = data.get("password")

    if not name or not password:
        return jsonify("error-no-credentials", 400)

    user_result = db_conn.loginUser(name, password)
    if isinstance(user_result, dict):
        return jsonify({"id": user_result["id"], "name": user_result["name"], "level": user_result["level"]}), 200
    elif user_result == "false-password":
        return jsonify({"error": "error-password"}), 401
    elif user_result == "false-username":
        return jsonify({"error": "error-username"}), 401

    else:
        return jsonify("error-unknown", 500)

"""
    Sign up proccess for new user.

    - name (str): User's name / username.
    - email (str): User's email.
    - level (str): User's level of english.
    - password (str): User's password.

    :return: Validates if users signup is valid.
"""
@app.route("/signupuser", methods=["POST"])
def signup_user():
    data = request.get_json()
    user_name = data.get("name")
    email = data.get("email")
    level = data.get("level")
    password = data.get("password")

    if not user_name or not email or not password:
        return jsonify({"error": "error-no-signup-info"}), 400

    res = db_conn.signupUser(user_name, email, level, password)
    if res.get("error"):
        return jsonify({"error": res["error"]}), 400

    return jsonify({"message": res}), 200

"""
    Check if user is still signed by special id.

    - id (str): User's ID.

    :return: Validated response based if it validated.
"""
@app.route("/checkuser", methods=["POST"])
def check_user():
    data = request.get_json()
    id_user = data.get("id")
    res = db_conn.checkUser(id_user)

    if res is True:
        return jsonify({"status": "success"}), 200
    else:
        return jsonify("error-check-user", 400)

@app.route("/remove", methods=["GET"])
def removes():
    """
    Removes a word from the database.

    :return: JSON response with success or error message.
    """
    try:
        user_result = db_conn.remove_word_db()
        return user_result
    except Exception:
        return jsonify("error-remove", 500)

"""
    Add user's word to his word bank.

    - id (str): User's ID.
    - word (str): The word that should be added.

    :return: Return validated responce.
"""
@app.route("/addwordbank", methods=["POST"])
def addWordsUser():
    try:
        data = request.get_json()
        id_user = data.get("id")
        word_name = data.get("word")

        if not id_user or not word_name:
            return jsonify({"error": "error-no-word-info"}), 400

        word_id = db_conn.check_word_id(word_name)
        if not word_id:
            return jsonify({"error": "word-id-not-found"}), 404

        res = db_conn.add_word_to_bank(id_user, word_id)
        return jsonify({"message": res}), 200
    except Exception as e:
        return jsonify({"error": "error-add-word", "details": str(e)}), 500


"""
    Removes a word from the user's word bank.

    - id (str): User's ID.
    - word (str): The word that should be removed from word bank.

    :return: Response of validated response.
"""
@app.route("/removewordbank", methods=["POST"])
def removeWordsUser():
    try:
        data = request.get_json()
        id_user = data.get("id")
        word_name = data.get("word")

        if not id_user or not word_name:
            return jsonify({"error": "error-no-word-info"}), 400

        word_id = db_conn.check_word_id(word_name)
        if not word_id:
            return jsonify({"error": "word-id-not-found"}), 404

        res = db_conn.remove_word_from_bank(id_user, word_id)
        return jsonify({"message": res}), 200

    except Exception as e:
        return jsonify({"error": "error-remove-word", "details": str(e)}), 500


"""
    Retrieves all words in the user's word bank.

    Request Body:
    - id (str): The user's ID.

    :return: Response with the user's word bank.
"""
@app.route("/userwords", methods=["POST"])
def getWordsUser():
    try:
        data = request.get_json()
        id_user = data.get("id")

        if not id_user:
            return jsonify("error-no-user-id", 400)

        user_words = db_conn.get_user_word_bank(id_user)
        return user_words
    except Exception:
        return jsonify("error-get-words", 500)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
