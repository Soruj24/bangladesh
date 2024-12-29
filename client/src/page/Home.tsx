import AdminAllUser from "@/components/admin/AdminAllUser";
import { useSelector } from "react-redux";



const Home = () => {

  const user = useSelector((state: { auth: { user: any } }) => state.auth.user);
  console.log(user)

  return (
    <div>
      <AdminAllUser />
    </div>
  )
}

export default Home