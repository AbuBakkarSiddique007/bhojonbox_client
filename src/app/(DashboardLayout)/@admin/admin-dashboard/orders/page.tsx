"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import { adminService } from "@/services";

function OrderStatusBadge({ status }: { status?: string }) {
  const s = (status || "").toUpperCase();
  const map: Record<string, string> = {
    PLACED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    PENDING: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    PREPARING: "bg-primary/10 text-primary border-primary/20",
    READY: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    DELIVERED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
  };
  const cls = map[s] || "bg-muted text-muted-foreground border-border";
  return <span className={`inline-flex items-center text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-widest ${cls}`}>{s || 'UNKNOWN'}</span>;
}

export default function AdminOrdersPage() {
  type User = { name?: string; email?: string } & Record<string, unknown>;
  type Provider = { storeName?: string; name?: string } & Record<string, unknown>;
  type Order = {
    id?: string | number;
    user?: User;
    provider?: Provider;
    status?: string;
    totalAmount?: number;
    total?: number;
    createdAt?: string;
  } & Record<string, unknown>;

  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrders = async (opts: { status?: string } = {}) => {
    setLoading(true);
    try {
      const json = await adminService.getOrders({ status: opts.status ?? status });
      const hasData = (obj: unknown): obj is { data: unknown } => typeof obj === "object" && obj !== null && "data" in obj;
      let data: unknown = json;
      if (hasData(json)) data = (json as { data: unknown }).data;
      const hasOrders = (obj: unknown): obj is { orders: unknown } => typeof obj === "object" && obj !== null && "orders" in obj;
      if (hasOrders(data) && Array.isArray(data.orders)) setOrders(data.orders as Order[]);
      else if (Array.isArray(data)) setOrders(data as Order[]);
      else setOrders([]);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const formatCurrency = (v: number | string | undefined) => {
    if (v == null) return "—";
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isNaN(n)) return String(v);
    return `৳${n.toLocaleString()}`;
  };

  const STATUS_FILTERS = ["", "PLACED", "PENDING", "PREPARING", "READY", "DELIVERED", "CANCELLED"];

  return (
    <div className="p-4 md:p-8 lg:p-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter brand uppercase">Order Ledger</h1>
          <p className="text-muted-foreground mt-2 font-medium italic opacity-80">Complete transaction log across the entire platform.</p>
        </div>
        <select
          value={status}
          onChange={(e) => { const s = e.target.value; setStatus(s); fetchOrders({ status: s }); }}
          className="px-5 py-3 rounded-xl border border-border bg-card text-foreground text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/30 outline-none transition-all"
        >
          {STATUS_FILTERS.map(s => (
            <option key={s} value={s}>{s || "All Statuses"}</option>
          ))}
        </select>
      </div>

      <div className="bg-card rounded-[2rem] border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">#</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Restaurant</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="p-12 text-center"><Loading /></td></tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-muted-foreground italic text-sm">
                    No orders found matching the selected filter.
                  </td>
                </tr>
              ) : (
                orders.map((o: Order, idx: number) => (
                  <tr key={o.id ?? idx} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4 text-[10px] font-black text-muted-foreground/50 uppercase">{idx + 1}</td>
                    <td className="px-6 py-4 font-semibold text-foreground text-sm">{o.user?.name || o.user?.email || '—'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{o.provider?.storeName || o.provider?.name || '—'}</td>
                    <td className="px-6 py-4"><OrderStatusBadge status={o.status} /></td>
                    <td className="px-6 py-4 text-primary font-black text-sm">{formatCurrency(o.totalAmount ?? o.total)}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
