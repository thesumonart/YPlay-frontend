"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock, History, ListVideo, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/shared/Button";
import { HistoryCard } from "@/components/shared/HistoryCard";
import { PlaylistCard } from "@/components/video/PlaylistCard";
import { VideoCard } from "@/components/video/VideoCard";
import { type HistoryEntry, mockHistory } from "@/data/history";
import { mockPlaylists } from "@/data/playlists";
import { mockVideos } from "@/data/videos";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "watch-later", label: "Watch Later", icon: Clock },
  { id: "history", label: "History", icon: History },
  { id: "playlists", label: "Playlists", icon: ListVideo },
] as const;

type TabId = (typeof TABS)[number]["id"];

// Mock watch-later list (reuse some videos)
const watchLaterVideos = [
  mockVideos[1],
  mockVideos[3],
  mockVideos[6],
  mockVideos[10],
];

interface LibraryViewProps {
  defaultTab?: TabId;
}

export function LibraryView({ defaultTab = "watch-later" }: LibraryViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);
  const [history, setHistory] = useState<HistoryEntry[]>(mockHistory);
  const [watchLater, setWatchLater] = useState(watchLaterVideos);

  const removeFromHistory = (videoId: string) =>
    setHistory((h) => h.filter((e) => e.video.id !== videoId));

  const removeFromWatchLater = (videoId: string) =>
    setWatchLater((wl) => wl.filter((v) => v.id !== videoId));

  const userPlaylists = mockPlaylists.filter((p) => p.owner.id === "u1");

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-text">Library</h1>
        <p className="text-sm text-text-secondary mt-1">
          Your saved videos and playlists
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 border-b border-border"
        role="tablist"
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={activeTab === id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none",
              activeTab === id
                ? "text-text"
                : "text-text-secondary hover:text-text",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
            {activeTab === id && (
              <motion.div
                layoutId="library-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* Watch Later */}
          {activeTab === "watch-later" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-secondary">
                  {watchLater.length}{" "}
                  {watchLater.length === 1 ? "video" : "videos"}
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
                      >
                        <VideoCard video={video} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {/* History */}
          {activeTab === "history" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-secondary">
                  {history.length} {history.length === 1 ? "video" : "videos"}{" "}
                  watched
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
                        onRemove={removeFromHistory}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {/* Playlists */}
          {activeTab === "playlists" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-text-secondary">
                {userPlaylists.length}{" "}
                {userPlaylists.length === 1 ? "playlist" : "playlists"}
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
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

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
