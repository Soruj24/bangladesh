import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Upload } from "lucide-react";
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
      message: "Password must include uppercase, lowercase, number, and special character",
    }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  image: z.any().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const SignUp: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [addUser, { isLoading }] = useAddUserMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const res = await addUser(data);

      if (res.error) {
        const errorMessage = 'data' in res.error ? (res.error.data as { message?: string })?.message : "Sign-up failed";
        toast({
          title: "Sign-Up Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sign-Up Successful",
        description: `Welcome, ${data.name}!`,
      });
      navigate("/sign-in");
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 text-white mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bangladesh</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Create your account</p>
        </div>

        <Card className="border-0 shadow-xl dark:shadow-2xl dark:bg-gray-900/50 dark:backdrop-blur">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">Get started</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col items-center mb-2">
                <input
                  type="file"
                  accept="image/*"
                  id="image"
                  className="hidden"
                  {...register("image")}
                  onChange={handleImageChange}
                />
                <label htmlFor="image" className="cursor-pointer group">
                  <div className="relative">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 group-hover:border-emerald-500 transition-colors">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Your name"
                  className="h-11"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="h-11"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    className="h-11 pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <Input
                  type={passwordVisible ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  className="h-11"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-11 bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </CardContent>
          <div className="text-center pb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
