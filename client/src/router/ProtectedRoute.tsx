import SignIn from "@/page/SignIn";
import { Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const isSignedIn = true;

    return isSignedIn ? <Outlet /> : <SignIn />
}


export default ProtectedRoute