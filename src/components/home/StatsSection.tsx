"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: "Master Chefs", value: 50, suffix: "+" },
  { label: "Premium Cuisines", value: 15, suffix: "+" },
  { label: "Gourmet Deliveries", value: 10000, suffix: "+", formatter: (val: number) => (val / 1000).toFixed(0) + "k" },
  { label: "Happy Connoisseurs", value: 5000, suffix: "+", formatter: (val: number) => (val / 1000).toFixed(0) + "k" },
];

export default function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    stats.forEach((stat, i) => {
      const element = numberRefs.current[i];
      if (!element) return;

      gsap.fromTo(
        element,
        { innerText: 0 },
        {
          innerText: stat.value,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
          },
          onUpdate: function () {
            const val = Math.floor(this.targets()[0].innerText);
            element.innerText = stat.formatter ? stat.formatter(val) : val.toString();
          },
        }
      );
    });

    // Fade in the header
    const header = containerRef.current?.querySelector(".stats-header");
    if (header) {
      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, []);

  return (
    <section ref={containerRef} className="py-28 bg-background transition-colors duration-700 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="stats-header text-center mb-20 opacity-0">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary mb-4">The Impact</p>
          <h2 className="text-3xl md:text-5xl font-black text-foreground brand uppercase tracking-tight">
            BhojonBox <span className="text-primary italic">Impact</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-6 mb-6 rounded-full" />
          <p className="text-muted-foreground max-w-xl mx-auto italic font-medium leading-relaxed">
            Driven by passion, scaled for perfection. Our numbers reflect a commitment to culinary excellence.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-4xl md:text-6xl font-black text-primary brand mb-3 drop-shadow-sm group-hover:scale-110 transition-transform duration-500">
                <span ref={(el) => { numberRefs.current[i] = el; }}>0</span>
                {stat.suffix}
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
