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
import { User } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

const UserProfile = () => {
    const navigate = useNavigate()

    const [logoutUser] = useLogoutUserMutation()

    const handelLogout = async () => {
        const res = await logoutUser({})
        console.log(res)
        if (res.error) {
            toast({
                title: "Error",
                description: res?.error?.data?.message,
                variant: "destructive",
            })
            return
        }
        logout()
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

                    <Link to='/sign-in'>
                        <DropdownMenuItem>
                            Sign In
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>


                </DropdownMenuGroup>
                <DropdownMenuSeparator />


                <div onClick={handelLogout}>
                    <DropdownMenuItem>
                        Log out
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserProfile