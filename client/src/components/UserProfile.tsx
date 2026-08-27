import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/features/userSlice";
import { toast } from "@/hooks/use-toast";
import { useLogoutUserMutation } from "@/services/userApi";
import { LogOut, User, Settings, Crown, Shield } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "@/app/store";

const UserProfile = () => {
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    const res = await logoutUser({});
    if (res.error) {
      toast({
        title: "Error",
        description: (res.error as { data?: { message?: string } })?.data?.message || "An error occurred",
        variant: "destructive",
      });
      return;
    }
    dispatch(logout());
    navigate("/sign-in");
    toast({ title: "Success", description: "Logged out successfully!" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.isSuperAdmin ? "Super Admin" : user?.isAdmin ? "Admin" : "User"}
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user?.isSuperAdmin && (
            <>
              <Link to="/dashboard/super-admin/profile">
                <DropdownMenuItem>
                  <Crown className="mr-2 h-4 w-4" /> Super Admin Profile
                </DropdownMenuItem>
              </Link>
              <Link to="/dashboard/super-admin/create">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Create Items
                </DropdownMenuItem>
              </Link>
            </>
          )}
          {user?.isAdmin && (
            <>
              <Link to="/dashboard/admin/profile">
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" /> Admin Profile
                </DropdownMenuItem>
              </Link>
              <Link to="/dashboard/admin/all-users">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" /> All Users
                </DropdownMenuItem>
              </Link>
              <Link to="/dashboard/admin/add-admin-users">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Add Population
                </DropdownMenuItem>
              </Link>
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div onClick={handleLogout}>
          <DropdownMenuItem className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
