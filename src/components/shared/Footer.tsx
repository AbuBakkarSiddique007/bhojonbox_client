"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Link href="/" className="text-2xl font-bold inline-block mb-2">BhojonBox</Link>
          <p className="text-sm text-slate-200/80 max-w-sm">Discover and order delicious meals from local providers. Fast delivery, curated menus, and trusted providers.</p>
        </div>

        <div className="flex flex-col">
          <h4 className="text-lg font-semibold mb-3">Company</h4>
          <nav className="flex flex-col gap-2 text-sm text-slate-200/90">
            <Link href="#" className="hover:underline">About</Link>
            <Link href="#" className="hover:underline">Help Center</Link>
            <Link href="#" className="hover:underline">Contact</Link>
          </nav>
        </div>

        <div className="flex flex-col">
          <h4 className="text-lg font-semibold mb-3">Stay in touch</h4>
          <p className="text-sm text-slate-200/90 mb-3">Subscribe for updates and offers.</p>

          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              aria-label="Email"
              placeholder="you@email.com"
              className="flex-1 rounded-md px-3 py-2 text-slate-900 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-4 py-2 bg-primary text-white rounded-md">Subscribe</button>
          </form>

          <div className="mt-4 flex items-center gap-3 text-xl">
            <a href="#" aria-label="twitter" className="opacity-90 hover:opacity-100">🐦</a>
            <a href="#" aria-label="facebook" className="opacity-90 hover:opacity-100">📘</a>
            <a href="#" aria-label="instagram" className="opacity-90 hover:opacity-100">📸</a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-slate-300">
          <div>© {new Date().getFullYear()} BhojonBox. All rights reserved.</div>
          <div className="flex gap-4 mt-3 md:mt-0">
            <Link href="#" className="hover:underline">Terms</Link>
            <Link href="#" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
