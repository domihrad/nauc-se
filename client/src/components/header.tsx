import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LightToggleMode } from "../utils/lightToggleUtils";
import { getValData, removeValData } from "../services/getDataChrome";

/**
 * Header component that displays navigation links, user information, and light mode toggle.
 *
 * @component
 * @returns {JSX.Element} The rendered header component.
 */

export const Header : React.FC = () =>
{
    const [userExist, setUserExist] = useState<string | null>(null);
    const navigate = useNavigate();

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


    return (
        <div className="flex items-center justify-center h-min">
            <div className="flex items-center space-x-4 m-4 w-full">
                <div className="w-3/5">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center justify-between">
                            <Link
                                to="/"
                                onClick={handleNavigateHome}
                                className="text-base no-underline hover:underline noselect"
                            >
                                NaučSe!
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="w-2/5">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center justify-between">
                            {userExist ? (
                                <span className="text-base no-underline mr-3 noselect">
                                    {userExist}
                                </span>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={handleLogin}
                                    className="items-center justify-center text-base no-underline mr-3 hover:underline noselect"
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
