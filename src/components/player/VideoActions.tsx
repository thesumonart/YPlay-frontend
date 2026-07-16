"use client";

import { useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Share2, BookmarkPlus, MoreHorizontal, ListPlus, Ban, Flag } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { Video } from "@/types";
import { formatViews } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/Button";
import { ShareModal } from "@/components/shared/ShareModal";
import { AddToPlaylistModal } from "@/components/shared/AddToPlaylistModal";

interface VideoActionsProps {
  video: Video;
}

export function VideoActions({ video }: VideoActionsProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
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
          className="gap-2"
          onClick={() => setSaveOpen(true)}
          aria-label="Save to playlist"
        >
          <BookmarkPlus className="h-4 w-4" />
          Save
        </Button>
      </motion.div>

      <AddToPlaylistModal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        videoId={video.id}
      />

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="ghost" size="icon" aria-label="More options" className="ml-auto">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={6}
            className={cn(
              "z-50 min-w-[180px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            )}
          >
            {([
              { icon: ListPlus, label: "Add to queue",   action: () => {} },
              { icon: Ban,      label: "Not interested", action: () => {} },
              { icon: Flag,     label: "Report",         action: () => {}, danger: true },
            ] as { icon: React.ElementType; label: string; action: () => void; danger?: boolean }[]).map(({ icon: Icon, label, action, danger }) => (
              <DropdownMenu.Item
                key={label}
                onSelect={action}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors select-none",
                  danger
                    ? "text-[var(--danger)] focus:bg-[var(--danger)]/10"
                    : "text-[var(--text-secondary)] focus:bg-[var(--surface-secondary)] focus:text-[var(--text)]",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
