import React, { useEffect, useState } from "react";
import { WordHighlighter } from "../utils/highlightTextUtils";
import { getValData } from "../services/getDataChrome";
import { removeAddedWords, addWordsToBank } from "../utils/homepageUtils";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { CheckLoginUtils } from "../utils/checkLoginUtils";
import { TranslateApi } from "../api/translateApi";
import { setValData } from "../services/getDataChrome";
import { useNavigate } from "react-router-dom";
import { Globals } from "..";

/**
 * Homepage
 *
 * @component
 * @returns {React.ReactElement} The rendered Homepage component.
 */

export const openExtension = (navigate: ReturnType<typeof useNavigate>) =>
{
    window.innerWidth > Globals.widthRequired
        ? navigate("/learnpage")
        : window.open(`chrome-extension://${Globals.appId}/index.html#/learnpage`, "_blank");
};

export const Homepage: React.FC = () =>
{
    const [userId, setUserId] = useState("");
    const [addedWords, setAddedWords] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [translations, setTranslations] = useState<Record<string, string>>({});

    const navigate = useNavigate();

    CheckLoginUtils();

    const getUserId = async () =>
    {
        const userIdGet = await getValData("userId");
        setUserId(userIdGet)
    }
    getUserId();

    useEffect(() =>
    {
        const getWords = async () => {
            const storedWords = await getValData("words-data");

            if (storedWords) setAddedWords(storedWords);
            else setAddedWords([]);
        };

        getWords();
    }, []);


    useEffect(() =>
    {
        chrome.storage.local.get("selectedText", (result) =>
        {
            if (result.selectedText)
            {
                setAddedWords((currentWords) =>
                {
                    if (currentWords.includes(result.selectedText)) return currentWords;

                    const updatedWords = [...currentWords, result.selectedText];

                    setValData("words-data", updatedWords)
                        .then(() => chrome.storage.local.remove("selectedText"));

                    return updatedWords;
                });
            }
        });
        chrome.storage.local.remove("selectedText");
    }, []);



    useEffect(() => {
        const addNewWordsToBank = async () =>
        {
            if (addedWords.length > 0) {
                try
                {
                    for (const word of addedWords)
                    {
                        await addWordsToBank(userId, word.toLowerCase());
                    }

                }
                catch (err)
                {
                    throw new Error(`${(err as Error)?.message || err}`);
                }
            }
        };

        addNewWordsToBank();
    }, [addedWords]);




    useEffect(() =>
    {
        const fetchTranslations = async () =>
        {
            const newTranslations: Record<string, string> = {};
            for (const word of addedWords)
            {
                newTranslations[word] = await TranslateApi(word.toLowerCase());
            }
            setTranslations(newTranslations);
        };

        fetchTranslations();
    }, [addedWords]);

    const handleAddAllWords = async () =>
    {
        try
        {
            setIsLoading(true);
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let i = 0; i < addedWords.length; i++)
            {
                try
                {
                    await addWordsToBank(userId, addedWords[i].toLowerCase());
                    await delay(300);
                }
                catch (err)
                {
                    throw new Error(`${(err as Error)?.message || err}`);
                }
            }

            await setValData("words-data", []);
            setAddedWords([]);
            window.location.reload();
        }
        catch (err)
        {
            throw new Error(`${(err as Error)?.message || err}`);
        }
        finally
        {
            setIsLoading(false);
        }
    };


    return (
        <>
            <div className="w-full flex items-center justify-center">
                <div className="mt-4 space-y-4 m-3 w-64">
                    {   window.innerWidth > Globals.widthRequired ? <h1 className="text-center text-lg">Welcome to Nauč-Se</h1> : <></>

                    }
                    <div className="mb-5 flex items-center justify-center">
                        <button
                            className="text-sm w-64 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 no-style"
                            onClick={() => openExtension(navigate)}
                        >
                            Start revision
                        </button>
                    </div>
                            {addedWords.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-center">
                                        <div className="relative flex flex-col rounded-lg shadow-sm border border-slate-200">
                                            <nav className="flex w-64 flex-col gap-1 p-1.5">
                                                <div className="max-h-[230px] overflow-y-auto
                                                                [&::-webkit-scrollbar]:w-2
                                                                [&::-webkit-scrollbar-track]:rounded-full
                                                                [&::-webkit-scrollbar-track]:bg-gray-100
                                                                [&::-webkit-scrollbar-thumb]:rounded-full
                                                                [&::-webkit-scrollbar-thumb]:bg-gray-300
                                                                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                                                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                                                    {addedWords.map((word, index) =>
                                                    (
                                                        <div
                                                            key={index}
                                                            className="text-sm dark:text-white flex w-full items-center rounded-md p-2 pl-3 transition-all">
                                                                <div className="flex items-center justify-center gap-1">
                                                                    <p className="text-xs">{` ${word.toLowerCase()}` }</p>
                                                                    <span>{" - "}</span>
                                                                    <p className="text-xs">{(translations[word] as string)?.toLowerCase()}</p>
                                                                </div>
                                                            <div className="ml-auto flex align-center justify-center">
                                                                <button className="dark:text-white rounded-md border border-transparent p-1 text-center text-sm transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button"
                                                                        onClick={async () =>
                                                                        {
                                                                            await addWordsToBank(userId, word);
                                                                            const updatedWords = addedWords.filter((_, i) => i !== index);
                                                                            await setValData("words-data", updatedWords);
                                                                            setAddedWords(updatedWords);
                                                                        }}
                                                                >
                                                                    <IoMdAddCircleOutline size={18} />
                                                                </button>
                                                                <button className="dark:text-white rounded-md border border-transparent p-1 text-center text-sm transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button"
                                                                    onClick={() => removeAddedWords(word, index)}>
                                                                    <FaTrashAlt size={15} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </nav>
                                        </div>
                                    </div>
                                    <div className="mb-5 flex items-center justify-center">
                                        <button
                                            className="text-sm w-64 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 no-style"
                                            onClick={ handleAddAllWords }
                                            >
                                            {isLoading ? "Adding . . ." : "Add to learning list"}
                                        </button>
                                    </div>
                                </>
                            ) :
                            (
                                window.innerWidth > Globals.widthRequired ? <></> : <h2 className="text-center">No words added yet</h2>
                            )
                    }
                    <WordHighlighter />
                </div>
            </div>
        </>
    );
};
