/**
 * Validate email.
 *
 * @function
 * @param {string} email - Users email
 * @returns {boolean} - If the email is valid or not.
 *
*/


export const IsValidEmail = (email : string) : boolean =>
{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
