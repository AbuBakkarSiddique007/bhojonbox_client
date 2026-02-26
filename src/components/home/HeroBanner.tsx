"use client";

import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-400 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-8">
        <div className="md:flex-1">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">Fresh meals from local providers — delivered fast</h2>
          <p className="text-lg text-white/90 mb-6 max-w-xl">Explore curated menus from neighborhood chefs and food hubs. Order for pickup or delivery with real-time tracking.</p>

          <div className="flex gap-3">
            <Link href="#" className="px-6 py-3 bg-white text-indigo-700 rounded-md font-semibold">Browse Menus</Link>
            <Link href="#" className="px-6 py-3 bg-indigo-800 text-white rounded-md font-medium">Become a Provider</Link>
          </div>
        </div>

        <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-xl bg-white">
            <img src="https://i.ibb.co/dwTgY3Qs/banner.jpg" alt="Delicious meals" className="w-full h-96 object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
