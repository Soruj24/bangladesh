import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import UserIcon from "@/assets/user.png";

// Zod Schema for Validation
const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().regex(/^\d{10,15}$/, "Phone number must be 10-15 digits"),
    tag: z.string().optional(),
    division: z.string().nonempty("Division is required"),
    district: z.string().nonempty("District is required"),
    upazila: z.string().nonempty("Upazila is required"),
    union: z.string().nonempty("Union is required"),
    village: z.string().nonempty("Village is required"),
});

export function AddPopulation() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userSchema),
    });

    const onSubmit = (data: any) => {
        console.log(data, selectedImage);
        toast({
            title: "User added successfully"
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card className="mt-3">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-col justify-center items-center space-y-1.5">
                        {/* Image input and preview */}
                        <Input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <label htmlFor="image" className="cursor-pointer">
                            {/* Display selected image or default user icon */}
                            <img
                                src={selectedImage || UserIcon}
                                alt="User"
                                width={96}
                                height={96}
                                className="rounded-full"
                            />
                        </label>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex w-full items-center gap-4">
                        {/* Left Column */}
                        <div className="flex flex-col space-y-1.5 w-1/2">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Name" {...register("name")} />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" placeholder="Email" {...register("email")} />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" placeholder="Phone" {...register("phone")} />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm">{errors.phone.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="tag">Tag</Label>
                                <Input id="tag" placeholder="Tag" {...register("tag")} />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col space-y-1.5 w-1/2">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="division">Division</Label>
                                <Select onValueChange={(value) => setValue("division", value)}>
                                    <SelectTrigger id="division">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="division1">Division 1</SelectItem>
                                        <SelectItem value="division2">Division 2</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.division && (
                                    <p className="text-red-500 text-sm">{errors.division.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="district">District</Label>
                                <Select onValueChange={(value) => setValue("district", value)}>
                                    <SelectTrigger id="district">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="district1">District 1</SelectItem>
                                        <SelectItem value="district2">District 2</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.district && (
                                    <p className="text-red-500 text-sm">{errors.district.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="upazila">Upazila</Label>
                                <Select onValueChange={(value) => setValue("upazila", value)}>
                                    <SelectTrigger id="upazila">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="upazila1">Upazila 1</SelectItem>
                                        <SelectItem value="upazila2">Upazila 2</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.upazila && (
                                    <p className="text-red-500 text-sm">{errors.upazila.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="union">Union</Label>
                                <Select onValueChange={(value) => setValue("union", value)}>
                                    <SelectTrigger id="union">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="union1">Union 1</SelectItem>
                                        <SelectItem value="union2">Union 2</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.union && (
                                    <p className="text-red-500 text-sm">{errors.union.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="village">Village</Label>
                                <Select onValueChange={(value) => setValue("village", value)} defaultValue="village1">
                                    <SelectTrigger id="village">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="village1">Village 1</SelectItem>
                                        <SelectItem value="village2">Village 2</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.village && (
                                    <p className="text-red-500 text-sm">{errors.village.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <CardFooter className="flex justify-center mt-4">
                        <Button type="submit">Add User</Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}
