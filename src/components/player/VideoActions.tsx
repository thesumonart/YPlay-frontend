"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Share2, BookmarkPlus, MoreHorizontal } from "lucide-react";
import type { Video } from "@/types";
import { formatViews } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/Button";
import { ShareModal } from "@/components/shared/ShareModal";

interface VideoActionsProps {
  video: Video;
}

export function VideoActions({ video }: VideoActionsProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/watch/${video.id}`
    : `https://yplay.app/watch/${video.id}`;

  const likeCount = video.likes + (liked ? 1 : 0);

  const handleLike = () => {
    setLiked((l) => !l);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked((d) => !d);
    if (liked) setLiked(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Like / Dislike pill */}
      <div className="flex items-center rounded-lg border border-[var(--border)] overflow-hidden">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          aria-label="Like"
          aria-pressed={liked}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-r border-[var(--border)]",
            liked
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text)]"
          )}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{formatViews(likeCount)}</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleDislike}
          aria-label="Dislike"
          aria-pressed={disliked}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
            disliked
              ? "bg-[var(--surface-secondary)] text-[var(--text)]"
              : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text)]"
          )}
        >
          <ThumbsDown className="h-4 w-4" />
        </motion.button>
      </div>

      <Button variant="secondary" size="md" className="gap-2" onClick={() => setShareOpen(true)}>
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        url={shareUrl}
        title={video.title}
        videoId={video.id}
      />

      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="secondary"
          size="md"
          className={cn("gap-2", saved && "text-[var(--primary)]")}
          onClick={() => setSaved((s) => !s)}
          aria-pressed={saved}
        >
          <BookmarkPlus className="h-4 w-4" />
          {saved ? "Saved" : "Save"}
        </Button>
      </motion.div>

      <Button variant="ghost" size="icon" aria-label="More options" className="ml-auto">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
