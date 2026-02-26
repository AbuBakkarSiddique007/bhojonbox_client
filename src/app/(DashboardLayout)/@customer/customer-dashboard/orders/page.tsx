"use client";

import Link from "next/link";

export default function CustomerOrdersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
      <p className="text-sm text-muted-foreground mb-4">List of orders with cancel option.</p>
      <ul className="space-y-2">
        <li>
          <Link href="/customer-dashboard/orders/1" className="text-primary hover:underline">Order #1</Link>
        </li>
      </ul>
    </div>
  );
}
