import { API_BASE_URL } from '@/config';
import Link from 'next/link';
import BackButton from '@/components/ui/BackButton';
import AddToCartButton from '@/components/meals/AddToCartButton';

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
    const base = API_BASE_URL || 'https://bhojonbox-server.onrender.com/api';
    const { id } = (await params) as { id: string };

    const resp = await fetchJson(`${base}/meals/${id}`);
    const meal: Meal | null = resp?.data?.meal ?? null;

    // fetch reviews for this meal
    const reviewsResp = await fetchJson(`${base}/reviews/meal/${id}`);
    const reviewsData = reviewsResp?.data ?? reviewsResp ?? null;
    const reviews: any[] = reviewsData?.reviews ?? [];
    const averageRating: number = reviewsData?.averageRating ?? 0;
    const totalRatings: number = reviewsData?.totalRatings ?? reviews.length;

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
                        <div>

                            <AddToCartButton mealId={meal.id} providerId={meal.provider?.id ?? null} name={meal.name} price={meal.price} image={meal.image} />
                        </div>
                        {/* Reviews */}
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-2">Reviews</h3>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="text-2xl font-bold">{averageRating > 0 ? averageRating : '—'}</div>
                                <div className="text-sm text-slate-500">{totalRatings} rating{totalRatings !== 1 ? 's' : ''}</div>
                            </div>

                            {reviews.length === 0 ? (
                                <div className="text-sm text-slate-600">No reviews yet. Be the first to review this meal after delivery.</div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((r: any) => (
                                        <div key={r.id} className="p-4 bg-white border rounded">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                                                    {r.user?.avatar ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={r.user.avatar} alt={r.user.name} className="object-cover w-full h-full" />
                                                    ) : (
                                                        <div className="text-sm text-slate-500">{r.user?.name ? r.user.name.charAt(0) : '?'}</div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="font-medium">{r.user?.name ?? 'Anonymous'}</div>
                                                        <div className="text-sm text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                    <div className="mt-2 text-sm text-slate-700">{r.comment}</div>
                                                    <div className="mt-2 text-sm text-amber-600">Rating: {r.rating}★</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
