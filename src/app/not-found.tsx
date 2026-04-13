"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 text-center animate-in fade-in duration-1000">
      <div className="max-w-2xl w-full">
        <div className="relative mb-8 animate-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-primary/5 select-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            404
          </h1>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-12 group hover:rotate-0 transition-transform duration-500">
               <span className="text-4xl filter drop-shadow-md">🍽️</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground brand uppercase tracking-tight mb-4">
              A Culinary <span className="text-primary italic">Mystery</span>
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-8"></div>
          </div>
        </div>

        <p className="text-lg text-muted-foreground mb-12 max-w-md mx-auto leading-relaxed italic">
          It seems you&apos;ve requested a dish that isn&apos;t on our curated menu. Even the finest palates occasionally lose their way.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button size="lg" className="bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 rounded-2xl px-10 font-black text-xs uppercase tracking-[0.2em] h-14">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.history.back()}
            className="border-border text-foreground hover:bg-muted rounded-2xl px-10 font-black text-xs uppercase tracking-[0.2em] h-14"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        <div className="mt-20 pt-12 border-t border-border/50 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/meals" className="group p-4 rounded-2xl hover:bg-muted/50 transition-colors">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Browse</h4>
            <p className="text-sm font-bold">Discover Meals</p>
          </Link>
          <Link href="/providers" className="group p-4 rounded-2xl hover:bg-muted/50 transition-colors">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Explore</h4>
            <p className="text-sm font-bold">Restaurants</p>
          </Link>
          <Link href="/help" className="group p-4 rounded-2xl hover:bg-muted/50 transition-colors">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Assistance</h4>
            <p className="text-sm font-bold">Get Help</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
