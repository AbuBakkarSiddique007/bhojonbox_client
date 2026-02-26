import HeroBanner from "@/components/home/HeroBanner";
import FeaturedMeals from "@/components/home/FeaturedMeals";
import ProvidersList from "@/components/home/ProvidersList";
import HowItWorks from "@/components/home/HowItWorks";
import WhyBhojonbox from "@/components/home/WhyBhojonbox";

export default function HomePage() {
  return (
    <main>
      <HeroBanner />

      <FeaturedMeals limit={6} />

      <HowItWorks />

      <WhyBhojonbox />

      <ProvidersList limit={6} />
    </main>
  );
}