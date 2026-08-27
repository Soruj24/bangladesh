import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { setUser, logout } from "@/features/userSlice";
import { baseQuery } from "@/services/baseQuery";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { isInitializing } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isInitializing) return;

    const restoreSession = async () => {
      try {
        const result = await baseQuery(
          { url: "/auth/refresh-token", method: "POST" },
          { dispatch, getState: () => ({}) } as never,
          {}
        );

        if (result.data) {
          const { accessToken } = result.data as { accessToken: string };

          const meResult = await baseQuery(
            { url: "/auth/protected", method: "GET" },
            { dispatch, getState: () => ({ auth: { user: { accessToken } } }) } as never,
            {}
          );

          if (meResult.data) {
            const meData = meResult.data as { user: Array<{ _id: string; name: string; email: string; isAdmin: boolean; isSuperAdmin: boolean }> };
            const userData = meData.user?.[0];
            if (userData) {
              dispatch(
                setUser({
                  id: userData._id,
                  name: userData.name,
                  email: userData.email,
                  isAdmin: userData.isAdmin,
                  isSuperAdmin: userData.isSuperAdmin,
                  accessToken,
                })
              );
              return;
            }
          }
        }
      } catch {
        // Refresh failed
      }

      dispatch(logout());
    };

    restoreSession();
  }, [dispatch, isInitializing]);

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

  return <>{children}</>;
};

export default AuthInitializer;
