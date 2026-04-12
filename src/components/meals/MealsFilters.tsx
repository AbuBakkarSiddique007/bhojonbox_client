"use client";

import { useEffect, useRef, useState } from "react";
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

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowSuggestions(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (filters.q.trim().length > 1) {
        setIsSearching(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://bhojonbox-server.onrender.com/api"}/ai/suggestions?q=${encodeURIComponent(filters.q)}`);
          const json = await res.json();
          if (json.success) {
             setSuggestions(json.data);
             setShowSuggestions(true);
          }
        } catch (err) {
          console.error("Failed to fetch suggestions:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400); // 400ms debounce for free tier rate limiting

    return () => clearTimeout(timer);
  }, [filters.q]);

  const apply = (e?: React.FormEvent, queryOverride?: string) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('limit', '10');
    const query = queryOverride !== undefined ? queryOverride : filters.q;
    if (query) params.set('q', query);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.category) params.set('category', filters.category);
    setShowSuggestions(false);
    router.push(`/meals?${params.toString()}`);
  };

  const reset = () => {
    setFilters({ q: '', minPrice: '', maxPrice: '', category: '' });
    setShowSuggestions(false);
    router.push('/meals');
  };

  return (
    <div className="bg-card border border-border rounded-[2rem] shadow-xl p-8 relative overflow-visible transition-all duration-500">
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-0"></div>
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-xl font-black text-foreground brand uppercase tracking-wider">Filters</h3>
        <button type="button" onClick={reset} className="text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em]">Reset All</button>
      </div>

      <form onSubmit={(e) => apply(e)} className="space-y-6 relative z-10">
        <div className="relative" ref={dropdownRef}>
          <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 ml-1">Search Culinary Items</label>
          <div className="relative">
            <input 
              value={filters.q} 
              onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))} 
              onFocus={() => filters.q.length > 1 && setShowSuggestions(true)}
              placeholder="Search meals or description" 
              className="w-full px-5 py-4 border border-border rounded-2xl bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground/30 font-medium pr-10" 
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-card/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-2 border-b border-border/50 text-[8px] font-black text-muted-foreground uppercase tracking-widest px-4 py-2 bg-muted/20">
                AI Suggested Recommendations
              </div>
              <ul className="max-h-60 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => {
                        setFilters(f => ({ ...f, q: s }));
                        apply(undefined, s);
                      }}
                      className="w-full text-left px-5 py-3 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-between group"
                    >
                      <span>{s}</span>
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] transition-opacity">➔</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
