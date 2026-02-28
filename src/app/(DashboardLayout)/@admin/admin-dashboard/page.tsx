"use client";

"use client";

import { useEffect, useState } from "react";
import adminService from "../../../../services/admin";
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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin · Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-6">Platform stats and quick actions.</p>

      {loading ? (
        <div className="mb-6"><Loading /></div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <StatCard
            title="Users"
            value={stats.users?.total ?? 0}
            subtitle={`${stats.users?.customers ?? 0} customers • ${stats.users?.providers ?? 0} providers`}
            className="bg-gradient-to-r from-indigo-600 to-violet-600"
          />

          <StatCard
            title="Providers"
            value={stats.users?.providers ?? 0}
            subtitle={`${stats.users?.customers ?? 0} customers`}
            className="bg-gradient-to-r from-sky-600 to-cyan-500"
          />

          <StatCard
            title="Meals"
            value={stats.meals ?? 0}
            subtitle="Total meals listed"
            className="bg-gradient-to-r from-emerald-600 to-teal-500"
          />

          <StatCard
            title="Orders"
            value={stats.orders?.total ?? 0}
            className="bg-gradient-to-r from-yellow-600 to-orange-500"
            footer={
              <div className="flex flex-wrap gap-2">
                {stats.orders?.byStatus && Object.entries(stats.orders.byStatus).map(([k, v]: [string, number]) => (
                  <span key={k} className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">
                    {k.replaceAll("_", " ")}: {v}
                  </span>
                ))}
              </div>
            }
          />

          <StatCard
            title="Revenue"
            value={typeof stats.revenue === "number" ? new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(stats.revenue) : stats.revenue}
            subtitle={`Reviews: ${stats.reviews ?? 0}`}
            className="bg-gradient-to-r from-rose-600 to-pink-500"
          />

          <StatCard
            title="Reviews"
            value={stats.reviews ?? 0}
            subtitle={`${(stats.recentOrders ?? []).length ?? 0} recent orders`}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-500"
          />
        </div>
      ) : (
        <p>No stats available</p>
      )}

    </div>
  );
}
