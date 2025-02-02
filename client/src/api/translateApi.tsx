import { Globals } from "..";

/**
 * Translates the given text using the translation API in the backend.
 *
 *
 * @async
 * @function TranslateApi
 * @param {string} textToTranslate - Text to be translated.
 * @returns {Promise<string>}  A promise that resolves when is valid.
 * @throws {Error}  Catch error from API.
 */

export const TranslateApi = async (textToTranslate: string): Promise<string> =>
{
    try
    {
        const response = await fetch(`${Globals.apiUrl}/translate`,
        {
            method : "POST",
            headers :
            {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
            {
                text : textToTranslate
            }),
        });

        if (!response.ok)
        {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }

        const data = await response.json();
        return data.translated_text;

    } catch (err)
    {
        throw new Error(`${(err as Error)?.message || err}`);
    }
};
