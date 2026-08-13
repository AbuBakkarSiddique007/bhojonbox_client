"use client";

import { useEffect, useMemo, useState } from "react";
import Loading from "@/components/ui/Loading";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";
import Link from "next/link";
import { cartBus } from "@/lib/cartBus";
import { useAuth } from "@/hooks/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services";
import StripePayment from "@/components/payment/StripePayment";

type CartItem = { id: string; providerId?: string | null; name?: string; price?: number; image?: string | null; qty: number };

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState("");
  const [paymentByProvider, setPaymentByProvider] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [processingProviders, setProcessingProviders] = useState<string[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
   const [activeProviderOrderId, setActiveProviderOrderId] = useState<string | null>(null);
   const [activeProviderId, setActiveProviderId] = useState<string | null>(null);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setItems(readCart());
    const onCustom = () => setItems(readCart());
    cartBus.on("cart-updated", onCustom as EventListener);
    const onWindow = () => setItems(readCart());
    window.addEventListener("cart-updated", onWindow as EventListener);
    const onStorage = () => setItems(readCart());
    window.addEventListener("storage", onStorage as EventListener);

    return () => {
      cartBus.off("cart-updated", onCustom as EventListener);
      window.removeEventListener("cart-updated", onWindow as EventListener);
      window.removeEventListener("storage", onStorage as EventListener);
    };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, CartItem[]>();
    for (const it of items) {
      const pid = it.providerId ?? "unknown";
      if (!map.has(pid)) map.set(pid, []);
      map.get(pid)!.push(it);
    }
    return map;
  }, [items]);

  const removeItem = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    localStorage.setItem("cart", JSON.stringify(next));
    cartBus.emit("cart-updated");
    setItems(next);
  };

  const updateQty = (id: string, qty: number) => {
    const next = items.map((i) => (i.id === id ? { ...i, qty } : i));
    localStorage.setItem("cart", JSON.stringify(next));
    cartBus.emit("cart-updated");
    setItems(next);
  };

  const checkoutProvider = async (providerId: string | null) => {
    if (!address) return toast.error("Please enter delivery address");
    if (isLoading) return toast.error("Checking authentication...");
    if (!user) return toast.error("Please login as a customer to place orders");
    if (user.role !== 'CUSTOMER') return toast.error("Only customers can place orders");
    
    const providerKey = providerId ?? "unknown";
    const providerItems = grouped.get(providerKey) ?? [];
    if (providerItems.length === 0) return;
    const paymentMethod = paymentByProvider[providerKey] ?? "Cash on Delivery";
    setProcessingProviders((p) => (p.includes(providerKey) ? p : [...p, providerKey]));
    setLoading(true);
    try {
      const payload = {
        providerId: providerId,
        deliveryAddress: address,
        items: providerItems.map((p) => ({ mealId: p.id, quantity: p.qty })),
        note: `Payment: ${paymentMethod}`,
      };

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        credentials: "include",
        headers: authService.getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.message || "Order failed");
      
      const order = json.data.order;

      if (paymentMethod === "Online Payment") {
        // Create Payment Intent
        const intentRes = await fetch(`${API_BASE_URL}/payment/create-intent`, {
          method: "POST",
          credentials: "include",
          headers: authService.getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ orderId: order.id }),
        });
        const intentJson = await intentRes.json();
        if (!intentRes.ok) throw new Error(intentJson.message || "Failed to initialize payment");
        
        setClientSecret(intentJson.data.clientSecret);
        setActiveProviderOrderId(order.id);
        setActiveProviderId(providerKey);
        setProcessingProviders((p) => p.filter((id) => id !== providerKey));
        return; // Don't clear cart yet, wait for payment completion
      }

      toast.success("Order created successfully");

      const remaining = items.filter((it) => (it.providerId ?? "unknown") !== providerKey);
      localStorage.setItem("cart", JSON.stringify(remaining));
      cartBus.emit("cart-updated");
      setItems(remaining);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      if (!clientSecret) {
        setLoading(false);
        setProcessingProviders((p) => p.filter((id) => id !== providerKey));
      }
    }
  };

  const onPaymentComplete = () => {
    if (activeProviderId) {
      const remaining = items.filter((it) => (it.providerId ?? "unknown") !== activeProviderId);
      localStorage.setItem("cart", JSON.stringify(remaining));
      cartBus.emit("cart-updated");
      setItems(remaining);
      setActiveProviderId(null);
      setActiveProviderOrderId(null);
    }
    
    // Refresh page or redirect to orders
    toast.success("Transaction finalized. Redirecting...");
    setTimeout(() => {
      router.push("/customer-dashboard/orders");
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-24 text-center animate-in fade-in duration-1000">
        <div className="mb-10 text-8xl grayscale opacity-20 filter drop-shadow-2xl">🛒</div>
        <h2 className="text-3xl font-black text-foreground brand uppercase tracking-widest mb-4">Your Cart is Empty</h2>
        <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
        <p className="text-sm text-muted-foreground italic mb-12 max-w-sm mx-auto leading-relaxed">
          Your culinary journey begins with a single selection. Explore our curated collections to find your next favorite meal.
        </p>
        <Link href="/meals" className="inline-flex px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all">
          Explore the Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 lg:py-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8 text-center md:text-left">
        <div>
          <h1 className="text-5xl font-black text-foreground tracking-tighter brand uppercase mb-4">Your Cart</h1>
          <p className="text-muted-foreground font-medium italic">Review your curated items and coordinate delivery.</p>
        </div>
        <div className="bg-card border border-border rounded-3xl p-6 shadow-xl relative overflow-hidden group min-w-[200px]">
           <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
           <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 relative z-10">Total Amount</div>
           <div className="text-3xl font-black text-primary brand relative z-10">৳ {items.reduce((s, it) => s + ((it.price ?? 0) * (it.qty ?? 0)), 0)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {[...grouped.entries()].map(([pid, list]) => (
            <section key={pid} className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
              
               <div className="flex items-center justify-between mb-8 border-b border-border pb-6 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Kitchen Selection</span>
                    <h3 className="text-xl font-black text-foreground brand uppercase truncate max-w-[250px]">{pid === 'unknown' ? 'Authorized Kitchen' : `ID: ${pid.slice(-8).toUpperCase()}`}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 block">Subtotal</span>
                    <div className="text-xl font-black text-foreground brand">৳ {list.reduce((s, it) => s + ((it.price ?? 0) * (it.qty ?? 0)), 0)}</div>
                  </div>
               </div>

              <div className="space-y-6 relative z-10">
                {list.map((it) => (
                  <div key={it.id} className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-muted/20 border border-border/50 hover:border-primary/30 transition-all group">
                    <div className="flex items-center gap-6 flex-1 w-full">
                      <div className="w-20 h-20 bg-muted rounded-2xl overflow-hidden flex-shrink-0 border-2 border-card shadow-sm group-hover:scale-105 transition-transform">
                        {it.image ? <img src={it.image} alt={it.name} className="object-cover w-full h-full" /> : <div className="text-muted-foreground/30 text-xs text-center flex items-center justify-center p-2">🖼️</div>}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg text-foreground brand leading-tight mb-1">{it.name}</div>
                        <div className="text-primary font-black text-xs">৳ {it.price}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/50">
                      <div className="flex items-center bg-card border border-border rounded-xl px-2 py-1 shadow-inner">
                        <button onClick={() => updateQty(it.id, Math.max(1, it.qty - 1))} className="w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground font-black transition-colors">-</button>
                        <span className="w-10 text-center text-sm font-black text-foreground">{it.qty}</span>
                        <button onClick={() => updateQty(it.id, it.qty + 1)} className="w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground font-black transition-colors">+</button>
                      </div>
                      <button 
                        disabled={processingProviders.includes(pid)} 
                        onClick={() => removeItem(it.id)} 
                        className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center hover:bg-destructive hover:text-white transition-all active:scale-95"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="flex items-center gap-6 bg-muted/30 p-4 rounded-2xl border border-border/50">
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Settlement</div>
                    <label className="flex items-center gap-3 cursor-pointer group/radio">
                       <input 
                         type="radio" 
                         name={`payment-${pid}`} 
                         checked={(paymentByProvider[pid] ?? 'Cash on Delivery') === 'Cash on Delivery'} 
                         onChange={() => setPaymentByProvider((p) => ({ ...p, [pid]: 'Cash on Delivery' }))} 
                         className="w-4 h-4 border-primary text-primary focus:ring-primary/40 rounded-full"
                       />
                       <span className="text-xs font-bold text-foreground group-hover/radio:text-primary transition-colors">Cash on Delivery</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group/radio">
                       <input 
                         type="radio" 
                         name={`payment-${pid}`} 
                         checked={paymentByProvider[pid] === 'Online Payment'} 
                         onChange={() => setPaymentByProvider((p) => ({ ...p, [pid]: 'Online Payment' }))} 
                         className="w-4 h-4 border-primary text-primary focus:ring-primary/40 rounded-full"
                       />
                       <span className="text-xs font-bold text-foreground group-hover/radio:text-primary transition-colors">Online Payment</span>
                    </label>
                 </div>

                 <button
                    onClick={() => {
                      if (isLoading) return toast.error("Checking authentication...");
                      if (!user) return router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
                      if (user.role !== 'CUSTOMER') return toast.error("Only customers can place orders");
                      return checkoutProvider(pid === 'unknown' ? null : pid);
                    }}
                    disabled={loading || processingProviders.includes(pid)}
                    className="w-full md:w-auto px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                 >
                   {processingProviders.includes(pid) ? <Loading inline size="sm" /> : `Finalize ${list.length} Items`}
                   {!processingProviders.includes(pid) && <span>➔</span>}
                 </button>
              </div>
            </section>
          ))}
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-8 h-fit">
           <div className="bg-card border border-border rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
              <h3 className="text-xl font-black text-foreground brand uppercase tracking-widest mb-8 flex items-center gap-3 relative z-10">
                 <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm shadow-inner">📍</span>
                 Logistics
              </h3>

              <div className="space-y-6 relative z-10">


                {!isLoading && (!user || user.role !== 'CUSTOMER') && (
                   <div className="mb-6 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-widest leading-relaxed italic animate-pulse">
                      Administrative Note: Please authenticate as a customer to initiate fulfillment.
                   </div>
                )}

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 ml-2">Fulfillment Address</label>
                  <textarea 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="w-full px-6 py-5 rounded-3xl bg-muted/30 border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 font-semibold text-sm leading-relaxed italic" 
                    placeholder="Provide your exact coordinates..." 
                    rows={4}
                  />
                  <div className="text-[10px] text-muted-foreground mt-3 ml-2 italic opacity-60">Verified location ensures timely curation.</div>
                </div>
                
                <div className="pt-6 border-t border-border/50">
                   <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Order Summary</div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-xs font-bold italic">
                         <span className="text-muted-foreground">Culinary Items</span>
                         <span className="text-foreground">{items.length}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold italic">
                         <span className="text-muted-foreground">Delivery Surcharge</span>
                         <span className="text-foreground">COMPLIMENTARY</span>
                      </div>
                      <div className="flex justify-between pt-4 border-t border-border/50">
                         <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Total Amount</span>
                         <span className="text-xl font-black text-primary brand">৳ {items.reduce((s, it) => s + ((it.price ?? 0) * (it.qty ?? 0)), 0)}</span>
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </aside>
      </div>

      {clientSecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
           <div className="max-w-md w-full my-auto">
              <StripePayment 
                clientSecret={clientSecret} 
                onCancel={() => {
                  setClientSecret(null);
                  setLoading(false);
                }} 
                onComplete={onPaymentComplete} 
              />
           </div>
        </div>
      )}
    </main>
  );
}
