"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";

type Meal = {
  isAvailable?: boolean;
  // add other properties as needed
};

function ProviderStatsSection() {
  const [mealsCount, setMealsCount] = useState<number | null>(null);
  const [activeMeals, setActiveMeals] = useState(0);
  const [inactiveMeals, setInactiveMeals] = useState(0);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);
  const [revenue, setRevenue] = useState<number>(0);
  const [ordersByStatus, setOrdersByStatus] = useState<Record<string, number>>({});
    const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setStatsLoading(true);
        const mRes = await fetch(`${API_BASE_URL}/meals/provider/my-meals`, { credentials: 'include' });
        const mJson = await mRes.json().catch(() => null);
        const meals: Meal[] = mRes.ok ? (mJson?.data?.meals ?? []) : [];

        const oRes = await fetch(`${API_BASE_URL}/orders/provider/orders`, { credentials: 'include' });
        const oJson = await oRes.json().catch(() => null);
        const orders = oRes.ok ? (oJson?.data?.orders ?? []) : [];

        if (!mounted) return;

        setMealsCount(meals.length);
        const act = meals.filter((m: Meal) => m.isAvailable !== false).length;
        setActiveMeals(act);
        setInactiveMeals(meals.length - act);

        setOrdersCount(orders.length);
        type Order = { totalAmount?: number; status?: string };
        const rev = orders.reduce((s: number, o: Order) => s + (o.totalAmount ?? 0), 0);
        setRevenue(rev);

        const byStatus: Record<string, number> = {};
        for (const o of orders) {
          const s = (o.status ?? 'UNKNOWN').toUpperCase();
          byStatus[s] = (byStatus[s] || 0) + 1;
        }
        setOrdersByStatus(byStatus);
      } catch (err) {
        // if fetch fails, log and provide sensible defaults so UI renders
        console.error('Failed to fetch provider stats', err);
        if (mounted) {
          setMealsCount(0);
          setActiveMeals(0);
          setInactiveMeals(0);
          setOrdersCount(0);
          setRevenue(0);
          setOrdersByStatus({});
        }
      } finally {
        if (mounted) setStatsLoading(false);
      }
    };
    // initiate fetch
    fetchData();

    return () => { mounted = false; };
  }, []);

  if (statsLoading) {
    return (
      <div className="mb-6">
        <div className="text-sm text-muted-foreground">Loading Provider Stats...</div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-md p-4 shadow-sm">
          <div className="text-sm text-slate-500">Meals</div>
          <div className="mt-2 text-2xl font-semibold">{mealsCount ?? '—'}</div>
          <div className="mt-1 text-sm text-slate-400">Active: {activeMeals} · Inactive: {inactiveMeals}</div>
        </div>

        <div className="bg-white rounded-md p-4 shadow-sm">
          <div className="text-sm text-slate-500">Orders</div>
          <div className="mt-2 text-2xl font-semibold">{ordersCount ?? '—'}</div>
          <div className="mt-1 text-sm text-slate-400">Revenue: ৳ {revenue}</div>
        </div>

        <div className="bg-white rounded-md p-4 shadow-sm">
          <div className="text-sm text-slate-500">Quick Actions</div>
          <div className="mt-2 flex items-center gap-2">
            <Link href="/provider-dashboard/menu" className="px-3 py-1 bg-amber-600 text-white rounded">Add Meal</Link>
            <Link href="/provider-dashboard/orders" className="px-3 py-1 border rounded">View Orders</Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md p-4 shadow-sm">
        <div className="text-sm text-slate-500 mb-2">Orders by status</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(ordersByStatus).length === 0 ? (
            <div className="text-sm text-slate-400 col-span-4">No orders yet.</div>
          ) : (
            Object.entries(ordersByStatus).map(([status, count]) => (
              <div key={status} className={`rounded-md p-2 text-sm font-medium ${status === 'PLACED' ? 'bg-amber-50 text-amber-700' : status === 'PREPARING' ? 'bg-yellow-50 text-yellow-700' : status === 'READY' ? 'bg-green-50 text-green-700' : status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'}`}>
                <div>{status}</div>
                <div className="text-lg font-semibold">{count}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

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
    } catch {
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
            <div className="mb-4">
              <Link href="/" className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-50">
                <span>🏠</span>
                <span>Dashboard</span>
              </Link>
            </div>
            <div className="mb-2">
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
          <aside className="w-64 hidden md:block bg-[#1f1410] text-[#f7efe6] px-4 py-6">
            <div className="mb-6 px-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center text-white">🍲</div>
                <div>
                  <div className="text-lg font-semibold">Bhojonbox</div>
                </div>
              </div>

              <div className="bg-[#2b1b16] rounded-md p-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-amber-600 flex items-center justify-center font-semibold">{user?.name ? user.name.charAt(0) : 'S'}</div>
                  <div>
                    <div className="font-medium">{user?.name ?? 'Spice Garden'}</div>
                    <div className="text-xs text-[#e6d8cc]">{user?.email ?? ''}</div>
                    <div className="mt-2">
                      <span className="inline-block text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">PROVIDER</span>
                    </div>
                  </div>
                </div>
              </div>

              <nav className="flex flex-col gap-2">
                <Link href="/provider-dashboard" className={`flex items-center gap-3 px-3 py-3 rounded ${pathname === '/provider-dashboard' || pathname === '/provider-dashboard/' ? 'bg-amber-600 text-white' : 'text-[#f7efe6] hover:bg-[#2b1b16]'}`}>
                  <span className="text-lg">🏠</span>
                  <span className="font-medium">Dashboard</span>
                </Link>

                <Link href="/provider-dashboard/menu" className={`flex items-center gap-3 px-3 py-3 rounded ${pathname?.startsWith('/provider-dashboard/menu') ? 'bg-[#2b1b16] text-amber-300' : 'text-[#d9cbbf] hover:bg-[#2b1b16]'}`}>
                  <span>＋</span>
                  <span>My Menu</span>
                </Link>

                <Link href="/provider-dashboard/orders" className={`flex items-center gap-3 px-3 py-3 rounded ${pathname?.startsWith('/provider-dashboard/orders') ? 'bg-[#2b1b16] text-amber-300' : 'text-[#d9cbbf] hover:bg-[#2b1b16]'}`}>
                  <span>📦</span>
                  <span>Orders</span>
                </Link>

                <Link href="/provider-dashboard/profile" className={`flex items-center gap-3 px-3 py-3 rounded ${pathname?.startsWith('/provider-dashboard/profile') ? 'bg-[#2b1b16] text-amber-300' : 'text-[#d9cbbf] hover:bg-[#2b1b16]'}`}>
                  <span>👤</span>
                  <span>Profile</span>
                </Link>

                <button type="button" onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded text-red-400 hover:bg-[#2b1b16] mt-4">
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          <main className="flex-1 p-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">
              {pathname === '/provider-dashboard' || pathname === '/provider-dashboard/' ? (
                <ProviderStatsSection />
              ) : null}

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
