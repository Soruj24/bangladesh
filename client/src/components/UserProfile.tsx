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
import { LogOut, User, Settings } from "lucide-react"; // Added the Settings icon
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  
  interface User {
    isSuperAdmin: boolean;
    isAdmin: boolean;
  }

  const user = useSelector(
    (state: { auth: { user: User } }) => state.auth.user
  );
  
  const handelLogout = async () => {
    const res = await logoutUser({});
    if (res.error) {
      toast({
        title: "Error",
        description:
          (res.error as { data?: { message?: string } })?.data?.message ||
          "An error occurred",
        variant: "destructive",
      });
      return;
    }
    dispatch(logout());
    navigate("/sign-in");
    toast({
      title: "Success",
      description: "You have logged out successfully!",
      variant: "default",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <User className="h-8 w-8 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 mt-6 ">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          {user?.isSuperAdmin && (
            <div>
              <Link to="/dashboard/supar-admin/supar-profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" /> Super Admin Profile
                </DropdownMenuItem>
              </Link>
              <Link to="/dashboard/supar-admin/profile">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Create Item
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link to="/dashboard/supar-admin/division-show-all">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Division Show All
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link to="/dashboard/supar-admin/district-show-all">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> District Show All
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link to="/dashboard/supar-admin/upazila-show-all">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Upazila Show All
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link to="/dashboard/supar-admin/union-show-all">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Union Show All
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link to="/dashboard/supar-admin/village-show-all">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Village Show All
                </DropdownMenuItem>
              </Link>
            </div>
          )}
          <DropdownMenuSeparator />
          {user?.isAdmin && (
            <div>
              <Link to="dashboard/admin/all-users">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" /> All Users
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link to="dashboard/admin/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" /> Admin Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link to="dashboard/admin/add-admin-users">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Add Population Users
                </DropdownMenuItem>
              </Link>
            </div>
          )}

          {user ? (
            <div onClick={handelLogout}>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </div>
          ) : (
            <Link to="/sign-in">
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" /> Sign In
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
