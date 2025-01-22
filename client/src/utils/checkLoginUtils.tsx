import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getValData, removeValData } from "../services/getDataChrome";
import { CheckLoginApi } from "../api/checkLoginApi";


/**
 * Check if user is logged still
 *
 *
 * @component
 * @returns {void} Return nothing just checks it.
 * @throws {Error} Catch error.
 */

export const CheckLoginUtils = () =>
{
    const navigate = useNavigate();

    useEffect(() =>
    {
        const checkUserExistence = async () =>
        {

            try
            {
                const userId = await getValData("userId");
                if (userId !== null)
                {
                    const res = await CheckLoginApi(userId);
                    if (res)
                    {
                        navigate("/");
                    }

                }
                else
                {
                    removeValData("user");
                    removeValData("level");
                    navigate("/login");
                    window.location.reload();
                }
            }
            catch (err)
            {
                throw new Error(`${(err as Error)?.message || err}`);
            }
        }
        checkUserExistence();

    }, [navigate]);
};
