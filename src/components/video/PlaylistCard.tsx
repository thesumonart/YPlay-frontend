import Link from "next/link";
import Image from "next/image";
import { ListVideo, Lock } from "lucide-react";
import type { Playlist } from "@/types";
import { timeAgo } from "@/lib/utils";

interface PlaylistCardProps {
  playlist: Playlist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Link href={`/playlist/${playlist.id}`} className="group flex flex-col gap-3">
      {/* Thumbnail stack */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--surface-secondary)]">
        <Image
          src={playlist.thumbnail}
          alt={playlist.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay with count */}
        <div className="absolute inset-y-0 right-0 w-1/3 bg-black/70 flex flex-col items-center justify-center gap-1">
          <ListVideo className="h-5 w-5 text-white" />
          <span className="text-sm font-bold text-white">{playlist.videos.length}</span>
        </div>
        {playlist.visibility === "private" && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5">
            <Lock className="h-3 w-3 text-white" />
            <span className="text-[10px] font-medium text-white">Private</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold text-[var(--text)] line-clamp-2 leading-snug group-hover:text-[var(--primary)] transition-colors">
          {playlist.title}
        </p>
        <p className="text-xs text-[var(--text-secondary)]">
          {playlist.owner.name} · Updated {timeAgo(playlist.updatedAt)}
        </p>
      </div>
    </Link>
  );
}
