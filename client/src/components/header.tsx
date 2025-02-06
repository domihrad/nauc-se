import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LightToggleMode } from "../utils/lightToggleUtils";
import { getValData, removeValData } from "../services/getDataChrome";
import { FaUserCog } from "react-icons/fa";

/**
 * Header component that displays navigation links, user information, and light mode toggle.
 *
 * @component
 * @returns {JSX.Element} The rendered header component.
 */

export const Header : React.FC = () =>
{
    const [isOpen, setIsOpen] = useState(false);
    const [userExist, setUserExist] = useState<string | null>(null);
    const navigate = useNavigate();


    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() =>
    {
        const checkUserExistence = async () =>
        {
            const userData = await getValData("user");
            if (userData && userData.trim() !== "")
            {
                const userDataTrim = userData.slice(1, -1);
                setUserExist(userDataTrim);

            }
            else
            {
                removeValData("user");
            }
        };

        checkUserExistence();
    }, []);

    const handleLogin = () => navigate("/login");

    const handleNavigateHome = () => navigate("/");

    const signOut = () =>
    {
        removeValData("user");
        removeValData("userId");
        removeValData("level");
        navigate("/login");
        setTimeout(() => window.location.reload(), 0);
    }


    return (
        <div className="flex items-center justify-center h-min">
            <div className="flex items-center space-x-4 m-4 w-full">
                <div className="w-1/2">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center justify-between">
                            <Link
                                to="/"
                                onClick={handleNavigateHome}
                                className="text-base md:text-xl lg:text-2xl no-underline hover:underline noselect"
                            >
                                NaučSe!
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="w-1/2">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center justify-between">
                            {userExist ? (
                                <div className="p-4">
                                    <FaUserCog
                                        id="dropdownInformationButton"
                                        size={20}
                                        onClick={toggleDropdown}
                                        className="cursor-pointer"
                                    />
                                    {isOpen && (
                                        <div
                                            id="dropdownInformation"
                                            className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-[8rem] dark:bg-gray-700 dark:divide-gray-600 absolute top-16"
                                        >
                                        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                            <p className="font-medium truncate">{userExist}</p>
                                        </div>
                                            <a
                                            onClick={ signOut }
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white noselect"
                                            >
                                                Sign out
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={handleLogin}
                                    className="items-center justify-center text-base md:text-xl lg:text-2xl no-underline mr-3 hover:underline noselect"
                                >
                                    Login
                                </Link>
                            )}
                            <LightToggleMode />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
