import { useState, useEffect } from "react";
import { GetUrlUtils } from "./getUrlUtils";
import { GetTextApi } from "../api/scrapeTextApi";
import { getValData } from "../services/getDataChrome";



/**
 * Hook to fetch and store scraped data.
 *
 * @function
 * @returns {Object} - Returns an object containing:
 *   - scrapedData : The scraped data as a string or null.
 *   - loading : If is it still loading to load block loading.
 *   - error : Any type of error.
 *
 * @throws {Error} Catch any error.
 */

export const useScrapedData = () =>
{
    const [scrapedData, setScrapedData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const url = GetUrlUtils();

    useEffect(() =>
    {
        const fetchData = async () =>
        {
            if (!url) return;

            setLoading(true);
            try
            {
                const level = await getValData("level");
                const data = await GetTextApi(url, level);
                setScrapedData(JSON.stringify(data, null, 2));
            }
            catch (err)
            {
                setError(`${(err as Error)?.message || err}`);
                throw new Error(`${(err as Error)?.message || err}`);
            }
            finally
            {
                setLoading(false);
            }
        };

        fetchData();

    }, [url]);


    return { scrapedData, loading, error };

};
