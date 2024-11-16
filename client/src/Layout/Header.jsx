import { logoutAction } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../services/userApi";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Using the RTK Query hook for logout mutation
    const [logoutApi] = useLogoutMutation();

    // Select the user slice from the Redux state
    const user = useSelector((state) => state?.user?.user);
    console.log(user)
    const handleLogout = async () => {
        try {
            // First, logout using the RTK Query API
            await logoutApi().unwrap();
            // Then, clear user data from Redux
            dispatch(logoutAction());

            // Navigate to login page and show success toast
            navigate('/login');
            toast.success("User logged out successfully");
        } catch (error) {
            // Handle error if API call fails
            toast.error(error?.data?.message || "Logout failed");
        }
    };

    return (
        <header className="bg-gray-800 text-white py-4">
            <div className="container mx-auto flex justify-between items-center px-4">
                {/* Navigation Links */}
                <nav className="flex items-center gap-5">
                    <Link
                        to="/"
                        className="text-gray-300 hover:text-white transition duration-200"
                    >
                        Home
                    </Link>
                    <Link
                        to="/item"
                        className="text-gray-300 hover:text-white transition duration-200"
                    >
                        Items
                    </Link>
                    <Link
                        to="/login"
                        className="text-gray-300 hover:text-white transition duration-200"
                    >
                        Add User
                    </Link>
                </nav>

                {/* User Actions */}
                <div className="flex items-center gap-5">

                    <button
                        onClick={handleLogout}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
