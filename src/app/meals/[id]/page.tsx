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

    const reviewsResp = await fetchJson(`${base}/reviews/meal/${id}`);
    const reviewsData = reviewsResp?.data ?? reviewsResp ?? null;
    type Review = { id: string; rating: number; comment?: string; createdAt: string; user?: { name?: string; avatar?: string } };
    const reviews: Review[] = reviewsData?.reviews ?? [];
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
        <main className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 mb-20 animate-in fade-in duration-500">
            <div className="mb-8 flex items-center justify-between">
                <BackButton />
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 brand">The BhojonBox · Gourmet Series</div>
            </div>
            
            <div className="bg-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-border shadow-primary/5 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 min-h-[500px]">
                    <div className="lg:col-span-2 relative group overflow-hidden bg-muted/20">
                        {meal.image ? (
                            <img src={meal.image} alt={meal.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000" />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 opacity-30 italic">
                               <div className="text-6xl">🍽️</div>
                               <div className="font-bold tracking-widest uppercase text-xs">Awaiting Masterpiece</div>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                             <span className="text-white text-xs font-black tracking-widest uppercase">Captured by BhojonBox Enthusiasts</span>
                        </div>
                    </div>

                    <div className="lg:col-span-3 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                    {meal.category?.name ?? 'Global Selection'}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-foreground brand leading-tight">{meal.name}</h1>
                            </div>
                            <div className="bg-primary/5 p-4 rounded-3xl border border-primary/10 min-w-[140px] text-center">
                                <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 opacity-60">Gourmet Price</div>
                                <div className="text-3xl font-black text-foreground brand">৳ {meal.price}</div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full"></div>
                            <p className="text-lg text-muted-foreground leading-relaxed italic pr-4 max-w-2xl">
                                {meal.description || "Indulge in a carefully crafted culinary experience. Every ingredient is selected with passion by our gourmet providers to ensure a symphony of flavors."}
                            </p>
                        </div>

                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Link href={providerDetails ? `/providers/${providerDetails.id}` : (meal.provider ? `/providers/${meal.provider.id}` : '#')} className="group p-5 bg-muted/30 hover:bg-muted/50 rounded-3xl border border-border/50 transition-all flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-card flex items-center justify-center border border-border shadow-sm group-hover:scale-105 transition-transform">
                                    {providerDetails?.logo ? (
                                        <img src={providerDetails.logo} alt={providerDetails.storeName} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="text-2xl">👨‍🍳</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-black text-muted-foreground/60 uppercase tracking-tighter mb-1">Crafted By</div>
                                    <div className="font-bold text-foreground brand truncate">
                                        {providerDetails?.storeName || meal.provider?.storeName || 'Expert Chef'}
                                    </div>
                                </div>
                                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">➔</span>
                            </Link>

                            <div className="p-5 bg-muted/30 rounded-3xl border border-border/50 flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-black text-muted-foreground/60 uppercase tracking-tighter mb-1">Status</div>
                                    <div className={`text-sm font-black uppercase tracking-widest ${meal.isAvailable ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                        {meal.isAvailable ? 'Freshly Ready' : 'Fully Booked'}
                                    </div>
                                </div>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-inner ${meal.isAvailable ? 'bg-emerald-500/10' : 'bg-muted'}`}>
                                    {meal.isAvailable ? '🟢' : '⚪'}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col md:flex-row items-center gap-6">
                            <AddToCartButton mealId={meal.id} providerId={meal.provider?.id ?? null} name={meal.name} price={meal.price} image={meal.image} />
                            <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Curated Since {meal.createdAt ? new Date(meal.createdAt).getFullYear() : '2026'}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-28 animate-in slide-in-from-bottom-8 duration-700">
                <div className="mb-12">
                    <h2 className="text-3xl font-black text-foreground brand uppercase tracking-[0.2em]">Culinary Feedback</h2>
                    <div className="w-16 h-1 bg-primary mt-4 rounded-full"></div>
                    <div className="flex items-center gap-6 mt-8">
                        <div className="flex items-center gap-1.5 bg-primary/10 px-4 py-2 rounded-2xl border border-primary/10">
                            {[1,2,3,4,5].map(i => (
                                <span key={i} className={`text-base ${i <= averageRating ? 'text-primary' : 'text-primary/20'}`}>★</span>
                            ))}
                        </div>
                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-60">From {totalRatings} Verified Foodies</span>
                    </div>
                </div>

                {reviews.length === 0 ? (
                    <div className="bg-card/50 border-2 border-dashed border-border rounded-[2rem] p-16 text-center">
                        <div className="text-4xl mb-4 opacity-20 filter grayscale">✨</div>
                        <p className="text-muted-foreground italic font-medium">Be the first to share your gastronomic journey with this dish.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {reviews.map((r) => (
                            <div key={r.id} className="group bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-muted overflow-hidden flex items-center justify-center border border-border shadow-inner">
                                        {r.user?.avatar ? (
                                            <img src={r.user.avatar} alt={r.user.name} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="text-xl font-bold text-muted-foreground/40">{r.user?.name ? r.user.name.charAt(0) : '?'}</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="font-bold text-foreground brand">{r.user?.name ?? 'Anonymous'}</div>
                                            <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div className="flex items-center gap-1 mt-1 text-xs text-primary">
                                            {Array.from({ length: r.rating }).map((_, i) => <span key={i}>★</span>)}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed italic text-sm">"{r.comment}"</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
