"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";
import { authService } from "@/services";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import CartBadge from "@/components/shared/CartBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Menu } from "lucide-react";

export default function Navbar() {
  const { user, isLoading, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await authService.logoutUser();
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const getDashboardRoute = () => {
    if (!user) return "/dashboard";
    if (user.role === "ADMIN") return "/admin-dashboard";
    if (user.role === "PROVIDER") return "/provider-dashboard";
    return "/customer-dashboard";
  };

  const getProfileRoute = () => {
    if (!user) return "/dashboard";
    if (user.role === "ADMIN") return "/admin-dashboard/profile";
    if (user.role === "PROVIDER") return "/provider-dashboard/profile";
    return "/customer-dashboard/profile";
  };

  return (
    <nav className="sticky top-0 z-50 navbar-watercolor">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-7xl mx-auto">

        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center -ml-2 group">
            <Image 
              src="/image2.png" 
              alt="Bhojonbox Logo" 
              width={160} 
              height={48} 
              priority
              className="h-10 md:h-12 w-auto object-contain brightness-110 contrast-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(255,215,0,0.5)] group-hover:scale-105 transition-all duration-500" 
            />
            <span className="sr-only">Bhojonbox</span>
          </Link>
        </div>


        <div className="hidden md:flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
          <Link href="/" className="relative">
            <span className={`inline-flex items-center px-5 py-2 rounded-full transition-all ${pathname === '/' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-foreground/60 hover:text-foreground hover:bg-muted'}`}>
              Home
            </span>
          </Link>

          <Link href="/meals" className="relative">
            <span className={`inline-flex items-center px-5 py-2 rounded-full transition-all ${pathname?.startsWith('/meals') ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-foreground/60 hover:text-foreground hover:bg-muted'}`}>
              Browse Meals
            </span>
          </Link>

          <Link href="/providers" className="relative">
            <span className={`inline-flex items-center px-5 py-2 rounded-full transition-all ${pathname?.startsWith('/providers') ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-foreground/60 hover:text-foreground hover:bg-muted'}`}>
              Restaurants
            </span>
          </Link>

          {(!user || user.role === "CUSTOMER") && (
            <Link href="/register?role=PROVIDER" className="relative">
              <span className={`inline-flex items-center px-5 py-2 rounded-full transition-all ${pathname?.includes('role=PROVIDER') ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-primary/70 hover:text-primary hover:bg-primary/5 font-black'}`}>
                Partner with Us
              </span>
            </Link>
          )}
        </div>


        <div className="flex items-center gap-2 md:gap-3">

          <div className="md:hidden flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-muted transition-colors">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 font-bold">
                <DropdownMenuLabel>Explore BhojonBox</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/")} className="cursor-pointer">Home</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/meals")} className="cursor-pointer">Browse Meals</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/providers")} className="cursor-pointer">Restaurants</DropdownMenuItem>
                {(!user || user.role === "CUSTOMER") && (
                  <DropdownMenuItem onClick={() => router.push("/register?role=PROVIDER")} className="cursor-pointer text-primary font-black">Partner with Us</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ThemeToggle />

          {(!user || user.role === "CUSTOMER") && <CartBadge />}

          {isLoading ? (
            <Button variant="ghost" className="relative h-9 w-9 rounded-full" disabled>
              <div className="h-9 w-9 rounded-full bg-slate-200 animate-pulse" />
            </Button>
          ) : user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar || ""} alt={user.name || "User Avatar"} className="object-cover" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(user.name || "User")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">

                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => router.push(getDashboardRoute())}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(getProfileRoute())}>
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-foreground font-bold hover:bg-muted rounded-xl">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary text-primary-foreground hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 rounded-xl font-bold px-6">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
