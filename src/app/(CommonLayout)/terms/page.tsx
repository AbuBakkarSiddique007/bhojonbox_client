"use client";

import React from "react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen py-20 px-6 max-w-4xl mx-auto animate-in fade-in duration-700">
      <div className="mb-16">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">Legal Repository</span>
        <h1 className="text-5xl font-black brand tracking-tighter text-foreground mb-6">
          Terms of Service
        </h1>
        <p className="text-muted-foreground text-sm italic">Last Updated: April 2026</p>
      </div>

      <div className="space-y-10 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-2xl font-black text-foreground brand mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the BhojonBox platform, you agree to be bound by these Terms of Service. If you do not agree, strictly refrain from using our services. Our services are exclusively available to individuals who are of legal age to form a binding contract.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-foreground brand mb-4">2. Provider Obligations</h2>
          <p>
            Culinary Providers utilizing our platform guarantee that all meals prepared and sold comply with local health, safety, and hygiene standards. The BhojonBox reserves the right to suspend any provider account failing to maintain executive-grade quality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-foreground brand mb-4">3. Customer Conduct</h2>
          <p>
            Customers agree to provide accurate information during registration, adhere to standard payment practices, and communicate respectfully with our providers and concierge team. Abuse of the platform architecture will result in immediate termination of clearance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-foreground brand mb-4">4. Intellectual Property</h2>
          <p>
            The branding, assets, "Obsidian & Gold" design system, and underlying algorithms (including the BhojonBox AI Concierge) are the exclusive intellectual property of the platform creators. Unauthorized reproduction or reverse engineering is strictly prohibited.
          </p>
        </section>
      </div>

      <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
        <Link href="/" className="text-primary font-bold hover:underline">
          &larr; Return to Dashboard
        </Link>
      </div>
    </main>
  );
}
