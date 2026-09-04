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
        <button className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors duration-150 hover:bg-accent">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <span className="text-sm font-medium text-primary">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-tight">{user?.name}</p>
            <p className="text-xs text-muted-foreground">
              {user?.isSuperAdmin ? "Super Admin" : user?.isAdmin ? "Admin" : "User"}
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 w-56" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user?.isSuperAdmin && (
            <>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/super-admin/profile">
                  <Crown className="mr-2 h-4 w-4" /> Super Admin Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/super-admin/create">
                  <Settings className="mr-2 h-4 w-4" /> Create Items
                </Link>
              </DropdownMenuItem>
            </>
          )}
          {user?.isAdmin && (
            <>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/admin/profile">
                  <Shield className="mr-2 h-4 w-4" /> Admin Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/admin/all-users">
                  <User className="mr-2 h-4 w-4" /> All Users
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/admin/add-admin-users">
                  <Settings className="mr-2 h-4 w-4" /> Add Population
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
