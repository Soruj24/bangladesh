import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useGetDivisionsQuery } from "@/services/dividionApi";
import { useGetDistrictsQuery } from "@/services/districtApi";
import { useGetUpazilasQuery } from "@/services/upozilaApi";
import { useGetUnionsQuery } from "@/services/unionsApi";
import { useGetVillagesQuery } from "@/services/villageApi";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { useAddPopulationMutation } from "@/services/populationApi";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
    name: z.string().min(2, { message: "Username must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    bio: z.string().optional(),
    tag: z.string().optional(),
    phone: z.string().optional(),
});

const AddAdminUsers = () => {
    const formMethods = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", email: "", bio: "", tag: "", phone: '' },
    });

    const [addPopulation] = useAddPopulationMutation()

    const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const [selectedUpazila, setSelectedUpazila] = useState<string | null>(null);
    const [selectedUnion, setSelectedUnion] = useState<string | null>(null);
    const [selectedVillage, setSelectedVillage] = useState<string | null>(null);

    const { data: divisionData } = useGetDivisionsQuery();
    const { data: districtData } = useGetDistrictsQuery(selectedDivision);
    const { data: upazilaData } = useGetUpazilasQuery(selectedDistrict);
    const { data: unionData } = useGetUnionsQuery(selectedUpazila);
    const { data: villageData } = useGetVillagesQuery(selectedUnion);

    const onSubmit = async (data: any) => {
        console.log("Form Data Submitted:", {
            ...data,
            selectedDivision,
            selectedDistrict,
            selectedUpazila,
            selectedUnion,
            selectedVillage,
        });

        try {
            const res = await addPopulation({
                ...data,
                selectedDivision,
                selectedDistrict,
                selectedUpazila,
                selectedUnion,
                selectedVillage,
            })

            if (res.error) {
                toast({
                    title: 'Error',
                    description: res?.error?.data?.message,
                    variant: "destructive"
                })
                return
            }

            console.log(res)
            toast({
                title: ' Success',
                description: 'Admin User Added Successfully',
                variant: 'default'
            })
        } catch (error) {
            console.log(error)
        }

    };

    return (
        <div className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto">
            <Card className="p-4 shadow-lg">
                <CardContent>
                    <CardTitle className="text-2xl font-semibold text-center mb-6">
                        Add Admin User
                    </CardTitle>
                    <FormProvider {...formMethods}>
                        <form
                            onSubmit={formMethods.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FormField
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter name"
                                                    {...field}
                                                    className="py-2 px-4 border rounded-md"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter email"
                                                    {...field}
                                                    className="py-2 px-4 border rounded-md"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="tag"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tag</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter Tag"
                                                    {...field}
                                                    className="py-2 px-4 border rounded-md"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter Bio"
                                                    {...field}
                                                    className="py-2 px-4 border rounded-md"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter Phone"
                                                    {...field}
                                                    className="py-2 px-4 border rounded-md"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                <Select
                                    onValueChange={(value) => {
                                        setSelectedDivision(value);
                                        setSelectedDistrict(null);
                                        setSelectedUpazila(null);
                                        setSelectedUnion(null);
                                        setSelectedVillage(null);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a Division" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {divisionData?.divisions?.map((division) => (
                                                <SelectItem key={division?._id} value={division?._id}>
                                                    {division?.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                {selectedDivision && (
                                    <Select
                                        onValueChange={(value) => {
                                            setSelectedDistrict(value);
                                            setSelectedUpazila(null);
                                            setSelectedUnion(null);
                                            setSelectedVillage(null);
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a District" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {districtData?.districts?.map((district) => (
                                                    <SelectItem key={district?._id} value={district?._id}>
                                                        {district?.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}

                                {selectedDistrict && (
                                    <Select
                                        onValueChange={(value) => {
                                            setSelectedUpazila(value);
                                            setSelectedUnion(null);
                                            setSelectedVillage(null);
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select an Upazila" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {upazilaData?.upazilas?.map((upazila) => (
                                                    <SelectItem key={upazila?._id} value={upazila?._id}>
                                                        {upazila?.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}

                                {selectedUpazila && (
                                    <Select
                                        onValueChange={(value) => {
                                            setSelectedUnion(value);
                                            setSelectedVillage(null);
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a Union" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {unionData?.union?.map((union) => (
                                                    <SelectItem key={union?._id} value={union?._id}>
                                                        {union?.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}

                                {selectedUnion && (
                                    <Select onValueChange={setSelectedVillage}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a Village" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {villageData?.villages?.map((village) => (
                                                    <SelectItem key={village?._id} value={village?._id}>
                                                        {village?.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                            <Button type="submit" className="w-full md:w-auto">
                                Submit
                            </Button>
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>
        </div>
    );
};


export default AddAdminUsers;
