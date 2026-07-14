"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, Pin, ChevronDown, ChevronUp } from "lucide-react";
import type { Comment } from "@/types";
import { formatViews, timeAgo } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shared/Avatar";
import { cn } from "@/lib/utils";

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
}

export function CommentItem({ comment, isReply = false }: CommentItemProps) {
  const [liked, setLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const likeCount = comment.likes + (liked ? 1 : 0);

  return (
    <div className={cn("flex gap-3", isReply && "ml-10 mt-3")}>
      <Avatar className={cn("shrink-0", isReply ? "h-7 w-7" : "h-9 w-9")}>
        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-[var(--text)]">{comment.author.name}</span>
          {comment.isPinned && (
            <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
              <Pin className="h-3 w-3" /> Pinned
            </span>
          )}
          <span className="text-xs text-[var(--text-secondary)]">{timeAgo(comment.publishedAt)}</span>
        </div>

        <p className="text-sm text-[var(--text)] leading-relaxed">{comment.content}</p>

        <div className="flex items-center gap-3 mt-0.5">
          <button
            onClick={() => setLiked((l) => !l)}
            aria-label="Like comment"
            aria-pressed={liked}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors",
              liked ? "text-[var(--primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"
            )}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{formatViews(likeCount)}</span>
          </button>

          {!isReply && (
            <button className="text-xs text-[var(--text-secondary)] hover:text-[var(--text)] font-medium transition-colors">
              Reply
            </button>
          )}
        </div>

        {/* Replies toggle */}
        {!isReply && comment.replies && comment.replies.length > 0 && (
          <div>
            <button
              onClick={() => setShowReplies((s) => !s)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--secondary)] hover:text-[var(--primary)] transition-colors mt-1"
            >
              {showReplies ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
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
                  {comment.replies.map((reply) => (
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
