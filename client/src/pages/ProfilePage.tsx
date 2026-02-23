/**
 * Profile Page — User settings, subscription management, notification preferences.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Bell, Crown, CreditCard, LogOut, Settings, Shield,
  Globe, Moon, Sun, ChevronRight, Check, Zap
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { CATEGORIES } from "@/lib/mockData";
import OGMeta from "@/components/OGMeta";

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [notifCategories, setNotifCategories] = useState<string[]>(["crime", "trending", "business"]);

  const toggleCategory = (id: string) => {
    setNotifCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto px-4 pt-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Sign in to GlobalPulse</h1>
            <p className="text-muted-foreground mb-6">
              Access your profile, manage subscriptions, and customize your news experience.
            </p>
            <a
              href={getLoginUrl()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-bold hover:opacity-90 transition-opacity"
            >
              <Zap className="w-5 h-5" /> Sign In
            </a>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <OGMeta title="GlobalPulse — Your Profile" description="Manage your GlobalPulse account, subscriptions, and preferences." />
      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white">
            {user?.name?.charAt(0) || "U"}
          </div>
          <h1 className="text-2xl font-bold">{user?.name || "User"}</h1>
          <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/50 border border-border/30 text-xs font-semibold">
            <Crown className="w-3 h-3 text-amber-400" />
            Free Plan
          </div>
        </motion.div>

        {/* Subscription Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="font-bold">Upgrade to Premium</h2>
              <p className="text-xs text-muted-foreground">Unlock all features for $4/month</p>
            </div>
          </div>
          <ul className="space-y-1.5 mb-4">
            {["Rewind & record live broadcasts", "48hr past broadcast archive", "Ad-free experience", "Priority call-in queue", "Exclusive AI insights"].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-400" /> {f}
              </li>
            ))}
          </ul>
          <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:opacity-90 transition-opacity">
            Subscribe — $4/month
          </button>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card/50 border border-border/30 overflow-hidden"
          >
            <div className="p-4 border-b border-border/20">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4 text-neon-cyan" /> Notifications
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Get alerts for breaking news and trending stories</p>
                </div>
                <button
                  onClick={() => setNotifEnabled(!notifEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${notifEnabled ? "bg-neon-cyan" : "bg-card border border-border/50"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${notifEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>

              {notifEnabled && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Notify me about:</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          notifCategories.includes(cat.id)
                            ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40"
                            : "bg-card/30 border border-border/20 text-muted-foreground"
                        }`}
                      >
                        {cat.emoji} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Menu Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-card/50 border border-border/30 overflow-hidden"
          >
            {[
              { icon: CreditCard, label: "Payment Methods", desc: "Manage your payment options", action: () => {} },
              { icon: Globe, label: "Language", desc: "Change app language", action: () => {} },
              { icon: Shield, label: "Privacy & Security", desc: "Manage your data and privacy", action: () => {} },
              { icon: Settings, label: "App Settings", desc: "Customize your experience", action: () => {} },
            ].map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors ${i > 0 ? "border-t border-border/20" : ""}`}
                >
                  <ItemIcon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              );
            })}
          </motion.div>

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
