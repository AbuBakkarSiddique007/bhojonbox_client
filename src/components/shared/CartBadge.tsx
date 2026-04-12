"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { cartBus } from "@/lib/cartBus";

function readCount() {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return 0;
    const items = JSON.parse(raw) as { id: string; qty: number }[];
    return items.reduce((s, it) => s + (it.qty || 0), 0);
  } catch {
    return 0;
  }
}

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  cartBus.on("cart-updated", onStoreChange as EventListener);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    cartBus.off("cart-updated", onStoreChange as EventListener);
  };
};

export default function CartBadge() {
  const count = useSyncExternalStore(
    subscribe,
    readCount,
    () => 0 // Server snapshot
  );

  return (
    <Link href="/cart" className="relative group p-2 hover:bg-primary/10 rounded-xl transition-all duration-300 active:scale-90">
      <span className="text-xl group-hover:scale-110 transition-transform block">🛒</span>
      {count > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[10px] font-black text-primary-foreground bg-primary rounded-full shadow-lg shadow-primary/30 border-2 border-background animate-in zoom-in duration-300">
          {count}
        </span>
      )}
    </Link>
  );
}
