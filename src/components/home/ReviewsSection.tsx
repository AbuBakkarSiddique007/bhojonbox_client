"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

const reviews = [
  {
    id: 1,
    name: "Zibran Hasan Chinku",
    role: "Culinary Critic",
    content: "The attention to detail in every dish is simply staggering. BhojonBox has redefined what premium delivery means to me.",
    rating: 5,
    image: "https://i.ibb.co.com/dwLmhGYv/zibi.jpg"
  },
  {
    id: 2,
    name: "Riki Ahmed",
    role: "Regular Connoisseur",
    content: "Authenticity is hard to find in a delivered meal, but here it is the standard. Every bite feels like a journey.",
    rating: 5,
    image: "https://i.ibb.co.com/rRbLyDnp/riki-Biki.jpg"
  },
  {
    id: 3,
    name: "Fahim Khan",
    role: "Gourmet Enthusiast",
    content: "Finally, a platform that respects the artisan. The meals arrive as if they just left the chef's hands.",
    rating: 5,
    image: "https://i.ibb.co.com/Rpg789vh/fahim.jpg"
  }
];

export default function ReviewsSection() {
  return (
    <section className="py-28 bg-muted/20 transition-colors duration-700 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-20 animate-in fade-in duration-1000">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary mb-4">Customer Chronicles</p>
            <h2 className="text-3xl md:text-5xl font-black text-foreground brand uppercase tracking-tight">
              Voices of the <span className="text-primary italic">Palate</span>
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-6 mb-6 rounded-full" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <div
              key={rev.id}
              className="group p-10 bg-card rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative"
            >
              <div className="absolute top-8 right-10 text-primary opacity-20 group-hover:opacity-100 transition-opacity">
                <svg width="40" height="30" viewBox="0 0 40 30" fill="currentColor">
                  <path d="M12.125 0V11.25H2.5C2.5 17.5 7.5 22.5 12.5 22.5V30C5 30 0 22.5 0 15V0H12.125ZM37.5 0V11.25H27.875C27.875 17.5 32.875 22.5 37.875 22.5V30C30.375 30 25.375 22.5 25.375 15V0H37.5Z" />
                </svg>
              </div>

              <div className="flex gap-1 mb-6">
                {Array(rev.rating).fill(0).map((_, idx) => (
                  <Star key={idx} size={14} className="fill-primary text-primary" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed italic mb-10 text-lg font-medium">
                &quot;{rev.content}&quot;
              </p>

              <div className="flex items-center gap-4 border-t border-border/50 pt-8 mt-2">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
                  <Image
                    src={rev.image}
                    alt={rev.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-black text-sm text-foreground brand uppercase tracking-wider">{rev.name}</h4>
                  <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
