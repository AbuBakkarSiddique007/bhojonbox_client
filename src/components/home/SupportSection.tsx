"use client"

import Link from "next/link";
import { useRef } from "react";
import useInView from "@/hooks/useInView";

export default function SupportSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { threshold: 0.18, rootMargin: "0px 0px -10% 0px" });

  const cardBase = "block p-6 rounded-lg bg-slate-800/60 border border-white/5 backdrop-blur-sm transition-all duration-700 ease-out transform";
  const hidden = "opacity-0 translate-y-6";
  const visible = "opacity-100 translate-y-0";

  return (
    <section ref={ref} className="max-w-6xl mx-auto px-4 md:px-0 mt-12 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/help" className={`${cardBase} ${inView ? visible : hidden}`}>
          <h3 className="text-xl font-semibold text-white">Help Center</h3>
          <p className="mt-2 text-sm text-white/80">Find answers to ordering, delivery, payments and provider policies.</p>
          <div className="mt-4 text-amber-400 font-medium">Visit Help Center →</div>
        </Link>

        <Link href="/contact" className={`${cardBase} ${inView ? visible : hidden}`}>
          <h3 className="text-xl font-semibold text-white">Contact Support</h3>
          <p className="mt-2 text-sm text-white/80">Can’t find an answer? Send us a message and we’ll respond quickly.</p>
          <div className="mt-4 text-amber-400 font-medium">Contact Us →</div>
        </Link>
      </div>
    </section>
  );
}
