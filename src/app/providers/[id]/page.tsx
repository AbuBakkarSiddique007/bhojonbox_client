import { API_BASE_URL } from '@/config';
import Link from 'next/link';

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
  const base = API_BASE_URL || 'http://localhost:5000/api';
  const { id } = (await params) as { id: string };

  const provResp = await fetchJson(`${base}/providers/${id}`);
  const provider: Provider | null = provResp?.data?.provider ?? null;
  const mealsResp = await fetchJson(`${base}/meals?provider=${id}`);
  const meals: Meal[] = mealsResp?.data?.meals ?? [];

  if (!provider) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold">Provider not found</h2>
        <p className="text-muted-foreground mt-2">The provider you are looking for does not exist.</p>
        <Link href="/">Return home</Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          <div className="md:col-span-1 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
            <div className="w-full h-56 md:h-64 rounded-lg overflow-hidden shadow-inner bg-gray-100">
              {provider.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={provider.logo} alt={provider.storeName} className="object-cover w-full h-full" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-300">No image</div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">{provider.storeName}</h1>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-sm text-slate-600">{provider.cuisine}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${provider.isOpen ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
                    {provider.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a href={`tel:${provider.phone}`} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition">Call</a>
                <a href={`mailto:${provider.user?.email}`} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-slate-700 rounded-md hover:bg-gray-50 transition">Email</a>
              </div>
            </div>

            <div className="mt-6 text-slate-700 leading-relaxed">
              <p>{provider.description}</p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm text-slate-500">Address</h4>
                <div className="mt-1 text-slate-800">{provider.address}</div>
                <div className="mt-2 text-sm text-slate-600">{provider.phone}</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm text-slate-500">Owner</h4>
                <div className="mt-1 text-slate-800">{provider.user?.name}</div>
                <div className="mt-2 text-sm text-slate-600">{provider.user?.email}</div>
              </div>
            </div>

            <div className="mt-6 text-sm text-slate-500">Joined on {provider.createdAt ? new Date(provider.createdAt).toLocaleDateString() : ''}</div>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Meals</h2>
        {meals.length === 0 ? (
          <p className="text-muted-foreground">No meals found for this provider.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((m) => (
              <article key={m.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {m.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.image} alt={m.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="text-gray-300">No image</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{m.name}</h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{m.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm font-medium text-slate-900">{m.price ? `৳ ${m.price}` : ''}</div>
                    <div className={`text-xs px-2 py-1 rounded ${m.isAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{m.isAvailable ? 'Available' : 'Unavailable'}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
