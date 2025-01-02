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
import { useGetDivisionsQuery } from "@/services/dividionApi";
import { useAddDistrictMutation } from "@/services/districtApi";
import { setDivisionId } from "@/features/divisionSlice";
import { useDispatch, useSelector } from "react-redux";

// Zod Schema Definition
const districtSchema = z.object({
    division: z.string().nonempty("Division is required"),
    name: z
        .string()
        .nonempty("Name is required")
        .min(2, "Name must be at least 2 characters"),
});

type DistrictFormValues = z.infer<typeof districtSchema>;

const DistrictAdd = () => {
    const { data: divisionData } = useGetDivisionsQuery();
    const [addDistrict] = useAddDistrictMutation();
    const dispatch = useDispatch();
    const divisionId = useSelector((state) => (state?.divisionIdData.divisionId));
    console.log("divisionId", divisionId)

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
            const payload = {
                divisionId,
                name: formData.name,
            };

            await addDistrict(payload).unwrap();

            toast({
                title: "Success",
                description: "District created successfully.",
            });

        } catch (err) {
            console.error("Error creating district:", err);
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
        <Card>
            <CardHeader>
                <CardTitle>Create District</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <div className="grid w-full items-center gap-4">
                        {/* Division Field */}
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="division">Division</Label>
                            <Select
                                onValueChange={(value) => {
                                    setValue("division", value); // Sync with form state
                                    dispatch(setDivisionId(value)); // Update Redux store with selected division ID
                                }}
                            >
                                <SelectTrigger id="division">
                                    <SelectValue placeholder="Select a division" />
                                </SelectTrigger>
                                <SelectContent>
                                    {divisionData?.divisions?.map((division) => (
                                        <SelectItem
                                            key={division._id}
                                            value={division._id}
                                        >
                                            {division.name}
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
                        <Button type="submit">Add District</Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
};

export default DistrictAdd;
