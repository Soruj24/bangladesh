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
} from "lucide-react";

const Home = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: statsData, isLoading: loadingStats } = useGetStatsQuery();
  const { data: divisionsData, isLoading: loadingDiv } = useGetPublicDivisionsQuery();
  const { data: populationData } = useGetPopulationsQuery();
  const populationUsers = (populationData as unknown as { users?: { id: string; name: string; email: string; image: string; division: string }[] })?.users ?? [];

  const stats = statsData?.payload;
  const divisions = divisionsData?.payload?.divisions ?? [];

  const statCards = [
    {
      label: "Divisions",
      value: stats?.divisions ?? 0,
      icon: MapPin,
      bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Districts",
      value: stats?.districts ?? 0,
      icon: Building2,
      bgLight: "bg-blue-50 dark:bg-blue-950/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Upazilas",
      value: stats?.upazilas ?? 0,
      icon: Landmark,
      bgLight: "bg-violet-50 dark:bg-violet-950/30",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      label: "Unions",
      value: stats?.unions ?? 0,
      icon: HomeIcon,
      bgLight: "bg-amber-50 dark:bg-amber-950/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Villages",
      value: stats?.villages ?? 0,
      icon: TreePine,
      bgLight: "bg-rose-50 dark:bg-rose-950/30",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
    {
      label: "Population",
      value: stats?.population ?? 0,
      icon: Users,
      bgLight: "bg-cyan-50 dark:bg-cyan-950/30",
      iconColor: "text-cyan-600 dark:text-cyan-400",
    },
  ];

  const divisionGradients = [
    "border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5",
    "border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-500/10 to-blue-500/5",
    "border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-500/10 to-violet-500/5",
    "border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-500/10 to-amber-500/5",
    "border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-500/10 to-rose-500/5",
    "border-cyan-200 dark:border-cyan-800 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5",
    "border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-500/10 to-orange-500/5",
    "border-teal-200 dark:border-teal-800 bg-gradient-to-br from-teal-500/10 to-teal-500/5",
  ];

  const divisionIconColors = [
    "text-emerald-600 dark:text-emerald-400",
    "text-blue-600 dark:text-blue-400",
    "text-violet-600 dark:text-violet-400",
    "text-amber-600 dark:text-amber-400",
    "text-rose-600 dark:text-rose-400",
    "text-cyan-600 dark:text-cyan-400",
    "text-orange-600 dark:text-orange-400",
    "text-teal-600 dark:text-teal-400",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-6 px-4 py-1.5 text-sm font-medium">
              Bangladesh Administrative Hierarchy
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              Managing Bangladesh
              <br />
              <span className="text-emerald-200">Administrative Data</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              A comprehensive system for managing the complete administrative hierarchy
              — from 8 divisions down to 64 districts, upazilas, unions, and villages.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to={
                    user.isSuperAdmin
                      ? "/dashboard/super-admin/profile"
                      : "/dashboard/admin/profile"
                  }
                >
                  <Button
                    size="lg"
                    className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-6 text-base shadow-xl shadow-emerald-900/20"
                  >
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link to="/sign-in">
                  <Button
                    size="lg"
                    className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-6 text-base shadow-xl shadow-emerald-900/20"
                  >
                    Sign In to Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              <a href="#overview">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-base"
                >
                  Explore Overview
                </Button>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 80H1440V30C1440 30 1200 0 720 30C240 60 0 30 0 30V80Z"
              fill="currentColor"
              className="text-gray-50 dark:text-gray-950"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id="overview"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            System Overview
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Real-time statistics from the database
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((stat) => (
            <Card
              key={stat.label}
              className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 dark:bg-gray-900/50 dark:border-gray-800 overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {stat.label}
                    </p>
                    {loadingStats ? (
                      <Skeleton className="h-9 w-16" />
                    ) : (
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-xl ${stat.bgLight} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Divisions Section */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              All Divisions
            </h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              The 8 administrative divisions of Bangladesh
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loadingDiv
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Card
                    key={i}
                    className="border-0 shadow-md dark:bg-gray-900/50"
                  >
                    <CardContent className="p-5">
                      <Skeleton className="h-5 w-32 mb-3" />
                      <Skeleton className="h-4 w-20" />
                    </CardContent>
                  </Card>
                ))
              : divisions.map((div, index) => (
                  <Card
                    key={div._id}
                    className={`group border shadow-md hover:shadow-xl transition-all duration-300 cursor-default ${divisionGradients[index % 8]}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {div.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Division {index + 1} of 8
                          </p>
                        </div>
                        <div
                          className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm group-hover:scale-110 transition-transform duration-300 ${divisionIconColors[index % 8]}`}
                        >
                          <MapPin className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Platform Capabilities
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Everything you need to manage administrative data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Role-Based Access",
              description:
                "Three-tier access control: Super Admin, Admin, and User roles with granular permissions.",
              color: "bg-emerald-50 dark:bg-emerald-950/30",
              iconColor: "text-emerald-600 dark:text-emerald-400",
            },
            {
              icon: BarChart3,
              title: "Full Hierarchy CRUD",
              description:
                "Create, read, update, and delete any level: Divisions, Districts, Upazilas, Unions, and Villages.",
              color: "bg-blue-50 dark:bg-blue-950/30",
              iconColor: "text-blue-600 dark:text-blue-400",
            },
            {
              icon: TrendingUp,
              title: "Population Tracking",
              description:
                "Track population records linked to the complete administrative hierarchy with search and pagination.",
              color: "bg-violet-50 dark:bg-violet-950/30",
              iconColor: "text-violet-600 dark:text-violet-400",
            },
          ].map((feature) => (
            <Card
              key={feature.title}
              className="border-0 shadow-md hover:shadow-xl transition-all duration-300 dark:bg-gray-900/50"
            >
              <CardContent className="p-7">
                <div
                  className={`inline-flex p-3 rounded-xl ${feature.color} mb-4`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Population Preview */}
      {populationUsers.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900/50 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Registered Population
                </h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {stats?.population ?? populationUsers.length} records across Bangladesh
                </p>
              </div>
              {user && (
                <Link
                  to={
                    user.isSuperAdmin
                      ? "/dashboard/super-admin/profile"
                      : "/dashboard/admin/profile"
                  }
                >
                  <Button variant="outline" className="gap-2">
                    View All <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {populationUsers.map((person) => (
                <Card
                  key={person.id}
                  className="border-0 shadow-md hover:shadow-lg transition-all duration-300 dark:bg-gray-900/50"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                          {person.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          {person.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {person.division || "N/A"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                BD
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Bangladesh Administrative System
              </span>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Built with React, Express, MongoDB & Tailwind CSS
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Globe className="h-3.5 w-3.5" />
              <span>bangladesh-info</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
