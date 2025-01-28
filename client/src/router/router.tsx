import App from "@/App";
import Home from "@/page/Home";
import SignIn from "@/page/SignIn";
import SignUp from "@/page/SignUp";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import AdminProfile from "@/components/admin/AdminProfile";
import AdminAllUser from "@/components/admin/AdminAllUser";
import SuparAdminRoute from "./SuparAdminRoute";
import SuparProfile from "@/components/suparAdmin/SuparProfile";
import ErrorPage from "@/page/ErrorPage";
import DivisionShow from "@/components/suparAdmin/DivisionShow";
import DistrictShow from "@/components/suparAdmin/DistrictShow";
import UpazilaShow from "@/components/suparAdmin/UpazilaShow";
import UnionShow from "@/components/suparAdmin/UnionShow";
import VillageShow from "@/components/suparAdmin/VillageShow";
import AddAdminUsers from "@/components/admin/AddAdminUsers";
import SuparAdminProfile from "@/components/suparAdmin/SuparAdminProfile";
import AllUser from "@/page/AllUser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
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
          {
            path: "add-admin-users",
            element: <AddAdminUsers />,
          },
          {
            path: "all-users",
            element:<AllUser/>
          }
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
          {
            path: "supar-profile",
            element: <SuparAdminProfile />,
          },
          {
            path: "division-show-all",
            element: <DivisionShow />,
          },
          {
            path: "district-show-all",
            element: <DistrictShow />,
          },
          {
            path: "upazila-show-all",
            element: <UpazilaShow />,
          },
          {
            path: "union-show-all",
            element: <UnionShow />,
          },
          {
            path: "village-show-all",
            element: <VillageShow />,
          },
        ],
      },
    ],
  },
]);

export default router;
