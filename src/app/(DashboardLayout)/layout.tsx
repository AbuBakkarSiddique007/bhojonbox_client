"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";

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
  const { user, isLoading } = useAuth();
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

              <Link href="/logout" className="text-sm flex items-center gap-3 hover:text-red-600 mt-4">
                <span>🚪</span>
                <span>Logout</span>
              </Link>
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

              <Link href="/logout" className="text-sm flex items-center gap-3 hover:text-red-600 mt-4">
                <span>🚪</span>
                <span>Logout</span>
              </Link>
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
          <aside className="w-64 border-r p-6 hidden md:block bg-white">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Customer Dashboard</h2>
            </div>

            <nav className="flex flex-col space-y-3">
              <Link href="/customer-dashboard/orders" className="text-sm flex items-center gap-3 hover:text-primary">
                <span>📦</span>
                <span>My Orders</span>
              </Link>

              <Link href="/profile" className="text-sm flex items-center gap-3 hover:text-primary">
                <span>👤</span>
                <span>Profile</span>
              </Link>

              <Link href="/logout" className="text-sm flex items-center gap-3 hover:text-red-600 mt-4">
                <span>🚪</span>
                <span>Logout</span>
              </Link>
            </nav>
          </aside>

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-semibold mb-6">Customer Overview</h1>

              <div className="mt-6">{customer ?? children}</div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
