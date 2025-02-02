import { Globals } from "..";

/**
 * Check login by users speacial ID.
 *
 * @async
 * @function CheckLoginApi
 * @param {string} id - Users ID.
 * @returns {Promise<boolean>} Promise that will resolve if it is true or false.
 * @throws {Error} Catch error from API.
 */

export const CheckLoginApi = async (id : string) : Promise<boolean> =>
{
    try
    {
        const response = await fetch(`${Globals.apiUrl}/checkuser`,
        {
            method : "POST",
            headers :
            {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
            {
                id : id,

            }),
        });

        if (!response.ok)
        {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }
        return true;
    }
    catch (err: any)
    {
        throw new Error(`${(err as Error)?.message || err}`);
    }
};
