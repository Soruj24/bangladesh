import { useGetUsersQuery } from "@/services/userApi"


const Home = () => {
  const { data } = useGetUsersQuery()
  console.log(data)
  return (
    <div>Home</div>
  )
}

export default Home