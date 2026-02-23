/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Component: Footer with links, branding, and social
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";

const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { label: "Trends", href: "/trends" },
      { label: "Rankings", href: "/rankings" },
      { label: "Broadcasters", href: "/broadcasters" },
      { label: "Business", href: "/business" },
      { label: "Sports", href: "/sports" },
      { label: "Search", href: "/search" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Crime", href: "/trends/crime" },
      { label: "Entertainment", href: "/trends/entertainment" },
      { label: "Celebrity", href: "/trends/celebrity" },
      { label: "Gossip", href: "/trends/gossip" },
      { label: "Weather", href: "/trends/weather" },
      { label: "Funny", href: "/trends/funny" },
      { label: "Trending", href: "/trends/trending" },
      { label: "Business", href: "/trends/business" },
      { label: "Sports", href: "/trends/sports" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Register", href: "/register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/privacy" },
    ],
  },
];

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-neon-cyan/10 bg-secondary/50">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/icon-192x192.png"
                alt="GlobalPulse"
                className="w-8 h-8 rounded-lg"
              />
              <span className="font-display font-bold text-lg">
                <span className="text-neon-cyan">Global</span>Pulse
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-bold text-sm text-foreground mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neon-cyan/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">
            &copy; 2026 GlobalPulse. {t("footer.rights")}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Powered by AI. Built for the world.
            </span>
            <span className="flex items-center gap-1 text-xs text-neon-cyan">
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-neon-cyan inline-block" />
              Systems Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
