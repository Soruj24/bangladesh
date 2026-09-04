import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "@/app/store";
import { useGetPopulationsQuery } from "@/services/populationApi";
import {
  useGetStatsQuery,
  useGetPublicDivisionsQuery,
} from "@/services/publicApi";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Users,
  MapPin,
  ArrowRight,
  Globe,
  SearchX,
} from "lucide-react";

const ITEMS_PER_PAGE = 12;

const Home = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [popPage, setPopPage] = useState(1);
  const [popSearch, setPopSearch] = useState("");
  const { data: statsData, isLoading: loadingStats } = useGetStatsQuery();
  const { data: divisionsData, isLoading: loadingDiv } = useGetPublicDivisionsQuery();
  const { data: populationData, isLoading: loadingPop } = useGetPopulationsQuery({ page: popPage, limit: ITEMS_PER_PAGE, search: popSearch });
  const populationUsers = (populationData as unknown as { users?: { id: string; name: string; email: string; image: string; division: string }[] })?.users ?? [];
  const popPagination = (populationData as unknown as { pagination?: { totalUsers: number; totalPages: number; currentPage: number; hasNextPage: boolean; hasPreviousPage: boolean } })?.pagination;

  const stats = statsData?.payload;
  const divisions = divisionsData?.payload?.divisions ?? [];
  const divisionCount = divisions.length || stats?.divisions || 0;

  const ledgerStats = [
    { label: "Divisions", value: stats?.divisions ?? 0 },
    { label: "Districts", value: stats?.districts ?? 0 },
    { label: "Upazilas", value: stats?.upazilas ?? 0 },
    { label: "Unions", value: stats?.unions ?? 0 },
    { label: "Villages", value: stats?.villages ?? 0 },
    { label: "Population", value: stats?.population ?? 0 },
  ];

  const hierarchyChain = [
    { level: "01", label: "Division", value: stats?.divisions },
    { level: "02", label: "District", value: stats?.districts },
    { level: "03", label: "Upazila", value: stats?.upazilas },
    { level: "04", label: "Union", value: stats?.unions },
    { level: "05", label: "Village", value: stats?.villages },
  ];

  const goToPopPage = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    if (!popPagination) return;
    if (page < 1 || page > popPagination.totalPages || page === popPage) return;
    setPopPage(page);
  };

  const popPageWindow = () => {
    if (!popPagination) return [];
    const count = Math.min(5, popPagination.totalPages);
    const start = Math.max(1, Math.min(popPage - 2, popPagination.totalPages - 4));
    return Array.from({ length: count }, (_, i) => start + i).filter((p) => p <= popPagination.totalPages);
  };

  const dashboardPath = user?.isSuperAdmin
    ? "/dashboard/super-admin/profile"
    : "/dashboard/admin/profile";

  return (
    <div className="min-h-screen bg-background">
      {/* Masthead — editorial split: claim left, hierarchy chain right */}
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <Badge variant="outline" className="mb-5 font-medium">
              <span className="status-dot status-dot-success mr-1.5" aria-hidden="true" />
              Live civil registry
            </Badge>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              Every tier of Bangladesh, in one ledger.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-6 text-muted-foreground">
              Divisions down to villages, plus the population records linked to
              them — searchable, paginated, and kept current.
            </p>
            <div className="mt-7 flex flex-col gap-2 sm:flex-row">
              {user ? (
                <Button asChild className="h-10 px-5">
                  <Link to={dashboardPath}>
                    Go to Dashboard <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              ) : (
                <Button asChild className="h-10 px-5">
                  <Link to="/sign-in">
                    Sign In to Get Started <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="h-10 px-5">
                <a href="#overview">Explore Overview</a>
              </Button>
            </div>
            <p className="mt-6 text-xs tabular text-muted-foreground" aria-live="polite">
              {loadingStats ? (
                <Skeleton className="inline-block h-3.5 w-52 align-middle" />
              ) : (
                <>{stats?.divisions ?? 0} divisions · {stats?.districts ?? 0} districts · {stats?.population ?? 0} records</>
              )}
            </p>
          </div>

          {/* Hierarchy chain — timeline, not cards */}
          <div>
            <p className="eyebrow mb-4">Registry structure</p>
            {loadingStats ? (
              <div className="space-y-3.5" aria-label="Loading registry structure">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="ml-auto h-4 w-12" />
                  </div>
                ))}
              </div>
            ) : (
              <ol className="relative space-y-0 border-l border-border pl-0">
                {hierarchyChain.map((tier) => (
                  <li key={tier.label} className="relative flex items-baseline gap-3 py-2.5 pl-6">
                    <span
                      className="absolute -left-[5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-background bg-primary"
                      aria-hidden="true"
                    />
                    <span className="text-xs tabular text-muted-foreground">{tier.level}</span>
                    <span className="text-sm font-medium">{tier.label}</span>
                    <span className="ml-auto text-sm tabular text-muted-foreground">
                      {tier.value ?? 0}
                    </span>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Five tiers, one chain of custody — every record below resolves upward.
            </p>
          </div>
        </div>
      </section>

      {/* Totals — single hairline strip, not six cards */}
      <section
        id="overview"
        className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="eyebrow">System Overview</p>
            <h2 className="page-title">Live registry totals</h2>
          </div>
          <p className="text-xs text-muted-foreground">Updated on every visit</p>
        </div>

        <div
          className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3 lg:grid-cols-6"
          aria-live="polite"
          aria-label="Registry totals"
        >
          {ledgerStats.map((stat) => (
            <div key={stat.label} className="bg-card px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
              {loadingStats ? (
                <Skeleton className="mt-2 h-7 w-14" />
              ) : (
                <p className="mt-1 text-2xl font-semibold tabular tracking-tight">
                  {stat.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Divisions — numbered ledger rows, no fake-affordance cards */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="eyebrow">Geography</p>
              <h2 className="page-title">All Divisions</h2>
            </div>
            <p className="text-xs tabular text-muted-foreground" aria-live="polite">
              {loadingDiv ? "Loading…" : `${divisionCount} divisions`}
            </p>
          </div>

          {loadingDiv ? (
            <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2" aria-label="Loading divisions">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-baseline gap-4 border-t border-border py-3.5">
                  <Skeleton className="h-3.5 w-8" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : divisions.length > 0 ? (
            <ol className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              {divisions.map((div, index) => (
                <li
                  key={div._id}
                  className="flex items-baseline gap-4 border-t border-border py-3.5"
                >
                  <span className="text-xs tabular text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate text-[15px] font-medium tracking-tight">
                    {div.name}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="border-t border-border py-10 text-center text-sm text-muted-foreground">
              No divisions published yet.
            </p>
          )}
        </div>
      </section>

      {/* Population */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Records</p>
            <h2 className="page-title">Registered Population</h2>
            <p className="page-sub tabular" aria-live="polite">
              {stats?.population ?? populationUsers.length} records across Bangladesh
            </p>
          </div>
          {user && (
            <Button asChild variant="outline" size="sm" className="w-fit">
              <Link to={dashboardPath}>
                Open Dashboard <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>

        <label htmlFor="population-search" className="sr-only">
          Search population records
        </label>
        <SearchInput
          id="population-search"
          value={popSearch}
          onChange={(v) => { setPopSearch(v); setPopPage(1); }}
          placeholder="Search by name, email, phone or tag..."
          className="mb-5 max-w-md"
        />

        {loadingPop ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Loading population records">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-11 w-11 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : populationUsers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {populationUsers.map((person) => (
              <Card key={person.id}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <img
                      src={person.image}
                      alt={person.name}
                      loading="lazy"
                      className="h-11 w-11 rounded-full object-cover ring-1 ring-border"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {person.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {person.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">
                      {person.division || "N/A"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : popSearch.trim() ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-14 text-center">
              <div className="mb-4 rounded-full bg-muted p-3.5">
                <SearchX className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="section-title mb-1">
                No results found
              </h3>
              <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                Nothing matches &ldquo;{popSearch.trim()}&rdquo;. Try a different keyword.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setPopSearch(""); setPopPage(1); }}
              >
                Clear Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-14 text-center">
              <div className="mb-4 rounded-full bg-muted p-3.5">
                <Users className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="section-title mb-1">No records yet</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Population records will appear here once admins start registering people.
              </p>
            </CardContent>
          </Card>
        )}

        {popPagination && popPagination.totalPages > 1 && (
          <Pagination className="mt-7">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => goToPopPage(e, popPage - 1)}
                  aria-disabled={!popPagination.hasPreviousPage}
                  className={!popPagination.hasPreviousPage ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
              {popPageWindow().map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={popPage === page}
                    onClick={(e) => goToPopPage(e, page)}
                    className="tabular"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {popPagination.totalPages > 5 && popPage < popPagination.totalPages - 2 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => goToPopPage(e, popPagination.totalPages)}
                      className="tabular"
                    >
                      {popPagination.totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => goToPopPage(e, popPage + 1)}
                  aria-disabled={!popPagination.hasNextPage}
                  className={!popPagination.hasNextPage ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-7 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground" aria-hidden="true">
              BD
            </div>
            <span className="text-sm font-medium">
              Bangladesh Registry
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Civil records · React, Express, MongoDB
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="tabular">bangladesh-info</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
