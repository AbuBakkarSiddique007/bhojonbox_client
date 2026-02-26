"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";
import { logoutUser } from "@/services/auth";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await logoutUser();
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
    <nav className="border-b">
      <div className="flex items-center justify-between px-6 py-3">
        <Link href="/" className="text-xl font-bold">
          BhojonBox
        </Link>

        <div className="flex items-center gap-3">
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
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
