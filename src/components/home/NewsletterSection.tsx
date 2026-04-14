"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";

import ScrollReveal from "@/components/shared/ScrollReveal";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success("Welcome to the Elite Table!", {
      description: "You've successfully joined our exclusive culinary club."
    });

    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden transition-colors duration-700">
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto px-6 text-center">
        <ScrollReveal>
          <div className="mb-12 inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl rotate-12 mb-8 shadow-sm">
            <Mail className="w-8 h-8 text-primary -rotate-12" />
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground brand uppercase tracking-tight mb-6">
            The Culinary <span className="text-primary italic">Insider</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed italic">
            Join our curated list of connoisseurs to receive exclusive access to artisanal menus and premier seasonal events.
          </p>
        </ScrollReveal>

        <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto group px-4 sm:px-0">
          <div className="flex flex-col sm:block relative">
            <input
              type="email"
              required
              suppressHydrationWarning
              placeholder="Your professional email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 sm:pr-40 py-5 sm:py-6 bg-card border border-border/50 rounded-[1.5rem] sm:rounded-3xl outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-medium text-foreground placeholder:text-muted-foreground/30 shadow-lg"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
            <div className="mt-4 sm:mt-0 sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-[1.25rem] sm:rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Join the Table <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">
          Respect for your inbox — Curated content only.
        </p>
      </div>
    </section>
  );
}
