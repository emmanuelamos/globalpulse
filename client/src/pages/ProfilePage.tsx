/**
 * Profile Page — User settings, subscription management, notification preferences.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Bell, Crown, CreditCard, LogOut, Settings, Shield,
  Globe, ChevronRight, Check, Zap, Loader2
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { CATEGORIES } from "@/lib/mockData"; // Ensure IDs here match your DB strings
import OGMeta from "@/components/OGMeta";
import { AuthModal } from "@/components/AuthModal";
import { trpc } from "@/lib/trpc";

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const utils = trpc.useContext();

  // ─── DATA FETCHING ─────────────────────────────────────────
  // Fetch saved category preferences from the DB
  const { data: prefs, isLoading: isPrefsLoading } = trpc.categoryPrefs.get.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // ─── MUTATIONS ─────────────────────────────────────────────
  const updatePrefs = trpc.categoryPrefs.update.useMutation({
    onMutate: async (newPrefs) => {
      await utils.categoryPrefs.get.cancel();
      const previousPrefs = utils.categoryPrefs.get.getData();
      
      // Fixes the "id is missing" error by spreading the old object
      utils.categoryPrefs.get.setData(undefined, (old) => {
        if (!old) return old;
        return {
          ...old,
          categoryOrder: newPrefs.categoryOrder as string[],
        };
      });
      return { previousPrefs };
    },
    onError: (err, newPrefs, context) => {
      utils.categoryPrefs.get.setData(undefined, context?.previousPrefs);
    },
    onSettled: () => {
      utils.categoryPrefs.get.invalidate();
    },
  });

  const createPortal = trpc.payments.createCustomerPortal.useMutation({
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (err) => alert(err.message)
  });

  const createCheckout = trpc.payments.createPremiumCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        // In Vite/SPA, we use window.location for external redirects
        window.location.href = data.url;
      }
    },
    onError: (err) => {
      alert(`Checkout error: ${err.message}`);
    }
  });

  const toggleCategory = (categoryId: string) => {
    // Safe fallback to an empty array
    const currentOrder = Array.isArray(prefs?.categoryOrder) ? prefs.categoryOrder : [];
    
    const newOrder = currentOrder.includes(categoryId)
      ? currentOrder.filter((id) => id !== categoryId)
      : [...currentOrder, categoryId];

     console.log(currentOrder, newOrder) 

    updatePrefs.mutate({ categoryOrder: newOrder });
  };

  const isPremium = user?.subscriptionTier === "premium";

  // ─── AUTH CHECK ────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto px-4 pt-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Sign in to GlobalPulse</h1>
            <p className="text-muted-foreground mb-6">Access your profile and customize your news experience.</p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-magenta text-white font-bold hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Zap className="w-5 h-5" /> Sign In
            </button>
          </motion.div>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <OGMeta title="GlobalPulse — Your Profile" />
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-20">
        
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white shadow-[0_0_20px_rgba(0,255,255,0.3)]">
            {user?.name?.charAt(0) || "U"}
          </div>
          <h1 className="text-2xl font-bold">{user?.name || "User"}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/50 border border-border/30 text-xs font-semibold">
             {isPremium ? <Crown className="w-3 h-3 text-amber-400" /> : <Shield className="w-3 h-3 text-muted-foreground" />}
             <span>{isPremium ? "Premium Member" : "Free Account"}</span>
          </div>
        </motion.div>

        {/* Dynamic Subscription Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`p-5 rounded-2xl border mb-6 relative overflow-hidden ${
            isPremium 
              ? "bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 border-neon-cyan/30" 
              : "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30"
          }`}
        >
          <div className="absolute top-0 right-0 p-2 opacity-10">
            {isPremium ? <Zap className="w-16 h-16" /> : <Crown className="w-16 h-16" />}
          </div>
          <div className="flex items-center gap-3 mb-3">
            {isPremium ? <Zap className="w-6 h-6 text-neon-cyan" /> : <Crown className="w-6 h-6 text-amber-400" />}
            <h2 className="font-bold">{isPremium ? "Premium Active" : "Get Premium Access"}</h2>
          </div>
          
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {["Priority Call-ins", "Ad-free Stream", "Extended Archive", "Global Rooms"].map(f => (
              <li key={f} className="flex items-center gap-2 text-xs text-foreground/80">
                <Check className={`w-3 h-3 ${isPremium ? "text-neon-cyan" : "text-green-400"}`} /> {f}
              </li>
            ))}
          </ul>

          {!isPremium && (
            <button 
              onClick={() => createCheckout.mutate({ origin: window.location.origin })}
              disabled={createCheckout.isPending}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              {createCheckout.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upgrade for $4/mo"}
            </button>
          )}
        </motion.div>

        <div className="space-y-4">
          {/* Category Preferences (Persisted to DB) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card/50 border border-border/30 overflow-hidden"
          >
            <div className="p-4 border-b border-border/20 flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4 text-neon-cyan" /> News Preferences
              </h3>
              {updatePrefs.isPending && <Loader2 className="w-4 h-4 animate-spin text-neon-cyan" />}
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-bold">Followed Categories</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => {
                  const isActive = ((prefs?.categoryOrder as string[]) || []).includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      disabled={updatePrefs.isPending}
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 group ${
                        isActive
                          ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-[0_0_10px_rgba(0,255,255,0.1)]"
                          : "bg-card/30 border border-border/20 text-muted-foreground hover:border-border/60 hover:bg-card/50"
                      }`}
                    >
                      {/* Remove grayscale from the emoji so the UI stays colorful */}
                      <span className={`${isActive ? "scale-110" : "opacity-70 group-hover:opacity-100"} transition-transform`}>
                        {cat.emoji}
                      </span>
                      <span>{cat.label}</span>
                      
                      {/* Optional: Add a little plus/check icon for better feedback */}
                      {isActive ? (
                        <Check className="w-3 h-3 ml-0.5" />
                      ) : (
                        <span className="w-3 h-3 ml-0.5 opacity-0 group-hover:opacity-100">+</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Standard Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl bg-card/50 border border-border/30 overflow-hidden"
          >
            {[
              { 
                icon: Globe, 
                label: "Language", 
                desc: "English (US)",
                onClick: () => {} 
              },
              { 
                icon: CreditCard, 
                label: "Billing", 
                desc: isPremium ? "Manage subscription & payments" : "Upgrade to unlock premium features",
                onClick: () => isPremium ? createPortal.mutate() : createCheckout.mutate({ origin: window.location.origin }),
                isLoading: createPortal.isPending || createCheckout.isPending
              },
              { 
                icon: Settings, 
                label: "Playback", 
                desc: "Audio quality & data saver",
                onClick: () => {}
              },
            ].map((item, i) => (
              <button 
                key={item.label} 
                onClick={item.onClick}
                disabled={item.isLoading}
                className={`w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors ${i > 0 ? "border-t border-border/20" : ""}`}
              >
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                {item.isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            ))}
          </motion.div>

          {/* Logout */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-400/70 font-semibold hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}