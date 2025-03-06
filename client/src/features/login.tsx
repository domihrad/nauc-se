import React, { useState } from "react";
import { LoginApi } from "../api/loginApi";
import { useNavigate } from "react-router-dom";
import { openExtension } from "../pages/homePage";


/**
 *  LoginPage component for user to log in.
 *
* @component
* @returns {JSX.Element} The SignupPage component.
*/

export const LoginPage: React.FC = () =>
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    /**
     * Handles the login click event when the user wants to log in.
    * @async
    * @function
    */
    const handleLoginClick = async () =>
    {
        setIsLoading(true);
        if (!username || !password)
        {
            setErrorMessage("Enter username & password");
            setIsLoading(false);
            return;
        }

        try
        {
            await LoginApi(username, password);

            const storedValue = JSON.stringify(username);

            if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {chrome.storage.local.set({ user: storedValue });}
            else { localStorage.setItem("user", storedValue);}

            const widthWindow = window.innerWidth;
            if (widthWindow > 1000)
            {
                openExtension(navigate);
            }
            else
            {
                navigate("/");
            }
            window.location.reload();

        }
        catch (err: any)
        {
            setIsLoading(false);
            if (err.message === "error-password" || err.message === "error-username") setErrorMessage("Invalid credentials");
            else setErrorMessage("Error occurred.");
        }
        finally
        {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <form className="mt-6 space-y-4 max-w-80 w-full" onSubmit={(e) => e.preventDefault()}>
                <div className="">
                    <label className="text-sm mb-2 block text-center dark:text-white">Username</label>
                    <div className="relative flex items-center">
                        <input
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border px-4 py-3 rounded-md text-base dark:bg-gray-800 dark:text-white dark:border-gray-600 no-style"
                            placeholder="Enter username"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-sm mb-2 block text-center dark:text-white">Password</label>
                    <div className="relative flex items-center">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border px-4 py-3 rounded-md text-base dark:bg-gray-800 dark:text-white dark:border-gray-600 no-style"
                            placeholder="Enter password"
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
                <div className="min-h-[24px] flex justify-center items-center">
                    {errorMessage && <p className="text-red-500 text-sm text-center no-style">{errorMessage}</p>}
                </div>
                <div className="mt-4">
                    <button
                        onClick={handleLoginClick}
                        className={`w-full py-3 px-4 text-sm tracking-wide rounded-lg ${isLoading ? 'bg-gray-500' : 'bg-blue-600'} hover:bg-blue-700 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800 no-style`} >
                        <span className="no-style">{isLoading ? "Login in ..." : "Login"}</span>
                    </button>
                </div>
                <p className="text-sm mt-3 text-center dark:text-white">
                    Don't have an account?
                    <a
                        onClick={() => navigate("/signup")}
                        className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold dark:text-blue-400 no-style noselect">
                        Register here
                    </a>
                </p>
            </form>
        </div>
    );
};
