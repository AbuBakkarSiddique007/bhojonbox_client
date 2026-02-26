"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function MealsFilters({ categories = [] }: { categories?: { id: string; name: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    q: searchParams.get("q") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    category: searchParams.get("category") ?? "",
  });

  const apply = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('limit', '10');
    if (filters.q) params.set('q', filters.q);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.category) params.set('category', filters.category);
    router.push(`/meals?${params.toString()}`);
  };

  const reset = () => {
    setFilters({ q: '', minPrice: '', maxPrice: '', category: '' });
    router.push('/meals');
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
        <button type="button" onClick={reset} className="text-sm text-slate-500 hover:text-slate-700">Reset</button>
      </div>

      <form onSubmit={apply} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Search</label>
          <input value={filters.q} onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))} placeholder="Search meals or description" className="w-full px-3 py-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Min price</label>
            <input value={filters.minPrice} onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))} placeholder="0" type="number" className="w-full px-3 py-2 border rounded-md bg-white text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Max price</label>
            <input value={filters.maxPrice} onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))} placeholder="1000" type="number" className="w-full px-3 py-2 border rounded-md bg-white text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
          <select value={filters.category} onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-white text-sm">
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="pt-1">
          <button type="submit" className="w-full px-4 py-2 bg-amber-600 text-white rounded-md shadow-sm hover:bg-amber-700">Apply filters</button>
        </div>
      </form>
    </div>
  );
}
