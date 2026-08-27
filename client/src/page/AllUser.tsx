import React, { useState } from "react";
import { useDeleteUserMutation, useGetUsersQuery, useRoleUpdateMutation } from "@/services/userApi";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Search, Trash2 } from "lucide-react";

const AllUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data, isLoading, error, refetch } = useGetUsersQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });

  const [roleUpdate] = useRoleUpdateMutation();
  const [deleteUser] = useDeleteUserMutation();

  const totalUsers = data?.pagination?.totalUsers || 0;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleChange = async (id: string, role: string) => {
    const res = await roleUpdate({ id, role });
    if (res?.error) {
      toast({ title: "Error", description: "Failed to update role", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Role updated" });
    }
  };

  const handleDeleteUser = async (id: string) => {
    const res = await deleteUser(id);
    if (res?.error) {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "User deleted" });
    }
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Failed to fetch users</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage user roles and accounts</p>
      </div>

      <Card className="border-0 shadow-sm dark:bg-gray-900/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">All Users</CardTitle>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 h-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {data?.users?.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.users.map(
                    (user: { _id: string; name: string; email: string; role: string }, index: number) => (
                      <TableRow key={user._id}>
                        <TableCell className="text-gray-500">
                          {index + 1 + (currentPage - 1) * itemsPerPage}
                        </TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select onValueChange={(newRole) => handleRoleChange(user._id, newRole)}>
                            <SelectTrigger className="w-[160px] h-9">
                              <SelectValue placeholder={user.role || "Select role"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Role</SelectLabel>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="super-admin">Super Admin</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <p className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                      First
                    </Button>
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                      Prev
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                      const page = start + i;
                      if (page > totalPages) return null;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                        >
                          {page}
                        </Button>
                      );
                    })}
                    <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                      Next
                    </Button>
                    <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
                      Last
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center py-8 text-gray-500">No users found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllUsers;
