"use client";

import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";
import Link from "next/link";
import { cartBus } from "@/lib/cartBus";
import { useAuth } from "@/hooks/AuthContext";
import { usePathname, useRouter } from "next/navigation";

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
    // require authenticated customer
    if (isLoading) return toast.error("Checking authentication...");
    if (!user) return toast.error("Please login as a customer to place orders");
    if (user.role !== 'CUSTOMER') return toast.error("Only customers can place orders");
    const providerKey = providerId ?? "unknown";
    const providerItems = grouped.get(providerKey) ?? [];
    if (providerItems.length === 0) return;
    const paymentMethod = paymentByProvider[providerKey] ?? "Cash on Delivery";
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.message || "Order failed");
      toast.success("Order created");

      const remaining = items.filter((it) => (it.providerId ?? "unknown") !== providerKey);
      localStorage.setItem("cart", JSON.stringify(remaining));
      cartBus.emit("cart-updated");
      setItems(remaining);
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error(String(e));
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-sm text-slate-600">Browse meals and add items to the cart.</p>
        <div className="mt-6">
          <Link href="/meals" className="px-4 py-2 bg-amber-600 text-white rounded-md">Browse meals</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>

      {/* Overall total */}
      <div className="mb-4 text-right">
        <p className="text-sm text-muted-foreground">Total:</p>
        <p className="text-xl font-semibold">
          ৳ {items.reduce((s, it) => s + ((it.price ?? 0) * (it.qty ?? 0)), 0)}
        </p>
      </div>

      {/* Auth checks */}
      {isLoading ? (
        <div className="mb-4 text-sm text-slate-500">Checking authentication…</div>
      ) : !user ? (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-100 rounded">
          <div className="text-sm text-slate-700">Please <Link href="/login" className="text-primary underline">login</Link> as a customer to place orders.</div>
        </div>
      ) : user.role !== 'CUSTOMER' ? (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-100 rounded">
          <div className="text-sm text-slate-700">Only customers can place orders. Your role: {user.role}</div>
        </div>
      ) : null}

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">Delivery address</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Street, City, ZIP" />
      </div>

      {[...grouped.entries()].map(([pid, list]) => (
        <section key={pid} className="mb-6 bg-white border border-gray-100 rounded-lg p-4">
          <h3 className="font-medium mb-3">Provider: {pid === 'unknown' ? 'Unknown' : pid}</h3>
          <div className="space-y-3">
            {list.map((it) => (
              <div key={it.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    {it.image ? <img src={it.image} alt={it.name} className="object-cover w-full h-full" /> : <div className="text-gray-300">No image</div>}
                  </div>
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-slate-600">{it.price ? `৳ ${it.price}` : ''}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="number" min={1} value={it.qty} onChange={(e) => updateQty(it.id, Number(e.target.value) || 1)} className="w-20 px-2 py-1 border rounded-md" />
                  <button onClick={() => removeItem(it.id)} className="px-3 py-1 bg-gray-100 rounded-md">Remove</button>
                </div>
              </div>
            ))}
            {/* Provider total and payment method */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Provider total</p>
                <p className="text-lg font-semibold">৳ {list.reduce((s, it) => s + ((it.price ?? 0) * (it.qty ?? 0)), 0)}</p>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium">Payment</label>
                  <div className="flex items-center gap-3 mt-1">
                    <label className="inline-flex items-center gap-2">
                      <input type="radio" name={`payment-${pid}`} checked={ (paymentByProvider[pid] ?? 'Cash on Delivery') === 'Cash on Delivery' } onChange={() => setPaymentByProvider((p) => ({ ...p, [pid]: 'Cash on Delivery' }))} />
                      <span className="text-sm">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="relative inline-block group">
                    <button
                      onClick={() => {
                        if (isLoading) return toast.error("Checking authentication...");
                        if (!user) return router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
                        if (user.role !== 'CUSTOMER') return toast.error("Only customers can place orders");
                        return checkoutProvider(pid === 'unknown' ? null : pid);
                      }}
                      disabled={loading}
                      aria-disabled={loading}
                      aria-describedby={loading ? `tooltip-checkout-${pid}` : undefined}
                      className="px-4 py-2 bg-amber-600 text-white rounded-md disabled:opacity-50"
                    >
                      {loading ? 'Processing…' : `Checkout ${list.length} item(s)`}
                    </button>

                    {loading && (
                      <div id={`tooltip-checkout-${pid}`} role="tooltip" className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute left-1/2 -translate-x-1/2 -top-9 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                        Checking authentication...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
