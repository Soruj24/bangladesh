
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useGetDistrictsQuery } from "@/services/districtApi";
import { useAddUpozilaMutation } from "@/services/upozilaApi";

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
    const dispatch = useDispatch();


    const divisionId = useSelector((state) => (state?.divisionIdData?.divisionId));
    const districtId = useSelector((state) => (state?.districtIdData?.districtId));
    const { data: districtData } = useGetDistrictsQuery(divisionId);
    console.log("districtData", districtData?.division?.districts)

    const [addUpozila] = useAddUpozilaMutation();



    const {
        register,
        handleSubmit,
        setValue,
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

            console.log('Response:', response);

            toast({
                title: "Success",
                description: "District created successfully.",
            });
        } catch (err: any) {
            console.error("Error creating district:", err?.data?.message);

            toast({
                title: "Error",
                description: err?.data?.message || "Failed to create district. Please try again.",
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
                <CardTitle>Create Upozila</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <div className="grid w-full items-center gap-4">
                        {/* Division Field */}
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="division">District</Label>
                            <Select
                                onValueChange={(value) => {
                                    setValue("division", value); // Sync with form state
                                    dispatch(setDistrictId(value));
                                }}
                            >
                                <SelectTrigger id="division">
                                    <SelectValue placeholder="Select a district" />
                                </SelectTrigger>
                                <SelectContent>
                                    {districtData?.division?.districts?.map((district) => (
                                        <SelectItem
                                            key={district._id}
                                            value={district._id}
                                        >
                                            {district.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.division && (
                                <p className="text-sm text-red-600">
                                    {errors.division.message}
                                </p>
                            )}
                        </div>

                        {/* Name Field */}
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter district name"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">
                                    {errors.name.message}
                                </p>
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
