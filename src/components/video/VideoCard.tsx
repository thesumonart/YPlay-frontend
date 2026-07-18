"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/Avatar";
import { VideoCardMenu } from "@/components/video/VideoCardMenu";
import { cn, formatDuration, formatViews, timeAgo } from "@/lib/utils";
import type { Video } from "@/types";

interface VideoCardProps {
  video: Video;
  className?: string;
}

export function VideoCard({ video, className }: VideoCardProps) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={cn("group flex flex-col gap-3", className)}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-xl bg-surface-secondary aspect-video">
        <Link href={`/watch/${video.id}`} className="block w-full h-full">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {formatDuration(video.duration)}
          </span>
        </Link>
        {/* Context menu — sits above the link */}
        <VideoCardMenu videoId={video.id} videoTitle={video.title} />
      </div>

      {/* Meta */}
      <div className="flex gap-3">
        <Link href={`/channel/${video.channel.id}`} className="shrink-0 mt-0.5">
          <Avatar className="h-9 w-9">
            <AvatarImage src={video.channel.avatar} alt={video.channel.name} />
            <AvatarFallback>{video.channel.name[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            href={`/watch/${video.id}`}
            className="text-sm font-semibold text-text line-clamp-2 leading-snug hover:text-primary transition-colors"
          >
            {video.title}
          </Link>
          <Link
            href={`/channel/${video.channel.id}`}
            className="flex items-center gap-1 text-xs text-text-secondary hover:text-text transition-colors"
          >
            {video.channel.name}
            {video.channel.verified && (
              <CheckCircle2 className="h-3 w-3 text-text-secondary" />
            )}
          </Link>
          <p className="text-xs text-text-secondary">
            {formatViews(video.views)} views · {timeAgo(video.publishedAt)}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
