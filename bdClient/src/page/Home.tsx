import { useGetUsersQuery } from "@/services/userApi";

const Home = () => {
  const { data, isError, isLoading, isSuccess    } = useGetUsersQuery();
  console.log(data)

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-700">
      Loading...
    </div>;
  }

  if (isError) {
    return <div className="flex items-center justify-center h-screen text-lg font-semibold text-red-500">
      User not found
    </div>;
  }
  
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">User List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isSuccess &&
          data?.users?.map((user) => (
            <div
              key={user._id}
              className="p-4 bg-white shadow-md rounded-md hover:shadow-lg transition duration-300"
            >
              <p className="text-lg font-medium text-gray-800">Name: {user.name}</p>
              <p className="text-sm text-gray-600">Email: {user.email}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
