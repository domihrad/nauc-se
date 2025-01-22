/**
 * Creates a context menu item in the Chrome extension.
*/

if (typeof chrome !== 'undefined' && chrome.contextMenus)
{
    chrome.contextMenus.create(
    {
        id: "naučse",
        title: "naučse",
        contexts: ["selection"]
    });
}


/**
 * Handles the context menu click, it will then update in the storage
 *
 *
 * @async
 * @function handleContextMenuClick
 * @param {chrome.contextMenus.OnClickData} info - Data about the context menu item click.
 */
const handleContextMenuClick = async (info) =>
{
    if (info.selectionText !== null)
    {
        try
        {
            await new Promise((resolve, reject) =>
            {
                chrome.storage.local.set({ "selectedText": info.selectionText }, () =>
                {
                    if (chrome.runtime.lastError)
                    {
                        reject(chrome.runtime.lastError);
                    }
                    else
                    {
                        resolve();
                    }
                });
            });

            chrome.action.openPopup();
        }
        catch (err)
        {
            console.error(err);
        }
    }
};

chrome.contextMenus.onClicked.addListener(handleContextMenuClick);
