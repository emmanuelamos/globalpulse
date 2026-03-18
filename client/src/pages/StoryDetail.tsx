import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Heart, MessageCircle, Share2, Flame, ArrowLeft, ExternalLink,
  ThumbsUp, ThumbsDown, Send, Clock, Globe, Loader2
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import StoryCard from "@/components/StoryCard";
import { CATEGORIES } from "@/lib/mockData";
import { useRoute, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import OGMeta from "@/components/OGMeta";
import { trpc } from "@/lib/trpc";

export default function StoryDetail() {
  const [, params] = useRoute("/story/:id");
  const storyId = Number(params?.id);
  const { isAuthenticated, user } = useAuth(); // Assuming useAuth provides the current user

  // ─── DATA FETCHING ────────────────────────────────────────────────────────
  // 1. Fetch the actual story
  const { data: story, isLoading: isLoadingStory } = trpc.stories.byId.useQuery(
    { id: storyId },
    { enabled: !!storyId && !isNaN(storyId) } // Only run if we have a valid ID
  );

  // 2. Fetch the actual comments
  const { data: comments, isLoading: isLoadingComments } = trpc.comments.byStory.useQuery(
    { storyId },
    { enabled: !!storyId && !isNaN(storyId) }
  );

  // Optional: Fetch related stories (Assuming you have a router for this)
  // const { data: relatedStories } = trpc.stories.getRelated.useQuery({ category: story?.category });

  // ─── MUTATIONS ────────────────────────────────────────────────────────────
  const utils = trpc.useContext();
  
  const toggleLike = trpc.likes.toggle.useMutation({
    onMutate: () => {
      // Optimistic update for snappy UI
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
    }
  });

  const createComment = trpc.comments.create.useMutation({
    onSuccess: () => {
      setCommentText("");
      setReplyText("");
      setShowReplyFor(null);
      utils.comments.byStory.invalidate({ storyId }); // Refresh comments instantly
    }
  });

  // ─── LOCAL STATE ──────────────────────────────────────────────────────────
  // Initialize from DB once story loads
  const [liked, setLiked] = useState(false); 
  const [likeCount, setLikeCount] = useState(0);
  
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [showReplyFor, setShowReplyFor] = useState<number | null>(null);

  // ─── HELPERS ──────────────────────────────────────────────────────────────
  // Group comments into top-level and replies based on your `parentId` column
  const topLevelComments = useMemo(() => comments?.filter((c: any) => !c.parentId) || [], [comments]);
  const getReplies = (parentId: number) => comments?.filter((c: any) => c.parentId === parentId) || [];

  const category = CATEGORIES.find(c => c.id === story?.category);
  const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();
  const timeAgo = (dateStr: string | Date) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // ─── HANDLERS ─────────────────────────────────────────────────────────────
  const handleLike = () => {
    if (!isAuthenticated) return; // Optional: redirect to login
    toggleLike.mutate({ storyId });
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    createComment.mutate({ storyId, content: commentText });
  };

  const handlePostReply = (parentId: number) => {
    if (!replyText.trim()) return;
    createComment.mutate({ storyId, parentId, content: replyText });
  };

  // ─── RENDER STATES ────────────────────────────────────────────────────────
  if (isLoadingStory) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
        </div>
      </AppLayout>
    );
  }

  if (!story || isNaN(storyId)) {
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
      <OGMeta category={story.category} title={`${story.title} — GlobalPulse`} description={story.summary || story.title} />
      
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Link href="/trends">
          <motion.button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Trends
          </motion.button>
        </Link>

        {/* Hero Image */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl overflow-hidden mb-6">
          <img src={story.imageUrl || ""} alt="" className="w-full h-64 md:h-80 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-lg bg-gradient-to-r ${category?.color || 'from-gray-500 to-gray-700'} text-white text-xs font-bold`}>
                {category?.emoji} {category?.label || story.category}
              </span>
              <span className="px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-mono">
                #{story.rank || 0}
              </span>
              <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-orange-400 text-xs font-mono">
                <Flame className="w-3 h-3" /> {story.heatScore || 0}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Title + Meta */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3">{story.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
            <span className="text-lg">{story.country || "🌍"}</span>
            <span>{story.sourceName}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(story.publishedAt || story.createdAt)}</span>
            {story.city && <><span>•</span><span className="flex items-center gap-1"><Globe className="w-3 h-3" />{story.city}</span></>}
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
          <p className="text-lg leading-relaxed text-foreground/90">{story.summary}</p>
        </motion.div>

        {/* AI Summary */}
        {story.aiSummary && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">AI</span>
              </div>
              <span className="text-sm font-semibold text-neon-cyan">AI Analysis & Summary</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">{story.aiSummary}</p>
          </motion.div>
        )}

        {/* Source Link */}
        {story.sourceUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mb-8">
            <a href={story.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card/50 border border-border/30 text-sm hover:border-neon-cyan/40 transition-all">
              <ExternalLink className="w-4 h-4" /> Read full story on {story.sourceName}
            </a>
          </motion.div>
        )}

        {/* Engagement Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-6 p-4 rounded-xl bg-card/50 border border-border/30 mb-8">
          <button onClick={handleLike} className={`flex items-center gap-2 text-sm font-semibold transition-colors ${liked ? "text-neon-magenta" : "text-muted-foreground hover:text-neon-magenta"}`}>
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            {formatCount(story.likesCount || likeCount)}
          </button>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="w-5 h-5" /> {comments?.length || 0} comments
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
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 rounded-xl bg-card/50 border border-border/30 text-sm resize-none focus:outline-none focus:border-neon-cyan/50 min-h-[80px]"
                />
                <div className="flex justify-end mt-2">
                  <button onClick={handlePostComment} disabled={!commentText.trim() || createComment.isPending} className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-magenta text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center gap-1">
                    {createComment.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />} Post
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
          {isLoadingComments ? (
            <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="space-y-4">
              {topLevelComments.map((comment: any) => {
                const replies = getReplies(comment.id);
                return (
                  <div key={comment.id} className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-card/80 border border-border/30 flex items-center justify-center text-sm font-bold shrink-0 uppercase">
                        {comment.user?.name?.substring(0,2) || "AN"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">{comment.user?.name || "Anonymous"}</span>
                          <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm text-foreground/90 mb-2">{comment.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <button onClick={() => setShowReplyFor(showReplyFor === comment.id ? null : comment.id)} className="hover:text-neon-cyan transition-colors">
                            Reply
                          </button>
                        </div>

                        {/* Reply Input Form */}
                        {showReplyFor === comment.id && isAuthenticated && (
                          <div className="mt-3 flex gap-2">
                             <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." className="flex-1 px-3 py-2 text-sm bg-background border border-border/30 rounded-lg focus:outline-none focus:border-neon-cyan" />
                             <button onClick={() => handlePostReply(comment.id)} disabled={!replyText.trim()} className="px-3 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg text-sm font-medium disabled:opacity-50">Send</button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Render Replies */}
                    {replies.length > 0 && (
                      <div className="ml-12 space-y-3 border-l-2 border-border/20 pl-4">
                        {replies.map((reply: any) => (
                          <div key={reply.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-card/80 border border-border/30 flex items-center justify-center text-xs font-bold shrink-0 uppercase">
                              {reply.user?.name?.substring(0,2) || "AN"}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold">{reply.user?.name || "Anonymous"}</span>
                                <span className="text-xs text-muted-foreground">{timeAgo(reply.createdAt)}</span>
                              </div>
                              <p className="text-sm text-foreground/90">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {topLevelComments.length === 0 && <p className="text-center text-sm text-muted-foreground">No comments yet. Be the first!</p>}
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}