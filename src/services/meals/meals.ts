import { API_BASE_URL } from "@/config";

export const getAllMeals = async (
  page = 1,
  limit = 10,
  filters?: { minPrice?: number; maxPrice?: number; category?: string; cuisine?: string; q?: string }
) => {
  const base = API_BASE_URL || "http://localhost:5000/api";
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (filters) {
    if (filters.minPrice != null) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice));
    // backend expects a `category` query param (which represents cuisine here)
    const cuisineVal = filters.cuisine ?? filters.category;
    if (cuisineVal) params.set('category', cuisineVal);
    // backend expects `search` as the query key for name searches
    if (filters.q) params.set('search', filters.q);
  }
  const url = `${base}/meals?${params.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    
    const all = await fetch(`${base}/meals`, { cache: 'no-store' }).then((r) => r.json()).catch(() => null);
    const list = all?.data?.meals ?? all?.meals ?? [];
    const total = list.length;
    const items = list.slice((page - 1) * limit, page * limit);
    const pages = Math.max(1, Math.ceil(total / limit));
    return { meals: items, pagination: { page, limit, total, pages } };
  }

  const json = await res.json();
  const meals = json?.data?.meals ?? json?.meals ?? [];
  const pagination = json?.data?.pagination ?? json?.pagination ?? null;
  return { meals, pagination };
};

export const getMyMeals = async () => {
  const res = await fetch(`${API_BASE_URL}/meals/provider/my-meals`, {
    credentials: "include",
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch my meals");
  return result;
};
