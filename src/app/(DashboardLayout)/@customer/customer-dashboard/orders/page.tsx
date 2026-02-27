"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/config";

type Order = {
  id: string;
  totalAmount?: number;
  status?: string;
  createdAt?: string;
  items?: { id: string; meal?: { name?: string }; quantity?: number }[];
};

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/orders/my-orders`, { credentials: 'include' });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || 'Failed to fetch orders');
        if (!mounted) return;
        setOrders(json?.data?.orders ?? []);
      } catch (e: unknown) {
        if (!mounted) return;
        if (e instanceof Error) {
          setErr(e.message);
        } else {
          setErr(String(e));
        }
      }
    };

    fetchOrders();
    return () => { mounted = false; };
  }, []);

  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;
  if (!orders) return <div className="p-6 text-sm text-muted-foreground">Loading orders…</div>;
  if (orders.length === 0) return <div className="p-6 text-sm text-muted-foreground">You have no orders yet.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
      <p className="text-sm text-muted-foreground mb-4">List of your recent orders.</p>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="bg-white border border-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <Link href={`/customer-dashboard/orders/${o.id}`} className="text-primary font-medium hover:underline">Order #{o.id}</Link>
                <div className="text-sm text-slate-600">{o.items?.length ?? 0} items • {o.status}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">৳ {o.totalAmount ?? 0}</div>
                <div className="text-xs text-slate-500">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
