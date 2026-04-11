import Link from 'next/link';
import { providerService } from '@/services';

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

export default async function ProvidersPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const sp = (await searchParams) ?? {};
  const page = Number(sp.page ?? '1') || 1;
  const limit = Number(sp.limit ?? '9') || 9;

  const all = await providerService.getAllProviders();
  const total = all.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const providers = all.slice((page - 1) * limit, page * limit);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 animate-in fade-in duration-500">
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground brand uppercase">The Gourmet Collective</h1>
        <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
        <p className="mt-6 text-lg text-muted-foreground italic font-medium">Browse our certified gourmet providers and discover their unique culinary narratives.</p>
      </div>

      {providers.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center bg-card border border-border rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="text-7xl mb-6">🏬</div>
          <h3 className="text-2xl font-black text-foreground brand uppercase tracking-widest">No Providers Found</h3>
          <div className="w-12 h-1 bg-primary mt-3 mb-6 rounded-full"></div>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm text-center leading-relaxed italic px-4">
            Our gourmet community is expanding. Check back soon for new additions to our certified provider list.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.map((p: Provider) => (
            <Link
              key={p.id}
              href={`/providers/${p.id}`}
              className="block bg-card rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-border group"
            >
              <div className="h-56 w-full bg-muted flex items-center justify-center overflow-hidden relative">
                {p.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.logo} alt={p.storeName} className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground/30 gap-3">
                    <div className="text-5xl">🏬</div>
                    <div className="text-[10px] font-black uppercase tracking-widest">Awaiting Brand</div>
                  </div>
                )}
                <div className="absolute top-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                   <div className="bg-primary px-3 py-1 rounded-full text-[8px] font-black text-primary-foreground uppercase tracking-widest">View Profile</div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-4 border-b border-border/50 pb-4">
                  <h4 className="font-black text-xl leading-tight text-foreground brand pr-4 truncate">{p.storeName || 'Unnamed'}</h4>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${p.isOpen ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                    {p.isOpen ? 'Live' : 'Off-Air'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black text-primary uppercase tracking-widest opacity-80">{p.cuisine || 'Various'}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2 italic leading-relaxed h-10">{p.description || 'Expertly curated culinary experiences, prepared with passion and delivered with care.'}</p>
                
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Executive Chef</span>
                      <span className="text-xs font-bold text-foreground truncate max-w-[150px]">{p.user?.name || 'Authorized Provider'}</span>
                   </div>
                   <div className="text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">➔</div>
                </div>
              </div>
            </Link>
          ))}
          </div>

          <div className="mt-16 flex items-center justify-center gap-4">
            <Link
              href={`/providers?page=${Math.max(1, page - 1)}&limit=${limit}`}
              className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${page > 1 ? 'bg-secondary text-secondary-foreground border border-border shadow-sm hover:bg-muted' : 'bg-muted/50 text-muted-foreground/30 cursor-not-allowed border border-border/20'}`}
              aria-disabled={page <= 1}
            >
              Previous
            </Link>

            <div className="flex items-center gap-3">
              {Array.from({ length: pages }).map((_, i) => {
                const p = i + 1;
                const isActive = p === page;
                return (
                  <Link
                    key={p}
                    href={`/providers?page=${p}&limit=${limit}`}
                    className={`w-10 h-10 flex items-center justify-center text-xs font-black rounded-xl transition-all ${isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110' : 'bg-card border border-border text-foreground hover:bg-muted'}`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>

            <Link
              href={`/providers?page=${Math.min(pages, page + 1)}&limit=${limit}`}
              className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${page < pages ? 'bg-secondary text-secondary-foreground border border-border shadow-sm hover:bg-muted' : 'bg-muted/50 text-muted-foreground/30 cursor-not-allowed border border-border/20'}`}
              aria-disabled={page >= pages}
            >
              Next
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
