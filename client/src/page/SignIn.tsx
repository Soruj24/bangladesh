"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "@/services/userApi";
import { setUser } from "@/features/userSlice";
import { useDispatch } from "react-redux";

// Define Zod schema
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(passwordRegex, {
            message:
                "Password must include uppercase, lowercase, number, and special character",
        }),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
    const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
    const { toast } = useToast();

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const [loginUser] = useLoginUserMutation()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInFormData) => {
        // Mock Sign-In Process

        const res = await loginUser(data)
        console.log(res?.data?.user)

        dispatch(setUser(res?.data?.user));
        if (res.error) {
            toast({
                title: "Error",
                description: res?.error?.data?.message,
                variant: "destructive",
            })
            return
        }



        const user = res?.data?.user;

        let path = '';

        if (user.isAdmin) {
            path = '/dashboard/admin/profile';
        } else if (user.isSuperAdmin) {  // Example of a third condition
            path = '/dashboard/supar-admin/profile';
        } else {
            path = '/';
        }

        navigate(path);
        toast({
            title: "Success",
            description: "You have signed in successfully!",
            variant: "default",
        });

    };

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <Card className="w-full max-w-md p-4 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...register("email")}
                                className="mt-1"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Your password"
                                    {...register("password")}
                                    className="mt-1 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                >
                                    {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm">{errors.password.message}</p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3">
                        <Button type="submit" className="w-full  ">
                            Sign In
                        </Button>
                        <Button variant="link" className="text-sm">
                            Forgot your password?
                        </Button>
                    </CardFooter>
                </form>
                <div className="text-center">
                    <p className="text-sm"> Don&apos;t have an account? <Link className="text-red-300" to='/sign-up'>Sign Up</Link> </p>
                </div>
            </Card>
        </div>
    );
};

export default SignIn;
