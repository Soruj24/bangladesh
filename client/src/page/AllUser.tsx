import React, { useState } from "react";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useRoleUpdateMutation,
} from "@/services/userApi";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";

const AllUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data, isLoading, error, refetch } = useGetUsersQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });

  const user = useSelector(
    (state: {
      auth: { user: { id: string; name: string; email: string; role: string } };
    }) => state.auth.user
  );

  console.log(user);

  const [roleUpdate] = useRoleUpdateMutation();
  const [deleteUser] = useDeleteUserMutation();

  const totalUsers = data?.pagination?.totalUsers || 0;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleCurrentChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousChange = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextChange = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const getVisiblePageNumbers = () => {
    const visiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage < visiblePages - 1) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePageNumbers = getVisiblePageNumbers();

  if (isLoading) return <p>Loading users...</p>;
  if (error)
    return (
      <p className="text-red-500">Failed to fetch users. Please try again.</p>
    );

  const handleRoleChange = async (id: string, role: string) => {
    console.log(`User ID: ${id}, New Role: ${role}`);

    try {
      const res = await roleUpdate({ id, role });
      console.log(res);

      if (res?.error) {
        toast({
          title: "error",
          description: "Failed to update role",
          variant: "destructive",
        });
      } else {
        toast({
          title: "success",
          description: "Role updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "error",
        description: "Failed to update role",
        variant: "destructive",
      });

      console.error("Failed to update role", error);
    }
  };

  const handelDeleteUser = async (id: string) => {
    try {
      const res = await deleteUser(id);
      console.log(res);
      if (res?.error) {
        toast({
          title: "error",
          description: "Failed to delete user",
          variant: "destructive",
        });
      } else {
        toast({
          title: "success",
          description: "User deleted successfully",
        });
      }
      refetch();
    } catch (error) {
      toast({
        title: "error",
        description: "Failed to delete user",
        variant: "destructive",
      });
      console.error("Failed to delete user", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-1/3"
        />
      </div>

      {/* User Table */}
      {data?.users?.length > 0 ? (
        <>
          <Table className="table-auto border-collapse">
            <TableHeader className="sticky top-0">
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.users.map(
                (
                  user: {
                    _id: string;
                    name: string;
                    email: string;
                    role: string;
                  },
                  index: number
                ) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      {user.email}{" "}
                      <Badge
                        onClick={() => handelDeleteUser(user._id)}
                        className="ml-5 cursor-pointer"
                        variant="outline"
                      >
                        Delete
                      </Badge>{" "}
                    </TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(newRole) =>
                          handleRoleChange(user._id, newRole)
                        } // Add onChange handler here
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            placeholder={user.role} // Display the current role as placeholder
                          />
                          <SelectValue placeholder="Select a Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Role</SelectLabel>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="super-admin">
                              Super Admin
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="my-3 space-x-3 text-center">
              <Button disabled={currentPage === 1} onClick={handleFirstPage}>
                First Page
              </Button>
              <Button
                onClick={handlePreviousChange}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {visiblePageNumbers.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  onClick={() => handleCurrentChange(pageNumber)}
                  className={`mx-2 px-2 py-2 rounded-md transition-colors ${
                    currentPage === pageNumber
                      ? "bg-black text-white font-bold"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {pageNumber}
                </Button>
              ))}
              <Button
                onClick={handleNextChange}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
              <Button
                disabled={currentPage === totalPages}
                onClick={handleLastPage}
              >
                Last Page
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
};

export default AllUsers;
