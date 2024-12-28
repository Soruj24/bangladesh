/* eslint-disable @typescript-eslint/no-explicit-any */
import SignIn from "@/page/SignIn";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const user = useSelector((state: { auth: { user: any } }) => state.auth.user);
    
    const isSignedIn = user;

    return isSignedIn ? <Outlet /> : <SignIn />
}


export default ProtectedRoute