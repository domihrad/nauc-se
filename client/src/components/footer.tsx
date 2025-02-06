import { FaGithub , FaLinkedin} from "react-icons/fa";
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
                <div className="flex items-center space-x-4 m-4 w-full">
                    <div className="w-1/2">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-between">
                                <p className="text-sm md:text-xl lg:text-xl text-gray-500 dark:text-gray-300 sm:text-center">
                                    © {new Date().getFullYear()} domihrad
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-between p-2">
                                <a
                                    href="https://github.com/domihrad"
                                    target="_blank"
                                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm md:text-xl lg:text-xl"
                                >
                                    <FaGithub size={20} />
                                </a>
                            </div>
                            <div className="flex items-center justify-between p-2">
                                <a
                                    href="https://www.linkedin.com/in/domihrad/"
                                    target="_blank"
                                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm md:text-xl lg:text-xl"
                                >
                                    <FaLinkedin size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
