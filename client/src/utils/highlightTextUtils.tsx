import React, { useEffect } from "react";
import { useScrapedData } from "./scrapeTextUtils";
import { LoadingBlock } from "../blocks/loadingBlock";

declare global
{
    /**
    * Function to capture clicks by the user so it can be processed.
    * @param {MouseEvent} event - Mouse event on click.
    */
    interface Window
    {
        captureWord: (event: MouseEvent) => void;
        currentBox: HTMLElement | null;
    }
}
/**
 * Used for calling the whole proccess and invidual functions.
* @component
* @function
* @returns {React.ReactElement} - Based on the state it is in.
*/
export const WordHighlighter: React.FC = () =>
{
    const { scrapedData, loading, error } = useScrapedData();

    useEffect(() =>
    {
        if (!loading && scrapedData)
        {
            const wordsToHighlight = WordsToHighlight(scrapedData);
            const wordIdMapping = GenerateWordId(wordsToHighlight);
            storeWordsAndHighlight(wordIdMapping);
        }
    }, [scrapedData, loading]);

    if (loading) return <LoadingBlock />;
    if (error) return <div>Error: {error}</div>;
    return null;
};
/**
 * Text to highlights based on regex
 * @param {string} text - The text that should be used.
 * @returns {string[]} - Words to be highlighted.
 */
const WordsToHighlight = (text: string): string[] =>
{
    const words = text.match(/\b\w+\b/g);
    return words ? Array.from(new Set(words)) : [];
};

/**
 * Generates a unique ID to better find the words later on.
 * @param {string[]} words - List of words to highlight.
 * @returns {Record<string, string>} - Return a Record of words with the word "word" : "word-index".
 */

const GenerateWordId = (words: string[]): Record<string, string> =>
{
    return words.reduce((acc, word, index) => {
        acc[word] = `hdw-${index}`;
        return acc;
    }, {} as Record<string, string>);
};
/**
 * Uses the words stored to then be highlighted.
 * @param {Record<string, string>} wordIdMapping -  Record of words with the word "word" : "word-index".
 */

const storeWordsAndHighlight = (wordIdMapping: Record<string, string>) =>
{
    chrome.storage.local.set({ wordIdMapping }, () =>
    {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
        {
            if (tabs[0]?.id)
            {
                chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    /**
                     *
                     * @param {Record<string, string>} mapping - Map words and add the id and button
                     */
                    func: (mapping) =>
                    {
                        window.currentBox = null;
                        const words = Object.keys(mapping);
                        const regex = new RegExp(`\\b(${words.join("|")})\\b`, "gi");

                        const validElements = new Set([
                            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                            'p', 'span', 'div', 'li', 'td', 'th',
                            'label', 'button', 'a', 'strong', 'em',
                            'article', 'section', 'figcaption', 'cite',
                            'blockquote', 'q', 'mark', 'dfn', 'time',
                            'address', 'dt', 'dd'
                        ]);

                        const invalidElements = new Set([
                            'svg', 'img', 'video', 'canvas', 'iframe',
                            'script', 'style', 'code', 'pre', 'noscript',
                            'input', 'textarea', 'select', 'option',
                            'math', 'path', 'circle', 'rect', 'polygon'
                        ]);

                        const isValidTextElement = (element: HTMLElement): boolean =>
                        {
                            const tagName = element.tagName.toLowerCase();

                            if (tagName === 'span' || tagName === 'div')
                            {
                                const hasOnlyText = Array.from(element.childNodes).every(node =>
                                    node.nodeType === Node.TEXT_NODE ||
                                    (node instanceof HTMLElement &&
                                        ['span', 'strong', 'em', 'b', 'i', 'mark'].includes(node.tagName.toLowerCase()))
                                );
                                return hasOnlyText;
                            }

                            return validElements.has(tagName);
                        };

                        const shouldProcessNode = (node: Node): boolean =>
                        {
                            const parentElement = node.parentElement;
                            if (!parentElement) return false;

                            let element: HTMLElement | null = parentElement;

                            while (element !== null)
                            {
                                const tagName = element.tagName.toLowerCase();
                                if (invalidElements.has(tagName))
                                {
                                    return false;
                                }
                                element = element.parentElement;
                            }

                            return isValidTextElement(parentElement);
                        };
                        /**
                         * Walks through the HTML code in the document and highlights matching words and changes the structure of it.
                         * @param {Node} node - The current node / item that is being processed.
                         */


                        const walkTextNodes = (node: Node) =>
                        {
                            if (node.nodeType === Node.TEXT_NODE && shouldProcessNode(node))
                            {
                                const textNode = node as Text;
                                const originalText = textNode.textContent || "";

                                 /**
                                 * Replaces the structure of any element like P, H, or A tags and add span and color to it.
                                 * @param {match} string that replaces the with the word-id
                                 */
                                const newText = originalText.replace(regex, (match) =>
                                {
                                    const id = mapping[match];

                                    return `<span data-dobid="${id}" class="highlighted-word" data-word="${match}" style="color: red; font-weight: bold; cursor: pointer;">${match}</span>`;
                                });

                                if (newText !== originalText)
                                {
                                    const span = document.createElement("span");
                                    span.innerHTML = newText;
                                    textNode.replaceWith(span);
                                }
                            }
                            else node.childNodes.forEach(walkTextNodes);
                        };


                        walkTextNodes(document.body);
                        /**
                         * Removes the word box of a highlighted text
                         */
                        const removeCurrentBox = () =>
                        {
                            if (window.currentBox)
                            {
                                window.currentBox.remove();
                                window.currentBox = null;
                            }
                        };


                        const highlightedWords = document.querySelectorAll(".highlighted-word");
                        highlightedWords.forEach((wordElement) =>
                        {
                            if (wordElement instanceof HTMLElement)
                            {
                                wordElement.addEventListener("mouseenter", (event) =>
                                {
                                    removeCurrentBox();

                                    /**
                                     * Box styling and the scroll of button math
                                     */
                                    const box = document.createElement("div");
                                    const button = document.createElement("button");
                                    button.style.cssText =
                                        "color: white;" +
                                        "background-color: #1d4ed8;" +
                                        "padding: 10px 20px;" +
                                        "border-radius: 8px;" +
                                        "font-size: 14px;" +
                                        "font-weight: 500;" +
                                        "border: none;" +
                                        "cursor: pointer;" +
                                        "transition: background-color 0.2s;";

                                    button.textContent = "Add";

                                    button.addEventListener('mouseover', () => button.style.backgroundColor = '#1e40af');
                                    button.addEventListener('mouseout', () => button.style.backgroundColor = '#1d4ed8');

                                    box.appendChild(button);

                                    const rect = (event.target as HTMLElement).getBoundingClientRect();
                                    box.style.position = "absolute";
                                    const boxWidth = box.offsetWidth;
                                    box.style.left = `${rect.left + window.scrollX + (rect.width) - (boxWidth / 2)}px`;
                                    box.style.top = `${rect.top + window.scrollY - 40}px`;
                                    box.style.zIndex = "10000";

                                    window.currentBox = box;
                                    document.body.appendChild(box);

                                    button.addEventListener("click", () =>
                                    {
                                        window.captureWord(event);
                                        removeCurrentBox();
                                    });

                                    /**
                                     * Checks if the mouse has is far enough to then dissapear.
                                     * @param {MouseEvent} e - Mouse event as e (hover)
                                     * @returns {boolean} - Return valid if it is far enough.
                                     */
                                    const isMouseFar = (e: MouseEvent) =>
                                    {
                                        const wordRect = (event.target as HTMLElement).getBoundingClientRect();
                                        const distance = Math.sqrt(
                                            Math.pow(e.clientX - wordRect.left, 2) +
                                            Math.pow(e.clientY - wordRect.top, 2)
                                        );
                                        return distance > 150;
                                    };

                                    /**
                                     *  Removes the box button
                                     * @param {MouseEvent} e - Mouse event as e (hover)
                                     *
                                     */
                                    const onMouseMove = (e: MouseEvent) =>
                                    {
                                        if (isMouseFar(e))
                                        {
                                            removeCurrentBox();
                                            document.removeEventListener("mousemove", onMouseMove);
                                        }
                                    };

                                    document.addEventListener("mousemove", onMouseMove);
                                });
                            }
                        });
                        /**
                         * Adding the highlighted words to save it.
                         * @async
                         * @param {MouseEvent} e - Mouse event as e (click).
                         * @throws {Error} Catch any error.
                         */

                        window.captureWord = async (event: MouseEvent) =>
                        {
                            const clickedElement = event.target as HTMLElement;
                            const clickedWord = clickedElement.dataset.word?.toLowerCase();

                            if (clickedWord)
                            {
                                try
                                {
                                    chrome.storage.local.get(['words-data'], (result) => {
                                        const existingWords: string[] = result['words-data'] || [];

                                        if (!existingWords.includes(clickedWord.toLowerCase())) {
                                            existingWords.push(clickedWord);
                                            chrome.storage.local.set({ 'words-data': existingWords });
                                        }
                                    });
                                }
                                catch (err)
                                {
                                    throw new Error(`${(err as Error)?.message || err}`);
                                }
                            }
                        };
                    },
                    args: [wordIdMapping],
                });
            }
        });
    });
};
