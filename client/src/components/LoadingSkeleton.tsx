/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Component: Loading skeleton with broadcast pulse animation
 */
import { motion } from "framer-motion";
import { Radio, Loader2 } from "lucide-react";

/** Full-page loading state for route transitions */
export function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-neon-cyan/20 animate-ping" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Radio className="w-8 h-8 text-neon-cyan animate-pulse" />
          </div>
        </div>
        <p className="text-sm font-mono text-neon-cyan tracking-widest">
          TUNING SIGNAL...
        </p>
      </motion.div>
    </div>
  );
}

/** Inline loading spinner */
export function InlineLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12">
      <Loader2 className="w-5 h-5 text-neon-cyan animate-spin" />
      <span className="text-sm font-mono text-muted-foreground">{text}</span>
    </div>
  );
}

/** Card skeleton placeholder */
export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card rounded-xl p-5 border border-border/20 animate-pulse"
        >
          <div className="w-10 h-10 rounded-lg bg-secondary/50 mb-4" />
          <div className="h-5 bg-secondary/50 rounded w-2/3 mb-3" />
          <div className="h-3 bg-secondary/30 rounded w-full mb-2" />
          <div className="h-3 bg-secondary/30 rounded w-4/5" />
        </div>
      ))}
    </div>
  );
}

/** Rankings list skeleton */
export function RankingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="glass-card rounded-lg p-4 flex items-center gap-4 animate-pulse"
        >
          <div className="w-8 h-8 rounded-full bg-secondary/50" />
          <div className="w-8 h-8 rounded bg-secondary/50" />
          <div className="flex-1">
            <div className="h-4 bg-secondary/50 rounded w-1/3 mb-2" />
            <div className="h-3 bg-secondary/30 rounded w-1/4" />
          </div>
          <div className="h-6 w-16 bg-secondary/50 rounded" />
        </div>
      ))}
    </div>
  );
}

/** Story feed skeleton */
export function StoryFeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card rounded-xl p-5 flex gap-4 animate-pulse"
        >
          <div className="w-24 h-24 rounded-lg bg-secondary/50 shrink-0" />
          <div className="flex-1">
            <div className="h-3 bg-secondary/40 rounded w-1/4 mb-3" />
            <div className="h-5 bg-secondary/50 rounded w-3/4 mb-2" />
            <div className="h-3 bg-secondary/30 rounded w-full mb-2" />
            <div className="h-3 bg-secondary/30 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
