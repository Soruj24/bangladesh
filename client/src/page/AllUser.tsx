import { useState } from "react";
import { useDeleteUserMutation, useGetUsersQuery, useRoleUpdateMutation } from "@/services/userApi";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type ApiUser = { id: string; name: string; email: string; isAdmin: boolean; isSuperAdmin: boolean };
type ApiResponse = { payload?: { users?: ApiUser[]; pagination?: { totalUsers: number; totalPages: number; currentPage: number; limit: number } } };

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

  const apiData = data as unknown as ApiResponse;
  const users = apiData?.payload?.users ?? [];
  const totalUsers = apiData?.payload?.pagination?.totalUsers || 0;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const getRole = (user: ApiUser) => user.isSuperAdmin ? "super-admin" : user.isAdmin ? "admin" : "user";

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
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
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name or email..."
            className="w-72"
          />
        </CardHeader>
        <CardContent className="p-0">
          {users.length > 0 ? (
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
                  {users.map(
                    (user, index) => (
                      <TableRow key={user.id}>
                        <TableCell className="text-gray-500">
                          {index + 1 + (currentPage - 1) * itemsPerPage}
                        </TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select onValueChange={(newRole) => handleRoleChange(user.id, newRole)}>
                            <SelectTrigger className="w-[160px] h-9">
                              <SelectValue placeholder={getRole(user)} />
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
                            onClick={() => handleDeleteUser(user.id)}
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
                <div className="px-4 py-3 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => p - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                        const page = start + i;
                        if (page > totalPages) return null;
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={currentPage === page}
                              onClick={() => setCurrentPage(page)}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => setCurrentPage(totalPages)}
                              className="cursor-pointer"
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((p) => p + 1)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
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
