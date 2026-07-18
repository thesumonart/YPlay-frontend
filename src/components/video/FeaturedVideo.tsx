import { motion } from "framer-motion";
import { CheckCircle2, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { formatDuration, formatViews, timeAgo } from "@/lib/utils";
import type { Video } from "@/types";

interface FeaturedVideoProps {
  video: Video;
}

export function FeaturedVideo({ video }: FeaturedVideoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full overflow-hidden rounded-2xl bg-surface-secondary aspect-[21/9] min-h-[200px]"
    >
      <Image
        src={video.thumbnail}
        alt={video.title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="flex flex-col gap-3 max-w-2xl">
          <div className="flex items-center gap-2 text-white/70 text-xs">
            <span className="rounded-md bg-primary px-2 py-0.5 text-white text-[11px] font-semibold uppercase tracking-wide">
              Featured
            </span>
            <span>{video.category}</span>
            <span>·</span>
            <span>{formatDuration(video.duration)}</span>
          </div>

          <h2 className="text-xl md:text-3xl font-bold text-white leading-tight line-clamp-2">
            {video.title}
          </h2>

          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span className="flex items-center gap-1">
              {video.channel.name}
              {video.channel.verified && (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
            </span>
            <span>·</span>
            <span>{formatViews(video.views)} views</span>
            <span>·</span>
            <span>{timeAgo(video.publishedAt)}</span>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <Button asChild size="lg" className="gap-2 rounded-xl">
              <Link href={`/watch/${video.id}`}>
                <Play className="h-4 w-4 fill-white" />
                Watch Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
