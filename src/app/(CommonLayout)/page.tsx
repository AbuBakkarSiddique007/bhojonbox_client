import HeroBanner from "@/components/home/HeroBanner";
import FeaturedMeals from "@/components/home/FeaturedMeals";
import ProvidersList from "@/components/home/ProvidersList";
import HowItWorks from "@/components/home/HowItWorks";
import WhyBhojonbox from "@/components/home/WhyBhojonbox";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import ReviewsSection from "@/components/home/ReviewsSection";
import StatsSection from "@/components/home/StatsSection";
import FaqSection from "@/components/home/FaqSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <main>
      <HeroBanner />

      <CategoryShowcase />

      <StatsSection />

      <FeaturedMeals limit={6} />

      <HowItWorks />

      <FaqSection />

      <WhyBhojonbox />

      <NewsletterSection />

      <ReviewsSection />

      <ProvidersList limit={6} />
    </main>
  );
}