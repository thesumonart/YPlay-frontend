import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/Avatar";
import { formatDuration, formatViews, timeAgo } from "@/lib/utils";
import type { Video } from "@/types";

interface SearchResultCardProps {
  video: Video;
}

export function SearchResultCard({ video }: SearchResultCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group flex gap-4"
    >
      {/* Thumbnail */}
      <Link
        href={`/watch/${video.id}`}
        className="relative shrink-0 w-44 sm:w-64 md:w-80 aspect-video rounded-xl overflow-hidden bg-surface-secondary"
      >
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 176px, (max-width: 768px) 256px, 320px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
          {formatDuration(video.duration)}
        </span>
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-2 flex-1 min-w-0 py-1">
        <Link
          href={`/watch/${video.id}`}
          className="text-sm sm:text-base font-semibold text-text line-clamp-2 leading-snug hover:text-primary transition-colors"
        >
          {video.title}
        </Link>

        <p className="text-xs text-text-secondary">
          {formatViews(video.views)} views · {timeAgo(video.publishedAt)}
        </p>

        <Link
          href={`/channel/${video.channel.id}`}
          className="flex items-center gap-2 group/ch"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={video.channel.avatar} alt={video.channel.name} />
            <AvatarFallback>{video.channel.name[0]}</AvatarFallback>
          </Avatar>
          <span className="flex items-center gap-1 text-xs text-text-secondary group-hover/ch:text-text transition-colors">
            {video.channel.name}
            {video.channel.verified && <CheckCircle2 className="h-3 w-3" />}
          </span>
        </Link>

        <p className="hidden md:block text-xs text-text-secondary line-clamp-2 leading-relaxed mt-1">
          {video.description}
        </p>
      </div>
    </motion.article>
  );
}
