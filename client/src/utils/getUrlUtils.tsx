import { useEffect, useState } from "react";

/**
 * Get current URL that is being viewed.
 *
 * @component
 * @returns {string} String of the URL.
 */

export const GetUrlUtils = () => {
    const [url, setUrl] = useState<string>("");

    useEffect(() =>
    {
        const getActiveTabUrl = () =>
        {
            if (typeof chrome !== "undefined" && chrome.tabs)
            {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
                {
                    if (tabs && tabs.length > 0)
                    {
                        const activeTab = tabs[0];
                        if (activeTab.url)
                        {
                            setUrl(activeTab.url);
                        }
                    }
                });
            }
        };

        getActiveTabUrl();
    }, []);

    return url;
};
