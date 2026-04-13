"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does BhojonBox ensure food quality?",
    answer: "We only partner with vetted culinary artisans who meet our rigorous standards for ingredient sourcing and preparation. Every dish is inspected before delivery."
  },
  {
    question: "What is the typical delivery time?",
    answer: "Most gourmet orders are delivered within 45-60 minutes, ensuring your meal arrives at the perfect temperature."
  },
  {
    question: "Do you offer subscription plans for regular diners?",
    answer: "Yes, our 'Elite Table' membership offers exclusive access to limited-edition menus and priority delivery windows."
  },
  {
    question: "How can I contact a specific restaurant?",
    answer: "You can find contact details for each culinary partner on their individual provider page within the app."
  },
  {
    question: "Is there a minimum order value?",
    answer: "Minimum values vary by artisan but typically range from ৳ 500 to ৳ 1,000 to maintain the premium nature of the service."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-28 bg-background transition-colors duration-700">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary mb-4">Common Mysteries Resolved</p>
          <h2 className="text-3xl md:text-5xl font-black text-foreground brand uppercase tracking-tight">
            Frequently Asked <span className="text-primary italic">Questions</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-6 mb-6 rounded-full" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={`group border border-border/50 rounded-[1.5rem] overflow-hidden transition-all duration-300 ${isOpen ? 'bg-muted/30 shadow-lg' : 'bg-card hover:border-primary/30'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <span className={`text-sm md:text-base font-black brand uppercase tracking-wide transition-colors ${isOpen ? 'text-primary' : 'text-foreground'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
                >
                  <p className="px-8 pb-8 text-sm md:text-base text-muted-foreground leading-relaxed italic border-t border-border/20 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
