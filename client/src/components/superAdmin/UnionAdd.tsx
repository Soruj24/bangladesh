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
  const [selectedUpazilaId, setSelectedUpazilaId] = useState("");

  const divisionId = useSelector((state: RootState) => state.geo.divisionId);
  const districtId = useSelector((state: RootState) => state.geo.districtId);

  const { data: upazilaData, isLoading: loadingUpazilas } = useGetUpazilasQuery({ divisionId, districtId }, { skip: !divisionId || !districtId });
  const [addUnion, { isLoading }] = useAddUnionMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UnionFormValues>({
    resolver: zodResolver(unionSchema),
  });

  const upazilaDataTyped = upazilaData as { upazila?: { _id: string; name: string }[] } | undefined;
  const upazilas = upazilaDataTyped?.upazila || [];
  const selectedUpazilaName = upazilas.find((u) => u._id === selectedUpazilaId)?.name;

  const onSubmit = async (formData: UnionFormValues) => {
    if (!selectedUpazilaId) {
      toast({ title: "Error", description: "Please select an upazila", variant: "destructive" });
      return;
    }
    try {
      await addUnion({ body: formData, divisionId, districtId, upazilaId: selectedUpazilaId }).unwrap();
      toast({ title: "Success", description: "Union created" });
      reset();
      setSelectedUpazilaId("");
    } catch (err) {
      toast({
        title: "Error",
        description: (err as { data?: { message?: string } })?.data?.message || "Failed to create union",
        variant: "destructive",
      });
    }
  };

  const parentsReady = divisionId && districtId;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="union-parent">Parent upazila</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="union-parent"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={loadingUpazilas || !parentsReady}
              className="h-10 w-full justify-between font-normal"
            >
              {loadingUpazilas
                ? "Loading upazilas…"
                : selectedUpazilaId
                  ? selectedUpazilaName ?? "Select upazila…"
                  : "Select upazila…"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search upazila..." className="h-9" />
              <CommandList>
                <CommandEmpty>No upazila found.</CommandEmpty>
                <CommandGroup>
                  {upazilas.map((upazila: { _id: string; name: string }) => (
                    <CommandItem
                      key={upazila._id}
                      value={upazila.name}
                      onSelect={() => {
                        if (selectedUpazilaId === upazila._id) {
                          setSelectedUpazilaId("");
                        } else {
                          setSelectedUpazilaId(upazila._id);
                          dispatch(setUpazilaId(upazila._id));
                        }
                        setOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", selectedUpazilaId === upazila._id ? "opacity-100" : "opacity-0")} aria-hidden="true" />
                      {upazila.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {!parentsReady ? (
          <p className="text-xs text-muted-foreground">Choose a district in step 03 first — upazilas live under it.</p>
        ) : !loadingUpazilas && upazilas.length === 0 ? (
          <p className="text-xs text-muted-foreground">No upazilas under this district yet.</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="union-name">Name</Label>
          <Input id="union-name" placeholder="e.g. Savar Union" autoComplete="off" {...register("name")} />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>
        <Button type="submit" disabled={isLoading} className="w-full shrink-0 sm:w-auto">
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Creating…</>
          ) : (
            "Create Union"
          )}
        </Button>
      </div>
    </form>
  );
};

export default UnionAdd;
