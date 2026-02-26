"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/hooks/AuthContext";

import { registerUser } from "@/services/auth";

// Form validation using Zod:
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["CUSTOMER", "PROVIDER"]),

    phone: z.string().optional(),
    address: z.string().optional(),

    // For Providers only:
    storeName: z.string().optional(),
    cuisine: z.string().optional(),
    description: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], 
  });


type RegisterFormValues = z.infer<typeof registerSchema>;

function FormField({
  id,
  label,
  type = "text",
  placeholder,
  error,
  registration,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  error?: string;
  registration: object; 
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} {...registration} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}


export default function RegisterForm() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "PROVIDER">(
    "CUSTOMER"
  );

  const isProvider = selectedRole === "PROVIDER";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "CUSTOMER" },
  });


  const handleRoleChange = (role: "CUSTOMER" | "PROVIDER") => {
    setSelectedRole(role);
    setValue("role", role); 
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {

      const { confirmPassword, ...submitData } = data;
      void confirmPassword;

      const result = await registerUser(submitData);
      setUser(result.data.user);

      toast.success(result.message || "Registered successfully!");
      router.push("/dashboard");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
    }
  };

  return (
    <Card className="w-full max-w-lg">
     
      <CardHeader>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Sign up as a customer or food provider
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={!isProvider ? "default" : "outline"}
              className="flex-1"
              onClick={() => handleRoleChange("CUSTOMER")}
            >
              Customer
            </Button>
            <Button
              type="button"
              variant={isProvider ? "default" : "outline"}
              className="flex-1"
              onClick={() => handleRoleChange("PROVIDER")}
            >
              Food Provider
            </Button>
          </div>

          <FormField
            id="name"
            label="Name"
            placeholder="John Doe"
            error={errors.name?.message}
            registration={register("name")}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            registration={register("email")}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            registration={register("password")}
          />

          <FormField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            registration={register("confirmPassword")}
          />

          <FormField
            id="phone"
            label="Phone (optional)"
            placeholder="+880..."
            registration={register("phone")}
          />

          <FormField
            id="address"
            label="Address (optional)"
            placeholder="Your address"
            registration={register("address")}
          />


          {isProvider && (
            <>
              <FormField
                id="storeName"
                label="Store Name"
                placeholder="My Kitchen"
                registration={register("storeName")}
              />

              <FormField
                id="cuisine"
                label="Cuisine Type"
                placeholder="Bengali, Chinese..."
                registration={register("cuisine")}
              />

              <FormField
                id="description"
                label="Description"
                placeholder="Tell us about your food..."
                registration={register("description")}
              />
            </>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Register"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline">
              Login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}