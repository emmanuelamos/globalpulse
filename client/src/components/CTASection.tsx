/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Component: Final CTA section — big bold call to action with email capture
 * Now wired to tRPC backend to save waitlist emails to database
 */
import { motion } from "framer-motion";
import { useState } from "react";
import { Zap, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const { t } = useLanguage();

  const waitlistMutation = trpc.waitlist.join.useMutation({
    onSuccess: () => {
      toast.success("You're on the list! We'll notify you at launch.");
      setEmail("");
    },
    onError: (err) => {
      if (err.message.includes("already")) {
        toast.info("You're already on the waitlist! We'll be in touch.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      setEmail("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      waitlistMutation.mutate({ email, source: "landing_cta" });
    }
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-cyan/5 blur-[120px]" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-neon-magenta/5 blur-[100px]" />

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-amber/10 border border-neon-amber/30 mb-8">
            <span className="live-dot w-2 h-2 rounded-full bg-neon-amber inline-block" />
            <span className="text-neon-amber font-display text-xs font-bold tracking-wider">LAUNCHING SOON — 47 COUNTRIES</span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] mb-6">
            {t("cta.title1").replace(".", "")}{" "}
            <span className="text-neon-cyan text-glow-cyan">
              {t("cta.title1").includes(".") ? "." : ""}
            </span>
            <br />
            {t("cta.title2").replace("?", "")}{" "}
            <span className="text-neon-magenta text-glow-magenta">?</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {t("cta.subtitle")}
          </p>

          {/* Email capture */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("cta.placeholder")}
              required
              className="flex-1 px-5 py-4 rounded-xl bg-secondary/80 border border-neon-cyan/20 text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/30"
            />
            <button
              type="submit"
              disabled={waitlistMutation.isPending}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-display font-bold text-base hover:shadow-[0_0_40px_oklch(0.85_0.18_195/0.5)] transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {waitlistMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
              {waitlistMutation.isPending ? "Joining..." : t("cta.joinWaitlist")}
              {!waitlistMutation.isPending && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="shimmer-text font-mono font-bold text-lg">127,843</span>
              on waitlist
            </span>
            <span className="text-neon-cyan/20">|</span>
            <span>{t("cta.noSpam")}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
