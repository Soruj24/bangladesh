import { useSelector } from "react-redux";

 

const Home = () => {
  
  const user = useSelector((state: { auth: { user: any } }) => state.auth.user);
  console.log(user)

  return (
    <div>Home</div>
  )
}

export default Home