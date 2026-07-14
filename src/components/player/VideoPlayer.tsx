"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Settings,
  SkipForward, SkipBack,
} from "lucide-react";
import type { Video } from "@/types";
import { formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  video: Video;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showPlayPulse, setShowPlayPulse] = useState(false);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    if (playing) {
      controlsTimer.current = setTimeout(() => setShowControls(false), 2500);
    }
  }, [playing]);

  const togglePlay = () => {
    setPlaying((p) => !p);
    setShowPlayPulse(true);
    setTimeout(() => setShowPlayPulse(false), 600);
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    if (!playing) {
      controlsTimer.current = setTimeout(() => setShowControls(false), 2500);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    setProgress(Math.max(0, Math.min(1, pct)));
  };

  const elapsed = Math.floor(progress * video.duration);

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-black aspect-video group select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Thumbnail */}
      <Image
        src={video.thumbnail}
        alt={video.title}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 70vw"
        className={cn("object-cover transition-opacity duration-300", playing && "opacity-60")}
      />

      {/* Click to play/pause */}
      <div className="absolute inset-0 cursor-pointer" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} role="button" tabIndex={0} onKeyDown={(e) => e.key === " " && togglePlay()} />

      {/* Center play pulse */}
      <AnimatePresence>
        {showPlayPulse && (
          <motion.div
            key="pulse"
            initial={{ opacity: 0.8, scale: 0.6 }}
            animate={{ opacity: 0, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              {playing ? <Play className="h-7 w-7 fill-white text-white" /> : <Pause className="h-7 w-7 fill-white text-white" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Big play button when paused */}
      {!playing && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
            <Play className="h-7 w-7 fill-white text-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pb-3 pt-10"
          >
            {/* Progress bar */}
            <div
              className="group/bar mb-3 h-1 w-full cursor-pointer rounded-full bg-white/30 hover:h-1.5 transition-all duration-150"
              onClick={handleProgressClick}
              role="slider"
              aria-label="Video progress"
              aria-valuenow={Math.round(progress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              tabIndex={0}
            >
              <div
                className="h-full rounded-full bg-[var(--primary)] relative"
                style={{ width: `${progress * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white opacity-0 group-hover/bar:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Bottom controls row */}
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className="text-white hover:text-white/80 transition-colors">
                {playing ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
              </button>
              <button aria-label="Skip back 10s" className="text-white hover:text-white/80 transition-colors">
                <SkipBack className="h-4 w-4" />
              </button>
              <button aria-label="Skip forward 10s" className="text-white hover:text-white/80 transition-colors">
                <SkipForward className="h-4 w-4" />
              </button>
              <button onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} className="text-white hover:text-white/80 transition-colors">
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <span className="text-xs text-white/80 tabular-nums">
                {formatDuration(elapsed)} / {formatDuration(video.duration)}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <button aria-label="Settings" className="text-white hover:text-white/80 transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
                <button aria-label="Fullscreen" className="text-white hover:text-white/80 transition-colors">
                  <Maximize className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
