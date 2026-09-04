import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import SignIn from "@/page/SignIn";

const SuperAdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, isInitializing } = useSelector((state: RootState) => state.auth);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return user?.isSuperAdmin ? <>{children}</> : <SignIn />;
};

export default SuperAdminRoute;
