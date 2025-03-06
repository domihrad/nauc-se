import { CheckLoginUtils } from "./checkLoginUtils";
import { WordBankAddApi } from "../api/wordBankAddApi";
import { getValData, setValData } from "../services/getDataChrome";

/**
 * Call Homepage data
 * @async
 * @function
 *
 */

export const HomepageUtils: React.FC = () =>
{
    CheckLoginUtils();
    return null;
};
/**
 * Remove words form quick save storage.
 * @async
 * @function
 * @param {string} word - Name of the word.
 * @param {number} index - The index of the word.
 *
 */
export const removeAddedWords = async (word: string, index: number) =>
{

    const storedWords : Array<string> = await getValData("words-data");
    if (storedWords)
    {;
        const arr = removeItemByName(storedWords, word);
        await setValData("words-data", arr);

        window.location.reload();
    }
};
/**
 * Call the api to add it
 * @async
 * @function
 * @param {string} user_id - User's id.
 * @param {string} word - Name of the word to be added.
 *
 */
export const addWordsToBank = async (user_id : string, word : string) =>
{
    try
    {
        WordBankAddApi(user_id, word);
    }
    catch (err)
    {
        throw new Error(`${(err as Error)?.message || err}`);
    }

}
/**
 * Add words form quick save storage.
 * @function
 * @param {string[]} arr - Array of holded words.
 * @param {string} name - Name of the word to be added.
 *
 */
const removeItemByName = (arr: string[], name: string): string[] =>
{
    return arr.filter(item => item !== name);
};
