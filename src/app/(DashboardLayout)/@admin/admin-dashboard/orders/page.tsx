"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import adminService from "../../../../../services/admin";

function OrderStatusBadge({ status }: { status?: string }) {
  const s = (status || "").toUpperCase();
  const map: Record<string, string> = {
    PLACED: "bg-blue-100 text-blue-700",
    PENDING: "bg-blue-100 text-blue-700",
    PREPARING: "bg-amber-100 text-amber-700",
    READY: "bg-emerald-100 text-emerald-700",
    DELIVERED: "bg-orange-100 text-orange-700",
    CANCELLED: "bg-rose-100 text-rose-700",
  };
  const cls = map[s] || "bg-slate-100 text-slate-700";
  return <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${cls}`}>{s || 'UNKNOWN'}</span>;
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

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatCurrency = (v: number | string | undefined) => {
    if (v == null) return "—";
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isNaN(n)) return String(v);
    return `৳${n.toLocaleString()}`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">All Orders</h1>
          <p className="text-sm text-muted-foreground">View every order placed on the platform.</p>
        </div>

        <div>
          <select
            value={status}
            onChange={(e) => {
              const s = e.target.value;
              setStatus(s);
              fetchOrders({ status: s });
            }}
            className="p-2 rounded-lg border bg-white"
          >
            <option value="">All Statuses</option>
            <option value="PLACED">PLACED</option>
            <option value="PENDING">PENDING</option>
            <option value="PREPARING">PREPARING</option>
            <option value="READY">READY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <table className="w-full">
          <thead className="bg-amber-50 text-slate-600 text-xs uppercase">
            <tr>
              <th className="text-left p-4">Serials</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Restaurant</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center"><Loading /></td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center">No orders found.</td></tr>
            ) : (
              orders.map((o: Order, idx: number) => (
                <tr key={o.id ?? idx} className="border-t">
                  <td className="p-4 font-semibold">{idx + 1}</td>
                  <td className="p-4">{o.user?.name || o.user?.email || '—'}</td>
                  <td className="p-4">{o.provider?.storeName || o.provider?.name || '—'}</td>
                  <td className="p-4"><OrderStatusBadge status={o.status} /></td>
                  <td className="p-4 text-amber-600 font-semibold">{formatCurrency(o.totalAmount ?? o.total)}</td>
                  <td className="p-4 text-slate-600">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
