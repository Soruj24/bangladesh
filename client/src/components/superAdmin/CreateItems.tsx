import { Card, CardContent } from "@/components/ui/card";
import { Globe, MapPin, Landmark, Home, TreePine } from "lucide-react";
import DivisionAdd from "./DivisionAdd";
import DistrictAdd from "./DistrictAdd";
import UpazilaAdd from "./UpazilaAdd";
import UnionAdd from "./UnionAdd";
import VillageAdd from "./VillageAdd";

const steps = [
  {
    numeral: "01",
    icon: Globe,
    title: "Division",
    description: "Top-level region. Stands alone — start here.",
    form: <DivisionAdd />,
  },
  {
    numeral: "02",
    icon: MapPin,
    title: "District",
    description: "Lives inside a division. Pick its parent first.",
    form: <DistrictAdd />,
  },
  {
    numeral: "03",
    icon: Landmark,
    title: "Upazila",
    description: "Lives inside a district under the chosen division.",
    form: <UpazilaAdd />,
  },
  {
    numeral: "04",
    icon: Home,
    title: "Union",
    description: "Lives inside an upazila further down the chain.",
    form: <UnionAdd />,
  },
  {
    numeral: "05",
    icon: TreePine,
    title: "Village",
    description: "Deepest level — needs the full chain above it.",
    form: <VillageAdd />,
  },
];

const CreateItems = () => {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <div>
        <p className="eyebrow">Geography</p>
        <h1 className="page-title">Create Items</h1>
        <p className="page-sub">Build the hierarchy top to bottom — each level unlocks the next</p>
      </div>

      <Card className="overflow-hidden border bg-card shadow-none">
        <CardContent className="p-0">
          <ol className="divide-y divide-border">
            {steps.map((step) => (
              <li key={step.numeral} className="p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-xs tabular text-muted-foreground" aria-hidden="true">
                    {step.numeral}
                  </span>
                  <span className="rounded-md bg-primary/10 p-2 text-primary" aria-hidden="true">
                    <step.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="section-title">{step.title}</h2>
                    <p className="truncate text-xs text-muted-foreground sm:text-sm sm:whitespace-normal">
                      {step.description}
                    </p>
                  </div>
                </div>
                {step.form}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateItems;
