import { FaGithub } from "react-icons/fa";

/**
 * Footer component
 * @component
 * @returns {JSX.Element} The rendered footer component.
 */

export const Footer: React.FC = () =>
{
    return (
        <>
            <div className="px-4 py-6 md:flex md:items-center md:justify-between absolute inset-x-0 bottom-0 limit--width mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">
                    © {new Date().getFullYear()} domihrad
                </p>
                <div className="flex mt-4 sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse">
                    <a
                        href="https://github.com/domihrad"
                        target="_blank"
                        className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <FaGithub size={20} />
                    </a>
                </div>
            </div>
        </>
    );
};
