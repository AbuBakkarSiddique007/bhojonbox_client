"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Loading from "@/components/ui/Loading";

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

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
  if (!orders) return <div className="p-6"><Loading /></div>;
  if (orders.length === 0) return <div className="p-6 text-sm text-muted-foreground">You have no orders yet.</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">My Orders</h1>
          <p className="text-sm text-muted-foreground">Track all your food orders</p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/customer-dashboard/orders/${o.id}`} className="text-lg font-medium text-amber-700 hover:underline">Order #{o.id}</Link>
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

                {o.status === 'PLACED' && (
                  <div className="mt-3">
                    <button
                      className={`ml-3 px-3 py-1 rounded-md text-white ${processingId === o.id ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                      onClick={() => {
                        setSelectedOrderId(o.id);
                        setConfirmOpen(true);
                      }}
                      disabled={processingId === o.id}
                    >
                      {processingId === o.id ? <Loading inline size="sm" label="Processing…" /> : 'Cancel'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Cancel Order"
        description="Are you sure you want to cancel this order? This action cannot be undone."
        confirmLabel="Cancel Order"
        cancelLabel="Keep Order"
        loading={confirmLoading}
        onCancel={() => { setConfirmOpen(false); setSelectedOrderId(null); }}
        onConfirm={async () => {
          if (!selectedOrderId) return;
          try {
            setConfirmLoading(true);
            setProcessingId(selectedOrderId);
            const res = await fetch(`${API_BASE_URL}/orders/${selectedOrderId}/cancel`, { method: 'PATCH', credentials: 'include' });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Failed to cancel order');
            toast.success('Order cancelled');
            // refresh orders
            const refresh = await fetch(`${API_BASE_URL}/orders/my-orders`, { credentials: 'include' });
            const refreshJson = await refresh.json();
            setOrders(refreshJson?.data?.orders ?? []);
          } catch (err: unknown) {
            if (err instanceof Error) toast.error(err.message);
            else toast.error(String(err));
          } finally {
            setConfirmLoading(false);
            setProcessingId(null);
            setConfirmOpen(false);
            setSelectedOrderId(null);
          }
        }}
      />
    </div>
  );
}
