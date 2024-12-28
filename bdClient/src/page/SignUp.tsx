import React, { useState } from 'react';

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from '@/components/ui/card';
import { Label } from '@radix-ui/react-context-menu';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAddUserMutation } from '@/services/userApi';

// Validation schema using Zod
const signUpSchema = z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addUser] = useAddUserMutation()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpFormValues) => {
        setIsSubmitting(true);
        try {
            const response = await addUser(data).unwrap(); // Unwrap the mutation result

            toast({
                description: response?.data?.message || "Sign-up successful!",
            });

            navigate("/signIn");
        } catch (error: any) {
            console.error("Error during signup:", error);

            toast({
                description: error?.data?.message || "Sign-up failed!",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={cn("flex justify-center items-center min-h-screen bg-gray-50")}>
            <Card className="p-6 w-full max-w-md shadow-lg">
                <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter your name"
                            {...register("name")}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register("email")}
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password")}
                            className={errors.password ? "border-red-500" : ""}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "Signing Up..." : "Sign Up"}
                    </Button>
                </form>
                <div className='text-center mt-4 font-semibold'>
                    <p> Already an account <Link to="/signIn" className='text-red-500 hover:underline'>SignIn </Link> </p>
                </div>
            </Card>
        </div>
    );
};

export default SignUp;
