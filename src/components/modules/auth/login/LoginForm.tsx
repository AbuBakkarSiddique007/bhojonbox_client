"use client";

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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

import { loginUser } from "@/services/auth";
import { useAuth } from "@/hooks/AuthContext";

// Form validation using Zod:
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


type LoginFormValues = z.infer<typeof loginSchema>;


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


export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await loginUser(data);
      setUser(result.data.user); 
      toast.success(result.message || "Logged in successfully!");

      // After a normal login we return users to the site root instead of forcing the dashboard.
      // Protected-route flows can pass an explicit "next" param later if needed.
      router.replace("/");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    }
  };


  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-center text-sm text-muted-foreground">
          Do not have an account?{" "}
          <Link href="/register" className="text-primary underline">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}