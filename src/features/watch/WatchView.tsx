"use client";

import { motion } from "framer-motion";
import type { Video } from "@/types";
import type { Comment } from "@/types";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { VideoActions } from "@/components/player/VideoActions";
import { VideoInfo } from "@/components/player/VideoInfo";
import { CommentSection } from "@/components/comments/CommentSection";
import { UpNextCard } from "@/components/video/UpNextCard";

interface WatchViewProps {
  video: Video;
  upNext: Video[];
  comments: Comment[];
}

export function WatchView({ video, upNext, comments }: WatchViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col xl:flex-row gap-6"
    >
      {/* Main column */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <VideoPlayer video={video} />
        <VideoActions video={video} />
        <VideoInfo video={video} />
        <div className="border-t border-border pt-6">
          <CommentSection comments={comments} videoId={video.id} />
        </div>
      </div>

      {/* Up Next sidebar */}
      <aside className="w-full xl:w-95 shrink-0 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text">Up Next</h2>
        <div className="flex flex-col gap-1">
          {upNext.map((v) => (
            <UpNextCard key={v.id} video={v} />
          ))}
        </div>
      </aside>
    </motion.div>
  );
}
