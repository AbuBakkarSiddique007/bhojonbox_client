import HeroBanner from "@/components/home/HeroBanner";
import FeaturedMeals from "@/components/home/FeaturedMeals";
import ProvidersList from "@/components/home/ProvidersList";
import HowItWorks from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <main>
      <HeroBanner />

      <FeaturedMeals limit={6} />

      <HowItWorks />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <ProvidersList limit={6} />
      </section>
    </main>
  );
}