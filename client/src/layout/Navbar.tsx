import  { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import UserProfile from "@/components/UserProfile";

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(
        () => window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    // Apply the theme to the document
    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode]);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <nav className="flex justify-between items-center p-4 shadow-md">
                <div className="text-xl font-semibold"> <Link to='/'>Bangladesh</Link> </div>
                <div className="flex items-center gap-4">
                    <UserProfile />
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
