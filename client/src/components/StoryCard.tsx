/**
 * StoryCard — A single trending news story card.
 * Shows image, category badge, heat score, title, summary, engagement stats.
 * Used across Trends Feed, Business, and Search pages.
 */
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Flame, ArrowUpRight } from "lucide-react";
import { MockStory, CATEGORIES, COUNTRIES } from "@/lib/mockData";
import { type stories } from "../../../drizzle/schema";
import { Link } from "wouter";
import { useState } from "react";

type DbStory = typeof stories.$inferSelect;

interface StoryCardProps {
  story: MockStory | (DbStory & { countryFlag?: string }); 
  index?: number;
  compact?: boolean;
}

export default function StoryCard({ story, index = 0, compact = false }: StoryCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(story.likesCount ?? 0);
  const category = CATEGORIES.find(c => c.id === story.category);

  const displayFlag = story.countryFlag || 
    COUNTRIES.find(c => c.code === (story as any).country)?.flag || 
    "🌍";

  const publishedDate = typeof story.publishedAt === 'string' 
    ? story.publishedAt 
    : story.publishedAt?.toISOString() || new Date().toISOString();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount((prev: number) => liked ? prev - 1 : prev + 1);
  };

  const formatCount = (n: number | null | undefined) => {
    const num = n ?? 0;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link href={`/story/${story.id}`}>
          <div className="flex gap-3 p-3 rounded-xl bg-card/50 border border-border/30 hover:border-neon-cyan/40 transition-all cursor-pointer group">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
              <img src={story.imageUrl ?? ""} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white">
                #{story.rank ?? 0}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-semibold ${category?.textColor}`}>{category?.emoji} {category?.label}</span>
                <span className="text-xs text-muted-foreground">{displayFlag}</span>
              </div>
              <h4 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-neon-cyan transition-colors">{story.title}</h4>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatCount(likeCount)}</span>
                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{formatCount(story.commentsCount)}</span>
                <span>{timeAgo(publishedDate)}</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="group"
    >
      <Link href={`/story/${story.id}`}>
        <div className="relative rounded-2xl overflow-hidden bg-card/50 border border-border/30 hover:border-neon-cyan/40 transition-all cursor-pointer hover:shadow-lg hover:shadow-neon-cyan/10">
          <div className="relative h-48 overflow-hidden">
            <img src={story.imageUrl ?? ""} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className="px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 text-white font-mono text-sm font-bold">
                #{story.rank ?? 0}
              </div>
              <div className={`px-2 py-1 rounded-lg bg-gradient-to-r ${category?.color} text-white text-xs font-bold`}>
                {category?.emoji} {category?.label}
              </div>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-orange-500/30">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs font-mono font-bold text-orange-400">{story.heatScore ?? 0}</span>
            </div>

            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="text-lg">{displayFlag}</span>
              <span className="text-xs text-white/70">{story.sourceName ?? "GlobalPulse"}</span>
              <span className="text-xs text-white/50">•</span>
              <span className="text-xs text-white/50">{timeAgo(publishedDate)}</span>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-bold text-base leading-tight mb-2 group-hover:text-neon-cyan transition-colors line-clamp-2">
              {story.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{story.summary ?? ""}</p>

            <div className="p-2.5 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 mb-3">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">AI</span>
                </div>
                <span className="text-[10px] font-semibold text-neon-cyan uppercase tracking-wider">AI Summary</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{story.aiSummary ?? "Synthesizing global perspectives..."}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? "text-neon-magenta" : "text-muted-foreground hover:text-neon-magenta"}`}
                >
                  <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                  <span className="font-mono text-xs">{formatCount(likeCount)}</span>
                </button>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-mono text-xs">{formatCount(story.commentsCount ?? 0)}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1 text-xs text-neon-cyan font-semibold">
                  Read More <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
