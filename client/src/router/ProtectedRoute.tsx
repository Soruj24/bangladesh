import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import SignIn from "@/page/SignIn";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isInitializing } = useSelector((state: RootState) => state.auth);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <SignIn />;
};

export default ProtectedRoute;
