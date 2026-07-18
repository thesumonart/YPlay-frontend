"use client";

import { motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatDuration, formatViews, timeAgo } from "@/lib/utils";
import type { Video } from "@/types";

const COUNTDOWN = 5;
const R = 20;
const CIRC = 2 * Math.PI * R;

interface AutoplayCountdownProps {
  video: Video;
  onCancel: () => void;
}

export function AutoplayCountdown({ video, onCancel }: AutoplayCountdownProps) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(COUNTDOWN);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current!);
          router.push(`/watch/${video.id}`);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [video.id, router]);

  const dashOffset = CIRC * (remaining / COUNTDOWN);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-border bg-surface-secondary overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Up next
        </span>
        <button
          onClick={onCancel}
          aria-label="Cancel autoplay"
          className="flex h-6 w-6 items-center justify-center rounded-md text-text-secondary hover:bg-border hover:text-text transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Video preview */}
      <Link
        href={`/watch/${video.id}`}
        className="group flex gap-3 p-3 hover:bg-border/40 transition-colors"
      >
        {/* Thumbnail + ring */}
        <div className="relative shrink-0 w-32 aspect-video rounded-lg overflow-hidden bg-black">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            sizes="128px"
            className="object-cover opacity-50"
          />
          {/* Countdown ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="52"
              height="52"
              viewBox="0 0 52 52"
              className="-rotate-90"
            >
              <circle
                cx="26"
                cy="26"
                r={R}
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="3"
              />
              <motion.circle
                cx="26"
                cy="26"
                r={R}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 0.9, ease: "linear" }}
              />
            </svg>
            <span className="absolute text-lg font-bold text-white tabular-nums leading-none">
              {remaining}
            </span>
          </div>
          <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
            {formatDuration(video.duration)}
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 min-w-0 flex-1 py-0.5">
          <p className="text-sm font-semibold text-text line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {video.title}
          </p>
          <p className="flex items-center gap-1 text-xs text-text-secondary">
            {video.channel.name}
            {video.channel.verified && <CheckCircle2 className="h-3 w-3" />}
          </p>
          <p className="text-xs text-text-secondary">
            {formatViews(video.views)} · {timeAgo(video.publishedAt)}
          </p>
        </div>
      </Link>

      {/* Cancel button */}
      <div className="px-3 pb-3">
        <button
          onClick={onCancel}
          className="w-full rounded-lg border border-border py-2 text-xs font-medium text-text-secondary hover:bg-border hover:text-text transition-colors"
        >
          Cancel autoplay
        </button>
      </div>
    </motion.div>
  );
}
