import App from "@/App";
import Home from "@/page/Home";
import SignIn from "@/page/SignIn";
import SignUp from "@/page/SignUp";
import { createBrowserRouter } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import SuperAdminRoute from "./SuperAdminRoute";
import DashboardLayout from "@/layout/DashboardLayout";
import ErrorPage from "@/page/ErrorPage";
import AdminProfile from "@/components/admin/AdminProfile";
import AdminAllUser from "@/components/admin/AdminAllUser";
import AddAdminUsers from "@/components/admin/AddAdminUsers";
import AllUser from "@/page/AllUser";
import SuperAdminProfile from "@/components/superAdmin/SuperAdminProfile";
import CreateItems from "@/components/superAdmin/CreateItems";
import DivisionShow from "@/components/superAdmin/DivisionShow";
import DistrictShow from "@/components/superAdmin/DistrictShow";
import UpazilaShow from "@/components/superAdmin/UpazilaShow";
import UnionShow from "@/components/superAdmin/UnionShow";
import VillageShow from "@/components/superAdmin/VillageShow";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
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
    ],
  },
  {
    path: "/dashboard/admin",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
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
        element: <AllUser />,
      },
    ],
  },
  {
    path: "/dashboard/super-admin",
    element: (
      <SuperAdminRoute>
        <DashboardLayout />
      </SuperAdminRoute>
    ),
    children: [
      {
        path: "profile",
        element: <SuperAdminProfile />,
      },
      {
        path: "super-profile",
        element: <SuperAdminProfile />,
      },
      {
        path: "create",
        element: <CreateItems />,
      },
      {
        path: "divisions",
        element: <DivisionShow />,
      },
      {
        path: "districts",
        element: <DistrictShow />,
      },
      {
        path: "upazilas",
        element: <UpazilaShow />,
      },
      {
        path: "unions",
        element: <UnionShow />,
      },
      {
        path: "villages",
        element: <VillageShow />,
      },
    ],
  },
]);

export default router;
