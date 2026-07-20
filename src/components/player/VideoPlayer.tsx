"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Keyboard,
  Maximize,
  Pause,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn, formatDuration } from "@/lib/utils";
import type { Video } from "@/types";

interface VideoPlayerProps {
  video: Video;
  onEnded?: () => void;
  autoplay?: boolean;
  onAutoplayToggle?: (val: boolean) => void;
}

const SHORTCUTS = [
  { keys: ["K", "Space"], label: "Play / Pause" },
  { keys: ["J"], label: "Rewind 10s" },
  { keys: ["L"], label: "Forward 10s" },
  { keys: ["←"], label: "Rewind 5s" },
  { keys: ["→"], label: "Forward 5s" },
  { keys: ["M"], label: "Mute / Unmute" },
  { keys: ["F"], label: "Fullscreen" },
  { keys: ["?"], label: "Show shortcuts" },
];

export function VideoPlayer({
  video,
  onEnded,
  autoplay = true,
  onAutoplayToggle,
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showPlayPulse, setShowPlayPulse] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance progress while playing
  useEffect(() => {
    if (playing) {
      progressTimer.current = setInterval(() => {
        setProgress((p) => {
          const next = p + 1 / (video.duration * 10);
          if (next >= 1) {
            clearInterval(progressTimer.current!);
            setPlaying(false);
            onEnded?.();
            return 1;
          }
          return next;
        });
      }, 100);
    } else {
      if (progressTimer.current) clearInterval(progressTimer.current);
    }
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [playing, video.duration, onEnded]);

  const nudge = useCallback(
    (seconds: number) => {
      setProgress((p) => {
        const next = Math.max(0, Math.min(1, p + seconds / video.duration));
        if (next >= 1) onEnded?.();
        return next;
      });
    },
    [video.duration, onEnded],
  );

  const togglePlay = useCallback(() => {
    setPlaying((p) => !p);
    setShowPlayPulse(true);
    setTimeout(() => setShowPlayPulse(false), 600);
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target as HTMLElement).isContentEditable
      )
        return;

      switch (e.key) {
        case "k":
        case "K":
          e.preventDefault();
          setPlaying((p) => !p);
          setShowPlayPulse(true);
          setTimeout(() => setShowPlayPulse(false), 600);
          break;
        case " ":
          if (
            containerRef.current?.contains(document.activeElement) ||
            document.activeElement === document.body
          ) {
            e.preventDefault();
            setPlaying((p) => !p);
            setShowPlayPulse(true);
            setTimeout(() => setShowPlayPulse(false), 600);
          }
          break;
        case "j":
        case "J":
          e.preventDefault();
          nudge(-10);
          break;
        case "l":
        case "L":
          e.preventDefault();
          nudge(10);
          break;
        case "ArrowLeft":
          e.preventDefault();
          nudge(-5);
          break;
        case "ArrowRight":
          e.preventDefault();
          nudge(5);
          break;
        case "m":
        case "M":
          e.preventDefault();
          setMuted((m) => !m);
          break;
        case "f":
        case "F":
          e.preventDefault();
          if (containerRef.current) {
            if (!document.fullscreenElement)
              containerRef.current.requestFullscreen().catch(() => {});
            else document.exitFullscreen().catch(() => {});
          }
          break;
        case "?":
          e.preventDefault();
          setShowShortcuts((s) => !s);
          break;
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [nudge]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    if (playing) {
      controlsTimer.current = setTimeout(() => setShowControls(false), 2500);
    }
  }, [playing]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const next = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setProgress(next);
    if (next >= 1) onEnded?.();
  };

  const skipForward = () => {
    setProgress(1);
    setPlaying(false);
    onEnded?.();
  };

  const elapsed = Math.floor(progress * video.duration);

  return (
    <div
      ref={containerRef}
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
        className={cn(
          "object-cover transition-opacity duration-300",
          playing && "opacity-60",
        )}
      />

      {/* Click overlay */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => {
          setPlaying((p) => !p);
          setShowPlayPulse(true);
          setTimeout(() => setShowPlayPulse(false), 600);
        }}
        role="button"
        aria-label={playing ? "Pause" : "Play"}
        tabIndex={0}
        onKeyDown={(e) => e.key === " " && e.preventDefault()}
      />

      {/* Play pulse */}
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
              {playing ? (
                <Pause className="h-7 w-7 fill-white text-white" />
              ) : (
                <Play className="h-7 w-7 fill-white text-white" />
              )}
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

      {/* Keyboard shortcuts overlay */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/75 backdrop-blur-sm"
            onClick={() => setShowShortcuts(false)}
          >
            <div
              className="w-72 rounded-2xl border border-white/10 bg-black/80 p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-4">
                <Keyboard className="h-4 w-4 text-white/60" />
                <span className="text-sm font-semibold text-white">
                  Keyboard shortcuts
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {SHORTCUTS.map(({ keys, label }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-xs text-white/60">{label}</span>
                    <div className="flex items-center gap-1">
                      {keys.map((k) => (
                        <kbd
                          key={k}
                          className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-white/20 bg-white/10 px-1.5 font-mono text-[11px] font-medium text-white"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-[11px] text-white/30">
                Press ? or click anywhere to close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && !showShortcuts && (
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
              aria-valuetext={`${formatDuration(elapsed)} of ${formatDuration(video.duration)}`}
              tabIndex={0}
            >
              <div
                className="h-full rounded-full bg-primary relative"
                style={{ width: `${progress * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white opacity-0 group-hover/bar:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setPlaying((p) => !p);
                }}
                aria-label={playing ? "Pause" : "Play"}
                className="text-white hover:text-white/80 transition-colors"
              >
                {playing ? (
                  <Pause className="h-5 w-5 fill-white" />
                ) : (
                  <Play className="h-5 w-5 fill-white" />
                )}
              </button>
              <button
                onClick={() => nudge(-10)}
                aria-label="Rewind 10s"
                className="text-white hover:text-white/80 transition-colors"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                onClick={skipForward}
                aria-label="Skip to end"
                className="text-white hover:text-white/80 transition-colors"
              >
                <SkipForward className="h-4 w-4" />
              </button>
              <button
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Unmute" : "Mute"}
                className="text-white hover:text-white/80 transition-colors"
              >
                {muted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <span className="text-xs text-white/80 tabular-nums">
                {formatDuration(elapsed)} / {formatDuration(video.duration)}
              </span>

              <div className="ml-auto flex items-center gap-2">
                {onAutoplayToggle && (
                  <button
                    onClick={() => onAutoplayToggle(!autoplay)}
                    aria-label={
                      autoplay ? "Disable autoplay" : "Enable autoplay"
                    }
                    aria-pressed={autoplay}
                    className={cn(
                      "flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold transition-colors border",
                      autoplay
                        ? "border-white/40 bg-white/10 text-white"
                        : "border-white/20 text-white/40",
                    )}
                  >
                    Autoplay
                  </button>
                )}
                <button
                  onClick={() => setShowShortcuts((s) => !s)}
                  aria-label="Keyboard shortcuts"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <Keyboard className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (!document.fullscreenElement)
                      containerRef.current?.requestFullscreen().catch(() => {});
                    else document.exitFullscreen().catch(() => {});
                  }}
                  aria-label="Fullscreen"
                  className="text-white hover:text-white/80 transition-colors"
                >
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
