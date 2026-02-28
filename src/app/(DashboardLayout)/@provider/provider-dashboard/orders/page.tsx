"use client";

import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";
import Loading from "@/components/ui/Loading";

type Order = {
  id: string;
  totalAmount?: number;
  status?: string;
  createdAt?: string;
  items?: { id: string; meal?: { name?: string }; quantity?: number }[];
  customer?: { name?: string };
};

const NEXT_STATUS: Record<string, string | null> = {
  PLACED: 'PREPARING',
  PREPARING: 'READY',
  READY: 'DELIVERED',
  DELIVERED: null,
  CANCELLED: null,
};

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  const fetchOrders = async () => {
    try {
      setErr(null);
      const res = await fetch(`${API_BASE_URL}/orders/provider/orders`, { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Failed to fetch orders');
      setOrders(json?.data?.orders ?? []);
    } catch (e: unknown) {
      if (e instanceof Error) setErr(e.message);
      else setErr(String(e));
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const advanceStatus = async (id: string, current: string | undefined) => {
    const next = current ? NEXT_STATUS[current] : null;
    if (!next) return;
    try {
      setProcessingId(id);
      const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Failed to update status');
      toast.success('Order status updated');
      fetchOrders();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error(String(err));
    } finally { setProcessingId(null); }
  };

  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;
  if (!orders) return <div className="p-6"><Loading /></div>;
  if (orders.length === 0) return <div className="p-6 text-sm text-muted-foreground">No incoming orders.</div>;

  const STATUS_OPTIONS = ['ALL', 'PLACED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
  const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => (o.status ?? '').toUpperCase() === filter);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Provider · Orders</h1>
          <p className="text-sm text-muted-foreground">Advance order status from here.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Showing {filteredOrders.length} of {orders.length}</div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border rounded-md bg-white text-sm"
            aria-label="Filter orders by status"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Orders' : s[0] + s.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((o) => (
          <div key={o.id} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-medium">Order #{o.id} — {o.customer?.name ?? 'Customer'}</div>
                <div className="mt-1 text-sm text-slate-600">{o.items?.map(it => `${it.quantity}× ${it.meal?.name ?? ''}`).join(', ')}</div>
                <div className="mt-2 text-xs text-slate-500">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</div>
              </div>

              <div className="text-right flex flex-col items-end">
                <div className="text-2xl font-semibold text-amber-600">৳ {o.totalAmount ?? 0}</div>
                <div className="mt-2">
                  <span className={`inline-block text-xs px-2 py-1 rounded-full ${o.status === 'CANCELLED' ? 'bg-red-50 text-red-700' : o.status === 'DELIVERED' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                    {o.status}
                  </span>
                </div>

                {NEXT_STATUS[o.status ?? ''] && (
                  <div className="mt-3">
                    <button
                      className={`ml-3 px-3 py-1 rounded-md text-white ${processingId === o.id ? 'bg-gray-400' : 'bg-amber-600 hover:bg-amber-700'}`}
                      onClick={() => advanceStatus(o.id, o.status)}
                      disabled={processingId === o.id}
                    >
                      {processingId === o.id ? <Loading inline size="sm" label="Processing…" /> : `Mark ${NEXT_STATUS[o.status ?? '']}`}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
