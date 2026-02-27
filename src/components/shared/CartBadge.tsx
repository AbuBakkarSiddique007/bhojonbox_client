"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cartBus } from "@/lib/cartBus";

function readCount() {
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return 0;
    const items = JSON.parse(raw) as { id: string; qty: number }[];
    return items.reduce((s, it) => s + (it.qty || 0), 0);
  } catch {
    return 0;
  }
}

export default function CartBadge() {
  const [count, setCount] = useState(() => readCount());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cart") setCount(readCount());
    };

    const onCustom = () => setCount(readCount());

    window.addEventListener("storage", onStorage);
    cartBus.on("cart-updated", onCustom as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      cartBus.off("cart-updated", onCustom as EventListener);
    };
  }, []);

  return (
    <Link href="/cart" className="relative inline-flex items-center mr-2">
      <span className="text-xl">🛒</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold text-white bg-red-600 rounded-full">{count}</span>
      )}
    </Link>
  );
}
