/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Page: Privacy Policy — "Signal Privacy Protocol"
 * Style: Broadcast-themed legal page with newsroom aesthetic
 */
import { Link } from "wouter";
import { Shield, Radio, Eye, Lock, Database, Globe, Bell, Trash2, Mail, ArrowLeft } from "lucide-react";
import OGMeta from "@/components/OGMeta";

const SECTIONS = [
  {
    id: "data-collection",
    icon: Database,
    title: "DATA COLLECTION PROTOCOL",
    subtitle: "What signals we intercept",
    content: [
      "When you tune into GlobalPulse, we collect certain data to power your personalized news experience. Think of it as calibrating your antenna for the best signal.",
      "**Account Data:** When you register, we collect your name, email address, and authentication credentials. If you sign up via social platforms (Google, Apple, X), we receive your public profile information from those services.",
      "**Usage Signals:** We track which categories you browse, stories you engage with, rankings you explore, and broadcasts you tune into. This helps us rank what matters most to you.",
      "**Device Telemetry:** We collect device type, operating system, browser version, IP address, and general location data (country/city level) to optimize your experience and deliver region-relevant trending content.",
      "**Payment Data:** When you subscribe to Premium or purchase Call-In credits, payment processing is handled by Stripe. We store only your Stripe customer ID — never your full card details.",
      "**Broadcast Interactions:** If you participate in the Broadcasters Room (call-ins, live chat), we collect your audio input during the session and chat messages. Recordings are retained for 48 hours for subscriber replay, then permanently deleted."
    ]
  },
  {
    id: "data-usage",
    icon: Radio,
    title: "SIGNAL PROCESSING",
    subtitle: "How we use your data",
    content: [
      "Your data fuels the GlobalPulse engine. Here's exactly how we process your signals:",
      "**Personalized Rankings:** Your browsing patterns help us surface the most relevant trending stories and rankings for your interests and location.",
      "**AI Summaries & Broadcasts:** We use aggregated engagement data to train our AI anchors on what stories to prioritize and how to deliver them. Your individual data is never used to train AI models.",
      "**Service Improvement:** Usage analytics help us identify which features resonate, which categories need more coverage, and where our ranking algorithms can improve.",
      "**Communications:** We may send you notifications about breaking trends, new features, or account-related updates. You control notification preferences in your profile settings.",
      "**Legal Compliance:** We may process data as required by law, to protect our rights, or to ensure the safety of our community."
    ]
  },
  {
    id: "data-sharing",
    icon: Globe,
    title: "BROADCAST RANGE",
    subtitle: "Who receives your signals",
    content: [
      "We do not sell your personal data. Period. Your signal stays within the GlobalPulse network unless explicitly necessary:",
      "**Service Providers:** We work with trusted partners (hosting, payment processing, analytics) who process data on our behalf under strict contractual obligations.",
      "**AI Processing:** Our AI summarization and broadcast generation uses anonymized, aggregated data. Individual user data is never shared with third-party AI providers.",
      "**Legal Requirements:** We may disclose data if required by law, court order, or to protect the safety of our users and platform.",
      "**Business Transfers:** In the event of a merger, acquisition, or asset sale, user data may be transferred as part of the business assets, with continued privacy protections.",
      "**Public Interactions:** Comments, likes, and call-in broadcasts you make are visible to other users as part of the platform experience."
    ]
  },
  {
    id: "data-security",
    icon: Lock,
    title: "ENCRYPTION SHIELD",
    subtitle: "How we protect your signal",
    content: [
      "Your data security is mission-critical. We deploy enterprise-grade protections:",
      "**Encryption in Transit:** All data transmitted between your device and GlobalPulse servers is encrypted using TLS 1.3.",
      "**Encryption at Rest:** Stored data is encrypted using AES-256 encryption standards.",
      "**Access Controls:** Internal access to user data is restricted to authorized personnel on a need-to-know basis, with multi-factor authentication required.",
      "**Regular Audits:** We conduct periodic security assessments and vulnerability testing to maintain the integrity of our systems.",
      "**Incident Response:** In the unlikely event of a data breach, we will notify affected users within 72 hours as required by applicable regulations."
    ]
  },
  {
    id: "user-rights",
    icon: Eye,
    title: "YOUR CONTROL PANEL",
    subtitle: "Your rights over your data",
    content: [
      "You are the controller of your signal. Here are your rights:",
      "**Access:** Request a copy of all personal data we hold about you.",
      "**Correction:** Update or correct inaccurate personal information at any time through your profile settings.",
      "**Deletion:** Request complete deletion of your account and associated data. We will process this within 30 days, except where retention is legally required.",
      "**Portability:** Request your data in a structured, machine-readable format.",
      "**Opt-Out:** Unsubscribe from marketing communications at any time. Manage notification preferences in your profile.",
      "**Restriction:** Request that we limit processing of your data in certain circumstances.",
      "To exercise any of these rights, contact our Data Protection team at privacy@globalpulse.app or through our Contact page."
    ]
  },
  {
    id: "cookies",
    icon: Bell,
    title: "TRACKING BEACONS",
    subtitle: "Cookies & similar technologies",
    content: [
      "We use cookies and similar technologies to keep the signal strong:",
      "**Essential Cookies:** Required for authentication, security, and core functionality. These cannot be disabled.",
      "**Analytics Cookies:** Help us understand how users interact with GlobalPulse, which categories are most popular, and where we can improve. You can opt out of these.",
      "**Preference Cookies:** Remember your settings like dark/light mode, language preference, and notification choices.",
      "**Third-Party Cookies:** Our payment processor (Stripe) and authentication providers may set their own cookies. These are governed by their respective privacy policies.",
      "You can manage cookie preferences through your browser settings. Note that disabling certain cookies may impact your GlobalPulse experience."
    ]
  },
  {
    id: "retention",
    icon: Trash2,
    title: "SIGNAL RETENTION",
    subtitle: "How long we keep your data",
    content: [
      "We retain data only as long as necessary to deliver the GlobalPulse experience:",
      "**Account Data:** Retained for the lifetime of your account, plus 30 days after deletion request.",
      "**Usage Analytics:** Aggregated analytics are retained indefinitely. Individual usage logs are purged after 12 months.",
      "**Broadcast Recordings:** Subscriber replay recordings are automatically deleted after 48 hours. No exceptions.",
      "**Payment Records:** Transaction records are retained for 7 years as required by financial regulations.",
      "**Call-In Audio:** Live call-in audio is processed in real-time and not stored beyond the 48-hour replay window.",
      "**Comments & Interactions:** Retained until you delete them or your account is closed."
    ]
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <OGMeta title="Privacy Policy — GlobalPulse" description="How GlobalPulse protects your data. Our commitment to transparency, security, and your digital rights." />
      {/* Header */}
      <div className="border-b border-neon-cyan/10 bg-secondary/30">
        <div className="container py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-neon-cyan transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to HQ
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20">
              <Shield className="w-6 h-6 text-neon-cyan" />
            </div>
            <span className="font-mono text-xs text-neon-cyan tracking-widest">/// SIGNAL PRIVACY PROTOCOL</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black mt-4">
            Privacy <span className="text-neon-cyan">Policy</span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Your data, your signal, your control. This document outlines how GlobalPulse collects, processes, and protects the information that powers your personalized news experience.
          </p>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground font-mono">
            <span>EFFECTIVE: February 1, 2026</span>
            <span className="text-neon-cyan">|</span>
            <span>LAST UPDATED: February 8, 2026</span>
            <span className="text-neon-cyan">|</span>
            <span>VERSION 1.0</span>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="container py-8">
        <div className="glass-card p-6 mb-12">
          <h2 className="font-display font-bold text-sm text-neon-cyan mb-4 tracking-widest">/// SIGNAL INDEX</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {SECTIONS.map((section, i) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 p-3 rounded-lg border border-border/50 hover:border-neon-cyan/30 hover:bg-neon-cyan/5 transition-all group"
              >
                <span className="font-mono text-xs text-neon-magenta">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{section.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="max-w-4xl mx-auto space-y-12">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            return (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-2.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 mt-1">
                    <Icon className="w-5 h-5 text-neon-cyan" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-neon-magenta">SECTION {String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h2 className="font-display text-2xl font-black">{section.title}</h2>
                    <p className="text-sm text-muted-foreground">{section.subtitle}</p>
                  </div>
                </div>
                <div className="pl-0 md:pl-16 space-y-4">
                  {section.content.map((paragraph, j) => (
                    <p
                      key={j}
                      className="text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                      }}
                    />
                  ))}
                </div>
                {i < SECTIONS.length - 1 && (
                  <div className="mt-8 border-b border-border/30" />
                )}
              </section>
            );
          })}

          {/* Contact Section */}
          <section className="glass-card p-8 mt-12">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-neon-cyan" />
              <h2 className="font-display text-xl font-bold">QUESTIONS ABOUT YOUR PRIVACY?</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, our Data Protection team is standing by.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-bold hover:opacity-90 transition-opacity">
                <Radio className="w-4 h-4" />
                Contact Data Protection
              </Link>
              <span className="inline-flex items-center text-sm text-muted-foreground">
                or email: privacy@globalpulse.app
              </span>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="border-t border-neon-cyan/10 bg-secondary/30 mt-16">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
            ← Back to GlobalPulse
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
              Terms of Service →
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
              Contact Us →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
