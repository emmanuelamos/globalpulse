/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Page: About — "The Signal Behind the Pulse"
 * Style: Newsroom origin story, mission-driven, futuristic
 */
import { motion } from "framer-motion";
import { Globe, Radio, BarChart3, Zap, Users, TrendingUp, Shield, Cpu, Target, Rocket, Signal, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import OGMeta from "@/components/OGMeta";

const STATS = [
  { value: "47+", label: "Countries Ranked", icon: Globe, color: "text-neon-cyan" },
  { value: "8", label: "News Categories", icon: BarChart3, color: "text-neon-magenta" },
  { value: "24/7", label: "Live Broadcasts", icon: Radio, color: "text-neon-amber" },
  { value: "100K+", label: "Daily Rankings", icon: TrendingUp, color: "text-neon-green" },
];

const TIMELINE = [
  {
    phase: "PHASE 01",
    title: "The Signal Ignites",
    desc: "GlobalPulse was born from a simple frustration: news was everywhere, but nobody was ranking it. Nobody was telling you what's ACTUALLY trending in Lagos vs. Tokyo vs. Toronto — in real time, ranked, with AI-powered analysis. We decided to change that.",
    color: "border-neon-cyan",
    dot: "bg-neon-cyan",
  },
  {
    phase: "PHASE 02",
    title: "Building the Newsroom of Tomorrow",
    desc: "We assembled a team of data engineers, AI researchers, and broadcast innovators. Built ranking algorithms that process millions of signals per hour. Created AI anchors that don't just read news — they roast it, debate it, and make you feel it.",
    color: "border-neon-magenta",
    dot: "bg-neon-magenta",
  },
  {
    phase: "PHASE 03",
    title: "Going Global",
    desc: "From one country to 47+. From one category to eight. From text summaries to live AI broadcasts with real call-ins. GlobalPulse isn't just an app — it's a movement. The world's first ranked, AI-powered, interactive newsroom.",
    color: "border-neon-amber",
    dot: "bg-neon-amber",
  },
  {
    phase: "PHASE 04",
    title: "The Future is LIVE",
    desc: "We're scaling to every country on Earth. Adding more languages, more categories, more voices. Building the infrastructure for millions of simultaneous listeners. The pulse never stops — and neither do we.",
    color: "border-neon-green",
    dot: "bg-neon-green",
  },
];

const VALUES = [
  {
    icon: Target,
    title: "Ranked, Not Random",
    desc: "Every story, every country, every city — ranked by what's actually trending. No algorithms hiding the truth. Pure signal, zero noise.",
    color: "text-neon-cyan",
    border: "border-neon-cyan/30",
  },
  {
    icon: Cpu,
    title: "AI-First, Human-Verified",
    desc: "Our AI doesn't replace journalism — it supercharges it. Summaries in seconds, rankings in real time, broadcasts that never sleep.",
    color: "text-neon-magenta",
    border: "border-neon-magenta/30",
  },
  {
    icon: Globe,
    title: "Every Country Matters",
    desc: "From New York to Nairobi, from São Paulo to Seoul. We don't prioritize Western news. Every country gets its own rankings, its own broadcast, its own voice.",
    color: "text-neon-amber",
    border: "border-neon-amber/30",
  },
  {
    icon: Users,
    title: "The People's Newsroom",
    desc: "Call in. Comment. React. Vote. GlobalPulse isn't a one-way broadcast — it's a conversation with the entire planet.",
    color: "text-neon-green",
    border: "border-neon-green/30",
  },
  {
    icon: Shield,
    title: "Transparent Rankings",
    desc: "Our ranking methodology is open. Every score, every metric, every data source — visible. Trust isn't given, it's earned through transparency.",
    color: "text-neon-cyan",
    border: "border-neon-cyan/30",
  },
  {
    icon: Rocket,
    title: "Built for Speed",
    desc: "News moves fast. We move faster. Real-time updates, instant rankings, live broadcasts — because yesterday's trending is today's old news.",
    color: "text-neon-magenta",
    border: "border-neon-magenta/30",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <OGMeta title="About GlobalPulse" description="The signal behind the pulse. Learn how GlobalPulse uses AI to rank trending news across every country, state, and city in real time." />
      <Navbar />

      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/5 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-neon-magenta/20 blur-[120px]" />
          <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-neon-cyan/20 blur-[120px]" />
        </div>
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-sm font-display font-bold mb-6">
              <Signal className="w-4 h-4" />
              THE SIGNAL BEHIND THE PULSE
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">
              We Didn't Build{" "}
              <span className="text-neon-cyan text-glow-cyan">Another</span>
              <br />
              News App. We Built{" "}
              <span className="text-neon-magenta text-glow-magenta">The</span>
              <br />
              <span className="text-neon-amber">Newsroom.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              GlobalPulse is the world's first AI-powered, ranked, interactive newsroom. We don't just tell you what happened —
              we tell you what's trending, where it's trending, and why the world can't stop talking about it.
              From crime to crypto, celebrity to climate — ranked in real time, broadcast live, open to everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 text-center border border-border/20"
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-3`} />
                <div className={`text-3xl font-display font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-xs font-mono text-muted-foreground tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-10 md:p-14 border border-neon-cyan/20 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-amber" />
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-neon-cyan" />
              <span className="font-mono text-xs text-neon-cyan tracking-widest">OUR MISSION</span>
            </div>
            <blockquote className="text-2xl md:text-3xl font-display font-bold leading-snug mb-6">
              "To give every person on Earth access to{" "}
              <span className="text-neon-cyan">ranked</span>,{" "}
              <span className="text-neon-magenta">real-time</span>,{" "}
              <span className="text-neon-amber">AI-powered</span>{" "}
              news — from their country, their city, their neighborhood — delivered through the most engaging broadcast experience ever built."
            </blockquote>
            <p className="text-muted-foreground">
              We believe news shouldn't be a passive scroll. It should be ranked, interactive, alive.
              You should know what's #1 in your city right now. You should be able to call in and debate it live.
              That's GlobalPulse.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-neon-magenta font-display text-sm font-bold tracking-widest uppercase mb-3 block">
              /// Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              From <span className="text-neon-cyan">Spark</span> to{" "}
              <span className="text-neon-magenta">Signal</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan via-neon-magenta to-neon-green" />

            <div className="space-y-10">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative pl-16"
                >
                  {/* Dot */}
                  <div className={`absolute left-4 top-1 w-4 h-4 rounded-full ${item.dot} ring-4 ring-background`} />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground block mb-1">
                    {item.phase}
                  </span>
                  <h3 className="text-xl font-display font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-neon-amber font-display text-sm font-bold tracking-widest uppercase mb-3 block">
              /// What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Our <span className="text-neon-amber">Core Frequencies</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VALUES.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`glass-card rounded-xl p-6 ${val.border} transition-all hover:scale-[1.02]`}
              >
                <val.icon className={`w-8 h-8 ${val.color} mb-4`} />
                <h3 className="font-display font-bold text-lg mb-2">{val.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-12 border border-neon-cyan/20 max-w-3xl mx-auto relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-magenta/5" />
            <div className="relative z-10">
              <Zap className="w-12 h-12 text-neon-cyan mx-auto mb-6" />
              <h2 className="text-3xl font-display font-bold mb-4">
                Ready to <span className="text-neon-magenta">Tune In</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                The world's newsroom is live. Trending stories ranked in real time. AI anchors broadcasting 24/7.
                Your city's pulse — one tap away.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/trends"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-display font-bold text-sm hover:shadow-[0_0_30px_oklch(0.85_0.18_195/0.4)] transition-all"
                >
                  <Zap className="w-4 h-4" />
                  Enter the Pulse
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-secondary/50 border border-border/30 text-foreground font-display font-bold text-sm hover:border-neon-cyan/30 transition-all"
                >
                  Contact HQ
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
