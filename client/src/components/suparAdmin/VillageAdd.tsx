import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "@/hooks/use-toast";
import { useGetUnionsQuery } from "@/services/unionsApi";
import { useAddVillageMutation } from "@/services/villageApi";
import { useDispatch, useSelector } from "react-redux";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { setUnionId } from "@/features/unionSlice";

// Zod Schema Definition
const villageSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(2, "Name must be at least 2 characters"),
});

type VillageFormValues = z.infer<typeof villageSchema>;

const VillageAdd = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedUnion, setSelectedUnion] = useState<string>("");

  // Selectors for Redux state
  const divisionId = useSelector(
    (state: { divisionIdData: { divisionId: string } }) =>
      state.divisionIdData.divisionId
  );

  const districtId = useSelector(
    (state: { districtIdData: { districtId: string } }) =>
      state.districtIdData.districtId
  );

  const upazilaId = useSelector(
    (state: { upazilaIdData: { upazilaId: string } }) =>
      state.upazilaIdData.upazilaId
  );

  const unionId = useSelector((state: { unionIdData: { unionId: string } }) => state.unionIdData.unionId);

 
  // API calls
  const { data: unionData, isLoading: unionLoading } = useGetUnionsQuery({
    divisionId,
    districtId,
    upazilaId,
  });

  const [addVillage] = useAddVillageMutation();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VillageFormValues>({
    resolver: zodResolver(villageSchema),
  });

  const onSubmit = async (formData: VillageFormValues) => {
    try {
      // Combine form data with selected IDs
      const payload = {
        ...formData,
        divisionId,
        districtId,
        upazilaId,
        unionId,
      }; 

      console.log("Payload sent to API:", payload);

      const response = await addVillage(payload).unwrap();
      console.log("API Response:", response);

      toast({
        title: "Success",
        description: "Village created successfully.",
      });
    } catch (err) {
      const errorMessage =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to create village. Please try again.";
      console.error("Error creating village:", errorMessage);

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const onError = (formErrors: typeof errors) => {
    console.error("Validation Errors:", formErrors);
    toast({
      title: "Validation Error",
      description: "Please fill in all required fields correctly.",
      variant: "destructive",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Village</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="grid w-full items-center gap-4">
            {/* Union Dropdown */}
            <p className="text-sm font-medium leading-none">Select Union</p>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="justify-between"
                >
                  {selectedUnion
                    ? unionData?.unions?.find(
                        (union: { _id: string }) => union._id === selectedUnion
                      )?.name
                    : "Select union..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search union..." />
                  <CommandList>
                    {unionLoading ? (
                      <p className="p-4 text-sm">Loading unions...</p>
                    ) : unionData?.unions?.length ? (
                      <CommandGroup>
                        {unionData.unions.map(
                          (union: { _id: string; name: string }) => (
                            <CommandItem
                              key={union._id}
                              value={union.name}
                              onSelect={() => {
                                setSelectedUnion(union._id);
                                dispatch(setUnionId(union._id));
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedUnion === union._id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {union.name}
                            </CommandItem>
                          )
                        )}
                      </CommandGroup>
                    ) : (
                      <CommandEmpty>No unions found.</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Name Field */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter village name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
          </div>
          <CardFooter className="flex justify-end mt-4">
            <Button type="submit">Add Village</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default VillageAdd;
