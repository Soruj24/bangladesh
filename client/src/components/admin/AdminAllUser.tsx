import { useGetPopulationsQuery } from "@/services/populationApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const AdminAllUser = () => {
  const { data, isLoading, isError } = useGetPopulationsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load population data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Population Records</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">All registered population entries</p>
      </div>

      <Card className="border-0 shadow-sm dark:bg-gray-900/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
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
                    <TableCell>
                      <img src={user?.image} alt="User" className="w-8 h-8 rounded-full object-cover" />
                    </TableCell>
                    <TableCell className="font-medium">{user?.name}</TableCell>
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
          {!data?.users?.length && (
            <p className="text-center py-8 text-gray-500">No population records found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAllUser;
