import { useAppSelector } from "@/app/hooks"
import { Button } from "@/components/ui/button"
import { Profile } from "@/page/Profile"
import { Link } from "react-router-dom"

const Navbar = () => {

    const user = useAppSelector((state) => state?.user?.user);
    console.log(user);



    return (
        <div className="bg-slate-200 flex justify-between p-2">
            <Link to='/'> <Button>Bangladesh</Button> </Link>


            {
                user ? <Profile /> : <Link to='/signup'>
                    <Button>Sign Up</Button>
                </Link>
            }


        </div>
    )
}

export default Navbar