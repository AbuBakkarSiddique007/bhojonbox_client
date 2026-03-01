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
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Restaurants</h1>
        <p className="mt-2 text-lg text-slate-600">Browse providers and view their details</p>
      </div>

      {providers.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center bg-white border border-gray-100 rounded-lg">
          <div className="text-4xl mb-4">🏬</div>
          <h3 className="text-xl font-semibold">No providers found</h3>
          <p className="text-sm text-slate-600 mt-2">There are no providers available at the moment.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((p: Provider) => (
            <Link
              key={p.id}
              href={`/providers/${p.id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 overflow-hidden border border-gray-200"
            >
              <div className="h-44 w-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center overflow-hidden">
                {p.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.logo} alt={p.storeName} className="object-cover h-full w-full" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-300">
                    <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-lg leading-tight text-slate-900">{p.storeName || 'Unnamed'}</h4>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.isOpen ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
                    {p.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-slate-600">{p.cuisine || 'Various'}</span>
                </div>
                <p className="text-sm text-slate-600 mt-3 line-clamp-2">{p.description || 'No description'}</p>
                <div className="mt-4 text-sm text-slate-600 flex flex-col gap-1">
                  <div className="font-medium text-slate-800">{p.user?.name || ''}</div>
                  <div className="text-sm text-slate-500">{p.address || ''} {p.phone ? `· ${p.phone}` : ''}</div>
                </div>
              </div>
            </Link>
          ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href={`/providers?page=${Math.max(1, page - 1)}&limit=${limit}`}
              className={`px-3 py-1 rounded-md ${page > 1 ? 'bg-slate-100 hover:bg-slate-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              aria-disabled={page <= 1}
            >
              Previous
            </Link>

            <div className="flex items-center gap-2">
              {Array.from({ length: pages }).map((_, i) => {
                const p = i + 1;
                const isActive = p === page;
                return (
                  <Link
                    key={p}
                    href={`/providers?page=${p}&limit=${limit}`}
                    className={`${isActive ? 'px-3 py-1 rounded-full bg-amber-600 text-white' : 'px-2 py-1 rounded-md bg-white border text-slate-700'}`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>

            <Link
              href={`/providers?page=${Math.min(pages, page + 1)}&limit=${limit}`}
              className={`px-3 py-1 rounded-md ${page < pages ? 'bg-slate-100 hover:bg-slate-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
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
