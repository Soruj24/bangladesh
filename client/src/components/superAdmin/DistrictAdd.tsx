import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useGetDivisionsQuery } from "@/services/dividionApi";
import { useAddDistrictMutation } from "@/services/districtApi";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDispatch } from "react-redux";
import { setDivisionId } from "@/features/geoSlice";

const districtSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type DistrictFormValues = z.infer<typeof districtSchema>;

const DistrictAdd = () => {
  const { data: divisionData, isLoading: loadingDivisions } = useGetDivisionsQuery();
  const [addDistrict, { isLoading }] = useAddDistrictMutation();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [selectedDivisionId, setSelectedDivisionId] = useState("");

  const divisions = (divisionData as unknown as { payload?: { divisions?: { _id: string; name: string }[] } })?.payload?.divisions ?? [];
  const selectedDivisionName = divisions.find((d) => d._id === selectedDivisionId)?.name;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DistrictFormValues>({
    resolver: zodResolver(districtSchema),
  });

  const onSubmit = async (formData: DistrictFormValues) => {
    if (!selectedDivisionId) {
      toast({ title: "Error", description: "Please select a division", variant: "destructive" });
      return;
    }
    try {
      await addDistrict({ divisionId: selectedDivisionId, name: formData.name }).unwrap();
      toast({ title: "Success", description: "District created" });
      reset();
      setSelectedDivisionId("");
    } catch (err) {
      toast({
        title: "Error",
        description: (err as { data?: { message?: string } })?.data?.message || "Failed to create district",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="district-parent">Parent division</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="district-parent"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={loadingDivisions}
              className="h-10 w-full justify-between font-normal"
            >
              {loadingDivisions
                ? "Loading divisions…"
                : selectedDivisionId
                  ? selectedDivisionName ?? "Select division…"
                  : "Select division…"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search division..." className="h-9" />
              <CommandList>
                <CommandEmpty>No division found.</CommandEmpty>
                <CommandGroup>
                  {divisions.map((division: { _id: string; name: string }) => (
                    <CommandItem
                      key={division._id}
                      value={division.name}
                      onSelect={() => {
                        if (selectedDivisionId === division._id) {
                          setSelectedDivisionId("");
                        } else {
                          setSelectedDivisionId(division._id);
                          dispatch(setDivisionId(division._id));
                        }
                        setOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", selectedDivisionId === division._id ? "opacity-100" : "opacity-0")} aria-hidden="true" />
                      {division.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {!loadingDivisions && divisions.length === 0 && (
          <p className="text-xs text-muted-foreground">No divisions yet — create one in step 01 above.</p>
        )}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="dist-name">Name</Label>
          <Input id="dist-name" placeholder="e.g. Dhaka" autoComplete="off" {...register("name")} />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>
        <Button type="submit" disabled={isLoading} className="w-full shrink-0 sm:w-auto">
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Creating…</>
          ) : (
            "Create District"
          )}
        </Button>
      </div>
    </form>
  );
};

export default DistrictAdd;
