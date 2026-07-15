"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, X, CheckCircle2 } from "lucide-react";
import type { Video } from "@/types";
import { formatViews, formatDuration, timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PlaylistVideoRowProps {
  video: Video;
  index: number;
  active: boolean;
  onPlay: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function PlaylistVideoRow({
  video,
  index,
  active,
  onPlay,
  onRemove,
}: PlaylistVideoRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={cn(
        "group flex items-center gap-3 rounded-xl p-2 -mx-2 transition-colors cursor-pointer",
        active
          ? "bg-[var(--primary)]/8 border border-[var(--primary)]/20"
          : "hover:bg-[var(--surface-secondary)]"
      )}
      onClick={() => onPlay(video.id)}
    >
      {/* Index / play indicator */}
      <div className="flex w-6 shrink-0 items-center justify-center">
        {active ? (
          <div className="flex gap-0.5 items-end h-4">
            {[1, 2, 3].map((b) => (
              <motion.div
                key={b}
                animate={{ height: ["40%", "100%", "60%", "100%", "40%"] }}
                transition={{ duration: 1, repeat: Infinity, delay: b * 0.15 }}
                className="w-0.5 bg-[var(--primary)] rounded-full"
              />
            ))}
          </div>
        ) : (
          <>
            <span className="text-xs font-medium text-[var(--text-secondary)] group-hover:hidden">
              {index + 1}
            </span>
            <Play className="h-3.5 w-3.5 text-[var(--text-secondary)] hidden group-hover:block fill-current" />
          </>
        )}
      </div>

      {/* Thumbnail */}
      <div className="relative shrink-0 w-24 aspect-video rounded-lg overflow-hidden bg-[var(--surface-secondary)]">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[10px] font-medium text-white">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium line-clamp-2 leading-snug transition-colors",
          active ? "text-[var(--primary)]" : "text-[var(--text)] group-hover:text-[var(--primary)]"
        )}>
          {video.title}
        </p>
        <Link
          href={`/channel/${video.channel.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors w-fit"
        >
          {video.channel.name}
          {video.channel.verified && <CheckCircle2 className="h-3 w-3" />}
        </Link>
        <p className="text-xs text-[var(--text-secondary)]">
          {formatViews(video.views)} views · {timeAgo(video.publishedAt)}
        </p>
      </div>

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(video.id); }}
          aria-label="Remove from playlist"
          className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text)] transition-all opacity-0 group-hover:opacity-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </motion.div>
  );
}
