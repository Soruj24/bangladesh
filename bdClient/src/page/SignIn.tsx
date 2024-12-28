import React, { useState } from 'react';

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useLoginMutation } from '@/services/userApi';
import { setCredentials, setUser } from '@/features/userSlice';
import { useAppDispatch } from '@/app/hooks';

// Validation schema using Zod
const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignIn: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [login] = useLoginMutation();
    const dispatch = useAppDispatch()


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInFormValues) => {
        setIsSubmitting(true);
        try {
            console.log("SignIn Data:", data);

            const res = await login(data).unwrap()
            console.log(res)

            dispatch(setCredentials(res));


            toast({
                description: "User Login successfully "
            })
            // Add your API call here
        } catch (error) {
            console.error("Error during signin:", error?.data?.message);
            toast({
                description: error?.data?.message
            })
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={cn("flex justify-center items-center min-h-screen bg-gray-50")}>
            <Card className="p-6 w-full max-w-md shadow-lg">
                <h1 className="text-2xl font-bold mb-6">Sign In</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                        {isSubmitting ? "Signing In..." : "Sign In"}
                    </Button>
                </form>
                <div className='text-center mt-4 font-semibold'>
                    <p> I Don't Hove  an Account <Link to="/signUp" className='text-red-500 hover:underline'>SignIn </Link> </p>
                </div>
            </Card>
        </div>
    );
};

export default SignIn;
