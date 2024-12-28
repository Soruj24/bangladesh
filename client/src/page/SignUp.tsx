import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAddUserMutation } from "@/services/userApi";

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .regex(passwordRegex, {
            message:
                "Password must include uppercase, lowercase, number, and special character",
        }),
    image: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

const SignUp: React.FC = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const navigate = useNavigate()

    const [addUser] = useAddUserMutation()

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setValue("image", file);
        }
    };

    const onSubmit = async (data: FormData) => {

        try {
            const res = await addUser(data)
            console.log('res', res)

            if (res.error) {
                toast({
                    title: "Sign-Up Failed",
                    description: res.error?.data?.message,
                    variant: "destructive",
                });
                return
            }

            toast({
                title: "Sign-Up Successful",
                description: `Welcome, ${data.name}!`,
                variant: "default",
            });
            navigate('/sign-in')

        } catch (error) {
            console.log('error', error)
        }

    };

    return (
        <div className="flex min-h-screen items-center justify-center ">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Image Upload */}
                        <div className="flex flex-col items-center">
                            <input
                                type="file"
                                accept="image/*"
                                id="image"
                                className="hidden"
                                {...register("image")}
                                onChange={handleImageChange}
                            />
                            <label htmlFor="image" className="cursor-pointer">
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt="Selected"
                                        className="w-24 h-24 rounded-full object-cover border"
                                    />
                                ) : (
                                    <div className="w-24 h-24 text-center rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        Upload Image
                                    </div>
                                )}
                            </label>

                        </div>

                        {/* Name */}
                        <div>
                            <Label htmlFor="name" className="mb-2 block">
                                Name
                            </Label>
                            <Input
                                type="text"
                                id="name"
                                placeholder="Your name"
                                className="w-full"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email" className="mb-2 block">
                                Email
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                className="w-full"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Label htmlFor="password" className="mb-2 block">
                                Password
                            </Label>
                            <Input
                                type={passwordVisible ? "text" : "password"}
                                id="password"
                                placeholder="Enter your password"
                                className="w-full pr-10"
                                {...register("password")}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 top-5 flex items-center pr-3 text-gray-500"
                                onClick={togglePasswordVisibility}
                            >
                                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full">
                            Sign Up
                        </Button>
                    </form>
                    <div className="text-center mt-3">
                        <p className="text-sm"> Already have an account? <Link className="text-red-400" to='/sign-in'>Sign In</Link> </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignUp;
