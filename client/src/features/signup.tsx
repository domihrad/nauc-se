import React, { useState } from "react";
import { signupUser } from "../api/signupApi";
import { LoginApi } from "../api/loginApi";
import { useNavigate } from "react-router-dom";
import { setValData } from "../services/getDataChrome";
import { IsValidEmail } from "../utils/signupUtils";

/**
 * SignupPage component for user registration.
 *
 * @component
 * @returns {React.ReactElement} The LoginPage component.
 */

export const SignupPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [level, setLevel] = useState("1");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    /**
    * Handles the signup process for the user.
    *
    * @async
    * @function handleSignupClick
    * @returns {Promise<void>} Promises to resolve when the signup process is complete.
    * @throws {Error} Custom error handeling
    */

    const handleSignupClick = async () =>
    {

        if (isLoading) return;

        setIsLoading(true);

        if (username === "" || password === "" || email === "")
        {
            setErrorMessage("Enter credentials")
            setIsLoading(false);
            return;
        }

        try
        {
            const success = await signupUser(username, email, password, level);
            if (success)
            {
                await LoginApi(username, password);
                const userData = JSON.stringify(username);
                await setValData("user", userData);
                navigate("/");
                setTimeout(() => window.location.reload(), 0);
            }
        }
        catch (err: any)
        {
            if (err.message === "username-used") setErrorMessage("Username is already taken");
            else if (!IsValidEmail(email))setErrorMessage("Email is invalid");
            else if (err.message === "password-security-low") setErrorMessage("Password is not secure")
            else  setErrorMessage(err.message || "Unexpected error occurred");
        }
        finally
        {
            setIsLoading(false);
        }
    }


    return (
        <form className="mt-8 space-y-4 m-3">
            <div>
                <label className="text-sm mb-2 block text-center dark:text-white">Username</label>
                <input
                    name="username"
                    type="text"
                    maxLength={8}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border px-4 py-3 rounded-md text-base dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Enter user name"
                    required
                />
            </div>
            <div>
                <label htmlFor="email" className="text-sm mb-2 block text-center dark:text-white">Email</label>
                <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                     className="w-full border px-4 py-3 rounded-md text-base dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Enter email"
                    required
                />
            </div>
            <div>
                <label className="text-sm mb-2 block text-center dark:text-white">Password</label>
                <div className="relative flex items-center">
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border px-4 py-3 rounded-md text-base dark:bg-gray-800 dark:text-white dark:border-gray-600"
                        placeholder="Enter password"
                        required
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#bbb"
                        stroke="#bbb"
                        className="w-4 h-4 absolute right-4 cursor-pointer"
                        viewBox="0 0 128 128"
                        onClick={togglePasswordVisibility}>
                        <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" />
                    </svg>
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <select
                    id="level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-9/12 py-2 px-4 text-center text-sm font-medium text-gray-500 border border-gray-300 rounded-lg focus:ring-4 focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600">
                    <option value="1">A1 - Beginner</option>
                    <option value="2">A2 - Elementary</option>
                    <option value="3">B1 - Intermediate</option>
                    <option value="4">B2 - Upper Intermediate</option>
                    <option value="5">C1 - Advanced</option>
                    <option value="6">C2 - Proficiency</option>
                </select>
            </div>
            {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
            <div className="flex justify-center mt-7">
                <button
                    type="button"
                    onClick={handleSignupClick}
                    disabled={isLoading}
                    className={`w-full py-3 px-4 text-sm tracking-wide rounded-lg ${isLoading ? 'bg-gray-500' : 'bg-blue-600'} hover:bg-blue-700 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800 no-style`} >
                    {isLoading ? "Signing Up..." : "Register"}
                </button>
            </div>
            <p className="text-sm mt-4 text-center dark:text-white">
                Already have an account?
                <a
                    onClick={() => navigate("/login")}
                    className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold dark:text-blue-400 no-style noselect">
                    Login here
                </a>
            </p>
        </form>
    );
};
