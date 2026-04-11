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
    <div className="p-2 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Incoming Orders</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Track and manage your gourmet meal deliveries.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-card/50 p-2 rounded-2xl border border-border backdrop-blur-sm shadow-sm">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-2">Filter By:</div>
          <div className="flex bg-muted/50 rounded-xl p-1 gap-1">
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === s ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                {s === 'ALL' ? 'Total' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-card border-2 border-dashed border-border rounded-3xl p-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-4xl mb-6">📦</div>
            <h3 className="text-xl font-bold text-card-foreground">No orders matching your filter</h3>
            <p className="text-muted-foreground mt-2 max-w-sm italic">When customers order your delicious meals, they will appear right here.</p>
          </div>
        ) : (
          filteredOrders.map((o) => (
            <div key={o.id} className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1 bg-primary/10 text-primary font-black rounded-lg text-xs leading-none">ORDER #{o.id.slice(-6).toUpperCase()}</div>
                    <span className="text-muted-foreground/30 text-xl">•</span>
                    <span className="text-muted-foreground text-sm font-medium">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</span>
                  </div>
                  
                  <div className="text-2xl font-black text-foreground mb-4 brand">
                    {o.customer?.name ?? 'Anonymous Foodie'}
                  </div>
                  
                  <div className="space-y-3">
                    {o.items?.map(it => (
                      <div key={it.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/40 group-hover:border-primary/20 transition-colors">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center font-black text-primary">{it.quantity}</div>
                        <div className="font-bold text-card-foreground">{it.meal?.name ?? 'Delicious Item'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full lg:w-72 p-6 lg:p-8 bg-muted/20 flex flex-col justify-between overflow-hidden relative">
                  <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                  
                  <div className="relative">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Bill</div>
                    <div className="text-4xl font-black text-primary brand">৳ {o.totalAmount ?? 0}</div>
                    
                    <div className="mt-6">
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 opacity-60">Status</div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-wider uppercase transition-all ${o.status === 'CANCELLED' ? 'bg-red-500/10 text-red-600 border border-red-500/20' : o.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${o.status === 'CANCELLED' ? 'bg-red-600' : o.status === 'DELIVERED' ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                        {o.status}
                      </span>
                    </div>
                  </div>

                  {NEXT_STATUS[o.status ?? ''] && (
                    <div className="mt-8 relative">
                      <button
                        className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${processingId === o.id ? 'bg-muted text-muted-foreground cursor-not-allowed shadow-none' : 'bg-primary text-primary-foreground hover:shadow-primary/20 hover:-translate-y-0.5'}`}
                        onClick={() => advanceStatus(o.id, o.status)}
                        disabled={processingId === o.id}
                      >
                        {processingId === o.id ? <Loading inline size="sm" label="Updating…" /> : (
                          <>
                            <span>Mark as {NEXT_STATUS[o.status ?? '']}</span>
                            <span className="text-lg">➔</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
