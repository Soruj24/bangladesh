/* eslint-disable @typescript-eslint/no-explicit-any */
import SignIn from "@/page/SignIn";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const AdminRoute = () => {
    const user = useSelector((state: { auth: { user: any } }) => state.auth.user);
    
    const isSignedIn = user;
    const isAdmin = user?.isAdmin

    return isSignedIn && isAdmin ? <Outlet /> : <SignIn />
}

export default AdminRoute