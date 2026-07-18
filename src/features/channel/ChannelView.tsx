"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChannelAbout } from "@/components/channel/ChannelAbout";
import { ChannelBanner } from "@/components/channel/ChannelBanner";
import { PlaylistCard } from "@/components/video/PlaylistCard";
import { VideoCard } from "@/components/video/VideoCard";
import { mockPlaylists } from "@/data/playlists";
import { mockVideos } from "@/data/videos";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

const TABS = ["Videos", "Playlists", "About"] as const;
type Tab = (typeof TABS)[number];

interface ChannelViewProps {
  channel: User;
}

export function ChannelView({ channel }: ChannelViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Videos");

  const channelVideos = mockVideos.filter(
    (v) => v.channel.id === channel.id && !v.isShort,
  );
  const channelPlaylists = mockPlaylists.filter(
    (p) => p.owner.id === channel.id && p.visibility === "public",
  );

  return (
    <div className="flex flex-col gap-6">
      <ChannelBanner channel={channel} />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none",
              activeTab === tab
                ? "text-text"
                : "text-text-secondary hover:text-text",
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="channel-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {activeTab === "Videos" &&
          (channelVideos.length === 0 ? (
            <p className="py-16 text-center text-sm text-text-secondary">
              No videos uploaded yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {channelVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ))}

        {activeTab === "Playlists" &&
          (channelPlaylists.length === 0 ? (
            <p className="py-16 text-center text-sm text-text-secondary">
              No public playlists yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {channelPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ))}

        {activeTab === "About" && <ChannelAbout channel={channel} />}
      </motion.div>
    </div>
  );
}
