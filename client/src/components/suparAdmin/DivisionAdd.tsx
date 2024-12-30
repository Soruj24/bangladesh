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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAddDivisionMutation } from "@/services/dividionApi";

// Define the Zod schema
const divisionSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
});

type DivisionFormData = z.infer<typeof divisionSchema>;

const Division = () => {
    const { toast } = useToast(); // Using custom toast hook
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DivisionFormData>({
        resolver: zodResolver(divisionSchema),
    });

    const [addDivision] = useAddDivisionMutation()

    const onSubmit = async (data: DivisionFormData) => {
        // You can call your API or perform actions here
        console.log(data);

        const res = await addDivision(data)
        if (res.error) {
            toast({
                title: "Error",
                description: res?.error?.data?.message,
                variant: "destructive",
            });
            return
        }

        // Show success toast
        toast({
            title: "Division Created",
            description: `Division "${data.name}" has been created successfully.`,
            variant: "default",
        });
    };

    return (
        <Card className=" ">
            <CardHeader>
                <CardTitle>Create Division</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="divisionForm" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Name of your division"
                                {...register("name")}
                            />
                            {errors.name && (
                                <span className="text-red-500 text-sm mt-1">
                                    {errors.name.message}
                                </span>
                            )}
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button type="submit" form="divisionForm">
                    Deploy
                </Button>
            </CardFooter>
        </Card>
    );
};

export default Division;
