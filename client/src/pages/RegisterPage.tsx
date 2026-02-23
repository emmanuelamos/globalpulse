/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Page: Register / Sign Up — "Tune In. Join the Signal."
 * Style: Futuristic newsroom onboarding, not generic auth page
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Radio, Globe, Mail, Lock, User, Eye, EyeOff, ArrowRight, Signal, Shield, TrendingUp, BarChart3 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { toast } from "sonner";
import OGMeta from "@/components/OGMeta";

const PERKS = [
  { icon: TrendingUp, text: "Real-time trending news across 9 categories", color: "text-neon-cyan" },
  { icon: BarChart3, text: "Global rankings — country, state, city drill-down", color: "text-neon-magenta" },
  { icon: Radio, text: "AI-powered broadcasters with live call-in", color: "text-neon-amber" },
  { icon: Shield, text: "Personalized alerts for your tracked regions", color: "text-neon-green" },
];

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields required to activate your signal.");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters for secure transmission.");
      return;
    }
    setLoading(true);
    // Simulate registration — will be replaced with real auth
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    toast.success("Signal activated! Welcome to GlobalPulse.");
  };

  const handleSocialLogin = (provider: string) => {
    // For now, redirect to Manus OAuth which handles social logins
    window.location.href = getLoginUrl();
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-neon-cyan" />
          </div>
          <h2 className="text-2xl font-display font-bold text-neon-cyan mb-3">You're Already Tuned In!</h2>
          <p className="text-muted-foreground mb-6">Your signal is active. Head to the newsroom.</p>
          <Link href="/trends" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-display font-bold text-sm">
            <Zap className="w-4 h-4" />
            Enter the Pulse
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <OGMeta title="Join GlobalPulse" description="Activate your signal. Join the world's first AI-powered trending news platform with real-time rankings across every country." />
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left panel — branding & perks */}
        <div className="hidden lg:flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-background via-neon-cyan/5 to-neon-magenta/5 p-12 xl:p-16">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-neon-cyan/10 blur-[100px]" />
            <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-neon-magenta/10 blur-[100px]" />
          </div>

          <div className="relative z-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-12">
              <img src="/icon-192x192.png" alt="GlobalPulse" className="w-10 h-10 rounded-lg" />
              <span className="font-display font-bold text-2xl">
                <span className="text-neon-cyan">Global</span>
                <span className="text-foreground">Pulse</span>
              </span>
            </Link>

            <h2 className="text-4xl xl:text-5xl font-display font-bold leading-tight mb-6">
              The World's{" "}
              <span className="text-neon-magenta text-glow-magenta">Newsroom</span>
              <br />
              Is Waiting for{" "}
              <span className="text-neon-cyan text-glow-cyan">You.</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-10 max-w-md">
              Join the signal. Get ranked trending news from every country, AI-powered summaries,
              live broadcasts with call-in, and rankings that go from global to your city block.
            </p>

            {/* Perks */}
            <div className="space-y-4">
              {PERKS.map((perk, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-8 h-8 rounded-lg bg-current/10 flex items-center justify-center ${perk.color}`}>
                    <perk.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-foreground/80">{perk.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Live stats */}
            <div className="mt-12 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="live-dot w-2 h-2 rounded-full bg-neon-cyan inline-block" />
                <span className="text-xs font-mono text-neon-cyan">47 COUNTRIES LIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="live-dot w-2 h-2 rounded-full bg-neon-magenta inline-block" />
                <span className="text-xs font-mono text-neon-magenta">12K+ TUNED IN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — registration form */}
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12 xl:p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto w-full"
          >
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <img src="/icon-192x192.png" alt="GlobalPulse" className="w-9 h-9 rounded-lg" />
              <span className="font-display font-bold text-xl">
                <span className="text-neon-cyan">Global</span>
                <span className="text-foreground">Pulse</span>
              </span>
            </div>

            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-display font-bold mb-4">
                <Signal className="w-3 h-3" />
                ACTIVATE YOUR SIGNAL
              </div>
              <h1 className="text-3xl font-display font-bold mb-2">Join the Broadcast</h1>
              <p className="text-muted-foreground text-sm">
                Create your account and tune into the world's trending pulse.
              </p>
            </div>

            {/* Social login buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialLogin("google")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-secondary/50 border border-border/30 text-foreground font-display font-medium text-sm hover:border-neon-cyan/30 hover:bg-secondary/80 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => handleSocialLogin("apple")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-secondary/50 border border-border/30 text-foreground font-display font-medium text-sm hover:border-neon-cyan/30 hover:bg-secondary/80 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continue with Apple
              </button>

              <button
                onClick={() => handleSocialLogin("x")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-secondary/50 border border-border/30 text-foreground font-display font-medium text-sm hover:border-neon-cyan/30 hover:bg-secondary/80 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Continue with X
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-border/30" />
              <span className="text-xs font-mono text-muted-foreground tracking-wider">OR REGISTER WITH EMAIL</span>
              <div className="flex-1 h-px bg-border/30" />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-muted-foreground tracking-wider block mb-2">
                  CALLSIGN
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Your display name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/50 border border-border/30 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 font-body transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-muted-foreground tracking-wider block mb-2">
                  FREQUENCY
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/50 border border-border/30 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 font-body transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-muted-foreground tracking-wider block mb-2">
                  SECURE KEY
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-secondary/50 border border-border/30 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 font-body transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-display font-bold text-sm hover:shadow-[0_0_30px_oklch(0.85_0.18_195/0.4)] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Activating Signal...
                  </>
                ) : (
                  <>
                    Activate My Signal
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already tuned in?{" "}
              <a
                href={getLoginUrl()}
                className="text-neon-cyan hover:text-neon-cyan/80 font-display font-bold transition-colors"
              >
                Log in to your signal
              </a>
            </p>

            {/* Terms */}
            <p className="text-center text-[10px] text-muted-foreground/60 mt-4">
              By joining, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-foreground transition-colors">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
