import SignIn from "@/page/SignIn";
import { Outlet } from "react-router-dom";

const AdminRoute = () => {
    const isSignedIn = true;
    const isAdmin = true

    return isSignedIn && isAdmin ? <Outlet /> : <SignIn />
}

export default AdminRoute