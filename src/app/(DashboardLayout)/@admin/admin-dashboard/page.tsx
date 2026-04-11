"use client";

"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services";
import Loading from "@/components/ui/Loading";

function StatCard({ title, value, subtitle, className = "", footer, }: { title: string; value: React.ReactNode; subtitle?: string; className?: string; footer?: React.ReactNode }) {
  return (
    <div className={`rounded-lg p-4 shadow-sm flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-white/90">{title}</div>
          <div className="text-2xl font-bold text-white">{value}</div>
          {subtitle && <div className="text-xs text-white/80">{subtitle}</div>}
        </div>
      </div>
      {footer && <div className="mt-2">{footer}</div>}
    </div>
  );
}

type OrdersByStatus = Record<string, number>;

interface Stats {
  users?: {
    total?: number;
    customers?: number;
    providers?: number;
  };
  meals?: number;
  orders?: {
    total?: number;
    byStatus?: OrdersByStatus;
  };
  revenue?: number | string;
  reviews?: number;
  recentOrders?: unknown[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const json = await adminService.getDashboardStats();
        // server returns { data: { stats } }
        const s = json.data?.stats ?? json.data ?? json;
        setStats(s);
      } catch (err) {
        // ignore for now
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-2 md:p-6 lg:p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground mt-1 font-medium italic">Comprehensive insights into the BhojonBox gourmet ecosystem.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-[2rem] shadow-sm animate-pulse">
           <Loading label="Gleaning insights..." />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group bg-card border border-border rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Total Users</div>
            <div className="flex items-end gap-3 mb-6">
              <div className="text-5xl font-black text-foreground brand">{stats.users?.total ?? 0}</div>
              <div className="text-xs font-bold text-emerald-500 mb-2">↑ 12% This Mo.</div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 p-3 bg-muted/40 rounded-2xl border border-border/50 text-center">
                <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-tighter">Foodies</div>
                <div className="font-bold text-card-foreground">{stats.users?.customers ?? 0}</div>
              </div>
              <div className="flex-1 p-3 bg-muted/40 rounded-2xl border border-border/50 text-center">
                <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-tighter">Providers</div>
                <div className="font-bold text-card-foreground">{stats.users?.providers ?? 0}</div>
              </div>
            </div>
          </div>

          <div className="group bg-card border border-border rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden border-l-primary border-l-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Marketplace Revenue</div>
            <div className="text-5xl font-black text-primary brand mb-6">৳ {stats.revenue || 0}</div>
            <div className="space-y-4">
               <div className="flex items-center justify-between text-xs px-2">
                  <span className="text-muted-foreground font-bold uppercase tracking-widest">Platform Fee (10%)</span>
                  <span className="text-foreground font-black">৳ {(Number(stats.revenue) * 0.1).toFixed(0)}</span>
               </div>
               <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[70%]" />
               </div>
            </div>
          </div>

          <div className="group bg-card border border-border rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Total Culinary Items</div>
            <div className="text-5xl font-black text-foreground brand mb-6">{stats.meals ?? 0}</div>
            <p className="text-xs text-muted-foreground italic leading-relaxed">Active menu items being served by our network of gourmet providers.</p>
          </div>

          <div className="lg:col-span-2 group bg-card border border-border rounded-[2rem] p-8 lg:p-10 shadow-sm relative overflow-hidden">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-foreground brand">Gourmet Orders Flow</h3>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Live platform activity across status states</p>
                </div>
                <div className="text-4xl">🥡</div>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.orders?.byStatus && Object.entries(stats.orders.byStatus).map(([status, count]: [string, number]) => (
                   <div key={status} className="p-5 bg-muted/30 rounded-3xl border border-border/40 hover:border-primary/30 transition-colors">
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 opacity-60">{status.replaceAll("_", " ")}</div>
                      <div className="text-3xl font-black text-foreground">{count}</div>
                   </div>
                ))}
             </div>
          </div>

          <div className="group bg-card border border-border rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Customer Satisfaction</div>
            <div className="text-5xl font-black text-foreground brand mb-6 flex items-center gap-2">
              {stats.reviews ?? 0} <span className="text-2xl text-primary">★</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <span>Based on feedback from {stats.recentOrders?.length || 0} orders</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-20 bg-card border border-border border-dashed rounded-[2rem] flex items-center justify-center text-center">
            <p className="text-muted-foreground font-black uppercase tracking-widest italic opacity-50">No operational data available at this time.</p>
        </div>
      )}
    </div>
  );
}
