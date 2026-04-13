"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/services/categories";

type Category = {
  id: string;
  name: string;
  image?: string;
};

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await getCategories();
        const data = res?.data?.categories ?? res?.categories ?? [];
        setCategories(data.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCats();
  }, []);

  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="py-24 bg-background transition-colors duration-700 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary mb-4">Curated Cuisines</p>
          <h2 className="text-3xl md:text-5xl font-black text-foreground brand uppercase tracking-tight">
            Browse by <span className="text-primary italic">Inspiration</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-6 mb-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-[2.5rem]" />
            ))
          ) : (
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/meals?category=${cat.id}`}
                className="group relative h-64 rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-primary/20 transition-all duration-500 border border-border"
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 brightness-[0.7] group-hover:brightness-[0.4]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                )}

                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h4 className="text-2xl font-black text-white brand tracking-wide mb-2 drop-shadow-lg">{cat.name}</h4>
                    <div className="w-10 h-1 bg-primary rounded-full mb-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    Explore Menu ➔
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
