"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Loading from "@/components/ui/Loading";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";
import { Menu, X } from "lucide-react";
import { authService } from "@/services";

type Meal = { isAvailable?: boolean };

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
        const headers = authService.getAuthHeaders();
        const mRes = await fetch(`${API_BASE_URL}/meals/provider/my-meals`, { headers, credentials: 'include' });
        const mJson = await mRes.json().catch(() => null);
        const meals: Meal[] = mRes.ok ? (mJson?.data?.meals ?? []) : [];

        const oRes = await fetch(`${API_BASE_URL}/orders/provider/orders`, { headers, credentials: 'include' });
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

    fetchData();
    return () => { mounted = false; };
  }, []);

  if (statsLoading) return <div className="mb-6"><Loading /></div>;

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Meals</div>
          <div className="mt-2 text-3xl font-bold text-card-foreground">{mealsCount ?? '—'}</div>
          <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>{activeMeals} Active</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground/30"></span>{inactiveMeals} Inactive</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Orders</div>
          <div className="mt-2 text-3xl font-bold text-card-foreground">{ordersCount ?? '—'}</div>
          <div className="mt-2 text-xs text-muted-foreground font-medium">Revenue: <span className="text-emerald-600 dark:text-emerald-400 font-bold">৳ {revenue}</span></div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Quick Actions</div>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/provider-dashboard/menu" className="flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-sm hover:scale-[1.02] transition-transform">Add New Meal</Link>
            <Link href="/provider-dashboard/orders" className="flex items-center justify-center px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-xl font-semibold text-sm hover:bg-muted transition-colors">Manage Orders</Link>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Orders by status</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(ordersByStatus).length === 0 ? (
            <div className="text-sm text-muted-foreground col-span-4 py-4 text-center border-2 border-dashed border-border rounded-xl">No orders yet.</div>
          ) : (
            Object.entries(ordersByStatus).map(([status, count]) => (
              <div key={status} className={`rounded-xl p-4 border transition-all ${status === 'PLACED' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400' : status === 'PREPARING' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400' : status === 'READY' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : status === 'DELIVERED' ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-muted border-border text-muted-foreground'}`}>
                <div className="text-xs font-bold uppercase tracking-tighter mb-1 opacity-80">{status}</div>
                <div className="text-2xl font-bold">{count}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface User {
  name?: string;
  email?: string;
  role?: 'ADMIN' | 'PROVIDER' | 'CUSTOMER' | string;
}

const SidebarContent = ({ user, pathname, handleLogout, onLinkClick }: { user: User; pathname: string; handleLogout: () => void; onLinkClick?: () => void }) => (
  <>
    <div className="mb-8 pl-1">
      <Link 
        href="/" 
        onClick={(e) => {
          if (pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (onLinkClick) onLinkClick();
        }} 
        className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary transition-all hover:text-primary-foreground"
      >
        <span>🏠</span>
        <span>Go to Home</span>
      </Link>
    </div>

    <div className="mb-8 p-4 rounded-2xl bg-muted/50 border border-border/50">
      <div className="flex items-center gap-3">
        <Avatar className="border-2 border-primary/20 h-10 w-10">
          {user?.name ? (
            <AvatarFallback className="bg-primary text-primary-foreground">{user.name.charAt(0)}</AvatarFallback>
          ) : (
            <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
          )}
        </Avatar>
        
        <div className="overflow-hidden">
          <div className="font-bold text-card-foreground truncate">{user?.name ?? 'User'}</div>
          <div className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-widest">{user?.role ?? 'USER'}</div>
        </div>
      </div>
    </div>

    <nav className="flex-1 flex flex-col gap-1">
      {user?.role === 'ADMIN' ? (
        <>
          <Link onClick={onLinkClick} href="/admin-dashboard" className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${pathname === '/admin-dashboard' || pathname === '/admin-dashboard/' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            { (pathname === '/admin-dashboard' || pathname === '/admin-dashboard/') && <div className="absolute right-0 top-3 bottom-3 w-1 bg-primary rounded-l-full" /> }
            <span className="text-xl">📊</span>
            <span>Overview</span>
          </Link>
          <Link onClick={onLinkClick} href="/admin-dashboard/users" className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${pathname?.startsWith('/admin-dashboard/users') ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            { pathname?.startsWith('/admin-dashboard/users') && <div className="absolute right-0 top-3 bottom-3 w-1 bg-primary rounded-l-full" /> }
            <span className="text-xl">👥</span>
            <span>Users</span>
          </Link>
          <Link onClick={onLinkClick} href="/admin-dashboard/orders" className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${pathname?.startsWith('/admin-dashboard/orders') ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            { pathname?.startsWith('/admin-dashboard/orders') && <div className="absolute right-0 top-3 bottom-3 w-1 bg-primary rounded-l-full" /> }
            <span className="text-xl">📦</span>
            <span>Orders</span>
          </Link>
          <Link onClick={onLinkClick} href="/admin-dashboard/categories" className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${pathname?.startsWith('/admin-dashboard/categories') ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            { pathname?.startsWith('/admin-dashboard/categories') && <div className="absolute right-0 top-3 bottom-3 w-1 bg-primary rounded-l-full" /> }
            <span className="text-xl">📂</span>
            <span>Categories</span>
          </Link>
          <Link onClick={onLinkClick} href="/admin-dashboard/profile" className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${pathname?.startsWith('/admin-dashboard/profile') ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            { pathname?.startsWith('/admin-dashboard/profile') && <div className="absolute right-0 top-3 bottom-3 w-1 bg-primary rounded-l-full" /> }
            <span className="text-xl">👤</span>
            <span>Profile</span>
          </Link>
        </>
      ) : user?.role === 'PROVIDER' ? (
        <>
          <Link onClick={onLinkClick} href="/provider-dashboard" className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${pathname === '/provider-dashboard' || pathname === '/provider-dashboard/' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            { (pathname === '/provider-dashboard' || pathname === '/provider-dashboard/') && <div className="absolute right-0 top-3 bottom-3 w-1 bg-primary rounded-l-full" /> }
            <span className="text-xl">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link onClick={onLinkClick} href="/provider-dashboard/menu" className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${pathname?.startsWith('/provider-dashboard/menu') ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            { pathname?.startsWith('/provider-dashboard/menu') && <div className="absolute right-0 top-3 bottom-3 w-1 bg-primary rounded-l-full" /> }
            <span className="text-xl">🍽️</span>
            <span>My Menu</span>
          </Link>
          <Link onClick={onLinkClick} href="/provider-dashboard/orders" className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${pathname?.startsWith('/provider-dashboard/orders') ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            { pathname?.startsWith('/provider-dashboard/orders') && <div className="absolute right-0 top-3 bottom-3 w-1 bg-primary rounded-l-full" /> }
            <span className="text-xl">📦</span>
            <span>Orders</span>
          </Link>
          <Link onClick={onLinkClick} href="/provider-dashboard/profile" className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${pathname?.startsWith('/provider-dashboard/profile') ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            { pathname?.startsWith('/provider-dashboard/profile') && <div className="absolute right-0 top-3 bottom-3 w-1 bg-primary rounded-l-full" /> }
            <span className="text-xl">👤</span>
            <span>Profile</span>
          </Link>
        </>
      ) : (
        <>
          <Link onClick={onLinkClick} href="/customer-dashboard/orders" className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${pathname?.startsWith('/customer-dashboard/orders') ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            { pathname?.startsWith('/customer-dashboard/orders') && <div className="absolute right-0 top-3 bottom-3 w-1 bg-primary rounded-l-full" /> }
            <span className="text-xl">🛍️</span>
            <span>My Orders</span>
          </Link>
          <Link onClick={onLinkClick} href="/customer-dashboard/profile" className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${pathname?.startsWith('/customer-dashboard/profile') ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            { pathname?.startsWith('/customer-dashboard/profile') && <div className="absolute right-0 top-3 bottom-3 w-1 bg-primary rounded-l-full" /> }
            <span className="text-xl">👤</span>
            <span>Profile</span>
          </Link>
        </>
      )}

      <button type="button" onClick={handleLogout} className="mt-auto group flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-destructive hover:bg-destructive/10 font-bold">
        <span className="text-xl">🚪</span>
        <span>Logout</span>
      </button>
    </nav>
  </>
);

const Sidebar = ({ user, pathname, handleLogout, mobileMenuOpen, setMobileMenuOpen }: { user: User; pathname: string; handleLogout: () => void; mobileMenuOpen: boolean; setMobileMenuOpen: (val: boolean) => void }) => (
  <>
    <aside className="w-64 border-r border-border p-6 hidden lg:flex flex-col bg-card sticky top-0 h-screen overflow-auto">
      <SidebarContent user={user} pathname={pathname} handleLogout={handleLogout} />
    </aside>

    {mobileMenuOpen && (
      <div className="fixed inset-0 z-50 lg:hidden flex">
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-all" onClick={() => setMobileMenuOpen(false)} />
        <aside className="relative w-72 max-w-[80vw] h-full bg-card p-6 flex flex-col overflow-auto shadow-2xl animate-in slide-in-from-left duration-300">
          <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 bg-muted rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors border border-border">
            <X className="w-4 h-4" />
          </button>
          <div className="mt-4 flex-1 flex flex-col">
            <SidebarContent user={user} pathname={pathname} handleLogout={handleLogout} onLinkClick={() => setMobileMenuOpen(false)} />
          </div>
        </aside>
      </div>
    )}
  </>
);

export default function DashboardLayout({ children, admin, provider, customer }: { children: React.ReactNode; admin?: React.ReactNode; provider?: React.ReactNode; customer?: React.ReactNode; }) {
  const { user, isLoading, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
      if (typeof setUser === 'function') setUser(null);
      toast.success('Logged out');
      if (pathname?.startsWith('/admin-dashboard') || pathname?.startsWith('/provider-dashboard') || pathname?.startsWith('/customer-dashboard') || pathname?.startsWith('/dashboard')) {
        router.push('/login');
      } else {
        router.push('/');
      }
    } catch {
      toast.error('Failed to logout');
    }
  };

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
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {user?.role === "ADMIN" ? (
        <>
          <Sidebar user={user} pathname={pathname} handleLogout={handleLogout} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          <main className="flex-1 p-4 sm:p-6 lg:p-10 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2.5 bg-card border border-border rounded-xl hover:bg-muted transition-colors"><Menu className="w-5 h-5" /></button>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Admin Overview</h1>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-xl shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground hidden sm:inline">Admin Mode</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground sm:hidden">Admin</span>
                </div>
              </div>
              <div className="mt-6">{admin ?? children}</div>
            </div>
          </main>
        </>
      ) : user?.role === "PROVIDER" ? (
        <>
          <Sidebar user={user} pathname={pathname} handleLogout={handleLogout} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          <main className="flex-1 p-4 sm:p-6 lg:p-10 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2.5 bg-card border border-border rounded-xl hover:bg-muted transition-colors"><Menu className="w-5 h-5" /></button>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Provider Dashboard</h1>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-xl shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground hidden sm:inline">Provider Mode</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground sm:hidden">Provider</span>
                </div>
              </div>
              {pathname === '/provider-dashboard' || pathname === '/provider-dashboard/' ? (
                <ProviderStatsSection />
              ) : null}
              <div className="mt-6">{provider ?? children}</div>
            </div>
          </main>
        </>
      ) : (
        <>
          <Sidebar user={user ?? {}} pathname={pathname} handleLogout={handleLogout} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          <main className="flex-1 p-4 sm:p-6 lg:p-10 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2.5 bg-card border border-border rounded-xl hover:bg-muted transition-colors"><Menu className="w-5 h-5" /></button>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Customer Dashboard</h1>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-xl shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground hidden sm:inline">Customer Mode</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground sm:hidden">Customer</span>
                </div>
              </div>
              <div className="mt-6">{customer ?? children}</div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
