"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookMarked, Clock, History, ListVideo, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/shared/Button";
import { HistoryCard } from "@/components/shared/HistoryCard";
import { PlaylistCard } from "@/components/video/PlaylistCard";
import { VideoCard } from "@/components/video/VideoCard";
import { type HistoryEntry, mockHistory } from "@/data/history";
import { mockPlaylists } from "@/data/playlists";
import { mockVideos } from "@/data/videos";

const watchLaterVideos = [
  mockVideos[1],
  mockVideos[3],
  mockVideos[6],
  mockVideos[10],
];

const savedVideos = [
  mockVideos[0],
  mockVideos[4],
  mockVideos[7],
  mockVideos[9],
  mockVideos[11],
];

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary">
        <Icon className="h-7 w-7 text-text-secondary" />
      </div>
      <p className="text-base font-semibold text-text">{title}</p>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  );
}

export function HistoryView() {
  const [history, setHistory] = useState<HistoryEntry[]>(mockHistory);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text">History</h1>
        <p className="text-sm text-text-secondary mt-1">Videos you've watched</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            {history.length} {history.length === 1 ? "video" : "videos"} watched
          </p>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-text-secondary"
              onClick={() => setHistory([])}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear history
            </Button>
          )}
        </div>
        {history.length === 0 ? (
          <EmptyState
            icon={History}
            title="No watch history"
            description="Videos you watch will appear here"
          />
        ) : (
          <div className="flex flex-col gap-6">
            <AnimatePresence>
              {history.map((entry) => (
                <HistoryCard
                  key={entry.video.id}
                  entry={entry}
                  onRemove={(id) => setHistory((h) => h.filter((e) => e.video.id !== id))}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export function WatchLaterView() {
  const [watchLater, setWatchLater] = useState(watchLaterVideos);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Watch Later</h1>
        <p className="text-sm text-text-secondary mt-1">Videos saved to watch later</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            {watchLater.length} {watchLater.length === 1 ? "video" : "videos"}
          </p>
          {watchLater.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-text-secondary"
              onClick={() => setWatchLater([])}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </Button>
          )}
        </div>
        {watchLater.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No videos saved"
            description="Videos you save to watch later will appear here"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            <AnimatePresence>
              {watchLater.map((video) => (
                <motion.div
                  key={video.id}
                  layout
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative group/card"
                >
                  <VideoCard video={video} />
                  <button
                    onClick={() => setWatchLater((v) => v.filter((x) => x.id !== video.id))}
                    aria-label="Remove from Watch Later"
                    className="absolute top-1 right-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export function PlaylistsView() {
  const userPlaylists = mockPlaylists.filter((p) => p.owner.id === "u1");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Playlists</h1>
        <p className="text-sm text-text-secondary mt-1">Your saved playlists</p>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-text-secondary">
          {userPlaylists.length} {userPlaylists.length === 1 ? "playlist" : "playlists"}
        </p>
        {userPlaylists.length === 0 ? (
          <EmptyState
            icon={ListVideo}
            title="No playlists yet"
            description="Create a playlist to organise your favourite videos"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {userPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SavedView() {
  const [saved, setSaved] = useState(savedVideos);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Saved</h1>
        <p className="text-sm text-text-secondary mt-1">Videos you've bookmarked</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            {saved.length} {saved.length === 1 ? "video" : "videos"}
          </p>
          {saved.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-text-secondary"
              onClick={() => setSaved([])}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </Button>
          )}
        </div>
        {saved.length === 0 ? (
          <EmptyState
            icon={BookMarked}
            title="No saved videos"
            description="Bookmark videos to find them easily later"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            <AnimatePresence>
              {saved.map((video) => (
                <motion.div
                  key={video.id}
                  layout
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative group/card"
                >
                  <VideoCard video={video} />
                  <button
                    onClick={() => setSaved((v) => v.filter((x) => x.id !== video.id))}
                    aria-label="Remove from Saved"
                    className="absolute top-1 right-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

// Keep LibraryView as the playlists page (default landing for /library)
export function LibraryView() {
  return <PlaylistsView />;
}
