"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Video } from "@/types";
import type { Comment } from "@/types";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { VideoActions } from "@/components/player/VideoActions";
import { VideoInfo } from "@/components/player/VideoInfo";
import { CommentSection } from "@/components/comments/CommentSection";
import { UpNextCard } from "@/components/video/UpNextCard";
import { AutoplayCountdown } from "@/components/video/AutoplayCountdown";

interface WatchViewProps {
  video: Video;
  upNext: Video[];
  comments: Comment[];
}

export function WatchView({ video, upNext, comments }: WatchViewProps) {
  const [autoplay, setAutoplay] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);

  const handleEnded = () => {
    if (autoplay && upNext[0]) setShowCountdown(true);
  };

  const handleCancel = () => setShowCountdown(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col xl:flex-row gap-6"
    >
      {/* Main column */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <VideoPlayer
          video={video}
          onEnded={handleEnded}
          autoplay={autoplay}
          onAutoplayToggle={setAutoplay}
        />
        <VideoActions video={video} />
        <VideoInfo video={video} />
        <div className="border-t border-border pt-6">
          <CommentSection comments={comments} videoId={video.id} />
        </div>
      </div>

      {/* Up Next sidebar */}
      <aside className="w-full xl:w-96 shrink-0 flex flex-col gap-3">
        {/* Autoplay countdown — replaces the "Up Next" header when active */}
        <AnimatePresence mode="wait">
          {showCountdown && upNext[0] ? (
            <AutoplayCountdown
              key="countdown"
              video={upNext[0]}
              onCancel={handleCancel}
            />
          ) : (
            <motion.h2
              key="header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-semibold text-text"
            >
              Up Next
            </motion.h2>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-1">
          {upNext.map((v) => (
            <UpNextCard key={v.id} video={v} />
          ))}
        </div>
      </aside>
    </motion.div>
  );
}
