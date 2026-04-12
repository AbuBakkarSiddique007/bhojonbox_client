"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen py-20 px-6 max-w-4xl mx-auto animate-in fade-in duration-700">
      <div className="mb-16 border-b border-border pb-8">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">Data Governance</span>
        <h1 className="text-5xl font-black brand tracking-tighter text-foreground mb-6">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-sm italic">Commitment to your digital discretion.</p>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="text-xl font-black text-foreground uppercase tracking-widest mb-4 flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-primary"></span>
             Information Collection
          </h2>
          <p className="text-muted-foreground leading-relaxed pl-5 border-l border-border/50">
            We collect personal information such as your name, contact details, and location to provide a personalized culinary experience. Authentication data is heavily encrypted. We do not store sensitive payment details directly on our servers.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-black text-foreground uppercase tracking-widest mb-4 flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-primary"></span>
             Use of Information
          </h2>
          <p className="text-muted-foreground leading-relaxed pl-5 border-l border-border/50">
            Your data empowers our AI Concierge to suggest tailored meal recommendations. It is also used to facilitate seamless deliveries, generate accurate billing, and notify you of critical account updates.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-black text-foreground uppercase tracking-widest mb-4 flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-primary"></span>
             Third-Party Sharing
          </h2>
          <p className="text-muted-foreground leading-relaxed pl-5 border-l border-border/50">
            We operate under a strict zero-sell policy. Your personal identity is never sold to third-party marketers. Operational data is only shared with trusted restaurant partners strictly to fulfill active orders.
          </p>
        </div>
      </div>

      <div className="mt-16 pt-8 text-center text-sm text-muted-foreground">
        For privacy compliance inquiries, contact the Administrator. <br/>
        <Link href="/" className="text-primary mt-4 inline-block hover:underline font-bold">Back to Home</Link>
      </div>
    </main>
  );
}
