"use client";

import { useState, useEffect, useRef } from "react";
import Loading from "@/components/ui/Loading";
import { toast } from "sonner";
import { cartBus } from "@/lib/cartBus";
import { useAuth } from "@/hooks/AuthContext";
import { usePathname, useRouter } from "next/navigation";

type CartItem = {
  id: string;
  providerId: string | null;
  name: string;
  price: number;
  image: string | null;
  qty: number;
};

export default function AddToCartButton({
  mealId,
  providerId,
  name,
  price,
  image,
}: {
  mealId: string;
  providerId?: string | null;
  name?: string;
  price?: number;
  image?: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const autoAdded = useRef(false);

  const isCustomer = user?.role === "CUSTOMER";
  const canAdd = !isLoading && isCustomer;

  const performAdd = () => {
    setLoading(true);
    try {
      const raw = localStorage.getItem("cart");
      const items: CartItem[] = raw ? (JSON.parse(raw) as CartItem[]) : [];
      const existing = items.find((i) => i.id === mealId);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        items.push({ id: mealId, providerId: providerId ?? null, name: name ?? "", price: price ?? 0, image: image ?? null, qty: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(items));
      cartBus.emit("cart-updated");
      toast.success("Added to cart");
    } catch (e) {
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const add = () => {
    if (isLoading && !user) {
    } else if (isLoading) return;

    if (!user) {
      try {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("pendingAddToCart", mealId);
          sessionStorage.setItem("pendingAddToCartPath", pathname || "/");
        }
      } catch (e) {
      }
      const next = pathname || "/";
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    if (user.role !== "CUSTOMER") {
      toast.error("Only customers can add meals to cart");
      return;
    }

    performAdd();
  };

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const pending = sessionStorage.getItem("pendingAddToCart");
      const pendingPath = sessionStorage.getItem("pendingAddToCartPath");
      if (!autoAdded.current && pending && pending === mealId && user && user.role === "CUSTOMER") {
        autoAdded.current = true;
        performAdd();
        sessionStorage.removeItem("pendingAddToCart");
        sessionStorage.removeItem("pendingAddToCartPath");
        const base = pendingPath || window.location.pathname;
        router.replace(base);
      }
    } catch (e) {
    }
    
  }, [user]);

  const tooltipId = `tooltip-addtocart-${mealId}`;

  return (
    <div className="relative inline-block group mt-6">
      <button
        onClick={add}
        disabled={loading}
        aria-disabled={loading}
        aria-describedby={loading || !canAdd ? tooltipId : undefined}
        className={`px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 ${canAdd ? "bg-primary text-primary-foreground shadow-primary/20 hover:scale-[1.02] hover:-translate-y-0.5" : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed shadow-none"}`}
      >
        <span>Add to Signature Order</span>
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-30"></span>
        <span className="font-black text-xs">{price ? `৳ ${price}` : ""}</span>
      </button>

      {(loading || !canAdd) && (
        <div
          id={tooltipId}
          role="tooltip"
          className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-1/2 -translate-x-1/2 -top-12 bg-popover text-popover-foreground border border-border text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-2xl whitespace-nowrap z-50 backdrop-blur-md"
        >
          {isLoading ? <Loading inline size="sm" /> : !user ? "Membership Required" : user.role !== "CUSTOMER" ? "Customer Only Access" : ""}
        </div>
      )}
    </div>
  );
}
