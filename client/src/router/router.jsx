import {
    createBrowserRouter,
} from "react-router-dom";
import App from "../App";
import Home from "../page/Home";
import Login from "../page/Login";
import Register from "../page/Register";
import Item from "../page/Item";
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element:
                    <Home />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path:'/item',
                element:<Item/>
            }
        ]
    },
]);

export default router