import { useAppSelector } from "@/app/hooks"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,

    DropdownMenuSeparator,
    DropdownMenuShortcut,

    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logOut } from "@/features/userSlice"
import { toast } from "@/hooks/use-toast"
import { Link } from "react-router-dom"

export function Profile() {
    const user = useAppSelector((state) => state?.user?.user);
    console.log(user);

    const handelLogout = async () => {
        try {
            const res = await logOut()
            console.log(res)

            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')

            toast({
                description: "Logout successfully"
            })

        } catch (error) {
            console.log(error)
            toast({
                description: error?.data?.message
            })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button >Profile</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">

                <DropdownMenuGroup>
                    <Link to='/addInFoDb'>
                        <DropdownMenuItem>
                            Add InFoDb
                        </DropdownMenuItem>
                    </Link>

                    {
                        user?.isAdmin && (<Link to='/population'>
                            <DropdownMenuItem> Add Population</DropdownMenuItem>
                        </Link>)
                    }

                </DropdownMenuGroup>
                <DropdownMenuSeparator />


                <DropdownMenuItem>GitHub</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Button onClick={handelLogout}>Log Out</Button>

                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
