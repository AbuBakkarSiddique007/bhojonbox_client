import { Skeleton } from "@/components/ui/Skeleton";

export default function MealsLoading() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-6 text-center">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <aside className="md:col-span-3">
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </aside>

        <section className="md:col-span-9">
          <div className="mb-4">
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <Skeleton className="h-44 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
