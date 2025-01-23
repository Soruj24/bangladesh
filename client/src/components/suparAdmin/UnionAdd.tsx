import * as React from "react";
import { useState } from "react";
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
import { useGetUpazilasQuery } from "@/services/upozilaApi";
import { useAddUnionMutation } from "@/services/unionsApi";
import { useDispatch, useSelector } from "react-redux";
import { Check, ChevronsUpDown } from "lucide-react";
import { setUpazilaId } from "@/features/upazilaSlice";

// Zod Schema Definition
const districtSchema = z.object({
  division: z.string().nonempty("Division is required"),
  name: z
    .string()
    .nonempty("Name is required")
    .min(2, "Name must be at least 2 characters"),
});

type DistrictFormValues = z.infer<typeof districtSchema>;

const UnionAdd = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const [addUnion] = useAddUnionMutation();

  const divisionId = useSelector(
    (state: { divisionIdData: { divisionId: string } }) =>
      state?.divisionIdData?.divisionId
  );

  const districtId = useSelector(
    (state: { districtIdData: { districtId: string } }) =>
      state?.districtIdData?.districtId
  );


  const upazilaId = useSelector((state)=>(state?.upazilaIdData?.upazilaId))

  console.log("upazilaId", upazilaId);

  const { data: upazilaData } = useGetUpazilasQuery({ divisionId, districtId });
  const {
    register,
    handleSubmit,
    
    formState: { errors },
  } = useForm<DistrictFormValues>({
    resolver: zodResolver(districtSchema),
  });

  const onSubmit = async (formData: DistrictFormValues) => {
    try {
      const response = await addUnion({
        body: formData,
        divisionId,
        districtId,
        upazilaId,
      }).unwrap();
      toast({
        title: "Success",
        description: "District created successfully.",
      });
    } catch (err) {
      console.error("Error creating district:", err?.data?.message);
      toast({
        title: "Error",
        description:
          err?.data?.message || "Failed to create district. Please try again.",
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
    <Card className=" ">
      <CardHeader>
        <CardTitle>Create Union</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="grid w-full items-center gap-4">
            {/* Division Field */}

            <p className="text-sm font-medium leading-none">Select upazila</p>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="justify-between"
                >
                  {value
                    ? upazilaData?.upazila?.find(
                        (upazila) => upazila.value === value
                      )?.label
                    : "Select upazila..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput
                    placeholder="Search division..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No division found.</CommandEmpty>
                    <CommandGroup>
                      {upazilaData?.upazila?.map((upazila) => (
                        <CommandItem
                          key={upazila._id}
                          value={upazila.name}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            dispatch(setUpazilaId(upazila._id));
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === upazila.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {upazila.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Name Field */}
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
            <Button type="submit">Add Union</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default UnionAdd;
