import HeroBanner from "@/components/home/HeroBanner";
import ProvidersList from "@/components/home/ProvidersList";

export default function HomePage() {
  return (
    <main>
      <HeroBanner />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <ProvidersList limit={6} />
      </section>
    </main>
  );
}