/**
 * Shared layout wrapper for inner app pages.
 * Includes the Navbar and Footer with consistent styling.
 */
import Navbar from "./Navbar";
import Footer from "./Footer";
import TickerBar from "./TickerBar";

interface AppLayoutProps {
  children: React.ReactNode;
  showTicker?: boolean;
}

export default function AppLayout({ children, showTicker = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {showTicker && <TickerBar />}
      <Navbar />
      <main className="pt-4 pb-16">{children}</main>
      <Footer />
    </div>
  );
}
