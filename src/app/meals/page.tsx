import Link from 'next/link';
import { getAllMeals } from '@/services/meals/meals';
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

  const { meals, pagination } = await getAllMeals(page, limit, filters);

  const catRes = await fetch(`${API_BASE_URL}/categories`, { next: { revalidate: 60 } });
  const catJson = await catRes.json().catch(() => null);
  const categories = catJson?.data?.categories ?? catJson?.categories ?? [];
  const pages = pagination?.pages ?? Math.max(1, Math.ceil((pagination?.total ?? meals.length) / limit));

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Discover Delicious Meals</h1>
        <p className="mt-2 text-lg text-slate-600">Find meals by search, price range, or category</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <aside className="md:col-span-3">
          <div className="sticky top-24">
            <MealsFilters categories={categories} />
          </div>
        </aside>

        <section className="md:col-span-9">
          {meals.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center bg-white border border-gray-100 rounded-lg">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold">No meals found</h3>
              <p className="text-sm text-slate-600 mt-2">We could not find any meals matching your filters. Try adjusting your search or clearing filters.</p>
              
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-slate-600">Page {page} of {pages}</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.map((m: Meal) => (
                  <Link key={m.id} href={`/meals/${m.id}`} className="block bg-white rounded-lg shadow hover:shadow-lg overflow-hidden border border-gray-100">
                    <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
                      {m.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.image} alt={m.name} className="object-cover w-full h-full" />
                      ) : (
                        <div className="text-gray-300">No image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-lg text-slate-900">{m.name}</h4>
                      <div className="text-sm text-slate-600 mt-1 line-clamp-2">{m.description}</div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-900">{m.price ? `৳ ${m.price}` : ''}</div>
                        <div className={`text-xs px-2 py-1 rounded ${m.isAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{m.isAvailable ? 'Available' : 'Unavailable'}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-center gap-3">
                <Link
                  href={`/meals?page=${Math.max(1, page - 1)}&limit=${limit}`}
                  className={`px-3 py-1 rounded-md ${page > 1 ? 'bg-slate-100 hover:bg-slate-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  aria-disabled={page <= 1}
                >
                  Previous
                </Link>

                <div className="flex items-center gap-2">
                  {(() => {
                    const items: (number | string)[] = [];
                    if (pages <= 7) {
                      for (let i = 1; i <= pages; i++) items.push(i);
                    } else {
                      items.push(1);
                      if (page > 4) items.push('...');
                      const start = Math.max(2, page - 1);
                      const end = Math.min(pages - 1, page + 1);
                      for (let i = start; i <= end; i++) items.push(i);
                      if (page < pages - 3) items.push('...');
                      items.push(pages);
                    }
                    return items.map((it, idx) => {
                      if (typeof it === 'string') {
                        return (
                          <span key={`e-${idx}`} className="px-3 py-1 text-sm text-slate-600">{it}</span>
                        );
                      }
                      const p = it as number;
                      const isActive = p === page;
                      return (
                        <Link
                          key={p}
                          href={`/meals?page=${p}&limit=${limit}`}
                          className={`${isActive ? 'px-3 py-1 rounded-full bg-amber-600 text-white' : 'px-2 py-1 rounded-md bg-white border text-slate-700'}`}
                        >
                          {p}
                        </Link>
                      );
                    });
                  })()}
                </div>

                <Link
                  href={`/meals?page=${Math.min(pages, page + 1)}&limit=${limit}`}
                  className={`px-3 py-1 rounded-md ${page < pages ? 'bg-slate-100 hover:bg-slate-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
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