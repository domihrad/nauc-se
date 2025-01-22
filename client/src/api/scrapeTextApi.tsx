import { Globals } from "..";
import { getValData } from "../services/getDataChrome";

/**
 * Fetches text data from a specific URL based on the user's level and ID.
 *
 * @async
 * @function GetTextApi
 * @param {string} url - URL to scrape from.
 * @param {string} level - Users level of english.
 * @returns {Promise<any>} Promise that resolves with the scraped text data.
 * @throws {Error} Catch error from API.
 */

export const GetTextApi = async (url : string, level : string) =>
{

    const userId = await getValData("userId");
    try
    {

        const response = await fetch(`${Globals.apiUrl}/scrape`,
        {
            method: "POST",
            headers:
            {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
            {
                url: url,
                level: level,
                user_id : userId,
            }),
        });

        const data = await response.json();

        if (!response.ok)
        {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }

        return data;
    }
    catch (err)
    {
        throw new Error(`${(err as Error)?.message || err}`);
    }
};
