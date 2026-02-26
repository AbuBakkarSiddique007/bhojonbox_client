import Link from "next/link";
import { API_BASE_URL } from "@/config";

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
  const base = API_BASE_URL || "http://localhost:5000/api";
  const res = await fetch(`${base}/meals?limit=${limit}`, { next: { revalidate: 10 } });
  if (!res.ok) {
    return <div className="text-sm text-muted-foreground">Failed to load featured meals.</div>;
  }
  const json = await res.json().catch(() => null);
  const list: Meal[] = json?.data?.meals ?? [];
  const meals = list.slice(0, limit);

  if (meals.length === 0) return <div className="text-sm text-muted-foreground">No featured meals yet.</div>;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-6">
        <h3 className="text-3xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-cyan-500 to-teal-400">Featured Meals</h3>
        <p className="text-sm text-slate-600/90">Hand-picked meals from top providers.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {meals.map((m) => (
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
    </section>
  );
}
