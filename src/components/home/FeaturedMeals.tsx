import Link from "next/link";
import { API_BASE_URL } from "@/config";
import ScrollReveal from "@/components/shared/ScrollReveal";

type Meal = {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string | null;
  isAvailable?: boolean;
  provider?: { storeName?: string } | null;
};

export default async function FeaturedMeals({ limit = 6 }: { limit?: number }) {
  const base = API_BASE_URL || "https://bhojonbox-server.onrender.com/api";
  const res = await fetch(`${base}/meals?limit=${limit}`, { next: { revalidate: 10 } });
  if (!res.ok) {
    return <div className="text-sm text-muted-foreground">Failed to load featured meals.</div>;
  }
  const json = await res.json().catch(() => null);
  const list: Meal[] = json?.data?.meals ?? [];
  const meals = list.slice(0, limit);

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <ScrollReveal>
        <div className="mb-20 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary mb-4">Curations</p>
          <h3 className="text-3xl md:text-5xl font-black text-foreground brand uppercase tracking-tight">
            Chef&apos;s <span className="text-primary italic">Signature</span> Selection
          </h3>
          <div className="w-16 h-1 bg-primary mx-auto mt-6 mb-6 rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto font-medium italic leading-relaxed">
            Hand-selected masterpieces from our network of master artisans. Each dish tells a story of local flavor and passion.
          </p>
        </div>
      </ScrollReveal>

      {meals.length === 0 ? (
        <div className="bg-card/40 backdrop-blur-sm border shadow-sm border-border/50 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
          <div className="h-20 w-20 bg-primary/10 text-amber-600 dark:bg-primary/10 dark:text-amber-400 rounded-full flex items-center justify-center mb-5">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-foreground mb-2">No meals featured yet</h4>
          <p className="text-muted-foreground text-base max-w-sm">We are still curating the best meals for you. Stay tuned for delicious updates.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {meals.map((m) => (
          <Link key={m.id} href={`/meals/${m.id}`} className="block bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-border">
            <div className="h-44 bg-muted flex items-center justify-center overflow-hidden">
              {m.image ? (
                <img src={m.image} alt={m.name} className="object-cover w-full h-full" />
              ) : (
                <div className="text-muted-foreground/30 font-medium">No image</div>
              )}
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-lg text-card-foreground">{m.name}</h4>
              <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{m.description}</div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-bold text-primary">{m.price ? `৳ ${m.price}` : ''}</div>
                <div className={`text-xs px-2 py-1 rounded-full font-medium ${m.isAvailable ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>{m.isAvailable ? 'Available' : 'Unavailable'}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      )}
    </section>
  );
}
