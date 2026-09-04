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
        <div className="bg-card text-card-foreground border-b">
            <nav className="flex justify-between items-center p-4">
                <div className="text-xl font-semibold"> <Link to='/'>Bangladesh</Link> </div>
                <div className="flex items-center gap-4">
                    <UserProfile />
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
