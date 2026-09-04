import { useGetPopulationsQuery } from "@/services/populationApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const AdminAllUser = () => {
  const { data, isLoading, isError, refetch } = useGetPopulationsQuery({ page: 1, limit: 1000 });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-destructive">Failed to load population data</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Administration</p>
        <h1 className="text-xl font-semibold tracking-tight">Population Records</h1>
        <p className="mt-1 text-sm text-muted-foreground">All registered population entries</p>
      </div>

      <Card className="border bg-card shadow-none overflow-hidden">
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
                  <TableRow key={user.id}>
                    <TableCell>
                      <img src={user?.image} alt={user?.name ?? "User"} loading="lazy" className="h-8 w-8 rounded-full object-cover ring-1 ring-border" />
                    </TableCell>
                    <TableCell className="font-medium">{user?.name}</TableCell>
                    <TableCell className="tabular-nums">{user?.email}</TableCell>
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
            <p className="py-14 text-center text-sm text-muted-foreground">No population records found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAllUser;
