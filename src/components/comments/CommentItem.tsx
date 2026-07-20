"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Pin, ThumbsUp } from "lucide-react";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/Avatar";
import { cn, formatViews, timeAgo } from "@/lib/utils";
import type { Comment } from "@/types";

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
}

export function CommentItem({ comment, isReply = false }: CommentItemProps) {
  const [liked, setLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [localReplies, setLocalReplies] = useState<Comment[]>(comment.replies ?? []);
  const likeCount = comment.likes + (liked ? 1 : 0);

  const submitReply = () => {
    const trimmed = replyInput.trim();
    if (!trimmed) return;
    const newReply: Comment = {
      id: `r-${Date.now()}`,
      videoId: comment.videoId,
      author: { id: "me", name: "You", handle: "@yourhandle", avatar: "https://i.pravatar.cc/150?img=33", subscribers: 0, verified: false, joinedAt: "2024-01-01", totalViews: 0, videoCount: 0 },
      content: trimmed,
      likes: 0,
      publishedAt: new Date().toISOString(),
    };
    setLocalReplies((prev) => [...prev, newReply]);
    setReplyInput("");
    setReplying(false);
    setShowReplies(true);
  };

  return (
    <div className={cn("flex gap-3", isReply && "ml-10 mt-3")}>
      <Avatar className={cn("shrink-0", isReply ? "h-7 w-7" : "h-9 w-9")}>
        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-text">
            {comment.author.name}
          </span>
          {comment.isPinned && (
            <span className="flex items-center gap-1 text-[11px] text-text-secondary">
              <Pin className="h-3 w-3" /> Pinned
            </span>
          )}
          <span className="text-xs text-text-secondary">
            {timeAgo(comment.publishedAt)}
          </span>
        </div>

        <p className="text-sm text-text leading-relaxed">{comment.content}</p>

        <div className="flex items-center gap-3 mt-0.5">
          <button
            onClick={() => setLiked((l) => !l)}
            aria-label="Like comment"
            aria-pressed={liked}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors",
              liked ? "text-primary" : "text-text-secondary hover:text-text",
            )}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{formatViews(likeCount)}</span>
          </button>

          {!isReply && (
            <button
              onClick={() => setReplying((r) => !r)}
              className="text-xs text-text-secondary hover:text-text font-medium transition-colors"
            >
              Reply
            </button>
          )}
        </div>

        {/* Reply input */}
        <AnimatePresence>
          {replying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-2"
            >
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitReply();
                    if (e.key === "Escape") { setReplying(false); setReplyInput(""); }
                  }}
                  placeholder={`Reply to ${comment.author.name}…`}
                  aria-label="Write a reply"
                  className="flex-1 border-b border-border bg-transparent pb-1.5 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:border-text transition-colors"
                />
                <button
                  onClick={submitReply}
                  disabled={!replyInput.trim()}
                  className="text-xs font-semibold text-primary disabled:opacity-40 transition-colors"
                >
                  Reply
                </button>
                <button
                  onClick={() => { setReplying(false); setReplyInput(""); }}
                  className="text-xs font-medium text-text-secondary hover:text-text transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Replies toggle */}
        {!isReply && localReplies.length > 0 && (
          <div>
            <button
              onClick={() => setShowReplies((s) => !s)}
              className="flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-primary transition-colors mt-1"
            >
              {showReplies ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
              {localReplies.length}{" "}
              {localReplies.length === 1 ? "reply" : "replies"}
            </button>

            <AnimatePresence>
              {showReplies && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {localReplies.map((reply) => (
                    <CommentItem key={reply.id} comment={reply} isReply />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
