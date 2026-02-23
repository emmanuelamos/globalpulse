/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Component: Pricing section — Free tier, Premium sub, and call-in pricing
 * Wired to Stripe checkout for Premium ($4/mo) and Call-In ($0.99)
 */
import { motion } from "framer-motion";
import { Check, Zap, Crown, Phone, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const PLANS = [
  {
    id: "free" as const,
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get hooked on the pulse",
    color: "border-neon-cyan/20",
    buttonClass: "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/20",
    icon: Zap,
    buttonLabel: "Get Started",
    features: [
      "Homepage trends carousel",
      "Top 5 global rankings",
      "3 daily searches",
      "Text chat in broadcasts",
      "Basic notifications",
      "Ad-supported",
    ],
  },
  {
    id: "premium" as const,
    name: "Premium",
    price: "$4",
    period: "/month",
    description: "Unlimited access to everything",
    color: "border-neon-magenta/40 glow-magenta",
    buttonClass: "bg-gradient-to-r from-neon-magenta to-neon-amber text-white hover:shadow-[0_0_30px_oklch(0.7_0.25_350/0.4)]",
    icon: Crown,
    popular: true,
    buttonLabel: "Go Premium",
    features: [
      "Unlimited searches & deep dives",
      "Full top 10 rankings (all categories)",
      "Voice summaries — hear trends read aloud",
      "Custom alerts (e.g., 'Barrie crime changes')",
      "Ad-free experience",
      "Yearly rankings & historical data",
      "Priority call-in queue",
      "Country-specific language rooms",
    ],
  },
  {
    id: "callin" as const,
    name: "Call-In",
    price: "$0.99",
    period: "/call",
    description: "Go live with the AI anchor",
    color: "border-neon-amber/20",
    buttonClass: "bg-neon-amber/10 text-neon-amber border border-neon-amber/30 hover:bg-neon-amber/20",
    icon: Phone,
    buttonLabel: "Call In Now",
    features: [
      "45-second live call-in",
      "Talk directly to AI anchor",
      "Your voice broadcast to all listeners",
      "Session recap with your take featured",
      "$1.99 for 60-sec + priority queue",
      "Refund if not selected",
    ],
  },
];

export default function PricingSection() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const premiumCheckout = trpc.payments.createPremiumCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.info("Redirecting to checkout...");
        window.open(data.url, "_blank");
      }
    },
    onError: () => {
      toast.error("Could not create checkout session. Please try again.");
    },
  });

  const callInCheckout = trpc.payments.createCallInCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.info("Redirecting to checkout...");
        window.open(data.url, "_blank");
      }
    },
    onError: () => {
      toast.error("Could not create checkout session. Please try again.");
    },
  });

  const handlePlanClick = (planId: string) => {
    if (planId === "free") {
      if (!isAuthenticated) {
        window.location.href = getLoginUrl();
      } else {
        toast.success("You're already on the free plan!");
      }
      return;
    }

    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    const origin = window.location.origin;

    if (planId === "premium") {
      premiumCheckout.mutate({ origin });
    } else if (planId === "callin") {
      callInCheckout.mutate({ origin, room: "global" });
    }
  };

  const isLoading = (planId: string) => {
    if (planId === "premium") return premiumCheckout.isPending;
    if (planId === "callin") return callInCheckout.isPending;
    return false;
  };

  return (
    <section className="relative py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-neon-green font-display text-sm font-bold tracking-widest uppercase mb-3 block">
            {t("pricing.label")}
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight">
            {t("pricing.title1")}{" "}
            <span className="text-neon-magenta text-glow-magenta">{t("pricing.title2")}</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-lg">
            Everyone gets the pulse. Premium unlocks the full experience. Call-ins let you be part of the broadcast.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative glass-card rounded-2xl p-7 border ${plan.color} transition-all hover:scale-[1.02] hover:-translate-y-1`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-neon-magenta to-neon-amber text-white text-xs font-display font-bold">
                  {t("pricing.mostPopular")}
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 flex items-center justify-center">
                  <plan.icon className="w-5 h-5 text-neon-cyan" />
                </div>
                <span className="font-display font-bold text-lg">{plan.name}</span>
              </div>
              <div className="mb-4">
                <span className="font-display font-bold text-4xl">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
              <button
                onClick={() => handlePlanClick(plan.id)}
                disabled={isLoading(plan.id)}
                className={`w-full py-3 rounded-xl font-display font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 ${plan.buttonClass}`}
              >
                {isLoading(plan.id) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                {plan.buttonLabel}
              </button>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-neon-green shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Test mode notice */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Use test card <span className="font-mono">4242 4242 4242 4242</span> for testing payments.
        </p>
      </div>
    </section>
  );
}
