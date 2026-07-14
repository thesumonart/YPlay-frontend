import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import type { Video } from "@/types";
import { formatViews, formatDuration, timeAgo } from "@/lib/utils";

interface UpNextCardProps {
  video: Video;
}

export function UpNextCard({ video }: UpNextCardProps) {
  return (
    <Link
      href={`/watch/${video.id}`}
      className="group flex gap-3 rounded-xl p-2 -mx-2 hover:bg-[var(--surface-secondary)] transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative shrink-0 w-40 aspect-video rounded-lg overflow-hidden bg-[var(--surface-secondary)]">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          sizes="160px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--text)] line-clamp-2 leading-snug group-hover:text-[var(--primary)] transition-colors">
          {video.title}
        </p>
        <p className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
          {video.channel.name}
          {video.channel.verified && <CheckCircle2 className="h-3 w-3" />}
        </p>
        <p className="text-xs text-[var(--text-secondary)]">
          {formatViews(video.views)} · {timeAgo(video.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
