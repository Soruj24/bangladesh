import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useGetDistrictsQuery } from "@/services/districtApi";
import { useAddUpozilaMutation } from "@/services/upozilaApi";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDispatch, useSelector } from "react-redux";
import { setDistrictId } from "@/features/geoSlice";
import { RootState } from "@/app/store";

const upazilaSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type UpazilaFormValues = z.infer<typeof upazilaSchema>;

const UpazilaAdd = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const divisionId = useSelector((state: RootState) => state.geo.divisionId);
  const { data: districtData, isLoading: loadingDistricts } = useGetDistrictsQuery(divisionId, { skip: !divisionId });
  const [addUpozila, { isLoading }] = useAddUpozilaMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpazilaFormValues>({
    resolver: zodResolver(upazilaSchema),
  });

  const districts = (districtData as unknown as { payload?: { district?: { _id: string; name: string }[] } })?.payload?.district ?? [];
  const selectedDistrictName = districts.find((d) => d._id === selectedDistrictId)?.name;

  const onSubmit = async (formData: UpazilaFormValues) => {
    if (!selectedDistrictId) {
      toast({ title: "Error", description: "Please select a district", variant: "destructive" });
      return;
    }
    try {
      await addUpozila({ body: formData, divisionId, districtId: selectedDistrictId }).unwrap();
      toast({ title: "Success", description: "Upazila created" });
      reset();
      setSelectedDistrictId("");
    } catch (err) {
      toast({
        title: "Error",
        description: (err as { data?: { message?: string } })?.data?.message || "Failed to create upazila",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="upazila-parent">Parent district</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="upazila-parent"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={loadingDistricts || !divisionId}
              className="h-10 w-full justify-between font-normal"
            >
              {loadingDistricts
                ? "Loading districts…"
                : selectedDistrictId
                  ? selectedDistrictName ?? "Select district…"
                  : "Select district…"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search district..." className="h-9" />
              <CommandList>
                <CommandEmpty>No district found.</CommandEmpty>
                <CommandGroup>
                  {districts.map((district: { _id: string; name: string }) => (
                    <CommandItem
                      key={district._id}
                      value={district.name}
                      onSelect={() => {
                        if (selectedDistrictId === district._id) {
                          setSelectedDistrictId("");
                        } else {
                          setSelectedDistrictId(district._id);
                          dispatch(setDistrictId(district._id));
                        }
                        setOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", selectedDistrictId === district._id ? "opacity-100" : "opacity-0")} aria-hidden="true" />
                      {district.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {!divisionId ? (
          <p className="text-xs text-muted-foreground">Choose a division in step 02 first — districts live under it.</p>
        ) : !loadingDistricts && districts.length === 0 ? (
          <p className="text-xs text-muted-foreground">No districts under this division yet.</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="upa-name">Name</Label>
          <Input id="upa-name" placeholder="e.g. Savar" autoComplete="off" {...register("name")} />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>
        <Button type="submit" disabled={isLoading} className="w-full shrink-0 sm:w-auto">
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Creating…</>
          ) : (
            "Create Upazila"
          )}
        </Button>
      </div>
    </form>
  );
};

export default UpazilaAdd;
