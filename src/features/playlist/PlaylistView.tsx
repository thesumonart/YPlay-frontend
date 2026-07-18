"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { VideoActions } from "@/components/player/VideoActions";
import { VideoInfo } from "@/components/player/VideoInfo";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { PlaylistHeader } from "@/components/video/PlaylistHeader";
import { PlaylistVideoRow } from "@/components/video/PlaylistVideoRow";
import type { Playlist } from "@/types";

interface PlaylistViewProps {
  playlist: Playlist;
}

export function PlaylistView({ playlist }: PlaylistViewProps) {
  const [videos, setVideos] = useState(playlist.videos);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeVideo = videos.find((v) => v.id === activeId) ?? null;

  const handlePlay = useCallback(
    (id?: string) => {
      setActiveId(id ?? videos[0]?.id ?? null);
    },
    [videos],
  );

  const handleShuffle = useCallback(() => {
    const shuffled = [...videos].sort(() => Math.random() - 0.5);
    setVideos(shuffled);
    setActiveId(shuffled[0]?.id ?? null);
  }, [videos]);

  const handleRemove = useCallback(
    (id: string) => {
      setVideos((prev) => prev.filter((v) => v.id !== id));
      if (activeId === id) setActiveId(null);
    },
    [activeId],
  );

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Left: active player or header */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {activeVideo ? (
            <motion.div
              key={activeVideo.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4"
            >
              <VideoPlayer video={activeVideo} />
              <VideoActions video={activeVideo} />
              <VideoInfo video={activeVideo} />
            </motion.div>
          ) : (
            <motion.div
              key="header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Show playlist header in main area on desktop when nothing is playing */}
              <div className="xl:hidden">
                <PlaylistHeader
                  playlist={{ ...playlist, videos }}
                  onPlay={() => handlePlay()}
                  onShuffle={handleShuffle}
                />
              </div>
              <div className="hidden xl:block rounded-2xl border border-border bg-surface-secondary aspect-video flex items-center justify-center">
                <p className="text-sm text-text-secondary text-center p-8">
                  Select a video from the queue to start playing
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: playlist sidebar */}
      <aside className="w-full xl:w-96 shrink-0 flex flex-col gap-4">
        {/* Header — only visible on xl+ */}
        <div className="hidden xl:block">
          <PlaylistHeader
            playlist={{ ...playlist, videos }}
            onPlay={() => handlePlay()}
            onShuffle={handleShuffle}
          />
        </div>

        {/* Queue */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-text">
              Queue
              <span className="ml-2 text-xs font-normal text-text-secondary">
                {videos.length} {videos.length === 1 ? "video" : "videos"}
              </span>
            </p>
          </div>

          <AnimatePresence>
            {videos.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8 text-center text-sm text-text-secondary"
              >
                No videos in this playlist
              </motion.p>
            ) : (
              videos.map((video, i) => (
                <PlaylistVideoRow
                  key={video.id}
                  video={video}
                  index={i}
                  active={video.id === activeId}
                  onPlay={handlePlay}
                  onRemove={handleRemove}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
}
