"use client";

import { useState } from "react";
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

  const canAdd = !isLoading && user?.role === "CUSTOMER";

  const add = () => {
    if (isLoading) return;
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }
    if (user.role !== "CUSTOMER") {
      toast.error("Only customers can add meals to cart");
      return;
    }

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

  const tooltipId = `tooltip-addtocart-${mealId}`;

  return (
    <div className="relative inline-block group">
      <button
        onClick={add}
        disabled={loading || !canAdd}
        aria-disabled={loading || !canAdd}
        aria-describedby={loading || !canAdd ? tooltipId : undefined}
        className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-md ${canAdd ? "bg-amber-600 text-white hover:bg-amber-700" : "bg-gray-100 text-slate-500 cursor-not-allowed"}`}
        title={!user ? "Sign in to add to cart" : user?.role !== "CUSTOMER" ? "Only customers can add to cart" : undefined}
      >
        <span>{canAdd ? "Add to cart" : "Add to cart"}</span>
        <span className="text-sm opacity-80">{price ? `৳ ${price}` : ""}</span>
      </button>

      {(loading || !canAdd) && (
        <div
          id={tooltipId}
          role="tooltip"
          className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute left-1/2 -translate-x-1/2 -top-9 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50"
        >
          {isLoading ? "Checking authentication..." : !user ? "Sign in to add to cart" : user.role !== "CUSTOMER" ? "Only customers can add to cart" : ""}
        </div>
      )}
    </div>
  );
}
