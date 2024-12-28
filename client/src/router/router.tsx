import App from "@/App";
import Home from "@/page/Home";
import SignIn from "@/page/SignIn";
import SignUp from "@/page/SignUp";
import {
    createBrowserRouter,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import AdminProfile from "@/components/admin/AdminProfile";
import AdminAllUser from "@/components/admin/AdminAllUser";
import SuparAdminRoute from "./SuparAdminRoute";
import SuparProfile from "@/components/suparAdmin/SuparProfile";
import ErrorPage from "@/page/ErrorPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: 'sign-up',
                element: <SignUp />
            },
            {
                path: 'sign-in',
                element: <SignIn />
            },
            {
                path: "dashboard/user",
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "profile",
                        element: <Home />,
                    },

                ],
            },
            {
                path: "dashboard/admin",
                element: <AdminRoute />,
                children: [
                    {
                        path: "profile",
                        element: <AdminProfile />,
                    },

                    {
                        path: "users",
                        element: <AdminAllUser />,
                    },
                ],
            },
            {
                path: "dashboard/supar-admin",
                element: <SuparAdminRoute />,
                children: [
                    {
                        path: "profile",
                        element: <SuparProfile />,
                    },


                ],
            }
        ]
    },
]);


export default router