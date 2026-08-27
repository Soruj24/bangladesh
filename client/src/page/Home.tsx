import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useGetPopulationsQuery } from "@/services/populationApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Globe, Building2 } from "lucide-react";

const Home = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: populationData } = useGetPopulationsQuery();

  const stats = [
    { label: "Total Population", value: populationData?.users?.length || 0, icon: Users, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" },
    { label: "Your Role", value: user?.isSuperAdmin ? "Super Admin" : user?.isAdmin ? "Admin" : "User", icon: Globe, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
    { label: "Divisions", value: "8", icon: MapPin, color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" },
    { label: "Districts", value: "64", icon: Building2, color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here&apos;s what&apos;s happening with your system today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm dark:bg-gray-900/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {populationData?.users && populationData.users.length > 0 && (
        <Card className="border-0 shadow-sm dark:bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-lg">Recent Population Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {populationData.users.slice(0, 5).map((person) => (
                <div key={person._id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <img src={person.image} alt={person.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{person.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{person.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Home;
