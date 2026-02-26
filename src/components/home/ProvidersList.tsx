"use client";

import { useEffect, useState } from "react";
import { getAllProviders } from "@/services/provider";
import Link from "next/link";

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
};

export default function ProvidersList({
  limit = 6,
  title = "Popular Providers",
  description = "Browse top-rated providers in your area.",
}: {
  limit?: number;
  title?: string;
  description?: string;
}) {
  const [providers, setProviders] = useState<Provider[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getAllProviders()
      .then((list) => {
        if (!mounted) return;
        setProviders(list.slice(0, limit));
      })
      .catch((e) => {
        if (!mounted) return;
        setErr(String(e.message || e));
      });
    return () => {
      mounted = false;
    };
  }, [limit]);

  if (err) return <div className="text-red-500">Error: {err}</div>;
  if (!providers) return <div className="text-sm text-muted-foreground">Loading providers…</div>;

  if (providers.length === 0) return <div className="text-sm text-muted-foreground">No providers found.</div>;

  return (
    <section>
      <div className="mb-8">
        <h3 className="text-4xl sm:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-400">
          {title}
        </h3>
        <p className="text-base text-slate-600 max-w-2xl">{description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.map((p) => (
        <Link
          key={p.id}
          href={`/providers/${p.id}`}
          className="block bg-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 overflow-hidden border border-gray-200"
        >
          <div className="h-44 w-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center overflow-hidden">
            {p.logo ? (
                
              <img src={p.logo} alt={p.storeName} className="object-cover h-full w-full" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-300">
                <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-lg leading-tight text-slate-900">{p.storeName || "Unnamed"}</h4>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.isOpen ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
                {p.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-slate-600">{p.cuisine || "Various cuisines"}</span>
              {p.cuisine && <span className="ml-2 text-xs px-2 py-0.5 bg-indigo-50 rounded-full text-indigo-700">{p.cuisine.split(',')[0]}</span>}
            </div>
            <p className="text-sm text-slate-600 mt-3 line-clamp-2">{p.description || "No description"}</p>
            <div className="mt-4 text-sm text-slate-600 flex flex-col gap-1">
              <div className="font-medium text-slate-800">{p.user?.name || ''}</div>
              <div className="text-sm text-slate-500">{p.address || ''} {p.phone ? `· ${p.phone}` : ''}</div>
            </div>
          </div>
        </Link>
      ))}
      </div>
    </section>
  );
}
