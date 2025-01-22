import { setValData } from "../services/getDataChrome";
import { Globals } from "..";

/**
 * Make login connection based on username and password.
 *
 * @async
 * @function LoginApi
 * @param {string} id - Users username.
 * @param {string} password - Users password.
 * @returns {data} Return users data back with his level
 * @throws {Error} Catch error from API.
 */




export const LoginApi = async (username: string, password: string)=>
{
    try
    {
        const response = await fetch(`${Globals.apiUrl}/loginuser`,
        {
            method : "POST",
            headers :
            {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
            {
                name : username,
                password : password,

            }),
        });

        if (!response.ok)
        {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }

        const data = await response.json();

        setValData("userId", data.id);
        setValData("user", data.name);
        setValData("level", data.level);

        return data;
    }
    catch (err : any)
    {
        throw new Error(`${(err as Error)?.message || err}`);
    }
};
