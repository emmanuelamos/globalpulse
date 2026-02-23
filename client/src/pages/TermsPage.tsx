/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Page: Terms of Service — "Broadcast Terms & Conditions"
 * Style: Broadcast-themed legal page with newsroom aesthetic
 */
import { Link } from "wouter";
import { FileText, Radio, Users, CreditCard, Mic, AlertTriangle, Scale, Globe, Ban, RefreshCw, ArrowLeft } from "lucide-react";
import OGMeta from "@/components/OGMeta";

const SECTIONS = [
  {
    id: "acceptance",
    icon: Radio,
    title: "SIGNAL ACCEPTANCE",
    subtitle: "Agreement to these terms",
    content: [
      "By accessing or using GlobalPulse (\"the Platform\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not tune in.",
      "GlobalPulse is a global news aggregation, ranking, and broadcasting platform that delivers trending content across 8 categories: Crime, Trending, Funny, Entertainment, Celebrity, Gossip, Weather, and Business. Our service includes AI-powered news summaries, country-by-country rankings, live AI broadcaster sessions, and community call-in features.",
      "You must be at least 13 years of age to use GlobalPulse. If you are under 18, you must have parental or guardian consent. By creating an account, you represent that you meet these age requirements.",
      "We reserve the right to update these terms at any time. Continued use of the Platform after changes constitutes acceptance of the revised terms. We will notify users of material changes via email or in-app notification."
    ]
  },
  {
    id: "accounts",
    icon: Users,
    title: "USER CREDENTIALS",
    subtitle: "Account registration & responsibility",
    content: [
      "To access certain features of GlobalPulse, you must create an account. You can register using email, Google, Apple, or X (Twitter) authentication.",
      "**Account Security:** You are responsible for maintaining the confidentiality of your login credentials. Any activity under your account is your responsibility. Notify us immediately if you suspect unauthorized access.",
      "**Accurate Information:** You agree to provide accurate, current, and complete information during registration and to update it as necessary.",
      "**One Account Per Person:** Each individual may maintain only one GlobalPulse account. Duplicate accounts may be terminated without notice.",
      "**Account Termination:** We reserve the right to suspend or terminate accounts that violate these terms, engage in abusive behavior, or remain inactive for more than 12 months."
    ]
  },
  {
    id: "subscriptions",
    icon: CreditCard,
    title: "SUBSCRIPTION TIERS",
    subtitle: "Free, Premium & Call-In pricing",
    content: [
      "GlobalPulse operates on a freemium model with the following tiers:",
      "**Free Tier:** Access to all 8 trending categories, global and country rankings, AI-generated news summaries, and live broadcast listening. Free users cannot rewind broadcasts, access past broadcast archives, or participate in call-ins.",
      "**Premium ($4/month):** Everything in Free, plus: broadcast recording and rewind capabilities, 48-hour past broadcast archive access, priority call-in queue placement, ad-free experience, and advanced ranking filters.",
      "**Call-In Credits ($0.99 each):** Purchase individual call-in credits to participate in live Broadcasters Room sessions. Each credit grants one call-in opportunity. Premium subscribers receive 2 free call-in credits per month.",
      "**Billing:** Subscriptions are billed monthly through Stripe. You may cancel at any time; access continues until the end of your current billing period. No refunds are provided for partial months.",
      "**Price Changes:** We may adjust pricing with 30 days' advance notice. Existing subscribers will be grandfathered at their current rate for 90 days after any price increase."
    ]
  },
  {
    id: "broadcasts",
    icon: Mic,
    title: "BROADCAST PROTOCOLS",
    subtitle: "Broadcasters Room rules & call-in conduct",
    content: [
      "The Broadcasters Room is a core feature of GlobalPulse, featuring AI-powered news anchors and live user call-ins. By participating, you agree to the following:",
      "**AI Anchors:** GlobalPulse AI anchors (including Marcus and Victoria) deliver news with personality, commentary, and occasional humor. Their views are AI-generated and do not represent the opinions of GlobalPulse as a company.",
      "**Call-In Conduct:** When calling in, you agree to: maintain respectful discourse, avoid hate speech, threats, or harassment, not share personal information of others, not promote illegal activities, and keep discussions relevant to the current broadcast topic.",
      "**Recording & Replay:** Live broadcasts may be recorded for subscriber replay purposes. Recordings are automatically deleted after 48 hours. By participating in a call-in, you consent to being recorded and replayed within this window.",
      "**Moderation:** GlobalPulse reserves the right to mute, disconnect, or ban users who violate broadcast conduct rules. Repeated violations will result in permanent call-in suspension.",
      "**Country Rooms:** Each country room features localized AI anchors speaking the primary language of that region. Content and rankings are tailored to local trends. The same conduct rules apply across all rooms."
    ]
  },
  {
    id: "content",
    icon: Globe,
    title: "CONTENT TRANSMISSION",
    subtitle: "News content, rankings & user contributions",
    content: [
      "**News Aggregation:** GlobalPulse aggregates trending news from multiple third-party sources. We do not create original news content. All news stories are attributed to their original sources. Rankings are algorithmically generated based on publicly available data and engagement metrics.",
      "**AI Summaries:** Story summaries are generated by AI and may not perfectly represent the original article. Always refer to the source article for complete information. AI summaries are provided for convenience and should not be considered definitive reporting.",
      "**User Content:** Comments, reactions, and call-in contributions you make on GlobalPulse are your responsibility. By posting, you grant GlobalPulse a non-exclusive, worldwide, royalty-free license to display, distribute, and moderate your content within the platform.",
      "**Accuracy Disclaimer:** While we strive for accuracy in our rankings and aggregation, GlobalPulse does not guarantee the accuracy, completeness, or timeliness of any content. Rankings are based on available data and algorithmic analysis, which may not capture every nuance.",
      "**Business & Financial Content:** Business category content, including stock market data, crypto prices, and market rankings, is provided for informational purposes only and does not constitute financial advice. Always consult a qualified financial advisor before making investment decisions."
    ]
  },
  {
    id: "prohibited",
    icon: Ban,
    title: "SIGNAL INTERFERENCE",
    subtitle: "Prohibited activities",
    content: [
      "The following activities are strictly prohibited on GlobalPulse:",
      "**Platform Abuse:** Attempting to hack, reverse-engineer, or disrupt GlobalPulse systems. Using bots, scrapers, or automated tools to access content without authorization. Creating fake accounts or manipulating engagement metrics.",
      "**Content Violations:** Posting spam, malware, or phishing content. Sharing copyrighted material without authorization. Posting content that is illegal, defamatory, or violates the rights of others.",
      "**Community Harm:** Harassment, bullying, or threatening other users. Doxxing or sharing personal information of others. Impersonating GlobalPulse staff, AI anchors, or other users.",
      "**Commercial Misuse:** Using GlobalPulse data for commercial purposes without written permission. Reselling or redistributing GlobalPulse content. Using the platform to advertise or promote external products without authorization.",
      "Violations may result in immediate account suspension or termination, without refund of any subscription fees."
    ]
  },
  {
    id: "liability",
    icon: AlertTriangle,
    title: "LIABILITY LIMITS",
    subtitle: "Disclaimers & limitations",
    content: [
      "**Service Availability:** GlobalPulse is provided \"as is\" and \"as available.\" We do not guarantee uninterrupted, error-free, or secure access to the platform. Scheduled and unscheduled maintenance may temporarily affect availability.",
      "**Content Liability:** GlobalPulse is not liable for the accuracy, legality, or appropriateness of third-party news content aggregated on the platform. We are not responsible for decisions made based on information found on GlobalPulse.",
      "**Maximum Liability:** To the fullest extent permitted by law, GlobalPulse's total liability to you for any claims arising from your use of the platform shall not exceed the amount you paid to GlobalPulse in the 12 months preceding the claim.",
      "**Indemnification:** You agree to indemnify and hold harmless GlobalPulse, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the platform or violation of these terms.",
      "**Force Majeure:** GlobalPulse is not liable for delays or failures in performance resulting from circumstances beyond our reasonable control, including natural disasters, war, terrorism, pandemics, or internet infrastructure failures."
    ]
  },
  {
    id: "disputes",
    icon: Scale,
    title: "DISPUTE RESOLUTION",
    subtitle: "How we resolve conflicts",
    content: [
      "**Governing Law:** These terms are governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to conflict of law principles.",
      "**Informal Resolution:** Before filing any formal claim, you agree to contact us at legal@globalpulse.app and attempt to resolve the dispute informally for at least 30 days.",
      "**Arbitration:** Any disputes that cannot be resolved informally shall be settled by binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules.",
      "**Class Action Waiver:** You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.",
      "**Exceptions:** Either party may seek injunctive relief in any court of competent jurisdiction for violations involving intellectual property rights or unauthorized access to the platform."
    ]
  },
  {
    id: "changes",
    icon: RefreshCw,
    title: "PROTOCOL UPDATES",
    subtitle: "Changes to these terms",
    content: [
      "GlobalPulse reserves the right to modify these Terms of Service at any time. When we make changes:",
      "**Notification:** We will notify users of material changes via email and/or prominent in-app notification at least 14 days before the changes take effect.",
      "**Effective Date:** The updated terms will include a new \"Last Updated\" date at the top of this document.",
      "**Continued Use:** Your continued use of GlobalPulse after the effective date of revised terms constitutes acceptance of those changes.",
      "**Disagreement:** If you do not agree to the revised terms, you must stop using GlobalPulse and may request account deletion. Any prepaid subscription fees for the remaining period will be refunded on a pro-rata basis.",
      "We recommend reviewing these terms periodically to stay informed of any updates."
    ]
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <OGMeta title="Terms of Service — GlobalPulse" description="Terms of service for GlobalPulse. Rules of engagement for the world's AI-powered trending news platform." />
      {/* Header */}
      <div className="border-b border-neon-cyan/10 bg-secondary/30">
        <div className="container py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-neon-cyan transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to HQ
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-neon-magenta/10 border border-neon-magenta/20">
              <FileText className="w-6 h-6 text-neon-magenta" />
            </div>
            <span className="font-mono text-xs text-neon-magenta tracking-widest">/// BROADCAST TERMS & CONDITIONS</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black mt-4">
            Terms of <span className="text-neon-magenta">Service</span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            The rules of engagement for tuning into the world's most electrifying news platform. Read carefully — by using GlobalPulse, you're agreeing to these terms.
          </p>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground font-mono">
            <span>EFFECTIVE: February 1, 2026</span>
            <span className="text-neon-magenta">|</span>
            <span>LAST UPDATED: February 8, 2026</span>
            <span className="text-neon-magenta">|</span>
            <span>VERSION 1.0</span>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="container py-8">
        <div className="glass-card p-6 mb-12">
          <h2 className="font-display font-bold text-sm text-neon-magenta mb-4 tracking-widest">/// TERMS INDEX</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SECTIONS.map((section, i) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 p-3 rounded-lg border border-border/50 hover:border-neon-magenta/30 hover:bg-neon-magenta/5 transition-all group"
              >
                <span className="font-mono text-xs text-neon-cyan">{String(i + 1).padStart(2, '0')}</span>
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
                  <div className="p-2.5 rounded-lg bg-neon-magenta/10 border border-neon-magenta/20 mt-1">
                    <Icon className="w-5 h-5 text-neon-magenta" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-neon-cyan">ARTICLE {String(i + 1).padStart(2, '0')}</span>
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
              <Scale className="w-5 h-5 text-neon-magenta" />
              <h2 className="font-display text-xl font-bold">QUESTIONS ABOUT THESE TERMS?</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms of Service or need clarification on any provision, our legal team is ready to assist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-neon-magenta to-signal-amber text-white font-bold hover:opacity-90 transition-opacity">
                <Radio className="w-4 h-4" />
                Contact Legal Team
              </Link>
              <span className="inline-flex items-center text-sm text-muted-foreground">
                or email: legal@globalpulse.app
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
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
              Privacy Policy →
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
