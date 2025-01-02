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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useGetUnionsQuery } from "@/services/unionsApi";
import { useAddVillageMutation } from "@/services/villageApi";
import { useDispatch, useSelector } from "react-redux";
import { setVillageId } from "@/features/villageSlice";

// Zod Schema Definition
const districtSchema = z.object({
    division: z.string().nonempty("Division is required"),
    name: z
        .string()
        .nonempty("Name is required")
        .min(2, "Name must be at least 2 characters"),
});

type DistrictFormValues = z.infer<typeof districtSchema>;

const VillageAdd = () => {

    const dispatch = useDispatch()
    const divisionId = useSelector((state: { divisionIdData: { divisionId: string } }) => (state?.divisionIdData?.divisionId));
    const districtId = useSelector((state: { districtIdData: { districtId: string } }) => (state?.districtIdData?.districtId));
    const upazilaId = useSelector((state: { upazilaIdData: { upazilaId: string } }) => (state?.upazilaIdData?.upazilaId?.districtId));
    const unionId = useSelector((state: { villageIdData: { villageId: string } }) => (state.villageIdData.villageId))
    const { data: unionData } = useGetUnionsQuery({ divisionId, districtId, upazilaId });

    const [addVillage] = useAddVillageMutation();
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
            // Combine all necessary data into a single object
            const payload = {
                ...formData,
                divisionId,
                districtId,
                upazilaId,
                unionId,
            };

            // Call the mutation with the combined payload
            const response = await addVillage(payload).unwrap();

            console.log('response', response);

            toast({
                title: "Success",
                description: "Village created successfully.",
            });
        } catch (err) {
            console.error("Error creating village:", err?.data?.message);
            toast({
                title: "Error",
                description: err?.data?.message || "Failed to create village. Please try again.",
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
                <CardTitle>Create Village</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <div className="grid w-full items-center gap-4">
                        {/* Division Field */}
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="division">Union</Label>
                            <Select
                                onValueChange={(value) => {
                                    setValue("division", value); // Sync with form state
                                    dispatch(setVillageId(value))
                                }}
                            >
                                <SelectTrigger id="division">
                                    <SelectValue placeholder="Select a division" />
                                </SelectTrigger>
                                <SelectContent>
                                    {unionData?.unions?.map((division) => (
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
                        <Button type="submit">Add Village</Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
};

export default VillageAdd;
