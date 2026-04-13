"use client";

import { useRef } from "react";
import useInView from "@/hooks/useInView";

const stats = [
  { label: "Master Chefs", value: "50+" },
  { label: "Premium Cuisines", value: "15+" },
  { label: "Gourmet Deliveries", value: "10k+" },
  { label: "Happy Connoisseurs", value: "5k+" },
];

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-background transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={`text-center transition-all duration-1000 delay-${i * 100} ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <div className="text-4xl md:text-5xl font-black text-primary brand mb-3 drop-shadow-sm">
                {stat.value}
              </div>
              <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
