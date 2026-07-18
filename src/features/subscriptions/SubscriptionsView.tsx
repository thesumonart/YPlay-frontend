"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PlaySquare, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SubscribedChannelPill } from "@/components/channel/SubscribedChannelPill";
import { Button } from "@/components/shared/Button";
import { VideoCard } from "@/components/video/VideoCard";
import { mockSubscriptions } from "@/data/subscriptions";
import { mockVideos } from "@/data/videos";
import { timeAgo } from "@/lib/utils";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

function groupVideosByDate(videos: typeof mockVideos) {
  const now = new Date();
  const groups: { label: string; videos: typeof mockVideos }[] = [];
  const buckets: Record<string, typeof mockVideos> = {};

  for (const v of videos) {
    const diff = Math.floor(
      (now.getTime() - new Date(v.publishedAt).getTime()) / 86_400_000,
    );
    const key =
      diff === 0
        ? "Today"
        : diff === 1
          ? "Yesterday"
          : diff <= 7
            ? "This week"
            : diff <= 30
              ? "This month"
              : "Earlier";
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(v);
  }

  for (const label of [
    "Today",
    "Yesterday",
    "This week",
    "This month",
    "Earlier",
  ]) {
    if (buckets[label]?.length) groups.push({ label, videos: buckets[label] });
  }
  return groups;
}

export function SubscriptionsView() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const handleSelect = (id: string) =>
    setSelectedChannel((prev) => (prev === id ? null : id));

  const feed = useMemo(() => {
    const subIds = new Set(mockSubscriptions.map((c) => c.id));
    let videos = mockVideos
      .filter((v) => !v.isShort && subIds.has(v.channel.id))
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );

    if (selectedChannel) {
      videos = videos.filter((v) => v.channel.id === selectedChannel);
    }
    return videos;
  }, [selectedChannel]);

  const grouped = useMemo(() => groupVideosByDate(feed), [feed]);

  if (mockSubscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-secondary">
          <Users className="h-9 w-9 text-text-secondary" />
        </div>
        <p className="text-lg font-semibold text-text">
          No subscriptions yet
        </p>
        <p className="text-sm text-text-secondary max-w-xs">
          Subscribe to channels to see their latest videos here
        </p>
        <Button asChild variant="default" size="md" className="mt-2">
          <Link href="/trending">Discover channels</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
          <PlaySquare className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text">
            Subscriptions
          </h1>
          <p className="text-sm text-text-secondary">
            Latest from {mockSubscriptions.length} channels you follow
          </p>
        </div>
      </div>

      {/* Channel filter row */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Filter by channel
          </p>
          {selectedChannel && (
            <button
              onClick={() => setSelectedChannel(null)}
              className="text-xs text-primary hover:underline font-medium"
            >
              Show all
            </button>
          )}
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {mockSubscriptions.map((channel) => (
            <SubscribedChannelPill
              key={channel.id}
              channel={channel}
              selected={selectedChannel === channel.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      {/* Feed */}
      <AnimatePresence mode="wait">
        {feed.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-3 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary">
              <PlaySquare className="h-6 w-6 text-text-secondary" />
            </div>
            <p className="text-base font-semibold text-text">
              No videos yet
            </p>
            <p className="text-sm text-text-secondary">
              This channel hasn&apos;t uploaded recently
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={selectedChannel ?? "all"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-10"
          >
            {grouped.map(({ label, videos }) => (
              <div key={label} className="flex flex-col gap-4">
                {/* Date group header */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-text">
                    {label}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-text-secondary">
                    {videos.length} {videos.length === 1 ? "video" : "videos"}
                  </span>
                </div>

                {/* Video grid */}
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8"
                >
                  {videos.map((video) => (
                    <motion.div key={video.id} variants={fadeUp}>
                      <VideoCard video={video} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
