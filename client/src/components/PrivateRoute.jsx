import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const accessToken = useSelector((state) => state?.user?.accessToken);

    useEffect(() => {
        // Simulate loading state until accessToken is fetched
        if (accessToken !== undefined) {
            setLoading(false);
        }
    }, [accessToken]);

    if (loading) {
        // Show loading indicator while checking for access token
        return <div>Loading...</div>; // Replace with your custom loading component if needed
    }

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
