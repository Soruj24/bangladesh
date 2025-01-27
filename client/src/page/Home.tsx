import AdminAllUser from "@/components/admin/AdminAllUser";
import { useSelector } from "react-redux";



const Home = () => {

  interface User {
    id: string;
    name: string;
    email: string;
    // add other user properties here
  }

  const user = useSelector((state: { auth: { user: User } }) => state.auth.user);
  console.log(user)

  return (
    <div>
      <AdminAllUser />
    </div>
  )
}

export default Home