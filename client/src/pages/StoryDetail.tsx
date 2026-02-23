/**
 * Story Detail Page — Full story view with AI summary, comments, likes, sharing.
 */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Heart, MessageCircle, Share2, Flame, ArrowLeft, ExternalLink,
  ThumbsUp, ThumbsDown, Send, Clock, Globe
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import StoryCard from "@/components/StoryCard";
import { MOCK_STORIES, CATEGORIES } from "@/lib/mockData";
import { useRoute, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import OGMeta from "@/components/OGMeta";

const MOCK_COMMENTS = [
  { id: 1, user: "CryptoKing99", avatar: "CK", text: "This is insane! Bitcoin is going to hit $100k by March for sure.", time: "15m ago", likes: 42, replies: [
    { id: 11, user: "SkepticalSam", avatar: "SS", text: "People said the same thing last year lol", time: "10m ago", likes: 8 },
    { id: 12, user: "CryptoKing99", avatar: "CK", text: "This time it's different — institutional money is flowing in", time: "8m ago", likes: 3 },
  ]},
  { id: 2, user: "NewsJunkie", avatar: "NJ", text: "Great coverage as always. GlobalPulse is the best way to stay informed.", time: "30m ago", likes: 28, replies: [] },
  { id: 3, user: "LagosGirl", avatar: "LG", text: "Nigeria is really making moves in the tech space. Proud! 🇳🇬", time: "45m ago", likes: 56, replies: [
    { id: 31, user: "TechBro", avatar: "TB", text: "Lagos is the new Silicon Valley of Africa fr", time: "40m ago", likes: 15 },
  ]},
];

export default function StoryDetail() {
  const [, params] = useRoute("/story/:id");
  const storyId = Number(params?.id);
  const story = MOCK_STORIES.find(s => s.id === storyId);
  const { isAuthenticated } = useAuth();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(story?.likesCount || 0);
  const [commentText, setCommentText] = useState("");
  const [showReplyFor, setShowReplyFor] = useState<number | null>(null);

  const category = CATEGORIES.find(c => c.id === story?.category);

  const relatedStories = useMemo(() => {
    if (!story) return [];
    return MOCK_STORIES.filter(s => s.id !== story.id && (s.category === story.category || s.country === story.country)).slice(0, 3);
  }, [story]);

  const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (!story) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 pt-20 text-center">
          <div className="text-6xl mb-4">📰</div>
          <h2 className="text-2xl font-bold mb-2">Story not found</h2>
          <Link href="/trends" className="text-neon-cyan hover:underline">Back to Trends</Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showTicker={false}>
      <OGMeta
        category={story.category}
        title={`${story.title} — GlobalPulse`}
        description={story.summary || story.title}
      />
      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Back button */}
        <Link href="/trends">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Trends
          </motion.button>
        </Link>

        {/* Hero Image */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl overflow-hidden mb-6">
          <img src={story.imageUrl} alt="" className="w-full h-64 md:h-80 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-lg bg-gradient-to-r ${category?.color} text-white text-xs font-bold`}>
                {category?.emoji} {category?.label}
              </span>
              <span className="px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-mono">
                #{story.rank}
              </span>
              <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-orange-400 text-xs font-mono">
                <Flame className="w-3 h-3" /> {story.heatScore}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Title + Meta */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3">{story.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
            <span className="text-lg">{story.countryFlag}</span>
            <span>{story.sourceName}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(story.publishedAt)}</span>
            {story.city && <><span>•</span><span className="flex items-center gap-1"><Globe className="w-3 h-3" />{story.city}</span></>}
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
          <p className="text-lg leading-relaxed text-foreground/90">{story.summary}</p>
        </motion.div>

        {/* AI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20 mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">AI</span>
            </div>
            <span className="text-sm font-semibold text-neon-cyan">AI Analysis & Summary</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">{story.aiSummary}</p>
        </motion.div>

        {/* Source Link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mb-8">
          <a href={story.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card/50 border border-border/30 text-sm hover:border-neon-cyan/40 transition-all">
            <ExternalLink className="w-4 h-4" /> Read full story on {story.sourceName}
          </a>
        </motion.div>

        {/* Engagement Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-6 p-4 rounded-xl bg-card/50 border border-border/30 mb-8"
        >
          <button
            onClick={() => { setLiked(!liked); setLikeCount(prev => liked ? prev - 1 : prev + 1); }}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${liked ? "text-neon-magenta" : "text-muted-foreground hover:text-neon-magenta"}`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            {formatCount(likeCount)}
          </button>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="w-5 h-5" /> {MOCK_COMMENTS.length + MOCK_COMMENTS.reduce((acc, c) => acc + c.replies.length, 0)} comments
          </span>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto">
            <Share2 className="w-5 h-5" /> Share
          </button>
        </motion.div>

        {/* Comments Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-neon-cyan" /> Comments
          </h2>

          {/* Comment Input */}
          {isAuthenticated ? (
            <div className="flex gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta flex items-center justify-center text-sm font-bold text-white shrink-0">
                U
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 rounded-xl bg-card/50 border border-border/30 text-sm resize-none focus:outline-none focus:border-neon-cyan/50 min-h-[80px]"
                />
                <div className="flex justify-end mt-2">
                  <button
                    disabled={!commentText.trim()}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-magenta text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" /> Post
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-card/30 border border-border/20 text-center mb-6">
              <a href={getLoginUrl()} className="text-sm text-neon-cyan hover:underline">Sign in to comment</a>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {MOCK_COMMENTS.map(comment => (
              <div key={comment.id} className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-card/80 border border-border/30 flex items-center justify-center text-sm font-bold shrink-0">
                    {comment.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">{comment.user}</span>
                      <span className="text-xs text-muted-foreground">{comment.time}</span>
                    </div>
                    <p className="text-sm text-foreground/90 mb-2">{comment.text}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <ThumbsUp className="w-3 h-3" /> {comment.likes}
                      </button>
                      <button className="hover:text-foreground transition-colors">
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setShowReplyFor(showReplyFor === comment.id ? null : comment.id)}
                        className="hover:text-neon-cyan transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-12 space-y-3 border-l-2 border-border/20 pl-4">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-card/80 border border-border/30 flex items-center justify-center text-xs font-bold shrink-0">
                          {reply.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold">{reply.user}</span>
                            <span className="text-xs text-muted-foreground">{reply.time}</span>
                          </div>
                          <p className="text-sm text-foreground/90">{reply.text}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                              <ThumbsUp className="w-3 h-3" /> {reply.likes}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Related Stories */}
        {relatedStories.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-xl font-bold mb-4">Related Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedStories.map((s, i) => (
                <StoryCard key={s.id} story={s} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
