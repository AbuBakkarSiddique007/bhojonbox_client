import { Skeleton } from "@/components/ui/Skeleton";

export default function ProvidersLoading() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8 text-center">
        <Skeleton className="h-10 w-64 mx-auto mb-2" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <Skeleton className="h-44 w-full" />
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="pt-2 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
