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
import { useState } from "react";

import { authService } from "@/services";
import { useAuth } from "@/hooks/AuthContext";
import { cartBus } from "@/lib/cartBus";


const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const DEMO_ACCOUNTS = [
  {
    role: "User",
    email: "user1@gmail.com",
    password: "user1@gmail.com",
    emoji: "🧑‍🍳",
    color: "from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/60",
    badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25",
    glow: "hover:shadow-blue-500/20",
  },
  {
    role: "Provider",
    email: "provider1@gmail.com",
    password: "provider1@gmail.com",
    emoji: "🍽️",
    color: "from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-500/60",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25",
    glow: "hover:shadow-amber-500/20",
  },
  {
    role: "Admin",
    email: "admin@bhojonbox.com",
    password: "admin123",
    emoji: "🛡️",
    color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-500/60",
    badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    glow: "hover:shadow-emerald-500/20",
  },
] as const;


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
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleLoginSuccess = async (result: { message?: string; data: { user: object } }) => {
    setUser(result.data.user as Parameters<typeof setUser>[0]);

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
    } catch {}

    toast.success(result.message || "Logged in successfully!");

    const next = searchParams?.get("next");
    if (next) { router.replace(next); return; }

    try {
      if (typeof window !== "undefined") {
        const pendingPath = sessionStorage.getItem("pendingAddToCartPath");
        if (pendingPath) { router.replace(pendingPath); return; }
      }
    } catch {}

    router.replace("/");
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await authService.loginUser(data);
      await handleLoginSuccess(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    }
  };

  const handleDemoLogin = async (email: string, password: string, role: string) => {
    setDemoLoading(role);
    // Fill form fields for visual feedback
    setValue("email", email);
    setValue("password", password);
    try {
      const result = await authService.loginUser({ email, password });
      await handleLoginSuccess(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Demo login failed";
      toast.error(message);
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      {/* ── Demo Login Section ── */}
      <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">⚡</span>
          <p className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">
            Quick Demo Access
          </p>
          <div className="flex-1 h-px bg-border/60 ml-1" />
          <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest bg-muted/40 px-2 py-0.5 rounded-full border border-border/40">
            No signup needed
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {DEMO_ACCOUNTS.map((account) => {
            const isLoading = demoLoading === account.role;
            return (
              <button
                key={account.role}
                type="button"
                onClick={() => handleDemoLogin(account.email, account.password, account.role)}
                disabled={!!demoLoading}
                className={`
                  relative group flex flex-col items-center gap-2.5 p-4 rounded-xl
                  bg-gradient-to-b ${account.color}
                  border transition-all duration-300
                  hover:shadow-lg ${account.glow} hover:-translate-y-0.5 active:scale-95
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                  overflow-hidden
                `}
              >
                {/* Shimmer on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                {isLoading ? (
                  <div className="w-9 h-9 flex items-center justify-center">
                    <Loading inline size="sm" />
                  </div>
                ) : (
                  <span className="text-3xl leading-none group-hover:scale-110 transition-transform duration-300">
                    {account.emoji}
                  </span>
                )}

                <div className="text-center relative z-10">
                  <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${account.badgeColor}`}>
                    {isLoading ? "Signing in…" : account.role}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-center text-[10px] text-muted-foreground/50 font-medium">
          Click any role to instantly sign in with a pre-configured demo account
        </p>
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border/60" />
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
          or sign in manually
        </span>
        <div className="flex-1 h-px bg-border/60" />
      </div>

      {/* ── Regular Login Card ── */}
      <Card className="w-full">
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
          <p className="text-center text-sm text-muted-foreground w-full">
            Do not have an account?{" "}
            <Link href="/register" className="text-primary underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}