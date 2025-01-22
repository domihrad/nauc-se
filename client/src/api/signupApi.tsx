import { Globals } from "..";

/**
 * Signs up a new user.
 *
 * @async
 * @function signupUser
 * @param {string} username - User's username.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @param {string} level - User's level.
 * @returns {Promise<boolean>} A promise that resolves when is valid.
 * @throws {Error} Catch error from API.
 */

export const signupUser = async (username: string, email: string, password: string, level: string): Promise<boolean> =>
{
    try
    {
        const response = await fetch(`${Globals.apiUrl}/signupuser`,
        {
            method : "POST",
            headers :
            {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
            {
                name: username,
                email,
                password,
                level,
            }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Signup failed");
        return true;

    }
    catch (err)
    {
        throw new Error(`${(err as Error)?.message || err}`);
    }
};
