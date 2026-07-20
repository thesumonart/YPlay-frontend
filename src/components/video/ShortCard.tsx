"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  MessageSquare,
  Pause,
  Play,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/Avatar";
import { ShareModal } from "@/components/shared/ShareModal";
import { CommentSection } from "@/components/comments/CommentSection";
import { mockComments } from "@/data/comments";
import { cn, formatDuration, formatViews } from "@/lib/utils";
import type { Video } from "@/types";

interface ShortCardProps {
  video: Video;
  active: boolean;
}

function ActionButton({
  icon: Icon,
  label,
  count,
  active,
  activeColor = "text-primary",
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  count?: string;
  active?: boolean;
  activeColor?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      aria-label={label}
      className="flex flex-col items-center gap-1"
    >
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20",
          active && activeColor,
        )}
      >
        <Icon className={cn("h-5 w-5 text-white", active && activeColor)} />
      </div>
      {count && (
        <span className="text-[11px] font-medium text-white/90">{count}</span>
      )}
    </motion.button>
  );
}

export function ShortCard({ video, active }: ShortCardProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const videoComments = mockComments.filter((c) => c.videoId === video.id);

  useEffect(() => {
    if (active) {
      setProgress(0);
      setPlaying(true);
      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1) {
            clearInterval(progressRef.current!);
            setPlaying(false);
            return 1;
          }
          return prev + 1 / (video.duration * 10);
        });
      }, 100);
    } else {
      setPlaying(false);
      setProgress(0);
      if (progressRef.current) clearInterval(progressRef.current);
    }
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [active, video.duration]);

  const togglePlay = () => {
    setPlaying((p) => {
      const next = !p;
      if (next) {
        progressRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 1) {
              clearInterval(progressRef.current!);
              return 0;
            }
            return prev + 1 / (video.duration * 10);
          });
        }, 100);
      } else {
        if (progressRef.current) clearInterval(progressRef.current);
      }
      return next;
    });
  };

  const handleLike = () => {
    setLiked((l) => !l);
    if (disliked) setDisliked(false);
  };
  const handleDislike = () => {
    setDisliked((d) => !d);
    if (liked) setLiked(false);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative h-full max-h-[calc(100dvh-var(--header-height))] aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl">
        {/* Thumbnail */}
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 480px) 100vw, 400px"
          className={cn(
            "object-cover transition-opacity duration-300",
            playing && "opacity-70",
          )}
          priority={active}
        />

        {/* Dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Click to play/pause */}
        <button
          className="absolute inset-0 z-10"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
        />

        {/* Center play pulse */}
        <AnimatePresence>
          {!playing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                <Play className="h-7 w-7 fill-white text-white translate-x-0.5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mute button — top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMuted((m) => !m);
          }}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
        >
          {muted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>

        {/* Right-side action buttons */}
        <div className="absolute right-3 bottom-24 z-30 flex flex-col gap-4">
          <ActionButton
            icon={ThumbsUp}
            label="Like"
            count={formatViews(video.likes + (liked ? 1 : 0))}
            active={liked}
            activeColor="text-primary"
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          />
          <ActionButton
            icon={ThumbsDown}
            label="Dislike"
            active={disliked}
            onClick={(e) => {
              e.stopPropagation();
              handleDislike();
            }}
          />
          <ActionButton
            icon={MessageSquare}
            label="Comments"
            count={formatViews(Math.floor(video.likes * 0.04))}
            onClick={(e) => { e.stopPropagation(); setCommentsOpen(true); }}
          />
          <ActionButton
            icon={Share2}
            label="Share"
            onClick={(e) => { e.stopPropagation(); setShareOpen(true); }}
          />
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 pr-16">
          <div className="flex flex-col gap-2">
            {/* Channel */}
            <Link
              href={`/channel/${video.channel.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 w-fit"
            >
              <Avatar className="h-8 w-8 ring-2 ring-white/30">
                <AvatarImage
                  src={video.channel.avatar}
                  alt={video.channel.name}
                />
                <AvatarFallback>{video.channel.name[0]}</AvatarFallback>
              </Avatar>
              <span className="flex items-center gap-1 text-sm font-semibold text-white">
                {video.channel.name}
                {video.channel.verified && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-white/70" />
                )}
              </span>
            </Link>

            {/* Title */}
            <p className="text-sm font-medium text-white leading-snug line-clamp-2">
              {video.title}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-3 text-xs text-white/70">
              <span>{formatViews(video.views)} views</span>
              <span>·</span>
              <span>{formatDuration(video.duration)}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 z-40 h-0.5 bg-white/20">
          <motion.div
            className="h-full bg-primary"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Comments sheet */}
      <AnimatePresence>
        {commentsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setCommentsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[70dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-bold text-text">Comments</h2>
                <button
                  onClick={() => setCommentsOpen(false)}
                  aria-label="Close comments"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-secondary text-text-secondary hover:text-text transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <CommentSection comments={videoComments} videoId={video.id} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Share modal */}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        url={`https://yplay.app/shorts?id=${video.id}`}
        title={video.title}
        videoId={video.id}
      />
    </div>
  );
}
