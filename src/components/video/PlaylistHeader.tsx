"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Globe,
  Link2,
  Lock,
  MoreHorizontal,
  Play,
  Share2,
  Shuffle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/Avatar";
import { Button } from "@/components/shared/Button";
import { cn, formatViews, timeAgo } from "@/lib/utils";
import type { Playlist } from "@/types";

interface PlaylistHeaderProps {
  playlist: Playlist;
  onPlay: () => void;
  onShuffle: () => void;
}

const VISIBILITY_CONFIG = {
  public: { icon: Globe, label: "Public" },
  private: { icon: Lock, label: "Private" },
  unlisted: { icon: Link2, label: "Unlisted" },
};

export function PlaylistHeader({
  playlist,
  onPlay,
  onShuffle,
}: PlaylistHeaderProps) {
  const [saved, setSaved] = useState(false);
  const totalDuration = playlist.videos.reduce((s, v) => s + v.duration, 0);
  const totalViews = playlist.videos.reduce((s, v) => s + v.views, 0);
  const { icon: VisIcon, label: visLabel } =
    VISIBILITY_CONFIG[playlist.visibility];

  const hours = Math.floor(totalDuration / 3600);
  const mins = Math.floor((totalDuration % 3600) / 60);
  const durationLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-5"
    >
      {/* Cover image */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-surface-secondary shadow-lg">
        <Image
          src={playlist.thumbnail}
          alt={playlist.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 400px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Play overlay */}
        <button
          onClick={onPlay}
          aria-label="Play playlist"
          className="absolute inset-0 flex items-center justify-center group/play"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-transform group-hover/play:scale-110">
            <Play className="h-7 w-7 fill-white text-white translate-x-0.5" />
          </div>
        </button>
        {/* Video count badge */}
        <div className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2.5 py-1.5 text-xs font-semibold text-white">
          {playlist.videos.length} videos
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-xl font-bold text-text leading-snug">
            {playlist.title}
          </h1>
          <Button variant="ghost" size="icon" aria-label="More options">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Owner */}
        <Link
          href={`/channel/${playlist.owner.id}`}
          className="flex items-center gap-2 w-fit group/owner"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage
              src={playlist.owner.avatar}
              alt={playlist.owner.name}
            />
            <AvatarFallback>{playlist.owner.name[0]}</AvatarFallback>
          </Avatar>
          <span className="flex items-center gap-1 text-sm font-medium text-text-secondary group-hover/owner:text-text transition-colors">
            {playlist.owner.name}
            {playlist.owner.verified && (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}
          </span>
        </Link>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <VisIcon className="h-3.5 w-3.5" />
            {visLabel}
          </span>
          <span>·</span>
          <span>{formatViews(totalViews)} views</span>
          <span>·</span>
          <span>{durationLabel} total</span>
          <span>·</span>
          <span>Updated {timeAgo(playlist.updatedAt)}</span>
        </div>

        {/* Description */}
        {playlist.description && (
          <p className="text-sm text-text-secondary leading-relaxed">
            {playlist.description}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            onClick={onPlay}
            size="md"
            className="gap-2 flex-1 sm:flex-none"
          >
            <Play className="h-4 w-4 fill-white" />
            Play all
          </Button>
          <Button
            onClick={onShuffle}
            variant="secondary"
            size="md"
            className="gap-2 flex-1 sm:flex-none"
          >
            <Shuffle className="h-4 w-4" />
            Shuffle
          </Button>
          <Button
            variant="outline"
            size="md"
            className={cn("gap-2", saved && "text-primary border-primary/40")}
            onClick={() => setSaved((s) => !s)}
          >
            <Share2 className="h-4 w-4" />
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
