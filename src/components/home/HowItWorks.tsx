import ScrollReveal from "@/components/shared/ScrollReveal";

export default function HowItWorks() {
  const steps = [
    {
      icon: "🛒",
      color: "bg-primary/10",
      title: "Curate Your Selection",
      description:
        "Browse our meticulously curated menus, select your preferred culinary creations, and place your order within moments.",
    },
    {
      icon: "👨‍🍳",
      color: "bg-emerald-500/10",
      title: "Artisanal Preparation",
      description:
        "Your chosen dishes are freshly prepared by our network of vetted culinary artisans using only premium, locally sourced ingredients.",
    },
    {
      icon: "🚚",
      color: "bg-blue-500/10",
      title: "Punctual Delivery",
      description:
        "Monitor your order in real-time and receive your meal promptly — delivered with the discretion and care it deserves.",
    },
  ];

  return (
    <section className="bg-muted/10 dark:bg-muted/5 py-28 border-y border-border transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="mb-20 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary mb-4">The Process</p>
            <h2 className="text-3xl md:text-5xl font-black text-foreground brand uppercase tracking-tight mb-6">
              The Path to <span className="text-primary italic">Perfection</span>
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full" />
            <p className="text-muted-foreground max-w-2xl mx-auto italic font-medium leading-relaxed">
              A seamless, end-to-end culinary experience — from our heritage kitchens to your private table.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">


          <div className="absolute top-12 left-1/3 right-1/3 h-px bg-border hidden md:block" />

          {steps.map((step, i) => (
            <div
              key={i}
              className="relative p-10 bg-card rounded-[2rem] shadow-sm border border-border text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              
              <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                {step.icon}
              </div>

              <div className="absolute top-6 left-6 text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">
                0{i + 1}
              </div>

              <h3 className="text-xl font-black text-card-foreground mb-4 brand">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
