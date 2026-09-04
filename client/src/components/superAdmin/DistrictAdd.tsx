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
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const [selectedDivisionId, setSelectedDivisionId] = useState("");

  const divisions = (divisionData as unknown as { payload?: { divisions?: { _id: string; name: string }[] } })?.payload?.divisions ?? [];

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
      setValue("");
      setSelectedDivisionId("");
    } catch (err) {
      toast({
        title: "Error",
        description: (err as { data?: { message?: string } })?.data?.message || "Failed to create district",
        variant: "destructive",
      });
    }
  };

  if (loadingDivisions) return <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading divisions...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Select Division</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between mt-1 h-10">
              {value ? divisions.find((d: { name: string }) => d.name === value)?.name : "Select division..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full">
            <Command>
              <CommandInput placeholder="Search division..." className="h-9" />
              <CommandList>
                <CommandEmpty>No division found.</CommandEmpty>
                <CommandGroup>
                  {divisions.map((division: { _id: string; name: string }) => (
                    <CommandItem
                      key={division._id}
                      value={division.name}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setSelectedDivisionId(division._id);
                        dispatch(setDivisionId(division._id));
                        setOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value === division.name ? "opacity-100" : "opacity-0")} />
                      {division.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="dist-name" className="text-sm font-medium">Name</Label>
        <Input id="dist-name" placeholder="e.g. Dhaka" {...register("name")} className="mt-1 h-10" />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create District"}
      </Button>
    </form>
  );
};

export default DistrictAdd;
