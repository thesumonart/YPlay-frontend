import { motion } from "framer-motion";
import { CheckCircle2, Flame, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn, formatDuration, formatViews, timeAgo } from "@/lib/utils";
import type { Video } from "@/types";

interface TrendingCardProps {
  video: Video;
  rank: number;
}

export function TrendingCard({ video, rank }: TrendingCardProps) {
  const isTop3 = rank <= 3;

  return (
    <motion.article
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.04 }}
      className="group flex gap-4 rounded-xl p-3 -mx-3 hover:bg-surface-secondary transition-colors"
    >
      {/* Rank */}
      <div
        className={cn(
          "flex shrink-0 w-10 items-start justify-center pt-1",
          isTop3 ? "text-primary" : "text-text-secondary",
        )}
      >
        <span
          className={cn(
            "font-bold tabular-nums leading-none",
            rank === 1 ? "text-3xl" : rank <= 3 ? "text-2xl" : "text-lg",
          )}
        >
          {rank}
        </span>
      </div>

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
        {isTop3 && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-primary px-1.5 py-0.5">
            <Flame className="h-3 w-3 text-white" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wide">
              Hot
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-2 flex-1 min-w-0 py-1">
        <Link
          href={`/watch/${video.id}`}
          className="text-sm sm:text-base font-semibold text-text line-clamp-2 leading-snug hover:text-primary transition-colors"
        >
          {video.title}
        </Link>

        <Link
          href={`/channel/${video.channel.id}`}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text transition-colors w-fit"
        >
          {video.channel.name}
          {video.channel.verified && <CheckCircle2 className="h-3 w-3" />}
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-success" />
            {formatViews(video.views)} views
          </span>
          <span>{timeAgo(video.publishedAt)}</span>
          <span className="hidden sm:inline capitalize rounded-md bg-surface-secondary px-2 py-0.5 font-medium">
            {video.category}
          </span>
        </div>

        <p className="hidden md:block text-xs text-text-secondary line-clamp-2 leading-relaxed mt-1">
          {video.description}
        </p>
      </div>
    </motion.article>
  );
}
