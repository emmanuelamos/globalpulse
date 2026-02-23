/**
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Component: Scrolling breaking news ticker bar at top of page
 * Now fetching REAL stories from the database.
 */
import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";

export default function TickerBar() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch REAL stories from the database
  const storiesQuery = trpc.stories.list.useQuery(
    { limit: 20 },
    { 
      refetchInterval: 60000, // Refresh every minute
      placeholderData: (previousData) => previousData 
    }
  );

  const liveStories = storiesQuery.data || [];

  // 2. Scrolling Animation Logic
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || liveStories.length === 0) return;
    
    let animId: number;
    let pos = 0;
    const speed = 0.8; // Slightly faster for that terminal feel
    
    const animate = () => {
      pos -= speed;
      // Reset position when half the list has scrolled (since we duplicate the items)
      if (Math.abs(pos) >= el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(${pos}px)`;
      animId = requestAnimationFrame(animate);
    };
    
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [liveStories]);

  // Helper to color-code categories
  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      crime: "text-red-500",
      business: "text-green-400",
      entertainment: "text-magenta-400",
      weather: "text-cyan-400",
      sports: "text-blue-400",
      funny: "text-yellow-400",
      celebrity: "text-amber-400"
    };
    return colors[cat.toLowerCase()] || "text-neon-cyan";
  };

  // 3. Prepare the items (duplicate for infinite loop)
  const displayItems = liveStories.length > 0 
    ? [...liveStories, ...liveStories] 
    : [];

  return (
    <div className="w-full overflow-hidden bg-black/90 backdrop-blur-md border-b border-white/10 py-2 relative z-50 h-9">
      {/* LIVE Indicator */}
      <div className="flex items-center absolute left-0 top-0 bottom-0 z-10 px-3 bg-red-600">
        <span className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse" />
        <span className="text-white text-[10px] font-bold tracking-tighter">LIVE FEED</span>
      </div>

      <div className="ml-24">
        <div ref={scrollRef} className="flex whitespace-nowrap gap-12 will-change-transform">
          {displayItems.length > 0 ? (
            displayItems.map((story, i) => (
              <span key={`${story.id}-${i}`} className="inline-flex items-center gap-3 text-sm">
                <span className={`font-bold text-[10px] uppercase tracking-widest ${getCategoryColor(story.category)}`}>
                  {story.category}
                </span>
                <span className="text-white/90 font-medium">
                  {story.title.toUpperCase()}
                </span>
                <span className="text-white/20 font-mono">//</span>
              </span>
            ))
          ) : (
            <span className="text-white/40 text-xs font-mono animate-pulse">
              CONNECTING TO GLOBAL PULSE NETWORK... SYNCHRONIZING SATELLITE FEED...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}