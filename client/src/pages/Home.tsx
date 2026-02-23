/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Page: Home / Landing Page for GlobalPulse
 * Sections: Ticker → Navbar → Hero → Trending Categories → Rankings → Broadcasters Room → Features → Pricing → CTA → Footer
 */
import TickerBar from "@/components/TickerBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrendingCategories from "@/components/TrendingCategories";
import RankingsSection from "@/components/RankingsSection";
import BroadcastersRoom from "@/components/BroadcastersRoom";
import FeaturesGrid from "@/components/FeaturesGrid";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import OGMeta from "@/components/OGMeta";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <OGMeta />
      <TickerBar />
      <Navbar />
      <HeroSection />
      <TrendingCategories />
      <RankingsSection />
      <BroadcastersRoom />
      <FeaturesGrid />
      <PricingSection />
      <CTASection />
      <Footer />
      <BackToTop />
    </div>
  );
}
