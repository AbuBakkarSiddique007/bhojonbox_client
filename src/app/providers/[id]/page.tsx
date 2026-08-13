import { API_BASE_URL } from '@/config';
import Link from 'next/link';
import BackButton from '@/components/ui/BackButton';

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
  createdAt?: string;
  updatedAt?: string;
};

type Meal = {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string | null;
  isAvailable?: boolean;
};

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}

export default async function ProviderPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const base = API_BASE_URL || 'https://bhojonbox-server.onrender.com/api';
  const { id } = (await params) as { id: string };

  const provResp = await fetchJson(`${base}/providers/${id}`);
  const provider: Provider | null = provResp?.data?.provider ?? null;
  const mealsResp = await fetchJson(`${base}/meals?provider=${id}`);
  const meals: Meal[] = mealsResp?.data?.meals ?? [];

  if (!provider) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 animate-in fade-in duration-500">
        <div className="py-24 flex flex-col items-center justify-center bg-card border border-border rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="text-7xl mb-6">🏬</div>
          <h3 className="text-2xl font-black text-foreground brand uppercase tracking-widest">Provider Not Found</h3>
          <div className="w-12 h-1 bg-primary mt-3 mb-6 rounded-full"></div>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm text-center leading-relaxed italic px-4 mb-8">
            The provider you are looking for does not exist or has been removed from our collective.
          </p>
          <Link href="/providers" className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all bg-primary text-primary-foreground shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
            Return to Collective
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 animate-in fade-in duration-500">
      <div className="mb-8">
        <BackButton />
      </div>

      <div className="bg-card rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-border group mb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          <div className="md:col-span-5 lg:col-span-4 bg-muted flex items-center justify-center relative overflow-hidden min-h-[300px]">
              {provider.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={provider.logo} alt={provider.storeName} className="object-cover w-full h-full absolute inset-0 group-hover:scale-105 transition-transform duration-1000" />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground/30 gap-6 z-10 absolute inset-0">
                  <div className="text-8xl filter grayscale opacity-50">🏬</div>
                  <div className="text-xs font-black uppercase tracking-widest">Awaiting Brand</div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          <div className="md:col-span-7 lg:col-span-8 p-10 lg:p-14 flex flex-col justify-center">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground brand leading-none tracking-tighter mb-4">{provider.storeName}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-black text-primary uppercase tracking-widest">{provider.cuisine || 'Gourmet Cuisine'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${provider.isOpen ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                    {provider.isOpen ? 'Currently Live' : 'Off-Air'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a href={`tel:${provider.phone}`} className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-2xl shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all shrink-0" aria-label="Call Provider">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </a>
                <a href={`mailto:${provider.user?.email}`} className="inline-flex items-center justify-center w-12 h-12 bg-secondary text-secondary-foreground border border-border rounded-2xl hover:bg-muted hover:-translate-y-1 transition-all shrink-0" aria-label="Email Provider">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                </a>
              </div>
            </div>

            <div className="text-base text-muted-foreground leading-relaxed italic mb-10 max-w-3xl">
              {provider.description || 'Expertly curated culinary experiences, prepared with passion and delivered with care.'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-border">
              <div>
                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Location & Contact</h4>
                <div className="text-foreground font-medium mb-1">{provider.address || 'Address not provided'}</div>
                <div className="text-sm text-muted-foreground">{provider.phone || 'Phone not provided'}</div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Executive Chef</h4>
                <div className="text-foreground font-medium mb-1">{provider.user?.name || 'Authorized Provider'}</div>
                <div className="text-sm text-muted-foreground">{provider.user?.email || 'Email not provided'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <div className="flex items-end justify-between mb-10 border-b border-border/50 pb-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black brand tracking-tighter text-foreground mb-2">Curated Menu</h2>
            <div className="text-sm font-medium text-muted-foreground italic">Signature dishes from {provider.storeName}</div>
          </div>
          <div className="text-[10px] font-black text-primary uppercase tracking-widest hidden sm:block">
            {meals.length} Offerings
          </div>
        </div>

        {meals.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center bg-card border border-border rounded-[2.5rem] relative overflow-hidden group shadow-sm">
            <div className="text-6xl mb-6 opacity-50 filter grayscale">🍽️</div>
            <h3 className="text-xl font-black text-foreground brand uppercase tracking-widest">Menu Incoming</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm text-center leading-relaxed italic px-4">
               The chef is currently preparing the menu. Check back soon for delectable new offerings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {meals.map((m) => (
              <Link key={m.id} href={`/meals/${m.id}`} className="block bg-card rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-border group">
                <div className="h-56 bg-muted flex items-center justify-center overflow-hidden relative">
                  {m.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.image} alt={m.name || "Meal Image"} className="object-cover w-full h-full absolute inset-0 group-hover:scale-110 transition-transform duration-1000" />
                  ) : (
                    <div className="text-muted-foreground/30 font-black tracking-widest uppercase text-[10px]">Awaiting Masterpiece</div>
                  )}
                  <div className="absolute top-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                     <div className="bg-primary px-3 py-1 rounded-full text-[8px] font-black text-primary-foreground uppercase tracking-widest">View Detail</div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-3 border-b border-border/50 pb-4">
                     <h4 className="font-black text-xl text-card-foreground brand truncate pr-4">{m.name}</h4>
                     <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shrink-0 ${m.isAvailable ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>{m.isAvailable ? 'Fresh' : 'Sold Out'}</span>
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic mb-6 h-8">{m.description}</div>
                  <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                    <div className="text-lg font-black text-primary brand">৳ {m.price}</div>
                    <div className="text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">➔</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
