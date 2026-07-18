"use client";

import { motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/shared/Button";
import type { HistoryEntry } from "@/data/history";
import { formatDuration, formatViews, timeAgo } from "@/lib/utils";

interface HistoryCardProps {
  entry: HistoryEntry;
  onRemove?: (videoId: string) => void;
}

export function HistoryCard({ entry, onRemove }: HistoryCardProps) {
  const { video, watchedAt, progressSeconds } = entry;
  const progressPct = Math.min(
    100,
    Math.round((progressSeconds / video.duration) * 100),
  );
  const completed = progressPct >= 95;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="group flex gap-4"
    >
      {/* Thumbnail */}
      <Link
        href={`/watch/${video.id}`}
        className="relative shrink-0 w-40 sm:w-52 md:w-64 aspect-video rounded-xl overflow-hidden bg-surface-secondary"
      >
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 160px, (max-width: 768px) 208px, 256px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
          {formatDuration(video.duration)}
        </span>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {completed && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-xs font-semibold text-white bg-black/60 px-2 py-1 rounded-md">
              Watched
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0 py-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/watch/${video.id}`}
            className="text-sm font-semibold text-text line-clamp-2 leading-snug hover:text-primary transition-colors"
          >
            {video.title}
          </Link>
          {onRemove && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onRemove(video.id)}
              aria-label="Remove from history"
              className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <Link
          href={`/channel/${video.channel.id}`}
          className="flex items-center gap-1 text-xs text-text-secondary hover:text-text transition-colors w-fit"
        >
          {video.channel.name}
          {video.channel.verified && <CheckCircle2 className="h-3 w-3" />}
        </Link>

        <p className="text-xs text-text-secondary">
          {formatViews(video.views)} views · {timeAgo(video.publishedAt)}
        </p>

        <p className="text-xs text-text-secondary mt-auto">
          Watched {timeAgo(watchedAt)} · {progressPct}% complete
        </p>
      </div>
    </motion.article>
  );
}
