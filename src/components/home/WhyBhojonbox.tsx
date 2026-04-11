export default function WhyBhojonbox() {
  const pillars = [
    {
      icon: "🌿",
      color: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      title: "Locally Sourced",
      description:
        "We partner exclusively with providers who champion local farms and fresh, seasonal ingredients — ensuring every dish carries authentic, regional character.",
    },
    {
      icon: "🏅",
      color: "bg-primary/10",
      iconColor: "text-primary",
      title: "Rigorously Vetted",
      description:
        "Every culinary partner on our platform undergoes a comprehensive review process. Your satisfaction and safety are our founding principles.",
    },
    {
      icon: "⚡",
      color: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      title: "Precision Delivery",
      description:
        "Our proprietary logistics framework ensures your meal arrives at peak temperature, within the scheduled window, every single time.",
    },
  ];

  return (
    <section className="py-28 bg-background border-b border-border transition-colors duration-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary mb-4">Our Standards</p>
          <h2 className="text-3xl md:text-5xl font-black text-foreground brand uppercase tracking-tight">
            The BhojonBox Distinction
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-6 mb-6 rounded-full" />
          <p className="text-muted-foreground max-w-xl mx-auto italic font-medium leading-relaxed">
            We do not simply deliver food. We deliver an experience — one built on quality, trust, and a commitment to culinary excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="group p-10 bg-card rounded-[2rem] shadow-sm border border-border text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-28 h-28 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              
              <div className={`w-20 h-20 ${pillar.color} rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                {pillar.icon}
              </div>
              <h3 className={`text-xl font-black mb-4 brand ${pillar.iconColor}`}>{pillar.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
