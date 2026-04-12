"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle"; // For aesthetics

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen py-20 px-6 max-w-4xl mx-auto animate-in fade-in duration-700">
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-black brand tracking-tighter text-foreground mb-6">
          How Can We <span className="text-primary border-b-4 border-primary">Help?</span>
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto italic">
          BhojonBox Support is here to ensure your culinary journey is seamless. Browse our FAQs or contact us directly.
        </p>
      </div>

      <div className="space-y-6">
        <section className="p-8 bg-card border border-border rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-black text-foreground brand mb-4">Ordering Meals</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            To place an order, simply browse our curated catalog of meals, add your selections to the cart, and proceed to checkout. You must be signed in as a Customer to complete a transaction.
          </p>
        </section>

        <section className="p-8 bg-card border border-border rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-black text-foreground brand mb-4">Becoming a Provider</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Culinary experts can join BhojonBox by registering as a Provider. Once your account is established, you can access the Provider Dashboard to manage your signature meals and brand logo.
          </p>
        </section>

        <section className="p-8 bg-card border border-border rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-black text-foreground brand mb-4">Account Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your data is encrypted and securely stored. We use robust authentication systems to ensure that your identity and preferences are protected at all times.
          </p>
        </section>
      </div>

      <div className="mt-16 p-10 bg-primary/5 border border-primary/20 rounded-[2.5rem] text-center">
        <h3 className="text-3xl font-black brand mb-4">Still Need Assistance?</h3>
        <p className="text-muted-foreground mb-8">Our concierge team is available 24/7 to resolve any inquiries.</p>
        <Link href="/" className="px-8 py-4 bg-primary text-primary-foreground font-black tracking-widest text-xs uppercase shadow-lg shadow-primary/20 rounded-xl hover:scale-105 active:scale-95 transition-all">
          Return to Home
        </Link>
      </div>
    </main>
  );
}
