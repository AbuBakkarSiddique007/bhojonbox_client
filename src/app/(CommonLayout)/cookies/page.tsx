"use client";

import React from "react";
import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center py-20 px-6">
      <div className="max-w-2xl bg-card border border-border p-12 rounded-[3rem] shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
        
        <div className="text-6xl mb-8 relative z-10">🍪</div>
        <h1 className="text-4xl font-black brand text-foreground mb-4 relative z-10">Cookie Policy</h1>
        
        <div className="text-muted-foreground leading-relaxed space-y-6 relative z-10">
          <p>
            BhojonBox utilizes strictly necessary cookies to maintain your authenticated sessions. Without these, our executive tracking and AI concierge routing would fail to identify you crossing application boundaries.
          </p>
          <p>
            We do not employ invasive tracking cookies or third-party behavioral trackers. By continuing to use our portal, you consent to the storage of essential session identifiers.
          </p>
        </div>

        <Link href="/" className="mt-10 inline-block px-8 py-4 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 relative z-10">
          Acknowledge & Return
        </Link>
      </div>
    </main>
  );
}
