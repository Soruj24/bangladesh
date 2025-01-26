import { useGetPopulationsQuery } from "@/services/populationApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const AdminAllUser = () => {
    const { data, isLoading, isError } = useGetPopulationsQuery();
    console.log(data);

    if (isLoading) {
        return <p className="text-center text-xl">Loading...</p>;
    }

    if (isError) {
        return <p className="text-center text-xl text-red-500">Failed to load users.</p>;
    }

    

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">All Users</h1>

            <div className="overflow-x-auto">
                <Table className="min-w-full table-auto">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Division</TableHead>
                            <TableHead>District</TableHead>
                            <TableHead>Upazila</TableHead>
                            <TableHead>Union</TableHead>
                            <TableHead>Village</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data?.users?.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell> <img src={user?.image} alt="User" className="w-8 h-8 rounded-full" /> </TableCell>
                                <TableCell>{user?.name}</TableCell>
                                <TableCell>{user?.email}</TableCell>
                                <TableCell>{user?.division}</TableCell>
                                <TableCell>{user?.district}</TableCell>
                                <TableCell>{user?.upazila}</TableCell>
                                <TableCell>{user?.union}</TableCell>
                                <TableCell>{user?.village}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

        </div>
    );
};


export default AdminAllUser;
