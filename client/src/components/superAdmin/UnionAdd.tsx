import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useGetUpazilasQuery } from "@/services/upozilaApi";
import { useAddUnionMutation } from "@/services/unionsApi";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDispatch, useSelector } from "react-redux";
import { setUpazilaId } from "@/features/geoSlice";
import { RootState } from "@/app/store";

const unionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type UnionFormValues = z.infer<typeof unionSchema>;

const UnionAdd = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedUpazilaId, setSelectedUpazilaId] = useState("");

  const divisionId = useSelector((state: RootState) => state.geo.divisionId);
  const districtId = useSelector((state: RootState) => state.geo.districtId);

  const { data: upazilaData, isLoading: loadingUpazilas } = useGetUpazilasQuery({ divisionId, districtId });
  const [addUnion, { isLoading }] = useAddUnionMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UnionFormValues>({
    resolver: zodResolver(unionSchema),
  });

  const upazilas = upazilaData?.upazila || [];

  const onSubmit = async (formData: UnionFormValues) => {
    if (!selectedUpazilaId) {
      toast({ title: "Error", description: "Please select an upazila", variant: "destructive" });
      return;
    }
    try {
      await addUnion({ body: formData, divisionId, districtId, upazilaId: selectedUpazilaId }).unwrap();
      toast({ title: "Success", description: "Union created" });
      reset();
      setValue("");
      setSelectedUpazilaId("");
    } catch (err) {
      toast({
        title: "Error",
        description: (err as { data?: { message?: string } })?.data?.message || "Failed to create union",
        variant: "destructive",
      });
    }
  };

  if (loadingUpazilas) return <div className="flex items-center gap-2 text-sm text-gray-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading upazilas...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <Label className="text-sm">Select Upazila</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between mt-1 h-10">
              {value ? upazilas.find((u: { name: string }) => u.name === value)?.name : "Select upazila..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full">
            <Command>
              <CommandInput placeholder="Search upazila..." className="h-9" />
              <CommandList>
                <CommandEmpty>No upazila found.</CommandEmpty>
                <CommandGroup>
                  {upazilas.map((upazila: { _id: string; name: string }) => (
                    <CommandItem
                      key={upazila._id}
                      value={upazila.name}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setSelectedUpazilaId(upazila._id);
                        dispatch(setUpazilaId(upazila._id));
                        setOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value === upazila.name ? "opacity-100" : "opacity-0")} />
                      {upazila.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="union-name" className="text-sm">Name</Label>
        <Input id="union-name" placeholder="e.g. Savar Union" {...register("name")} className="mt-1 h-10" />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
      </div>
      <Button type="submit" size="sm" disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Union"}
      </Button>
    </form>
  );
};

export default UnionAdd;
