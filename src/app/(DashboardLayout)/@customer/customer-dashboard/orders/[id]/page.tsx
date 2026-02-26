"use client";

import { useRouter } from "next/navigation";

export default function CustomerOrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Order #{params.id}</h1>
      <p className="text-sm text-muted-foreground mb-4">Order details and progress tracker.</p>
      <button onClick={() => router.back()} className="px-3 py-2 bg-primary text-white rounded">Back</button>
    </div>
  );
}
