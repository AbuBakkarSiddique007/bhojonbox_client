"use client";

import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import Loading from "@/components/ui/Loading";

// Initialize Stripe outside of component to avoid recreation on each render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

function CheckoutForm({ clientSecret, onCancel, onComplete }: { clientSecret: string; onCancel: () => void; onComplete: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/customer-dashboard/orders`,
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "An unexpected error occurred.");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.success("Payment successful!");
      onComplete();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-border rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-muted transition-all"
        >
          Cancel
        </button>
        <button
          disabled={!stripe || loading}
          className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loading inline size="sm" /> : "Authorize Payment"}
        </button>
      </div>
    </form>
  );
}

export default function StripePayment({ clientSecret, onCancel, onComplete }: { clientSecret: string; onCancel: () => void; onComplete: () => void }) {
  const options = useMemo(() => ({
    clientSecret,
    appearance: {
      theme: "night" as const,
      variables: {
        colorPrimary: "#FFA500", // Using a gold/orange as primary
        colorBackground: "#0A0A0A",
        colorText: "#FFFFFF",
      },
    },
  }), [clientSecret]);

  if (!clientSecret) return null;

  return (
    <div className="bg-card border border-border rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-300">
      <h3 className="text-xl font-black text-foreground brand uppercase tracking-widest mb-6 flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm shadow-inner">💳</span>
        Secure Authorization
      </h3>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm clientSecret={clientSecret} onCancel={onCancel} onComplete={onComplete} />
      </Elements>
    </div>
  );
}
