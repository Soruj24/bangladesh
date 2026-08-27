import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import SignIn from "@/page/SignIn";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  return user?.isAdmin ? <>{children}</> : <SignIn />;
};

export default AdminRoute;
