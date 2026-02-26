import { API_BASE_URL } from '@/config';
import Link from 'next/link';
import BackButton from '@/components/ui/BackButton';

type Category = { id: string; name?: string; image?: string | null };
type ProviderLite = { id: string; storeName?: string; logo?: string | null };

type Meal = {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    image?: string | null;
    isAvailable?: boolean;
    category?: Category | null;
    provider?: ProviderLite | null;
    createdAt?: string;
};

async function fetchJson(url: string) {
    const res = await fetch(url);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return res.json();
}

export default async function MealPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
    const base = API_BASE_URL || 'http://localhost:5000/api';
    const { id } = (await params) as { id: string };

    const resp = await fetchJson(`${base}/meals/${id}`);
    const meal: Meal | null = resp?.data?.meal ?? null;

    let providerDetails: { id: string; storeName?: string; user?: { name?: string; email?: string } | null; logo?: string | null; address?: string | null; phone?: string | null } | null = null;
    if (meal?.provider?.id) {
        const prov = await fetchJson(`${base}/providers/${meal.provider.id}`);
        providerDetails = prov?.data?.provider ?? null;
    }

    if (!meal) {
        return (
            <main className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-semibold">Meal not found</h2>
                <p className="text-muted-foreground mt-2">The meal you are looking for does not exist.</p>
                <Link href="/">Return home</Link>
            </main>
        );
    }

    return (
        <main className="max-w-4xl mx-auto p-6">
            <div className="mb-4">
                <BackButton />
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="md:col-span-1 bg-gray-50 p-6 flex items-center justify-center">
                        <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                            {meal.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={meal.image} alt={meal.name} className="object-cover w-full h-full" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-300">No image</div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-2 p-8">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900">{meal.name}</h1>
                                <div className="mt-2 text-sm text-slate-600">{meal.category?.name ?? 'Uncategorized'}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-semibold text-slate-900">{meal.price ? `৳ ${meal.price}` : ''}</div>
                                <div className={`mt-2 text-xs px-2 py-1 rounded-full ${meal.isAvailable ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{meal.isAvailable ? 'Available' : 'Unavailable'}</div>
                            </div>
                        </div>

                        <div className="mt-6 text-slate-700 leading-relaxed">
                            <p>{meal.description}</p>
                        </div>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4">
                                <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {providerDetails?.logo ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={providerDetails.logo} alt={providerDetails.storeName} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="text-gray-300">No image</div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm text-slate-500">Provider</h4>
                                    {providerDetails ? (
                                        <div className="mt-1 text-slate-800">
                                            <Link href={`/providers/${providerDetails.id}`}>{providerDetails.storeName}</Link>
                                        </div>
                                    ) : meal.provider ? (
                                        <div className="mt-1 text-slate-800">
                                            <Link href={`/providers/${meal.provider.id}`}>{meal.provider.storeName}</Link>
                                        </div>
                                    ) : (
                                        <div className="mt-1 text-slate-800">Unknown</div>
                                    )}
                                    {providerDetails?.user?.name && (
                                        <div className="mt-1 text-sm text-slate-600">Owner: {providerDetails.user.name}</div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="text-sm text-slate-500">Category</h4>
                                <div className="mt-1 text-slate-800">{meal.category?.name ?? '—'}</div>
                            </div>
                        </div>

                        <div className="mt-6 text-sm text-slate-500">Added on {meal.createdAt ? new Date(meal.createdAt).toLocaleDateString() : ''}</div>
                    </div>
                </div>
            </div>
        </main>
    );
}
