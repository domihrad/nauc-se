import React from "react"

/**
 * LoadingBlock component that displays a loading spinner and a message.
 * This version uses maximum z-index and alternative positioning.
 *
 * @component
 * @returns {JSX.Element} The rendered loading block.
 */

export const LoadingBlock : React.FC = () =>
{
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div role="status" className="flex flex-col items-center">
                <div className="relative w-12 h-12">
                    <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200 dark:border-gray-700"></div>
                    <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-blue-600 border-t-transparent animate-spin"></div>
                </div>
                <p className="text-center text-lg font-medium mt-3">Loading . . .</p>
            </div>
        </div>
    );
}
