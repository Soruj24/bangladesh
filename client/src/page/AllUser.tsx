import { useState } from "react";
import { useDeleteUserMutation, useGetUsersQuery, useRoleUpdateMutation } from "@/services/userApi";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, SearchX, Trash2, Users } from "lucide-react";
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

const roleBadgeVariant = (role: string) =>
  role === "super-admin" ? "success" : role === "admin" ? "secondary" : "outline";

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

  const rangeStart = totalUsers === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const rangeEnd = Math.min(currentPage * itemsPerPage, totalUsers);

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

  const goToPage = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  const pageWindow = () => {
    const count = Math.min(5, totalPages);
    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    return Array.from({ length: count }, (_, i) => start + i).filter((p) => p <= totalPages);
  };

  if (isLoading) {
    return (
      <div className="space-y-5" aria-busy="true" aria-label="Loading users">
        <div>
          <p className="eyebrow">Administration</p>
          <h1 className="page-title">Users</h1>
          <p className="page-sub">Manage roles and accounts</p>
        </div>
        <Card className="overflow-hidden border bg-card shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-56" />
          </CardHeader>
          <CardContent className="space-y-0 p-0">
            <div className="divide-y divide-border px-5 py-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-3.5">
                  <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                  <Skeleton className="hidden h-9 w-36 sm:block" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t px-5 py-3.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-9 w-64" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-enter space-y-5">
        <div>
          <p className="eyebrow">Administration</p>
          <h1 className="page-title">Users</h1>
          <p className="page-sub">Manage roles and accounts</p>
        </div>
        <Card className="border bg-card shadow-none">
          <CardContent className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="mb-4 rounded-full bg-destructive/10 p-3.5">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="section-title">Failed to load users</h2>
            <p className="mb-5 mt-1 max-w-sm text-sm text-muted-foreground">
              We couldn&apos;t fetch the user list. Check your connection and try again.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const searching = searchQuery.trim().length > 0;

  return (
    <div className="animate-enter space-y-5">
      {/* Page header — count badge carries the meta, sub stays quiet */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Administration</p>
          <h1 className="page-title">Users</h1>
          <p className="page-sub">Manage roles and accounts</p>
        </div>
        <Badge variant="secondary" className="tabular">
          {totalUsers} {totalUsers === 1 ? "account" : "accounts"}
        </Badge>
      </div>

      {/* Toolbar — stacks on mobile, single row from sm up */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          id="user-search"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name or email..."
          className="w-full sm:max-w-xs"
        />
        <p className="text-xs tabular text-muted-foreground" aria-live="polite">
          {totalUsers === 0
            ? "No accounts"
            : `Showing ${rangeStart}–${rangeEnd} of ${totalUsers}`}
        </p>
      </div>

      <Card className="overflow-hidden border bg-card shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 pb-4">
          <CardTitle className="section-title">All Users</CardTitle>
          {users.length > 0 && (
            <span className="text-xs tabular text-muted-foreground">
              Page {currentPage} of {Math.max(totalPages, 1)}
            </span>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {users.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table className="min-w-[680px]">
                  <TableCaption className="sr-only">
                    Registered user accounts with role controls
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="w-[190px]">Role</TableHead>
                      <TableHead className="w-16 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => {
                      const role = getRole(user);
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="tabular text-muted-foreground">
                            {index + 1 + (currentPage - 1) * itemsPerPage}
                          </TableCell>
                          <TableCell>
                            <div className="flex min-w-0 items-center gap-3">
                              <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10"
                                aria-hidden="true"
                              >
                                <span className="text-sm font-medium text-primary">
                                  {user.name?.charAt(0)?.toUpperCase()}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="flex items-center gap-2 truncate text-sm font-medium">
                                  <span className="truncate">{user.name}</span>
                                  <Badge variant={roleBadgeVariant(role)} className="hidden shrink-0 lg:inline-flex">
                                    {role === "super-admin" ? "Super Admin" : role === "admin" ? "Admin" : "User"}
                                  </Badge>
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              key={`${user.id}-${role}`}
                              defaultValue={role}
                              onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                            >
                              <SelectTrigger
                                className="h-9 w-[148px]"
                                aria-label={`Change role for ${user.name}, current role ${role}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Role</SelectLabel>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="super-admin">Super Admin</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="icon"
                              variant="ghost"
                              aria-label={`Delete ${user.name}`}
                              title="Delete user"
                              onClick={() => handleDeleteUser(user.id)}
                              className="h-9 w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-3 border-t px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-center text-xs tabular text-muted-foreground sm:text-left">
                  Showing {rangeStart}–{rangeEnd} of {totalUsers} users
                </p>
                {totalPages > 1 && (
                  <Pagination className="mx-0 w-auto">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => goToPage(e, currentPage - 1)}
                          aria-disabled={currentPage === 1}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                        />
                      </PaginationItem>
                      {pageWindow().map((page) => (
                        <PaginationItem key={page} className="hidden sm:block">
                          <PaginationLink
                            href="#"
                            isActive={currentPage === page}
                            onClick={(e) => goToPage(e, page)}
                            className="tabular"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <PaginationItem className="hidden sm:block">
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem className="hidden sm:block">
                            <PaginationLink
                              href="#"
                              onClick={(e) => goToPage(e, totalPages)}
                              className="tabular"
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => goToPage(e, currentPage + 1)}
                          aria-disabled={currentPage === totalPages}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </>
          ) : searching ? (
            <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
              <div className="mb-4 rounded-full bg-muted p-3.5">
                <SearchX className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="section-title">No results found</h2>
              <p className="mb-5 mt-1 max-w-sm text-sm text-muted-foreground">
                Nothing matches &ldquo;{searchQuery.trim()}&rdquo;. Try a different name or email.
              </p>
              <Button variant="outline" size="sm" onClick={() => handleSearchChange("")}>
                Clear search
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
              <div className="mb-4 rounded-full bg-muted p-3.5">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="section-title">No users yet</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                New registrations will appear here once people sign up.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllUsers;
