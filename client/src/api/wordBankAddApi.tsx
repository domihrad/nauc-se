import { Globals } from "..";

/**
 * Add's a word to the user's word bank.
 *
 * @async
 * @function WordBankAddApi
 * @param {string} id - User's ID.
 * @param {string} word - The word that wants to be added.
 * @returns {Promise<any>} Promise to resolve the data.
 * @throws {Error} Catch error from API.
 */

export const WordBankAddApi = async (id: string, word: string) =>
{
    try
    {
        const response = await fetch(`${Globals.apiUrl}/addwordbank`,
        {
            method : "POST",
            headers :
            {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
            {
                id : id,
                word : word,
            }),
        });

        if (!response.ok)
        {
            try
            {
                const errorData = await response.json();
                throw new Error(errorData.error || "error");

            }
            catch (jsonError)
            {
                const errorText = await response.text();
                throw new Error(errorText || "error");
            }
        }

        try
        {
            const data = await response.json();
            return data;
        }
        catch (err)
        {
            const text = await response.text();
            return { success: false, message: text || "parse error" };
        }
    }
    catch (err : any)
    {
        throw new Error(`${(err as Error)?.message || err}`);
    }
};
