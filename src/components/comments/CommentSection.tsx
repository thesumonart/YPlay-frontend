"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/Avatar";
import { Button } from "@/components/shared/Button";
import { currentUser } from "@/data/users";
import { formatViews } from "@/lib/utils";
import type { Comment } from "@/types";
import { CommentItem } from "./CommentItem";

interface CommentSectionProps {
  comments: Comment[];
  videoId: string;
}

export function CommentSection({ comments, videoId }: CommentSectionProps) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>(
    comments.filter((c) => c.videoId === videoId),
  );

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      videoId,
      author: currentUser,
      content: trimmed,
      likes: 0,
      publishedAt: new Date().toISOString(),
      replies: [],
    };
    setLocalComments((prev) => [newComment, ...prev]);
    setInput("");
    setFocused(false);
  };

  const videoComments = localComments;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base font-semibold text-text">
        {formatViews(videoComments.length)} Comments
      </h2>

      {/* Comment input */}
      <div className="flex gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>Y</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2 flex-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Add a comment..."
            aria-label="Add a comment"
            className="w-full border-b border-border bg-transparent pb-2 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:border-text transition-colors"
          />
          <motion.div
            initial={false}
            animate={{ height: focused ? "auto" : 0, opacity: focused ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFocused(false);
                  setInput("");
                }}
              >
                Cancel
              </Button>
              <Button size="sm" disabled={!input.trim()} onClick={handleSubmit}>
                Comment
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Comment list */}
      <div className="flex flex-col gap-6">
        {videoComments.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          videoComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
