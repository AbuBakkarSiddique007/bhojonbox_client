"use client"

import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="py-12">
      <section className="mx-4 md:mx-8 lg:mx-16 bg-slate-800/60 rounded-2xl p-8 shadow-inner border border-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Help Center</h1>
          <p className="mt-4 text-white/80">Find answers to common questions about ordering, delivery, payments, and provider policies.</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-900/40 rounded border border-white/5">
              <h3 className="font-semibold text-white">Ordering</h3>
              <p className="mt-2 text-sm text-white/80">How to browse menus, add items to cart, and complete checkout.</p>
              <a  className="mt-3 inline-block text-amber-400 underline">Learn more</a>
            </div>

            <div className="p-4 bg-slate-900/40 rounded border border-white/5">
              <h3 className="font-semibold text-white">Delivery & Pickup</h3>
              <p className="mt-2 text-sm text-white/80">Options, tracking, and what to expect when your order is on the way.</p>
              <a  className="mt-3 inline-block text-amber-400 underline">Learn more</a>
            </div>

            <div className="p-4 bg-slate-900/40 rounded border border-white/5">
              <h3 className="font-semibold text-white">Payments</h3>
              <p className="mt-2 text-sm text-white/80">Supported payment methods, refunds, and receipts.</p>
              <a  className="mt-3 inline-block text-amber-400 underline">Learn more</a>
            </div>

            <div className="p-4 bg-slate-900/40 rounded border border-white/5">
              <h3 className="font-semibold text-white">Provider Policies</h3>
              <p className="mt-2 text-sm text-white/80">Guidelines for providers and how we keep quality high.</p>
              <a  className="mt-3 inline-block text-amber-400 underline">Learn more</a>
            </div>
          </div>

          <div className="mt-8 text-sm text-white/70">
            <p>If you can not find an answer, reach out via our contact page and we will help you directly.</p>
            <Link href="/contact" className="inline-block mt-3 text-amber-400 underline">Contact Support</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
