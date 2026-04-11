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
    <div className="bg-card border border-border rounded-[2rem] shadow-xl p-8 relative overflow-hidden transition-all duration-500">
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-0"></div>
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-xl font-black text-foreground brand uppercase tracking-wider">Filters</h3>
        <button type="button" onClick={reset} className="text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em]">Reset All</button>
      </div>

      <form onSubmit={apply} className="space-y-6 relative z-10">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Search Culinary Items</label>
          <input 
            value={filters.q} 
            onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))} 
            placeholder="Search meals or description" 
            className="w-full px-5 py-4 border border-border rounded-2xl bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground/30 font-medium" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Min Price</label>
            <input 
              value={filters.minPrice} 
              onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))} 
              placeholder="0" 
              type="number" 
              className="w-full px-5 py-4 border border-border rounded-2xl bg-muted/30 text-sm font-medium focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Max Price</label>
            <input 
              value={filters.maxPrice} 
              onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))} 
              placeholder="1000" 
              type="number" 
              className="w-full px-5 py-4 border border-border rounded-2xl bg-muted/30 text-sm font-medium focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30" 
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Meal Category</label>
          <select 
            value={filters.category} 
            onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))} 
            className="w-full px-5 py-4 border border-border rounded-2xl bg-card text-foreground text-sm font-medium focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-card text-foreground">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-card text-foreground">{c.name}</option>
            ))}
          </select>
        </div>

        <div className="pt-4">
          <button type="submit" className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Apply Refinements</button>
        </div>
      </form>
    </div>
  );
}
