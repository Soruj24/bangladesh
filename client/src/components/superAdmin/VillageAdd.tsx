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

  const { data: unionData, isLoading: unionLoading } = useGetUnionsQuery({ divisionId, districtId, upazilaId }, { skip: !divisionId || !districtId || !upazilaId });
  const [addVillage, { isLoading }] = useAddVillageMutation();

  const unionDataTyped = unionData as { unions?: { _id: string; name: string }[] } | undefined;
  const unions = unionDataTyped?.unions || [];

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

  const parentsReady = divisionId && districtId && upazilaId;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="village-parent">Parent union</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="village-parent"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={unionLoading || !parentsReady}
              className="h-10 w-full justify-between font-normal"
            >
              {unionLoading
                ? "Loading unions…"
                : selectedUnion
                  ? unions.find((u) => u._id === selectedUnion)?.name ?? "Select union…"
                  : "Select union…"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search union..." className="h-9" />
              <CommandList>
                {unionLoading ? (
                  <p className="p-4 text-sm text-muted-foreground">Loading…</p>
                ) : unions.length ? (
                  <CommandGroup>
                    {unions.map((union) => (
                      <CommandItem
                        key={union._id}
                        value={union.name}
                        onSelect={() => {
                          if (selectedUnion === union._id) {
                            setSelectedUnion("");
                          } else {
                            setSelectedUnion(union._id);
                            dispatch(setUnionId(union._id));
                          }
                          setOpen(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", selectedUnion === union._id ? "opacity-100" : "opacity-0")} aria-hidden="true" />
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
        {!parentsReady ? (
          <p className="text-xs text-muted-foreground">Choose an upazila in step 04 first — unions live under it.</p>
        ) : !unionLoading && unions.length === 0 ? (
          <p className="text-xs text-muted-foreground">No unions under this upazila yet.</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="village-name">Name</Label>
          <Input id="village-name" placeholder="e.g. Savar Village" autoComplete="off" {...register("name")} />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>
        <Button type="submit" disabled={isLoading} className="w-full shrink-0 sm:w-auto">
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Creating…</>
          ) : (
            "Create Village"
          )}
        </Button>
      </div>
    </form>
  );
};

export default VillageAdd;
