import { useDispatch, useSelector } from "react-redux";
import AllUsersShow from "../components/AllUsersShow";
import { logoutAction } from "../features/userSlice"; // Rename to avoid conflict
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../services/userApi";

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Using the RTK Query hook for logout mutation
    const [logoutApi] = useLogoutMutation();

    // Select the user slice from the Redux state
    const user = useSelector((state) => state?.user?.user);
    console.log(user); // Log the user data

    const handleLogout = async () => {
        try {
            // First, logout using the RTK Query API
            await logoutApi().unwrap();

            // Then, clear user data from Redux
            dispatch(logoutAction()); // This will clear the user slice

            // Navigate to login page and show success toast
            navigate('/login');
            toast.success("User logged out successfully");
        } catch (error) {
            // Handle error if API call fails
            console.error(error.data.message);
            toast.error(error.data.message);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <button
                onClick={handleLogout}
                className="bg-blue-500 mb-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Logout
            </button>
            <AllUsersShow />
        </div>
    );
};

export default Home;
