import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Upload, X } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
  const { ref: imageFieldRef, ...imageField } = register("image");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setValue("image", undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-[400px]">
        <div className="mb-7 text-center">
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground" aria-hidden="true">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join the Bangladesh civil registry</p>
        </div>

        <Card>
          <CardContent className="pt-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Photo — keyboard reachable, optional, removable */}
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  id="image"
                  className="peer sr-only"
                  {...imageField}
                  ref={(el) => {
                    imageFieldRef(el);
                    fileInputRef.current = el;
                  }}
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="image"
                  className="shrink-0 cursor-pointer rounded-full focus-visible:outline-none peer-focus-visible:ring-1 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-1"
                >
                  <span className="sr-only">Upload profile photo (optional)</span>
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Your profile photo preview"
                      className="h-16 w-16 rounded-full object-cover ring-1 ring-border"
                    />
                  ) : (
                    <span
                      className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-input bg-muted transition-colors duration-150 hover:border-primary"
                      aria-hidden="true"
                    >
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </span>
                  )}
                </label>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Profile photo</p>
                  {selectedImage ? (
                    <button
                      type="button"
                      onClick={handleImageRemove}
                      className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors duration-150 hover:text-destructive"
                    >
                      <X className="h-3 w-3" aria-hidden="true" /> Remove photo
                    </button>
                  ) : (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Optional — activate the circle to upload.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4 border-t pt-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Your name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p id="name-error" role="alert" className="field-error">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p id="email-error" role="alert" className="field-error">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4 border-t pt-5">
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      id="password"
                      placeholder="Create a password"
                      autoComplete="new-password"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "password-error password-hint" : "password-hint"}
                      className="pr-10"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      aria-label={passwordVisible ? "Hide passwords" : "Show passwords"}
                      aria-pressed={passwordVisible}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-150 hover:text-foreground"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                    </button>
                  </div>
                  <p id="password-hint" className="text-xs text-muted-foreground">
                    8+ characters, with uppercase, lowercase, number and symbol.
                  </p>
                  {errors.password && (
                    <p id="password-error" role="alert" className="field-error">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p id="confirm-error" role="alert" className="field-error">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <Button type="submit" className="h-10 w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Creating account…
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/sign-in" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
