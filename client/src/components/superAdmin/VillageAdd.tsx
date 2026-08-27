import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useGetUnionsQuery } from "@/services/unionsApi";
import { useAddVillageMutation } from "@/services/villageApi";
import { useDispatch, useSelector } from "react-redux";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { setUnionId } from "@/features/geoSlice";
import { RootState } from "@/app/store";

const villageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type VillageFormValues = z.infer<typeof villageSchema>;

const VillageAdd = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedUnion, setSelectedUnion] = useState<string>("");

  const divisionId = useSelector((state: RootState) => state.geo.divisionId);
  const districtId = useSelector((state: RootState) => state.geo.districtId);
  const upazilaId = useSelector((state: RootState) => state.geo.upazilaId);

  const { data: unionData, isLoading: unionLoading } = useGetUnionsQuery({ divisionId, districtId, upazilaId });
  const [addVillage, { isLoading }] = useAddVillageMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<VillageFormValues>({
    resolver: zodResolver(villageSchema),
  });

  const onSubmit = async (formData: VillageFormValues) => {
    if (!selectedUnion) {
      toast({ title: "Error", description: "Please select a union", variant: "destructive" });
      return;
    }
    try {
      await addVillage({ ...formData, divisionId, districtId, upazilaId, unionId: selectedUnion }).unwrap();
      toast({ title: "Success", description: "Village created" });
      reset();
      setSelectedUnion("");
    } catch (err) {
      toast({
        title: "Error",
        description: (err as { data?: { message?: string } })?.data?.message || "Failed to create village",
        variant: "destructive",
      });
    }
  };

  if (unionLoading) return <div className="flex items-center gap-2 text-sm text-gray-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading unions...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <Label className="text-sm">Select Union</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between mt-1 h-10">
              {selectedUnion
                ? unionData?.unions?.find((u: { _id: string }) => u._id === selectedUnion)?.name
                : "Select union..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full">
            <Command>
              <CommandInput placeholder="Search union..." />
              <CommandList>
                {unionLoading ? (
                  <p className="p-4 text-sm">Loading...</p>
                ) : unionData?.unions?.length ? (
                  <CommandGroup>
                    {unionData.unions.map((union: { _id: string; name: string }) => (
                      <CommandItem
                        key={union._id}
                        value={union.name}
                        onSelect={() => {
                          setSelectedUnion(union._id);
                          dispatch(setUnionId(union._id));
                          setOpen(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", selectedUnion === union._id ? "opacity-100" : "opacity-0")} />
                        {union.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <CommandEmpty>No unions found.</CommandEmpty>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="village-name" className="text-sm">Name</Label>
        <Input id="village-name" placeholder="e.g. Savar Village" {...register("name")} className="mt-1 h-10" />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
      </div>
      <Button type="submit" size="sm" disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Village"}
      </Button>
    </form>
  );
};

export default VillageAdd;
