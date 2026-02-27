"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
  admin,
  provider,
  customer,
}: {
  children: React.ReactNode;
  admin?: React.ReactNode;
  provider?: React.ReactNode;
  customer?: React.ReactNode;
}) {
  const { user, isLoading, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
        return;
      }


      if (pathname === "/dashboard" || pathname === "/dashboard/") {
        const rolePath = user.role === "ADMIN" ? "admin-dashboard" : user.role === "PROVIDER" ? "provider-dashboard" : "customer-dashboard";
        router.replace(`/${rolePath}`);
      }
    }
    
  }, [isLoading, user, router, pathname]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
      if (typeof setUser === 'function') setUser(null);
      toast.success('Logged out');
      router.push('/login');
    } catch (err) {
      toast.error('Failed to logout');
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
     
     
      {user?.role === "ADMIN" ? 
      
      // Admin Layout:
      (
        <>
          <aside className="w-64 border-r p-6 hidden md:block bg-white">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Admin Dashboard</h2>
            </div>

            <nav className="flex flex-col space-y-3">
              <Link href="/admin-dashboard" className="text-sm flex items-center gap-3 hover:text-primary">

                <span>🏠</span>
                <span>Overview</span>
              </Link>

              <Link href="/admin-dashboard/users" className="text-sm flex items-center gap-3 hover:text-primary">
                <span>👥</span>
                <span>Users</span>
              </Link>

              <Link href="/admin-dashboard/orders" className="text-sm flex items-center gap-3 hover:text-primary">
                <span>📦</span>
                <span>Orders</span>
              </Link>

              <Link href="/admin-dashboard/categories" className="text-sm flex items-center gap-3 hover:text-primary">
                <span>📂</span>
                <span>Categories</span>
              </Link>

              <button type="button" onClick={handleLogout} className="text-sm flex items-center gap-3 hover:text-red-600 mt-4">
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-semibold mb-6">Admin Overview</h1>

              <div className="mt-6">{admin ?? children}</div>
            </div>
          </main>
        </>
      ) : user?.role === "PROVIDER" ? 
      

      // Provider Layout:
      (
        <>
          <aside className="w-64 border-r p-6 hidden md:block bg-white">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Provider Dashboard</h2>
            </div>

            <nav className="flex flex-col space-y-3">
              <Link href="/provider-dashboard/menu" className="text-sm flex items-center gap-3 hover:text-primary">
                <span>🍛</span>
                <span>Menu</span>
              </Link>

              <Link href="/provider-dashboard/orders" className="text-sm flex items-center gap-3 hover:text-primary">
                <span>📦</span>
                <span>Orders</span>
              </Link>

              <button type="button" onClick={handleLogout} className="text-sm flex items-center gap-3 hover:text-red-600 mt-4">
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-semibold mb-6">Provider Overview</h1>

              <div className="mt-6">{provider ?? children}</div>
            </div>
          </main>
        </>
      ) : (


        // Customer Layout:
        <>
          <aside className="w-64 border-r p-6 hidden md:flex md:flex-col bg-white sticky top-6 self-start max-h-[calc(100vh-96px)] overflow-auto">
            <div className="mb-4">
              <Link href="/" className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-50">
                <span>🏠</span>
                <span>Dashboard</span>
              </Link>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <Avatar size="lg">
                {user?.name ? (
                  // use initial letter as fallback
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                ) : (
                  <AvatarFallback>U</AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="font-semibold">{user?.name ?? 'User'}</div>
                <div className="text-xs text-slate-500">{user?.email ?? ''}</div>
                <div className="mt-2">
                  <span className="inline-block text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">{user?.role ?? 'CUSTOMER'}</span>
                </div>
              </div>
            </div>

            <nav className="flex-1 flex flex-col gap-2">
              <Link href="/customer-dashboard/orders" className={`text-sm flex items-center gap-3 px-3 py-2 rounded ${pathname?.startsWith('/customer-dashboard/orders') ? 'bg-amber-50 text-amber-700 font-medium' : 'hover:bg-slate-50'}`}>
                <span>📦</span>
                <span>My Orders</span>
              </Link>

              <Link href="/customer-dashboard/profile" className={`text-sm flex items-center gap-3 px-3 py-2 rounded ${pathname?.startsWith('/customer-dashboard/profile') ? 'bg-amber-50 text-amber-700 font-medium' : 'hover:bg-slate-50'}`}>
                <span>👤</span>
                <span>Profile</span>
              </Link>
            </nav>

            <div className="mt-auto">
              <button type="button" onClick={handleLogout} className="text-sm flex items-center gap-3 text-red-600 px-3 py-2 rounded hover:bg-slate-50">
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </aside>

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mt-6">{customer ?? children}</div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
