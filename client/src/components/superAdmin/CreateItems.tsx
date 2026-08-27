import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, MapPin, Building2, Users, Home } from "lucide-react";
import DivisionAdd from "./DivisionAdd";
import DistrictAdd from "./DistrictAdd";
import UpazilaAdd from "./UpazilaAdd";
import UnionAdd from "./UnionAdd";
import VillageAdd from "./VillageAdd";

const CreateItems = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Items</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Add new geographic entities to the hierarchy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm dark:bg-gray-900/50">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Division</CardTitle>
          </CardHeader>
          <CardContent>
            <DivisionAdd />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm dark:bg-gray-900/50">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <MapPin className="h-5 w-5 text-emerald-600" />
            </div>
            <CardTitle className="text-lg">District</CardTitle>
          </CardHeader>
          <CardContent>
            <DistrictAdd />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm dark:bg-gray-900/50">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <Building2 className="h-5 w-5 text-amber-600" />
            </div>
            <CardTitle className="text-lg">Upazila</CardTitle>
          </CardHeader>
          <CardContent>
            <UpazilaAdd />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm dark:bg-gray-900/50">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Union</CardTitle>
          </CardHeader>
          <CardContent>
            <UnionAdd />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm dark:bg-gray-900/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/20">
              <Home className="h-5 w-5 text-rose-600" />
            </div>
            <CardTitle className="text-lg">Village</CardTitle>
          </CardHeader>
          <CardContent>
            <VillageAdd />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateItems;
