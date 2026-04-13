import Link from "next/link";
import { API_BASE_URL } from "@/config";
import ScrollReveal from "@/components/shared/ScrollReveal";

type Provider = {
  id: string;
  storeName?: string;
  description?: string;
  cuisine?: string;
  logo?: string | null;
  address?: string | null;
  phone?: string | null;
  isOpen?: boolean;
  user?: { name?: string; email?: string } | null;
};

export default async function ProvidersList({
  limit = 6,
  title = "The Artisan Guild",
  description = "Meet the visionary masterminds crafting extraordinary flavors every day. These are our most trusted partners.",
}: {
  limit?: number;
  title?: string;
  description?: string;
}) {
  const base = API_BASE_URL || "https://bhojonbox-server.onrender.com/api";
  const res = await fetch(`${base}/providers`, { next: { revalidate: 10 } });
  if (!res.ok) {
    return <div className="text-sm text-muted-foreground">Failed to load providers.</div>;
  }
  const json = await res.json().catch(() => null);
  const list: Provider[] = json?.data?.providers ?? [];
  const providers = list.slice(0, limit);

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 mb-12">
      <ScrollReveal>
        <div className="mb-20 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary mb-4">Masterminds</p>
          <h3 className="text-3xl md:text-5xl font-black text-foreground brand uppercase tracking-tight">
            The Artisan <span className="text-primary italic">Guild</span>
          </h3>
          <div className="w-16 h-1 bg-primary mx-auto mt-6 mb-6 rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto font-medium italic leading-relaxed">
            {description}
          </p>
        </div>
      </ScrollReveal>

      {providers.length === 0 ? (
        <div className="bg-card border border-border shadow-sm border-border/50 rounded-[2rem] p-20 flex flex-col items-center justify-center text-center">
          <div className="h-24 w-24 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-inner">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h4 className="text-2xl font-black text-foreground mb-4 brand">Awaiting New Partnerships</h4>
          <p className="text-muted-foreground text-base max-w-sm italic">We are curating the finest local talent. Our gourmands are searching for providers to serve your neighborhood soon.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.map((p) => (
        <Link
          key={p.id}
          href={`/providers/${p.id}`}
          className="group block bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-border"
        >
          <div className="h-44 w-full bg-muted flex items-center justify-center overflow-hidden">
            {p.logo ? (
              <img src={p.logo} alt={p.storeName} className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-muted-foreground/30">
                <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-lg leading-tight text-card-foreground group-hover:text-primary transition-colors">{p.storeName || "Unnamed"}</h4>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.isOpen ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {p.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">{p.cuisine || "Various cuisines"}</span>
              {p.cuisine && <span className="ml-2 text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-black uppercase tracking-widest">{p.cuisine.split(',')[0]}</span>}
            </div>
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{p.description || "No description"}</p>
            <div className="mt-4 pt-4 border-t border-border/50 text-sm flex flex-col gap-1">
              <div className="font-semibold text-card-foreground">{p.user?.name || ''}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="truncate">{p.address || ''}</span>
                {p.phone && <span>· {p.phone}</span>}
              </div>
            </div>
          </div>
        </Link>
      ))}
      </div>
      )}
    </section>
  );
}
