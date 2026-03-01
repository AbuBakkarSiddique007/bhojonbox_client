"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";
import { authService } from "@/services";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import CartBadge from "@/components/shared/CartBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-7xl mx-auto bg-transparent backdrop-blur-sm">

        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center -ml-2">
            <span className="brand text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-pink-600 to-indigo-600">Bhojonbox</span>
          </Link>
        </div>


        <div className="hidden md:flex items-center gap-4 text-base">
          <Link href="/" className="relative">
            <span className={`${pathname === '/' ? 'inline-flex items-center px-3 py-1 rounded-full bg-amber-600 text-white shadow-sm' : 'inline-flex items-center px-3 py-1 rounded-full text-slate-700 hover:bg-amber-50'}`}>
              Home
            </span>
          </Link>
          

          <Link href="/meals" className="relative">
            <span className={`${pathname?.startsWith('/meals') ? 'inline-flex items-center px-3 py-1 rounded-full bg-amber-600 text-white shadow-sm' : 'inline-flex items-center px-3 py-1 rounded-full text-slate-700 hover:bg-amber-50'}`}>
              Browse Meals
            </span>
          </Link>

          <Link href="/providers" className="relative">
            <span className={`${pathname?.startsWith('/providers') ? 'inline-flex items-center px-3 py-1 rounded-full bg-amber-600 text-white shadow-sm' : 'inline-flex items-center px-3 py-1 rounded-full text-slate-700 hover:bg-amber-50'}`}>
              Restaurants
            </span>
          </Link>
        </div>

        
        <div className="flex items-center gap-3">
          {/* show cart for guests and customers */}
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
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(user.name)}
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
                <Button variant="ghost" size="sm" className="text-slate-700">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-amber-600 border-amber-600 text-white hover:bg-amber-700">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
