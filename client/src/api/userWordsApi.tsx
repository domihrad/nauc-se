import { Globals } from "..";

/**
 * Fetches the user's words from the server by ID.
 *
 *
 * @async
 * @function UserWordsApi
 * @param {string} id - User's ID.
 * @returns {Promise<any>} A promise that resolves with the user's words data if successful
 * @throws {Error} Catch error from API.
 */

export const UserWordsApi = async (id : string) =>
{
    try
    {
        const response = await fetch(`${Globals.apiUrl}/userwords`,
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
            return false;
        }

        const data = await response.json();
        return data;

    }
    catch (err: any)
    {
        throw new Error(`${(err as Error)?.message || err}`);
    }
};
