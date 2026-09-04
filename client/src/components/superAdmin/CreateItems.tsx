import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, MapPin, Building2, Users, Home } from "lucide-react";
import DivisionAdd from "./DivisionAdd";
import DistrictAdd from "./DistrictAdd";
import UpazilaAdd from "./UpazilaAdd";
import UnionAdd from "./UnionAdd";
import VillageAdd from "./VillageAdd";

const CreateItems = () => {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Geography</p>
        <h1 className="text-xl font-semibold tracking-tight">Create Items</h1>
        <p className="text-sm text-muted-foreground mt-1">Add new geographic entities to the hierarchy</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border bg-card shadow-none">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Globe className="h-5 w-5" />
            </div>
            <CardTitle className="text-[15px] font-semibold tracking-tight">Division</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <DivisionAdd />
          </CardContent>
        </Card>

        <Card className="border bg-card shadow-none">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <CardTitle className="text-[15px] font-semibold tracking-tight">District</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <DistrictAdd />
          </CardContent>
        </Card>

        <Card className="border bg-card shadow-none">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <CardTitle className="text-[15px] font-semibold tracking-tight">Upazila</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <UpazilaAdd />
          </CardContent>
        </Card>

        <Card className="border bg-card shadow-none">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <CardTitle className="text-[15px] font-semibold tracking-tight">Union</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <UnionAdd />
          </CardContent>
        </Card>

        <Card className="border bg-card shadow-none lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Home className="h-5 w-5" />
            </div>
            <CardTitle className="text-[15px] font-semibold tracking-tight">Village</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <VillageAdd />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateItems;
