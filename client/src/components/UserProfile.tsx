import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/features/userSlice"
import { toast } from "@/hooks/use-toast"
import { useLogoutUserMutation } from "@/services/userApi"
import { LogOut, User } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

const UserProfile = () => {
    const navigate = useNavigate()

    const [logoutUser] = useLogoutUserMutation()
    const dispatch = useDispatch()
    const user = useSelector((state: { auth: { user: any } }) => state.auth.user);
    console.log(user)

    const handelLogout = async () => {
        const res = await logoutUser({})
        if (res.error) {
            toast({
                title: "Error",
                description: res?.error?.data?.message,
                variant: "destructive",
            })
            return
        }
        dispatch(logout())
        navigate('/sign-in')
        toast({
            title: "Success",
            description: "You have  logged out successfully!",
            variant: "default",
        });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild >
                <User className="h-8 w-8 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52 mt-6 ">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>

                    {
                        user?.isSuperAdmin && (
                            <div>
                                <Link to='/dashboard/supar-admin/profile'>
                                    <DropdownMenuItem>
                                        Super Admin
                                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </Link>
                                <Link to='/dashboard/supar-admin/division-show-all'>
                                    <DropdownMenuItem>
                                        Division Show All
                                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </Link>
                            </div>
                        )
                    }
                    {
                        user?.isAdmin && (
                            <Link to='dashboard/admin/profile'>
                                <DropdownMenuItem>
                                    Admin
                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </Link>
                        )
                    }

                    {
                        user ? (<div onClick={handelLogout}>
                            <DropdownMenuItem>
                                <LogOut className="mr-2 h-4 w-4" />   Log out
                                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </div>) : (<Link to='/sign-in'>
                            <DropdownMenuItem>
                                Sign In
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </Link>)
                    }


                </DropdownMenuGroup>




            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserProfile