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
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { useGetDivisionsQuery } from "@/services/divisionApi";

// Define the Zod schema
const districtSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name is required" })
        .max(50, { message: "Name cannot exceed 50 characters" }),
    framework: z.string().nonempty("Please select a framework."),
});

type DistrictFormValues = z.infer<typeof districtSchema>;

export function AddDistricts() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    console.log("Value",value)

    const {
        register,
        handleSubmit,
        setValue: setFormValue,
        formState: { errors },
    } = useForm<DistrictFormValues>({
        resolver: zodResolver(districtSchema),
    });

    const { data, isLoading, error } = useGetDivisionsQuery();  // Assuming data is an array of divisions
   
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading divisions!</div>;
    }

    // Check if data is an array
    const divisions = Array.isArray(data?.divisions ) ? data?.divisions : [];

    console.log(divisions)


    const onSubmit = (data: DistrictFormValues) => {
        console.log(data)
        toast({
            title: data.name + " Add Successfully",
        });
        console.log("Form Data:", data);
    };


    return (
        <Card className=" ">
            <CardHeader>
                <CardTitle>Add Districts</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid w-full items-center gap-4">
                        {/* Framework Dropdown */}
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                >
                                    {value
                                        ? divisions.find((division) => division._id === parseInt(value))?.name 
                                        : "Select Division..."}

                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Search Divisions..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>No Division Found.</CommandEmpty>
                                        <CommandGroup>
                                            {divisions.map((division) => (
                                                <CommandItem
                                                    key={division._id}
                                                    value={String(division._id)}  
                                                    onSelect={(currentValue) => {
                                                        const newValue = currentValue === value ? "" : currentValue;
                                                        console.log("newValue",newValue)
                                                        setValue(newValue);
                                                        setFormValue("framework", newValue);  
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {division.name}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            value === String(division._id) ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>

                                            ))}
                                            
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.framework && (
                            <p className="text-red-500 text-sm">{errors.framework.message}</p>
                        )}

                        {/* Name Input */}
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Name of your project"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm">{errors.name.message}</p>
                            )}
                        </div>
                    </div>
                    <CardFooter className="flex justify-between mt-4">
                        <Button type="submit">Add Districts</Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}
