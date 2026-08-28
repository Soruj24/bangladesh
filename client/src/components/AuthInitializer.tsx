import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { setUser, logout } from "@/features/userSlice";
import { rawBaseQuery } from "@/services/baseQuery";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { isInitializing } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isInitializing) return;

    const restoreSession = async () => {
      try {
        // Step 1: Use refresh cookie to get a new access token
        const refreshResult = await rawBaseQuery(
          { url: "/auth/refresh-token", method: "POST" },
          { dispatch, getState: () => ({ auth: { user: null } }) } as never,
          {}
        );

        if (refreshResult.data) {
          const { accessToken } = refreshResult.data as { accessToken: string };

          // Step 2: Use the new access token to fetch current user
          const meResult = await rawBaseQuery(
            { url: "/auth/protected", method: "GET" },
            { dispatch, getState: () => ({ auth: { user: { accessToken } } }) } as never,
            {}
          );

          if (meResult.data) {
            const meData = meResult.data as { user: { id: string; name: string; email: string; isAdmin: boolean; isSuperAdmin: boolean } };
            const userData = meData.user;
            if (userData) {
              dispatch(
                setUser({
                  id: userData.id,
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
