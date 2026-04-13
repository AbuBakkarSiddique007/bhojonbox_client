import Link from 'next/link';
import Image from 'next/image';
import { mealsService } from '@/services';
import MealsFilters from '../../components/meals/MealsFilters';
import { API_BASE_URL } from '@/config';

type Meal = {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string | null;
  isAvailable?: boolean;
};

export default async function MealsPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const sp = (await searchParams) ?? {};
  const page = Number(sp.page ?? '1') || 1;
  const limit = Number(sp.limit ?? '10') || 10;

  const filters = {
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    category: sp.category ?? undefined,
    q: sp.q ?? undefined,
  };

  const { meals, pagination } = await mealsService.getAllMeals(page, limit, filters);

  const catRes = await fetch(`${API_BASE_URL}/categories`, { next: { revalidate: 60 } });
  const catJson = await catRes.json().catch(() => null);
  const categories = catJson?.data?.categories ?? catJson?.categories ?? [];
  const pages = pagination?.pages ?? Math.max(1, Math.ceil((pagination?.total ?? meals.length) / limit));

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Discover Delicious Meals</h1>
        <p className="mt-2 text-lg text-muted-foreground">Find meals by search, price range, or category</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <aside className="md:col-span-3">
          <div className="sticky top-24">
            <MealsFilters categories={categories} />
          </div>
        </aside>

        <section className="md:col-span-9">
          {meals.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center bg-card border border-border rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="text-7xl mb-6 filter drop-shadow-lg">🍽️</div>
              <h3 className="text-2xl font-black text-foreground brand uppercase tracking-widest">No Meals Found</h3>
              <div className="w-12 h-1 bg-primary mt-3 mb-6 rounded-full"></div>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm text-center leading-relaxed italic px-4">
                Our culinary team is currently crafting new masterpieces. Try adjusting your refinements to explore other gourmet options.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-xs font-black text-muted-foreground uppercase tracking-widest opacity-60 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Curated Collection (Page {page} of {pages})
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {meals.map((m: Meal) => (
                  <Link key={m.id} href={`/meals/${m.id}`} className="block bg-card rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-border group">
                    <div className="h-56 bg-muted flex items-center justify-center overflow-hidden relative">
                      {m.image ? (
                        <Image 
                          src={m.image} 
                          alt={m.name || "Meal Image"} 
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                        />
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
                         <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${m.isAvailable ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>{m.isAvailable ? 'Fresh' : 'Sold Out'}</span>
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

              <div className="mt-16 flex items-center justify-center gap-4">
                <Link
                  href={`/meals?page=${Math.max(1, page - 1)}&limit=${limit}`}
                  className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${page > 1 ? 'bg-secondary text-secondary-foreground border border-border shadow-sm hover:bg-muted' : 'bg-muted/50 text-muted-foreground/30 cursor-not-allowed border border-border/20'}`}
                  aria-disabled={page <= 1}
                >
                  Previous
                </Link>

                <div className="flex items-center gap-3">
                  {(() => {
                    const items: (number | string)[] = [];
                    if (pages <= 5) {
                      for (let i = 1; i <= pages; i++) items.push(i);
                    } else {
                      items.push(1);
                      if (page > 3) items.push('...');
                      const start = Math.max(2, page - 1);
                      const end = Math.min(pages - 1, page + 1);
                      for (let i = start; i <= end; i++) items.push(i);
                      if (page < pages - 2) items.push('...');
                      items.push(pages);
                    }
                    return items.map((it, idx) => {
                      if (typeof it === 'string') {
                        return (
                          <span key={`e-${idx}`} className="px-2 text-sm text-muted-foreground opacity-30 font-black">{it}</span>
                        );
                      }
                      const p = it as number;
                      const isActive = p === page;
                      return (
                        <Link
                          key={p}
                          href={`/meals?page=${p}&limit=${limit}`}
                          className={`w-10 h-10 flex items-center justify-center text-xs font-black rounded-xl transition-all ${isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110' : 'bg-card border border-border text-foreground hover:bg-muted'}`}
                        >
                          {p}
                        </Link>
                      );
                    });
                  })()}
                </div>

                <Link
                  href={`/meals?page=${Math.min(pages, page + 1)}&limit=${limit}`}
                  className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${page < pages ? 'bg-secondary text-secondary-foreground border border-border shadow-sm hover:bg-muted' : 'bg-muted/50 text-muted-foreground/30 cursor-not-allowed border border-border/20'}`}
                  aria-disabled={page >= pages}
                >
                  Next
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}