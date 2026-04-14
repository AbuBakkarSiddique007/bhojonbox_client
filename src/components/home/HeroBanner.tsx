"use client";

import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-background border-b border-border pt-6 pb-12 md:pt-10 md:pb-20 lg:pt-12 lg:pb-24 transition-colors duration-700">

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent -z-10" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[140px] -z-10 animate-pulse" />
      <div className="absolute top-1/3 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">

        <div className="md:flex-1 text-center lg:text-left animate-in slide-in-from-left-8 duration-700">


          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] font-black uppercase tracking-[0.3em]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            The BhojonBox
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 text-foreground tracking-tighter brand">
            Artisanal Cuisine,{" "}
            <span className="text-primary italic">Delivered</span>{" "}
            to Your Door.
          </h1>

          <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            The BhojonBox curates exceptional menus from vetted local culinary artisans — offering a distinguished dining experience without leaving the comfort of your residence.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link
              href="/meals"
              className="px-8 py-3 sm:px-10 sm:py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/25 hover:scale-[1.03] active:scale-95 transition-all"
            >
              Explore the Menu
            </Link>
            <Link
              href="/register?role=provider"
              className="px-8 py-3 sm:px-10 sm:py-4 bg-transparent text-foreground border border-border rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-muted hover:border-primary/30 transition-all"
            >
              Partner with Us
            </Link>
          </div>


          <div className="mt-12 flex flex-wrap items-center gap-6 justify-center lg:justify-start text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Vetted Providers
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Premium Quality
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Fast Delivery
            </div>
          </div>
        </div>


        <div className="lg:w-1/2 relative animate-in slide-in-from-right-8 duration-700">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-border/50 group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
            <img
              src="https://i.ibb.co/dwTgY3Qs/banner.jpg"
              alt="The BhojonBox — Artisanal cuisine curated from the finest local providers"
              className="w-full h-[280px] sm:h-[350px] md:h-[480px] object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
          </div>

          <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl p-4 shadow-2xl backdrop-blur-sm hidden md:flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-lg">🏅</div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Excellence</div>
              <div className="text-sm font-black text-foreground">Curated & Vetted</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
