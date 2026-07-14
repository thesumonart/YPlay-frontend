"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { mockVideos } from "@/data/videos";
import { TrendingCard } from "@/components/video/TrendingCard";
import { VideoCard } from "@/components/video/VideoCard";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "all", label: "All" },
  { id: "tech", label: "Technology" },
  { id: "gaming", label: "Gaming" },
  { id: "music", label: "Music" },
  { id: "science", label: "Science" },
  { id: "design", label: "Design" },
  { id: "travel", label: "Travel" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function sortByTrending(videos: typeof mockVideos) {
  return [...videos].sort((a, b) => {
    const scoreA = a.views * 0.6 + a.likes * 0.4;
    const scoreB = b.views * 0.6 + b.likes * 0.4;
    return scoreB - scoreA;
  });
}

export function TrendingView() {
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const ranked = useMemo(() => {
    const base = mockVideos.filter((v) => !v.isShort);
    const filtered =
      activeTab === "all" ? base : base.filter((v) => v.category === activeTab);
    return sortByTrending(filtered);
  }, [activeTab]);

  const hero = ranked[0];
  const list = ranked.slice(1);

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text">Trending</h1>
          <p className="text-sm text-text-secondary">
            What everyone is watching right now
          </p>
        </div>
      </div>

      {/* Category tabs */}
      <div
        className="flex gap-1 overflow-x-auto pb-1 border-b border-border"
        role="tablist"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none",
              activeTab === tab.id
                ? "text-text"
                : "text-text-secondary hover:text-text",
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="trending-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
          </button>
        ))}
      </div>

      {ranked.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <TrendingUp className="h-10 w-10 text-text-secondary" />
          <p className="text-base font-semibold text-text">
            Nothing trending here yet
          </p>
          <p className="text-sm text-text-secondary">Check back soon</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {/* #1 Hero */}
          {hero && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-4xl font-black text-primary leading-none">
                  #1
                </span>
                <span className="text-sm font-medium text-text-secondary">
                  Trending now
                </span>
              </div>
              <VideoCard video={hero} />
            </div>
          )}

          {/* Ranked list */}
          {list.length > 0 && (
            <div className="flex flex-col gap-1 divide-y divide-border">
              {list.map((video, i) => (
                <div key={video.id} className="py-2">
                  <TrendingCard video={video} rank={i + 2} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
