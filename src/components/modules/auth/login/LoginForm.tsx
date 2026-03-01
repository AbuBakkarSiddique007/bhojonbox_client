"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
import Loading from "@/components/ui/Loading";

import { authService } from "@/services";
import { useAuth } from "@/hooks/AuthContext";
import { cartBus } from "@/lib/cartBus";


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
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await authService.loginUser(data);
      setUser(result.data.user);

      try {
        if (typeof window !== "undefined") {
          const pending = sessionStorage.getItem("pendingAddToCart");
          if (pending) {
            const cartRaw = localStorage.getItem("cart");
            type CartItem = { id: string; providerId: string | null; name: string; price: number; image: string | null; qty: number };
            const cart: CartItem[] = cartRaw ? JSON.parse(cartRaw) : [];
            const existing = cart.find((c: CartItem) => c.id === pending);
            if (existing) existing.qty = (existing.qty || 1) + 1;
            else cart.push({ id: pending, providerId: null, name: "", price: 0, image: null, qty: 1 });
            localStorage.setItem("cart", JSON.stringify(cart));
            try { window.dispatchEvent(new Event('storage')); } catch {}
            try { cartBus.emit("cart-updated"); } catch {}
            sessionStorage.removeItem("pendingAddToCart");
            sessionStorage.removeItem("pendingAddToCartPath");
          }
        }
      } catch (e) {}
      toast.success(result.message || "Logged in successfully!");

      const next = searchParams?.get("next");
      if (next) {
        router.replace(next);
        return;
      }

      try {
        if (typeof window !== "undefined") {
          const pendingPath = sessionStorage.getItem("pendingAddToCartPath");
          if (pendingPath) {
            router.replace(pendingPath);
            return;
          }
        }
      } catch (e) {
        
      }
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
            {isSubmitting ? <Loading inline size="sm" label="Logging in..." /> : "Login"}
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