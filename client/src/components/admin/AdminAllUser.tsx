import { useState } from "react";
import { useGetPopulationsQuery } from "@/services/populationApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/ui/search-input";
import { DataPagination } from "@/components/ui/data-pagination";
import { AlertTriangle, Loader2, SearchX, Users } from "lucide-react";

const AdminAllUser = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, refetch } = useGetPopulationsQuery({
    page,
    limit: pageSize,
    search: search.trim(),
  });

  const users = data?.users ?? [];
  const pagination = data?.pagination;
  const totalUsers = pagination?.totalUsers ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const rangeStart = totalUsers === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalUsers);
  const isSearching = search.trim().length > 0;

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const handlePageSize = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading population records">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Administration</p>
          <h1 className="text-xl font-semibold tracking-tight">Population Records</h1>
          <p className="mt-1 text-sm text-muted-foreground">All registered population entries</p>
        </div>
        <Card className="overflow-hidden border bg-card shadow-none">
          <CardContent className="space-y-0 p-0">
            <div className="space-y-3 px-5 py-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="hidden h-4 w-56 sm:block" />
                  <Skeleton className="ml-auto hidden h-4 w-24 md:block" />
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

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Administration</p>
          <h1 className="text-xl font-semibold tracking-tight">Population Records</h1>
          <p className="mt-1 text-sm text-muted-foreground">All registered population entries</p>
        </div>
        <Card className="border bg-card shadow-none">
          <CardContent className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="mb-4 rounded-full bg-destructive/10 p-3.5">
              <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
            </div>
            <h2 className="section-title">Failed to load population data</h2>
            <p className="mb-5 mt-1 max-w-sm text-sm text-muted-foreground">
              Check your connection and try again.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Administration</p>
          <h1 className="text-xl font-semibold tracking-tight">Population Records</h1>
          <p className="mt-1 text-sm tabular text-muted-foreground" aria-live="polite">
            {totalUsers} {totalUsers === 1 ? "entry" : "entries"}
            {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          id="population-admin-search"
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, email, phone or tag..."
          className="w-full sm:max-w-xs"
        />
        <p className="text-xs tabular text-muted-foreground" aria-live="polite">
          {totalUsers === 0
            ? isSearching ? "No matches" : "No records"
            : `Showing ${rangeStart}–${rangeEnd} of ${totalUsers}`}
        </p>
      </div>

      <Card className="overflow-hidden border bg-card shadow-none">
        <CardContent className="p-0">
          {users.length > 0 ? (
            <>
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
                    {users.map((user) => (
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
              <DataPagination
                page={page}
                totalPages={Math.max(totalPages, 1)}
                totalItems={totalUsers}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onPageChange={setPage}
                itemLabel="entries"
                pageSize={pageSize}
                onPageSizeChange={handlePageSize}
                pageSizeOptions={[5, 10, 15, 20, 50]}
              />
            </>
          ) : isSearching ? (
            <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
              <div className="mb-4 rounded-full bg-muted p-3.5">
                <SearchX className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <h2 className="section-title">No results found</h2>
              <p className="mb-5 mt-1 max-w-sm text-sm text-muted-foreground">
                Nothing matches &ldquo;{search.trim()}&rdquo;. Try a different keyword.
              </p>
              <Button variant="outline" size="sm" onClick={() => handleSearch("")}>
                Clear search
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
              <div className="mb-4 rounded-full bg-muted p-3.5">
                <Users className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <h2 className="section-title">No population records yet</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                New registrations will appear here once people are added.
              </p>
            </div>
          )}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 border-t py-3 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Updating…
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAllUser;
