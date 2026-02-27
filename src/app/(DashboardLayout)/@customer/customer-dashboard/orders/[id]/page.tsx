"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";
import reviewsService from "@/services/reviews";
import { useAuth } from "@/hooks/AuthContext";

export default function CustomerOrderDetailPage({ params }: { params: any }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const resolvedParams = React.use(params);
  const id = resolvedParams?.id;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [myReviewedMeals, setMyReviewedMeals] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/orders/${id}`, { credentials: "include" });
        const json = await res.json().catch(() => null);
        const o = json?.data?.order ?? json?.order ?? json;
        setOrder(o);

        // fetch my reviews so we can mark which meals are reviewed
        const my = await reviewsService.getMyReviews().catch(() => null);
        const reviews = my?.data?.reviews ?? my?.reviews ?? [];
        const map: Record<string, boolean> = {};
        for (const r of reviews) map[r.mealId] = true;
        setMyReviewedMeals(map);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const openReview = (meal: any) => {
    setSelectedMeal(meal);
    setRating(5);
    setComment("");
  };

  const submitReview = async () => {
    if (!selectedMeal) return;
    if (isLoading) return toast.error("Checking authentication...");
    if (!user) return router.push(`/login?next=/customer-dashboard/orders/${id}`);
    if (user.role !== "CUSTOMER") return toast.error("Only customers can submit reviews");

    setSubmitting(true);
    try {
      const payload = { mealId: selectedMeal.mealId ?? selectedMeal.id ?? selectedMeal.id, orderId: id, rating, comment };
      const res = await reviewsService.createReview(payload);
      if (res?.data?.review || res?.review) {
        toast.success("Review submitted");
        setMyReviewedMeals((m) => ({ ...m, [payload.mealId]: true }));
        setSelectedMeal(null);
      } else {
        throw new Error(res?.message || 'Failed to submit review');
      }
    } catch (e: any) {
      toast.error(e?.message || String(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading order…</div>;

  if (!order) return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Order #{id}</h1>
      <p className="text-sm text-muted-foreground mb-4">Order not found.</p>
      <button onClick={() => router.back()} className="px-3 py-2 bg-primary text-white rounded">Back</button>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Order #{id}</h1>
      <p className="text-sm text-muted-foreground mb-4">Status: {order.status ?? '—'}</p>

      {order.status !== 'DELIVERED' && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded text-sm text-slate-700">
          Reviews can only be submitted after the order is delivered.
        </div>
      )}

      <div className="space-y-4">
        {(order.items || []).map((it: any, idx: number) => (
          <div key={idx} className="p-4 bg-white border rounded flex items-start justify-between">
            <div>
              <div className="font-medium">{it.meal?.name ?? it.name}</div>
              <div className="text-sm text-slate-500">Qty: {it.quantity ?? it.qty}</div>
            </div>

            <div className="flex items-center gap-3">
              {order.status === 'DELIVERED' ? (
                myReviewedMeals[it.mealId ?? it.meal?.id ?? it.id] ? (
                  <span className="text-sm text-green-600">Reviewed</span>
                ) : (
                  <button onClick={() => openReview({ mealId: it.mealId ?? it.meal?.id ?? it.id, mealName: it.meal?.name ?? it.name })} className="px-3 py-1 bg-amber-600 text-white rounded">Write review</button>
                )
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button onClick={() => router.back()} className="px-3 py-2 bg-primary text-white rounded">Back</button>
      </div>

      {/* Review modal */}
      {selectedMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2">Review: {selectedMeal.mealName}</h3>
            <div className="mb-3">
              <label className="block text-sm mb-1">Rating</label>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map((r) => (
                  <button key={r} onClick={() => setRating(r)} className={`px-3 py-1 rounded ${rating === r ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}>{r}★</button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Comment (optional)</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-2 border rounded-md" rows={4} />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedMeal(null)} className="px-3 py-2 bg-gray-100 rounded">Cancel</button>
              <button onClick={submitReview} disabled={submitting} className="px-3 py-2 bg-amber-600 text-white rounded">{submitting ? 'Submitting…' : 'Submit review'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
