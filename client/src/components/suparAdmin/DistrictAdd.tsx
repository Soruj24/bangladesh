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
import { useGetDivisionsQuery } from "@/services/dividionApi";
import { useAddDistrictMutation } from "@/services/districtApi";

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
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  setDivisionId } from "@/features/divisionSlice";

type Division = {
  _id: string;
  value: string;
  name: string;
};

const districtSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(2, "Name must be at least 2 characters"),
});

type DistrictFormValues = z.infer<typeof districtSchema>;

const DistrictAdd: React.FC = () => {
  const { data: divisionData, isLoading, refetch } = useGetDivisionsQuery();
  const [addDistrict] = useAddDistrictMutation();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const dispatch = useDispatch();

  const divisionId = useSelector((state)=>(state?.divisionIdData?.divisionId))

   
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DistrictFormValues>({
    resolver: zodResolver(districtSchema),
  });

  const divisionItem = divisionData?.divisions;

  const onSubmit = async (formData: DistrictFormValues) => {
    const payload = { divisionId: String(divisionId), name: formData.name };

    try {
      await addDistrict(payload).unwrap();

      toast({
        title: "Success",
        description: "District created successfully.",
      });

      // Refetch division data and reset form
      // refetch();
      // reset();
      setValue("");
      setDivisionId("");
    } catch (err) {
      toast({
        title: "Error",
        description:
          (err as { data?: { message?: string } })?.data?.message ||
          "Failed to create district. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <p>Loading divisions...</p>;
  }

  if (!divisionData) {
    return <p>No divisions available. Please try again later.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create District</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-4">
            {/* Division Field */}
            <p className="text-sm font-medium leading-none">Select Division</p>
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
                        (division: Division) => division.value === value
                      )?.label
                    : "Select Division..."}
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
                      {divisionItem?.map((division: Division) => (
                        <CommandItem
                          key={division._id}
                          value={division.name}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            dispatch( setDivisionId(division._id))
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
            <Button type="submit">Add District</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default DistrictAdd;
