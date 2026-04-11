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
        setErr(e instanceof Error ? e.message : String(e));
      }
    };

    fetchOrders();
    return () => { mounted = false; };
  }, []);

  if (err) return <div className="p-8 text-destructive animate-in fade-in italic">Executive Error: {err}</div>;
  if (!orders) return <div className="p-12 flex justify-center"><Loading /></div>;
  
  if (orders.length === 0) {
    return (
      <div className="p-12 text-center animate-in fade-in duration-700">
         <div className="text-7xl opacity-10 mb-6 drop-shadow-xl">📜</div>
         <h2 className="text-2xl font-black text-foreground brand uppercase tracking-widest mb-4">No Active Engagements</h2>
         <p className="text-sm text-muted-foreground italic max-w-sm mx-auto">Your order history is currently a blank canvas. Discover something extraordinary to begin your narrative.</p>
         <Link href="/meals" className="inline-block mt-8 text-[10px] font-black uppercase tracking-widest text-primary hover:underline transition-all">Explore Culinary Offerings</Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter brand uppercase text-primary">Order Chronicles</h1>
          <p className="text-muted-foreground mt-2 font-medium italic opacity-80">Historical log of your curated culinary experiences.</p>
        </div>
        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] bg-muted/30 px-4 py-2 rounded-full border border-border">
           Total Engagements: {orders.length}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
        {orders.map((o) => (
          <div key={o.id} className="group bg-card border border-border rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-1000"></div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-lg shadow-inner">🍽️</div>
                   <div>
                      <Link href={`/customer-dashboard/orders/${o.id}`} className="text-lg font-black text-foreground brand uppercase tracking-tight hover:text-primary transition-colors flex items-center gap-2">
                        Assignment #{o.id.slice(-6).toUpperCase()}
                        <span className="text-[10px] text-muted-foreground font-mono opacity-40">({o.id})</span>
                      </Link>
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 italic">
                        {o.createdAt ? new Date(o.createdAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }) : 'Temporal Log Unavailable'}
                      </div>
                   </div>
                </div>
                
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-sm italic text-muted-foreground leading-relaxed">
                  {o.items?.map(it => `${it.quantity}× ${it.meal?.name ?? 'Unknown Fare'}`).join(', ')}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 min-w-[150px]">
                <div className="text-3xl font-black text-primary brand">৳ {o.totalAmount ?? 0}</div>
                
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-inner ${
                  o.status === 'CANCELLED' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                  o.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                  'bg-primary/10 text-primary border-primary/20'
                }`}>
                  {o.status}
                </div>

                {o.status === 'PLACED' && (
                  <button
                    className={`mt-4 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${processingId === o.id ? 'bg-muted text-muted-foreground' : 'bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white'}`}
                    onClick={() => {
                      setSelectedOrderId(o.id);
                      setConfirmOpen(true);
                    }}
                    disabled={processingId === o.id}
                  >
                    {processingId === o.id ? <Loading inline size="sm" /> : 'Revoke Assignment'}
                  </button>
                )}
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Revoke Assignment"
        description="Are you sure you want to terminate this culinary engagement? This decision cannot be reversed in the temporal flow."
        confirmLabel="Finalize Revocation"
        cancelLabel="Maintain Engagement"
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
            toast.success('Assignment successfully revoked');
            // refresh orders
            const refresh = await fetch(`${API_BASE_URL}/orders/my-orders`, { credentials: 'include' });
            const refreshJson = await refresh.json();
            setOrders(refreshJson?.data?.orders ?? []);
          } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : String(err));
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
