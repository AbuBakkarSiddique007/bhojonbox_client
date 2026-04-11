"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-20 pb-10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">


        <div className="col-span-1 lg:col-span-1">
          <div className="mb-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Est. 2026</span>
          </div>
          <Link href="/" className="block mb-6 group">
            <span className="text-3xl font-black text-primary inline-block brand tracking-tighter group-hover:opacity-80 transition-opacity">
              The BhojonBox
            </span>
          </Link>
          <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
            A distinguished culinary platform connecting discerning patrons with the finest local providers. Quality, trust, and taste — delivered.
          </p>
          <div className="flex items-center gap-4 text-xl">
            <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all hover:scale-110">🐦</a>
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all hover:scale-110">📘</a>
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all hover:scale-110">📸</a>
          </div>
        </div>


        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">Company</h4>
          <nav className="flex flex-col gap-4">
            {["About Us", "Help Center", "Contact Us", "Careers"].map((item) => (
              <Link key={item} href="#" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block font-medium">
                {item}
              </Link>
            ))}
          </nav>
        </div>


        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">Legal</h4>
          <nav className="flex flex-col gap-4">
            {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((item) => (
              <Link key={item} href="#" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block font-medium">
                {item}
              </Link>
            ))}
          </nav>
        </div>


        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">Newsletter</h4>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            Subscribe for curated gourmet updates, exclusive offers, and provider spotlights.
          </p>
          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              suppressHydrationWarning
              aria-label="Email"
              type="email"
              placeholder="your@email.com"
              className="w-full rounded-xl px-4 py-3 bg-muted border border-border text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/40"
            />
            <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
              Subscribe
            </button>
          </form>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground/60 gap-4">
        <div suppressHydrationWarning>
          © {new Date().getFullYear()} The BhojonBox. All rights reserved.
        </div>
        <div className="font-medium tracking-widest text-[10px] uppercase opacity-60">
          Where Quality Meets Convenience.
        </div>
      </div>
    </footer>
  );
}
