"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";
import Loading from "@/components/ui/Loading";
import { reviewsService, authService } from "@/services";
import { useAuth } from "@/hooks/AuthContext";

type ReviewMeal = {
  mealId?: string | number;
  mealName?: string;
  id?: string | number;
  name?: string;
};

type OrderItem = {
  mealId?: string | number;
  meal?: { id?: string | number; name?: string };
  name?: string;
  quantity?: number;
  qty?: number;
  id?: string | number;
};

type Review = {
  mealId: string | number;
  [key: string]: unknown;
};

type Order = {
  id?: string | number;
  status?: string;
  items?: OrderItem[];
  [key: string]: unknown;
};

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  PLACED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  PENDING: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  PREPARING: "bg-primary/10 text-primary border-primary/20",
  READY: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function CustomerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const routeParams = use(params);
  const id = routeParams.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<ReviewMeal | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [myReviewedMeals, setMyReviewedMeals] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/orders/${id}`, { headers: authService.getAuthHeaders(), credentials: "include" });
        const json = await res.json().catch(() => null);
        const o = json?.data?.order ?? json?.order ?? json;
        setOrder(o);

        const my = await reviewsService.getMyReviews().catch(() => null);
        const reviews = my?.data?.reviews ?? my?.reviews ?? [];
        const map: Record<string, boolean> = {};
        for (const r of reviews) map[r.mealId] = true;
        setMyReviewedMeals(map);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const openReview = (meal: ReviewMeal) => {
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
      const my = await reviewsService.getMyReviews().catch(() => null);
      const reviews = my?.data?.reviews ?? my?.reviews ?? [];
      const already = reviews.some((r: Review) => String(r.mealId) === String(selectedMeal.mealId ?? selectedMeal.id));
      if (already) {
        toast.error("You already reviewed this meal");
        setSelectedMeal(null);
        return;
      }
      const mealId = String(selectedMeal.mealId ?? selectedMeal.id);
      const payload = { mealId, orderId: id, rating, comment };
      const res = await reviewsService.createReview(payload);
      if (res?.data?.review || res?.review) {
        toast.success("Review submitted successfully");
        setMyReviewedMeals((m) => ({ ...m, [payload.mealId]: true }));
        setSelectedMeal(null);
      } else {
        throw new Error(res?.message || "Failed to submit review");
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 flex items-center justify-center min-h-[300px]"><Loading /></div>;

  if (!order) return (
    <div className="p-8">
      <h1 className="text-2xl font-black text-foreground brand mb-4">Order #{id}</h1>
      <p className="text-muted-foreground mb-6 italic">This order could not be found.</p>
      <button onClick={() => router.back()} className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">Go Back</button>
    </div>
  );

  const statusCls = STATUS_COLORS[(order.status ?? "").toUpperCase()] ?? "bg-muted text-muted-foreground border-border";

  return (
    <div className="p-4 md:p-8 lg:p-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter brand uppercase">Order #{id}</h1>
          <div className="flex items-center gap-3 mt-3">
            <span className={`inline-flex text-[10px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest ${statusCls}`}>
              {order.status ?? "UNKNOWN"}
            </span>
          </div>
        </div>
        <button onClick={() => router.back()} className="px-8 py-4 rounded-2xl bg-secondary text-secondary-foreground border border-border font-black text-xs uppercase tracking-widest hover:bg-muted transition-all active:scale-95">
          Return
        </button>
      </div>

      {order.status !== "DELIVERED" && (
        <div className="mb-8 p-5 bg-primary/5 border border-primary/15 rounded-2xl flex items-center gap-4">
          <span className="text-2xl">📋</span>
          <p className="text-sm text-muted-foreground italic font-medium">
            Culinary reviews may only be submitted once your order has been delivered and confirmed.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {(order.items || []).map((it: OrderItem, idx: number) => {
          const key = String(it.mealId ?? it.meal?.id ?? it.id ?? "");
          return (
            <div key={idx} className="group bg-card border border-border rounded-2xl p-6 flex items-center justify-between hover:shadow-md hover:border-border/80 transition-all">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  🍽️
                </div>
                <div>
                  <div className="font-black text-foreground brand">{it.meal?.name ?? it.name}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1 font-bold">
                    Qty: {it.quantity ?? it.qty}
                  </div>
                </div>
              </div>

              <div>
                {order.status === "DELIVERED" ? (
                  myReviewedMeals[key] ? (
                    <span className="inline-flex items-center gap-2 text-[10px] font-black px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest">
                      <span>✓</span> Reviewed
                    </span>
                  ) : (
                    <button
                      onClick={() => openReview({ mealId: it.mealId ?? it.meal?.id ?? it.id, mealName: it.meal?.name ?? it.name })}
                      className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all"
                    >
                      Write Review
                    </button>
                  )
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {selectedMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Culinary Feedback</p>
              <h3 className="text-2xl font-black text-foreground brand leading-tight">{selectedMeal.mealName}</h3>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    className={`w-12 h-12 rounded-xl font-black transition-all hover:scale-110 active:scale-95 text-sm border ${
                      rating >= r
                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                        : "bg-muted text-muted-foreground border-border hover:border-primary/30"
                    }`}
                  >
                    {r}★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Comment <span className="opacity-50 normal-case">(optional)</span></label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-5 py-4 bg-muted/30 border border-border rounded-2xl text-foreground text-sm font-medium focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all resize-none placeholder:text-muted-foreground/30"
                rows={4}
                placeholder="Share your experience with this dish..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedMeal(null)}
                className="px-6 py-3 rounded-xl bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={submitting}
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
              >
                {submitting ? <Loading inline size="sm" label="Submitting…" /> : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
