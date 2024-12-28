import App from "@/App";
import { AddDivision } from "@/components/AllAddInfo/AddDivision";
import AddInfoDB from "@/page/AddInfoDB";
import { AddPopulation } from "@/page/AddPopulation";
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
                path: '/',
                element: <Home />
            },
            {
                path: 'signUp',
                element: <SignUp />
            },
            {
                path: "signIn",
                element: <SignIn />
            },
            {
                path: 'population',
                element: <AddPopulation />
            },
            {
                path: "division",
                element: <AddDivision />
            },
            {
                path: 'addInFoDb',
                element: <AddInfoDB />
            }
        ]
    },
]);

export default router