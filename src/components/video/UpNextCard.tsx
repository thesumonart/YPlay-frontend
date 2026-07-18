"use client";

import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { VideoCardMenu } from "@/components/video/VideoCardMenu";
import { formatDuration, formatViews, timeAgo } from "@/lib/utils";
import type { Video } from "@/types";

interface UpNextCardProps {
  video: Video;
}

export function UpNextCard({ video }: UpNextCardProps) {
  return (
    <div className="group flex gap-3 rounded-xl p-2 -mx-2 hover:bg-surface-secondary transition-colors">
      {/* Thumbnail */}
      <div className="relative shrink-0 w-40 aspect-video rounded-lg overflow-hidden bg-surface-secondary">
        <Link href={`/watch/${video.id}`} className="block w-full h-full">
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
        </Link>
        <VideoCardMenu videoId={video.id} videoTitle={video.title} />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <Link
          href={`/watch/${video.id}`}
          className="text-sm font-semibold text-text line-clamp-2 leading-snug hover:text-primary transition-colors"
        >
          {video.title}
        </Link>
        <p className="flex items-center gap-1 text-xs text-text-secondary">
          {video.channel.name}
          {video.channel.verified && <CheckCircle2 className="h-3 w-3" />}
        </p>
        <p className="text-xs text-text-secondary">
          {formatViews(video.views)} · {timeAgo(video.publishedAt)}
        </p>
      </div>
    </div>
  );
}
