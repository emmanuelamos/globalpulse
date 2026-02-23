/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Page: FAQ — "Frequently Transmitted Questions"
 * Style: Broadcast-themed Q&A, futuristic newsroom
 */
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Signal, Zap, Radio, BarChart3, CreditCard, Globe, Shield, Headphones, HelpCircle, Send, MessageSquarePlus, Bug, Lightbulb, Mic, MessageCircle, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import OGMeta from "@/components/OGMeta";

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQ_CATEGORIES = [
  { id: "all", label: "All Signals", icon: Signal, color: "text-neon-cyan" },
  { id: "general", label: "General", icon: HelpCircle, color: "text-neon-cyan" },
  { id: "rankings", label: "Rankings", icon: BarChart3, color: "text-neon-magenta" },
  { id: "broadcast", label: "Broadcasts", icon: Radio, color: "text-neon-amber" },
  { id: "billing", label: "Billing", icon: CreditCard, color: "text-neon-green" },
];

const FAQS: FAQItem[] = [
  {
    category: "general",
    q: "What exactly is GlobalPulse?",
    a: "GlobalPulse is the world's first AI-powered, ranked, interactive newsroom. We aggregate trending news across 8 categories — Crime, Trending, Funny, Entertainment, Celebrity, Gossip, Weather, and Business — and rank them in real time by country, state, and city. Think of it as a live leaderboard for what the world is talking about right now, powered by AI anchors who broadcast 24/7 with personality, roasts, and live call-ins.",
  },
  {
    category: "general",
    q: "How is GlobalPulse different from regular news apps?",
    a: "Traditional news apps show you articles. We show you RANKINGS. What's #1 trending in Nigeria right now? Which country has the highest crime buzz this week? What's the funniest viral story globally? Every story is ranked, every country is compared, and you can drill down from global → country → state → city. Plus, our AI anchors broadcast the top stories live with commentary and roasts — and you can call in to join the conversation.",
  },
  {
    category: "general",
    q: "What categories does GlobalPulse cover?",
    a: "We currently cover 8 categories: Crime, Trending, Funny, Entertainment, Celebrity, Gossip, Weather, and Business. Each category has its own global rankings, country-level breakdowns, and AI-powered summaries. Business includes sub-categories like Stocks, Crypto, Trending Apps, Startups, and Products. We plan to add more categories as we grow.",
  },
  {
    category: "general",
    q: "Is GlobalPulse available in my country?",
    a: "GlobalPulse covers 47+ countries and growing. Our ranking system works globally — you can see how your country stacks up against others in every category. We also support 25+ languages, so you can read and listen in your preferred language. If your country isn't listed yet, it's coming soon — we're expanding rapidly.",
  },
  {
    category: "rankings",
    q: "How do the rankings work?",
    a: "Our AI processes millions of data signals per hour — news articles, social media trends, government data, crime reports, weather stations, market feeds, and more. Each story and topic gets a 'pulse score' based on volume, velocity, and engagement. Countries, states, and cities are then ranked by their aggregate pulse scores in each category. Rankings update in real time, so what's #1 at 9am might be #5 by noon.",
  },
  {
    category: "rankings",
    q: "Can I see rankings for my specific city?",
    a: "Absolutely. Our drill-down hierarchy goes: Global Top 10-20 → Click a country → State/Province Top 10 → Click a state → City Top 10. So you can see what's trending globally, then zoom all the way into your city. This is our core feature — no other news platform offers this level of geographic granularity.",
  },
  {
    category: "rankings",
    q: "How often are rankings updated?",
    a: "Rankings are updated in real time. Our AI continuously processes incoming data and recalculates pulse scores. Major shifts (like a breaking crime story or a stock market crash) can change rankings within minutes. The ticker bar at the top of the app shows live ranking changes as they happen.",
  },
  {
    category: "rankings",
    q: "What data sources power the rankings?",
    a: "We aggregate from hundreds of sources including major news APIs, social media trend data, government crime statistics, weather services, stock market feeds, and more. Our AI cross-references multiple sources to verify trends and calculate accurate pulse scores. We're transparent about our methodology — every ranking shows its data sources.",
  },
  {
    category: "broadcast",
    q: "Who are Marcus and Victoria?",
    a: "Marcus and Victoria are our AI-powered news anchors. Marcus brings an American broadcast style — bold, direct, with sharp commentary. Victoria brings a British perspective — witty, analytical, with dry humor. Together they host the GlobalPulse broadcast, covering the top trending stories with personality, debate, and yes — roasts. They're not your typical monotone news readers.",
  },
  {
    category: "broadcast",
    q: "Can I call in to the live broadcast?",
    a: "Yes! Premium subscribers and call-in pass holders can join the live broadcast queue. When it's your turn, you get to discuss the trending topic with our AI anchors. Each call-in costs $0.99 or is included with Premium. There are 100 global call-in slots per day plus 50 per country, so there's always a chance to get on air.",
  },
  {
    category: "broadcast",
    q: "Are there country-specific broadcasts?",
    a: "Yes! Each country has its own dedicated broadcast room with AI anchors who speak the local language. India gets Hindi-speaking anchors covering India's top trends. Nigeria gets anchors covering Nigerian news. France gets French-speaking anchors. Every country gets its own newsroom experience focused on what's trending locally.",
  },
  {
    category: "broadcast",
    q: "Can I watch past broadcasts?",
    a: "Premium subscribers can access past broadcasts for up to 48 hours after they air. You can also rewind live broadcasts if you join late. After 48 hours, broadcasts are automatically cleared to keep the focus on what's trending NOW. Free users can only watch live — no rewind, no archive.",
  },
  {
    category: "broadcast",
    q: "Are subtitles/closed captions available?",
    a: "Yes! You can toggle closed captions in any of our 25+ supported languages during live broadcasts. Whether the anchor is speaking English, Hindi, or French, you can read along in your preferred language in real time.",
  },
  {
    category: "billing",
    q: "Is GlobalPulse free?",
    a: "GlobalPulse has a generous free tier that includes access to all 8 categories, global and country rankings, AI-generated story summaries, live broadcast listening, and dark/light mode. Premium ($4/month) unlocks advanced features like city-level drill-downs, broadcast recording and rewind, past broadcast archive, priority call-in queue, and ad-free experience.",
  },
  {
    category: "billing",
    q: "How much does a call-in cost?",
    a: "Each call-in to the live broadcast costs $0.99. This gives you a slot in the queue to discuss trending topics with our AI anchors on air. Premium subscribers get discounted call-in rates and priority queue placement.",
  },
  {
    category: "billing",
    q: "Can I cancel my subscription anytime?",
    a: "Absolutely. No contracts, no hidden fees, no guilt trips. Cancel anytime from your profile settings. Your Premium access continues until the end of your current billing period. We believe in earning your subscription every single month.",
  },
  {
    category: "billing",
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, Mastercard, Amex) through our secure Stripe payment processing. More payment methods including mobile money and regional options are coming soon as we expand globally.",
  },
];

const FEEDBACK_TYPES = [
  { id: "bug_report" as const, label: "Bug Report", icon: Bug, color: "text-red-400", desc: "Something isn't working right" },
  { id: "feature_request" as const, label: "Feature Request", icon: Lightbulb, color: "text-neon-amber", desc: "I'd love to see this added" },
  { id: "segment_suggestion" as const, label: "Segment Suggestion", icon: Mic, color: "text-neon-magenta", desc: "New broadcast segment idea" },
  { id: "general" as const, label: "General Feedback", icon: MessageCircle, color: "text-neon-cyan", desc: "Anything else on your mind" },
];

function FeedbackForm() {
  const { user } = useAuth();
  const submitFeedback = trpc.feedback.submit.useMutation();
  const [selectedType, setSelectedType] = useState<typeof FEEDBACK_TYPES[number]["id"] | null>(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !message.trim()) return;
    try {
      await submitFeedback.mutateAsync({
        feedbackType: selectedType,
        message: message.trim(),
        email: !user ? email || undefined : undefined,
      });
      setSubmitted(true);
      setMessage("");
      setEmail("");
      setSelectedType(null);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error("Feedback submission failed:", err);
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-neon-cyan/20 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border/10 bg-neon-cyan/5">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquarePlus className="w-6 h-6 text-neon-cyan" />
          <h3 className="text-xl font-display font-bold">Feedback & Suggestions</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Help us improve GlobalPulse. Report bugs, request features, or suggest new broadcast segments.
        </p>
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-10 text-center"
        >
          <CheckCircle2 className="w-12 h-12 text-neon-green mx-auto mb-4" />
          <h4 className="text-lg font-display font-bold mb-2">Transmission Received!</h4>
          <p className="text-sm text-muted-foreground">Thanks for your feedback. Our team reviews every submission.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Feedback type selector */}
          <div>
            <label className="block text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">
              What kind of feedback?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FEEDBACK_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    selectedType === type.id
                      ? "border-neon-cyan/40 bg-neon-cyan/10"
                      : "border-border/20 bg-secondary/20 hover:border-neon-cyan/20"
                  }`}
                >
                  <type.icon className={`w-5 h-5 shrink-0 ${type.color}`} />
                  <div>
                    <div className="text-sm font-display font-bold">{type.label}</div>
                    <div className="text-xs text-muted-foreground">{type.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what's on your mind..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border/20 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-cyan/40 focus:ring-1 focus:ring-neon-cyan/20 resize-none"
              required
            />
          </div>

          {/* Email (only for non-logged-in users) */}
          {!user && (
            <div>
              <label className="block text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Email <span className="text-muted-foreground/50">(optional — for follow-up)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border/20 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-cyan/40 focus:ring-1 focus:ring-neon-cyan/20"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!selectedType || !message.trim() || submitFeedback.isPending}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-display font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_30px_oklch(0.85_0.18_195/0.3)] transition-all"
          >
            <Send className="w-4 h-4" />
            {submitFeedback.isPending ? "Transmitting..." : "Submit Feedback"}
          </button>

          {submitFeedback.isError && (
            <p className="text-xs text-red-400 text-center">Failed to submit. Please try again.</p>
          )}
        </form>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs = activeCategory === "all"
    ? FAQS
    : FAQS.filter((f) => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <OGMeta title="GlobalPulse FAQ" description="Frequently transmitted questions about GlobalPulse. Learn about rankings, AI broadcasts, premium features, and more." />
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/5 via-transparent to-transparent" />
        <div className="container relative text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-sm font-display font-bold mb-6">
              <Signal className="w-4 h-4" />
              INTEL CENTER
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
              Frequently{" "}
              <span className="text-neon-magenta text-glow-magenta">Transmitted</span>
              <br />
              Questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Everything you need to know about GlobalPulse — from how rankings work to call-in pricing.
              Can't find your answer? Hit our{" "}
              <Link href="/contact" className="text-neon-cyan hover:underline">transmission line</Link>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category filter */}
      <section className="py-4 sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-border/10">
        <div className="container">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setOpenIndex(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan"
                    : "bg-secondary/30 border border-border/20 text-muted-foreground hover:text-foreground hover:border-neon-cyan/20"
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ items */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <div className="space-y-3">
            {filteredFAQs.map((faq, i) => {
              const isOpen = openIndex === i;
              const catColor = FAQ_CATEGORIES.find((c) => c.id === faq.category);
              return (
                <motion.div
                  key={`${activeCategory}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`glass-card rounded-xl border transition-all ${
                    isOpen ? "border-neon-cyan/30" : "border-border/10 hover:border-neon-cyan/20"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-start gap-4 p-5 text-left"
                  >
                    <span className={`text-xs font-mono font-bold mt-1 ${catColor?.color || "text-neon-cyan"}`}>
                      Q{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-display font-bold text-sm md:text-base">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-neon-cyan" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pl-14">
                          <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-16">
              <HelpCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No transmissions found in this frequency.</p>
            </div>
          )}
        </div>
      </section>

      {/* Feedback & Suggestion Form */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <FeedbackForm />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16">
        <div className="container text-center">
          <div className="glass-card rounded-2xl p-10 border border-neon-magenta/20 max-w-2xl mx-auto">
            <Headphones className="w-10 h-10 text-neon-magenta mx-auto mb-4" />
            <h3 className="text-xl font-display font-bold mb-3">
              Still Have <span className="text-neon-magenta">Questions</span>?
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Our signals team is standing by. Drop us a transmission and we'll get back to you within 24 hours.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-display font-bold text-sm hover:shadow-[0_0_30px_oklch(0.85_0.18_195/0.4)] transition-all"
            >
              <Zap className="w-4 h-4" />
              Contact HQ
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
