"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChannelAbout } from "@/components/channel/ChannelAbout";
import { ChannelBanner } from "@/components/channel/ChannelBanner";
import { PlaylistCard } from "@/components/video/PlaylistCard";
import { VideoCard } from "@/components/video/VideoCard";
import Link from "next/link";
import Image from "next/image";
import { mockPlaylists } from "@/data/playlists";
import { mockVideos } from "@/data/videos";
import { cn, formatDuration, formatViews } from "@/lib/utils";
import type { User } from "@/types";

const TABS = ["Home", "Videos", "Shorts", "Playlists", "About"] as const;
type Tab = (typeof TABS)[number];

interface ChannelViewProps {
  channel: User;
}

export function ChannelView({ channel }: ChannelViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Videos");

  const channelVideos = mockVideos.filter(
    (v) => v.channel.id === channel.id && !v.isShort,
  );
  const channelShorts = mockVideos.filter(
    (v) => v.channel.id === channel.id && v.isShort,
  );
  const channelPlaylists = mockPlaylists.filter(
    (p) => p.owner.id === channel.id && p.visibility === "public",
  );
  const pinnedVideo = channelVideos[0] ?? null;

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
        role="tabpanel"
        aria-labelledby={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {activeTab === "Home" && (
          <div className="flex flex-col gap-8">
            {pinnedVideo ? (
              <div className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Featured</h2>
                <Link href={`/watch/${pinnedVideo.id}`} className="group flex gap-4 rounded-xl overflow-hidden hover:bg-surface transition-colors p-2 -m-2">
                  <div className="relative w-64 shrink-0 aspect-video rounded-lg overflow-hidden">
                    <Image src={pinnedVideo.thumbnail} alt={pinnedVideo.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="256px" />
                    <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[11px] font-medium text-white">{formatDuration(pinnedVideo.duration)}</span>
                  </div>
                  <div className="flex flex-col gap-1 py-1">
                    <p className="font-semibold text-text line-clamp-2">{pinnedVideo.title}</p>
                    <p className="text-sm text-text-secondary">{formatViews(pinnedVideo.views)} views</p>
                    <p className="mt-2 text-sm text-text-secondary line-clamp-3">{pinnedVideo.description}</p>
                  </div>
                </Link>
              </div>
            ) : null}
            {channelVideos.length > 1 && (
              <div className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Recent uploads</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">
                  {channelVideos.slice(1, 6).map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </div>
            )}
            {channelVideos.length === 0 && (
              <p className="py-16 text-center text-sm text-text-secondary">No content yet.</p>
            )}
          </div>
        )}

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

        {activeTab === "Shorts" && (
          channelShorts.length === 0 ? (
            <p className="py-16 text-center text-sm text-text-secondary">No shorts uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {channelShorts.map((short) => (
                <Link key={short.id} href={`/shorts?id=${short.id}`} className="group flex flex-col gap-2">
                  <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-surface">
                    <Image src={short.thumbnail} alt={short.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 50vw, 20vw" />
                    <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[11px] font-medium text-white">{formatDuration(short.duration)}</span>
                  </div>
                  <p className="text-xs font-medium text-text line-clamp-2 leading-snug">{short.title}</p>
                  <p className="text-[11px] text-text-secondary">{formatViews(short.views)} views</p>
                </Link>
              ))}
            </div>
          )
        )}

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
