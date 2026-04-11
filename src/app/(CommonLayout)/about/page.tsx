"use client"

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="py-12">
      <section className="mx-4 md:mx-8 lg:mx-16 bg-gradient-to-r from-slate-800/60 via-slate-900/60 to-slate-900/80 rounded-2xl p-8 shadow-lg border border-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">Bhojonbox — Fresh meals, local flavors</h1>
            <p className="mt-4 text-lg text-white/80">Discover chef-prepared and home-cooked meals from trusted local providers. Fast ordering, clear menus, and reliable delivery — feel at home with every bite.</p>

            <div className="mt-6 flex items-center gap-4">
              <Link href="/meals" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-md shadow">
                Browse Meals
              </Link>
              <Link href="/providers" className="inline-flex items-center gap-2 text-white/90 underline">
                Meet Providers
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/70">
              <span className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">🚚 Fast delivery</span>
              <span className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">⭐ Top-rated providers</span>
              <span className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">💳 Secure checkout</span>
            </div>
          </div>

          <div className="w-56 h-56 md:w-64 md:h-64 bg-gradient-to-br from-amber-400/30 to-amber-600/10 rounded-2xl flex items-center justify-center shadow-xl border border-white/5">
            <div className="text-6xl">🍲</div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
        <div className="p-6 rounded-lg bg-slate-800/50 border border-white/5 backdrop-blur-sm text-white">
          <h3 className="text-lg font-semibold">Hand-picked menus</h3>
          <p className="mt-2 text-sm text-white/80">Curated dishes from cooks who care — clear descriptions, portion sizes, and honest pricing.</p>
        </div>

        <div className="p-6 rounded-lg bg-slate-800/50 border border-white/5 backdrop-blur-sm text-white">
          <h3 className="text-lg font-semibold">Support local</h3>
          <p className="mt-2 text-sm text-white/80">Every order helps nearby chefs and small food businesses grow — taste the community.</p>
        </div>

        <div className="p-6 rounded-lg bg-slate-800/50 border border-white/5 backdrop-blur-sm text-white">
          <h3 className="text-lg font-semibold">Simple ordering</h3>
          <p className="mt-2 text-sm text-white/80">Group items in your cart, choose delivery or pickup, and enjoy fast checkout with saved preferences.</p>
        </div>
      </section>
    </div>
  );
}
