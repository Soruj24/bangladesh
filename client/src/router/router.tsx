import App from "@/App";
import Home from "@/page/Home";
import SignIn from "@/page/SignIn";
import SignUp from "@/page/SignUp";
import {
    createBrowserRouter,
} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
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
            }
        ]
    },
]);


export default router