import React, { useState, useEffect } from "react";
import { IoMoon, IoSunny } from "react-icons/io5";
import { getValData, setValData } from "../services/getDataChrome";

/**
 * Toggle dark / light mode
 * @function.
 * @returns {JSX.Element} The rendered switch component.
 *
 */

export const LightToggleMode: React.FC = () =>
{
    const [dark, setDark] = useState(false);

    useEffect(() =>
    {
        const fetchStoredMode = async () =>
        {
            try
            {
                const storedMode = await getValData("LightToggleMode");
                if (storedMode === "black")
                {
                    setDark(true);
                    applyDarkMode(true);
                }
                else
                {
                    setDark(false);
                    applyDarkMode(false);
                }

            }
            catch (err)
            {
                throw new Error(`${(err as Error)?.message || err}`);
            }
        };

        fetchStoredMode();
    }, []);

    const applyDarkMode = (isDark: boolean) =>
    {
        const colorText = isDark ? "white" : "black";
        document.body.classList.toggle("dark", isDark);

        const bodyElements = Array.from(document.querySelectorAll("body *"))
            .filter(el => !el.classList.contains("no-style"));

        bodyElements.forEach((el) =>
        {
            if (el instanceof HTMLElement)  el.style.color = colorText;
        });
    };

    const darkModeHandler = async () =>
    {
        const newDarkMode = !dark;
        setDark(newDarkMode);
        try
        {
            await setValData("LightToggleMode", newDarkMode ? "black" : "white");
        }
        catch (err)
        {
            throw new Error(`${(err as Error)?.message || err}`);
        }
        applyDarkMode(newDarkMode);
    };

    return (
        <div className="flex items-right justify-center">
            <button onClick={darkModeHandler}>
                {dark ? (
                    <IoSunny size="20" className="text-base" style={{ color: "white" }} />
                ) : (
                    <IoMoon size="20" className="text-base" style={{ color: "black" }} />
                )}
            </button>
        </div>
    );
};
