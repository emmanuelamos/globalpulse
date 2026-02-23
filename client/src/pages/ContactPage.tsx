/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Page: Contact — "Broadcast Your Message to HQ"
 * Style: Futuristic newsroom control room feel, not generic corporate contact
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Radio, MapPin, Mail, Phone, MessageSquare, Zap, Globe, Clock, Signal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import OGMeta from "@/components/OGMeta";
import { trpc } from "@/lib/trpc";

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    label: "TRANSMISSION LINE",
    value: "hello@globalpulse.news",
    desc: "Direct feed to our editorial desk",
    color: "text-neon-cyan",
    border: "border-neon-cyan/30",
    glow: "hover:shadow-[0_0_20px_oklch(0.85_0.18_195/0.2)]",
  },
  {
    icon: Radio,
    label: "BROADCAST FREQ",
    value: "@GlobalPulse",
    desc: "Live on all social frequencies",
    color: "text-neon-magenta",
    border: "border-neon-magenta/30",
    glow: "hover:shadow-[0_0_20px_oklch(0.7_0.25_350/0.2)]",
  },
  {
    icon: MapPin,
    label: "COMMAND CENTER",
    value: "Global — Remote First",
    desc: "Correspondents in 47+ countries",
    color: "text-neon-amber",
    border: "border-neon-amber/30",
    glow: "hover:shadow-[0_0_20px_oklch(0.82_0.18_80/0.2)]",
  },
  {
    icon: Clock,
    label: "RESPONSE TIME",
    value: "< 24 Hours",
    desc: "Our signals team never sleeps",
    color: "text-neon-green",
    border: "border-neon-green/30",
    glow: "hover:shadow-[0_0_20px_oklch(0.8_0.2_150/0.2)]",
  },
];

const INQUIRY_TYPES = [
  { value: "general", label: "General Inquiry", icon: "📡" },
  { value: "press", label: "Press & Media", icon: "🎙️" },
  { value: "partnership", label: "Partnership / Sponsorship", icon: "🤝" },
  { value: "advertise", label: "Advertise on GlobalPulse", icon: "📺" },
  { value: "bug", label: "Report a Bug / Issue", icon: "🐛" },
  { value: "feature", label: "Feature Request", icon: "💡" },
  { value: "investor", label: "Investor Relations", icon: "📈" },
  { value: "careers", label: "Careers / Join the Team", icon: "🚀" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendMutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      setSending(false);
      setSent(true);
      toast.success("Transmission received! Our team will respond within 24 hours.");
    },
    onError: (err) => {
      setSending(false);
      toast.error(err.message || "Transmission failed. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("All fields are required to transmit your message.");
      return;
    }
    setSending(true);
    sendMutation.mutate({
      name: formData.name,
      email: formData.email,
      subject: formData.subject || formData.type || "General Inquiry",
      department: formData.type || "general",
      message: formData.message,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <OGMeta title="Contact GlobalPulse" description="Broadcast your message to GlobalPulse HQ. Reach out for partnerships, press inquiries, or feedback." />
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/5 via-transparent to-transparent" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-sm font-display font-bold mb-6">
              <Signal className="w-4 h-4" />
              OPEN CHANNEL
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
              Broadcast Your{" "}
              <span className="text-neon-magenta text-glow-magenta">Message</span>
              <br />
              to HQ.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Whether you're a journalist, investor, advertiser, or just someone who wants to shape the future of news —
              our transmission lines are always open. Drop your signal below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact channels */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONTACT_CHANNELS.map((ch, i) => (
              <motion.div
                key={ch.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card rounded-xl p-5 ${ch.border} ${ch.glow} transition-all`}
              >
                <div className={`w-10 h-10 rounded-lg bg-current/10 flex items-center justify-center mb-3 ${ch.color}`}>
                  <ch.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground block mb-1">
                  {ch.label}
                </span>
                <span className={`font-display font-bold text-sm ${ch.color}`}>{ch.value}</span>
                <p className="text-xs text-muted-foreground mt-1">{ch.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-8 md:p-12 border border-neon-cyan/20"
          >
            {/* Form header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 rounded-full bg-neon-cyan live-dot" />
              <span className="font-mono text-xs text-neon-cyan tracking-widest">SECURE TRANSMISSION FORM</span>
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-neon-cyan" />
                </div>
                <h3 className="text-2xl font-display font-bold text-neon-cyan mb-3">
                  Transmission Received!
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your message has been routed to our editorial command center. Expect a response within 24 hours.
                  Our signals team is on it.
                </p>
                <button
                  onClick={() => { setSent(false); setFormData({ name: "", email: "", type: "", subject: "", message: "" }); }}
                  className="mt-8 px-6 py-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-display font-bold text-sm hover:bg-neon-cyan/20 transition-all"
                >
                  Send Another Transmission
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-muted-foreground tracking-wider block mb-2">
                      YOUR CALLSIGN *
                    </label>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border/30 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 font-body transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-muted-foreground tracking-wider block mb-2">
                      FREQUENCY (EMAIL) *
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border/30 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 font-body transition-all"
                    />
                  </div>
                </div>

                {/* Inquiry type */}
                <div>
                  <label className="text-xs font-mono text-muted-foreground tracking-wider block mb-2">
                    TRANSMISSION TYPE
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {INQUIRY_TYPES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: t.value })}
                        className={`px-3 py-2.5 rounded-lg border text-xs font-display font-medium transition-all text-left ${
                          formData.type === t.value
                            ? "border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan"
                            : "border-border/30 bg-secondary/30 text-muted-foreground hover:border-neon-cyan/30 hover:text-foreground"
                        }`}
                      >
                        <span className="mr-1">{t.icon}</span> {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs font-mono text-muted-foreground tracking-wider block mb-2">
                    HEADLINE
                  </label>
                  <input
                    type="text"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border/30 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 font-body transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-mono text-muted-foreground tracking-wider block mb-2">
                    YOUR BROADCAST *
                  </label>
                  <textarea
                    placeholder="Tell us everything. The more detail, the faster we can respond..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border/30 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 font-body transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    <span className="text-neon-green">●</span> ENCRYPTED CHANNEL
                  </span>
                  <button
                    type="submit"
                    disabled={sending}
                    className="group flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-display font-bold text-sm hover:shadow-[0_0_30px_oklch(0.85_0.18_195/0.4)] transition-all disabled:opacity-50"
                  >
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        Transmit Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16">
        <div className="container text-center">
          <div className="glass-card rounded-2xl p-10 border border-neon-magenta/20 max-w-2xl mx-auto">
            <Globe className="w-10 h-10 text-neon-magenta mx-auto mb-4" />
            <h3 className="text-xl font-display font-bold mb-3">
              Want to Join the <span className="text-neon-magenta">Broadcast Team</span>?
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              We're always looking for correspondents, data analysts, AI engineers, and newsroom innovators
              who want to redefine how the world consumes news. No boring resumes — show us your signal.
            </p>
            <a
              href="mailto:careers@globalpulse.news"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neon-magenta/10 border border-neon-magenta/30 text-neon-magenta font-display font-bold text-sm hover:bg-neon-magenta/20 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              careers@globalpulse.news
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
