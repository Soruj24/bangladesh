import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

const PublicNavbar = () => {
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <nav className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
            BD
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">Bangladesh</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <Link
              to={user.isSuperAdmin ? "/dashboard/super-admin/profile" : "/dashboard/admin/profile"}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/sign-in"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
