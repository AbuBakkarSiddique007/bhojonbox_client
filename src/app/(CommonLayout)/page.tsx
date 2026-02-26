import HeroBanner from "@/components/home/HeroBanner";

export default function HomePage() {
  return (
    <main>
      <HeroBanner />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-2xl font-semibold mb-4">Popular Providers</h3>
        <p className="text-muted-foreground">Browse top-rated providers in your area (placeholder).</p>
      </section>
    </main>
  );
}