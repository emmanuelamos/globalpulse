import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import CookieConsent from "./components/CookieConsent";
import OnboardingModal from "./components/OnboardingModal";
import Home from "./pages/Home";
import TrendsFeed from "./pages/TrendsFeed";
import BusinessPage from "./pages/BusinessPage";
import SportsPage from "./pages/SportsPage";
import RankingsPage from "./pages/RankingsPage";
import BroadcastersPage from "./pages/BroadcastersPage";
import SearchPage from "./pages/SearchPage";
import StoryDetail from "./pages/StoryDetail";
import ProfilePage from "./pages/ProfilePage";
import ContactPage from "./pages/ContactPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import FAQPage from "./pages/FAQPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/trends"} component={TrendsFeed} />
      <Route path={"/trends/:category"} component={TrendsFeed} />
      <Route path={"/business"} component={BusinessPage} />
      <Route path={"/sports"} component={SportsPage} />
      <Route path={"/rankings"} component={RankingsPage} />
      <Route path={"/broadcasters"} component={BroadcastersPage} />
      <Route path={"/search"} component={SearchPage} />
      <Route path={"/story/:id"} component={StoryDetail} />
      <Route path={"/profile"} component={ProfilePage} />
      <Route path={"/contact"} component={ContactPage} />
      <Route path={"/register"} component={RegisterPage} />
      <Route path={"/about"} component={AboutPage} />
      <Route path={"/faq"} component={FAQPage} />
      <Route path={"/privacy"} component={PrivacyPage} />
      <Route path={"/terms"} component={TermsPage} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <CookieConsent />
            <OnboardingModal />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
