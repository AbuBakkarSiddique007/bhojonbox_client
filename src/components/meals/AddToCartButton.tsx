"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cartBus } from "@/lib/cartBus";

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

  const add = () => {
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

  return (
    <button onClick={add} disabled={loading} className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">
      <span>Add to cart</span>
      <span className="text-sm opacity-80">{price ? `৳ ${price}` : ""}</span>
    </button>
  );
}
