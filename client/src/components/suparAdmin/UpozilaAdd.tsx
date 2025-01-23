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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
import { toast } from "@/hooks/use-toast";
import { useGetDistrictsQuery } from "@/services/districtApi";
import { useAddUpozilaMutation } from "@/services/upozilaApi";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDistrictId } from "@/features/districtSlice";

// Zod Schema Definition
const districtSchema = z.object({
  division: z.string().nonempty("Division is required"),
  name: z
    .string()
    .nonempty("Name is required")
    .min(2, "Name must be at least 2 characters"),
});

type DistrictFormValues = z.infer<typeof districtSchema>;

const UpozilaAdd = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const dispatch = useDispatch();

  interface RootState {
    districtIdData: {
      districtId: string;
    };
    divisionIdData: {
      divisionId: string;
    };
  }

  const divisionId = useSelector(
    (state: RootState) => state?.divisionIdData?.divisionId
  );

  console.log("divisionId", divisionId);

  const districtId = useSelector(
    (state: { districtIdData: { districtId: string } }) =>
      state?.districtIdData.districtId
  );
  console.log("districtId", districtId);
  const { data: districtData } = useGetDistrictsQuery(divisionId);

  const divisionItem = districtData?.division?.districts || [];

  const [addUpozila] = useAddUpozilaMutation();

  const {
    register,
    handleSubmit,
    setValue: setFormValue,
    formState: { errors },
  } = useForm<DistrictFormValues>({
    resolver: zodResolver(districtSchema),
  });

  const onSubmit = async (formData: DistrictFormValues) => {
    try {
      const response = await addUpozila({
        body: formData,
        divisionId,
        districtId,
      }).unwrap();
      console.log(response);
      toast({
        title: "Success",
        description: "District created successfully.",
      });
    } catch (err: unknown) {
      const errorMessage =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to create district. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const onError = () => {
    toast({
      title: "Validation Error",
      description: "Please fill in all required fields correctly.",
      variant: "destructive",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Upozila</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="grid w-full items-center gap-4">
            <p className="text-sm font-medium leading-none">Select District</p>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="justify-between"
                >
                  {value
                    ? divisionItem?.find(
                        (division: {
                          _id: string;
                          name: string;
                          value: string;
                        }) => division.value === value
                      )?.label
                    : "Select District..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput
                    placeholder="Search District..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No district found.</CommandEmpty>
                    <CommandGroup>
                      {divisionItem?.map(
                        (division: {
                          _id: string;
                          name: string;
                          value: string;
                        }) => (
                          <CommandItem
                            key={division._id}
                            value={division.name}
                            onSelect={(currentValue) => {
                              setFormValue(
                                "division",
                                currentValue === value ? "" : currentValue
                              );
                              dispatch(setDistrictId(division._id));
                              setValue(currentValue);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === division.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {division.name}
                          </CommandItem>
                        )
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter district name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
          </div>
          <CardFooter className="flex justify-end mt-4">
            <Button type="submit">Add Upazila</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpozilaAdd;
