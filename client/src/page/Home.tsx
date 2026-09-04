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
  Building2,
  Landmark,
  HomeIcon,
  TreePine,
  ArrowRight,
  ChevronRight,
  Globe,
  Shield,
  BarChart3,
  TrendingUp,
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

  const statCards = [
    { label: "Divisions", value: stats?.divisions ?? 0, icon: MapPin },
    { label: "Districts", value: stats?.districts ?? 0, icon: Building2 },
    { label: "Upazilas", value: stats?.upazilas ?? 0, icon: Landmark },
    { label: "Unions", value: stats?.unions ?? 0, icon: HomeIcon },
    { label: "Villages", value: stats?.villages ?? 0, icon: TreePine },
    { label: "Population", value: stats?.population ?? 0, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero — flat ledger masthead */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-5 font-medium">
              Bangladesh Administrative Hierarchy
            </Badge>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              Managing Bangladesh
              <br />
              administrative data.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-6 text-muted-foreground">
              A civil registry for the complete administrative hierarchy
              — from divisions down to districts, upazilas, unions, and villages.
            </p>
            <div className="mt-7 flex flex-col gap-2 sm:flex-row">
              {user ? (
                <Button asChild className="h-10 px-5">
                  <Link
                    to={
                      user.isSuperAdmin
                        ? "/dashboard/super-admin/profile"
                        : "/dashboard/admin/profile"
                    }
                  >
                    Go to Dashboard <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild className="h-10 px-5">
                  <Link to="/sign-in">
                    Sign In to Get Started <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="h-10 px-5">
                <a href="#overview">Explore Overview</a>
              </Button>
            </div>
            <p className="mt-5 text-xs tabular text-muted-foreground">
              {stats?.divisions ?? 8} divisions · {stats?.districts ?? 64} districts · {stats?.population ?? populationUsers.length} records
            </p>
          </div>
        </div>
      </section>

      {/* Stats — ledger cards */}
      <section
        id="overview"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
      >
        <div className="mb-7">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            System Overview
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            Live registry totals
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <Card key={stat.label} className="overflow-hidden">
              <div className="h-[2px] w-full bg-primary/70" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </p>
                    {loadingStats ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <p className="text-2xl font-semibold tabular tracking-tight">
                        {stat.value}
                      </p>
                    )}
                  </div>
                  <div className="rounded-md bg-muted p-2.5">
                    <stat.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Divisions */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="mb-7">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Geography
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">
              All Divisions
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loadingDiv
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="space-y-2.5 p-5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </CardContent>
                  </Card>
                ))
              : divisions.map((div, index) => (
                  <Card key={div._id}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-[15px] font-semibold tracking-tight">
                            {div.name}
                          </h3>
                          <p className="mt-1 text-xs tabular text-muted-foreground">
                            Division {index + 1} of 8
                          </p>
                        </div>
                        <div className="rounded-md bg-primary/10 p-2">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-7">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Capabilities
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            Platform capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "Role-Based Access",
              description:
                "Three-tier access control: Super Admin, Admin, and User roles with granular permissions.",
            },
            {
              icon: BarChart3,
              title: "Full Hierarchy CRUD",
              description:
                "Create, read, update, and delete any level: Divisions, Districts, Upazilas, Unions, and Villages.",
            },
            {
              icon: TrendingUp,
              title: "Population Tracking",
              description:
                "Track population records linked to the complete administrative hierarchy with search and pagination.",
            },
          ].map((feature) => (
            <Card key={feature.title}>
              <CardContent className="p-5">
                <div className="mb-3 inline-flex rounded-md bg-primary/10 p-2.5">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-1.5 text-[15px] font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Population Preview */}
      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Records
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">
                Registered Population
              </h2>
              <p className="mt-1 text-sm tabular text-muted-foreground">
                {stats?.population ?? populationUsers.length} records across Bangladesh
              </p>
            </div>
            {user && (
              <Button asChild variant="outline" size="sm" className="w-fit gap-1">
                <Link
                  to={
                    user.isSuperAdmin
                      ? "/dashboard/super-admin/profile"
                      : "/dashboard/admin/profile"
                  }
                >
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          <SearchInput
            value={popSearch}
            onChange={(v) => { setPopSearch(v); setPopPage(1); }}
            placeholder="Search by name, email, phone or tag..."
            className="mb-5 max-w-md"
          />

          {loadingPop ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                      <MapPin className="h-3 w-3 shrink-0" />
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
                  <SearchX className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-[15px] font-semibold tracking-tight">
                  No results found
                </h3>
                <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                  Nothing matches &ldquo;{popSearch}&rdquo;. Try a different keyword.
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
              <CardContent className="py-14 text-center text-sm text-muted-foreground">
                No population records available.
              </CardContent>
            </Card>
          )}

          {popPagination && popPagination.totalPages > 1 && (
            <Pagination className="mt-7">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPopPage((p) => p - 1)}
                    className={!popPagination.hasPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, popPagination.totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(popPage - 2, popPagination.totalPages - 4));
                  const page = start + i;
                  if (page > popPagination.totalPages) return null;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={popPage === page}
                        onClick={() => setPopPage(page)}
                        className="cursor-pointer tabular"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                {popPagination.totalPages > 5 && popPage < popPagination.totalPages - 2 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setPopPage(popPagination.totalPages)}
                        className="cursor-pointer tabular"
                      >
                        {popPagination.totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPopPage((p) => p + 1)}
                    className={!popPagination.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-7 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
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
            <Globe className="h-3.5 w-3.5" />
            <span className="tabular">bangladesh-info</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
