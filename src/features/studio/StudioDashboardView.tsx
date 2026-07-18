"use client";

import { motion } from "framer-motion";
import {
  BarChart2,
  Eye,
  Film,
  MessageSquare,
  ThumbsUp,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { StatsCard } from "@/components/studio/StatsCard";
import { StudioVideoRow } from "@/components/studio/StudioVideoRow";
import { mockUsers } from "@/data/users";
import { mockVideos } from "@/data/videos";
import { formatViews } from "@/lib/utils";

const channel = mockUsers[0];
const myVideos = mockVideos.filter(
  (v) => v.channel.id === channel.id && !v.isShort,
);

const QUICK_ACTIONS = [
  {
    href: "/studio/upload",
    label: "Upload video",
    icon: Upload,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    href: "/studio/content",
    label: "Manage content",
    icon: Film,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    href: "/studio/analytics",
    label: "View analytics",
    icon: BarChart2,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    href: "/studio/comments",
    label: "View comments",
    icon: MessageSquare,
    color: "text-warning",
    bg: "bg-warning/10",
  },
];

export function StudioDashboardView() {
  const totalViews = myVideos.reduce((s, v) => s + v.views, 0);
  const totalLikes = myVideos.reduce((s, v) => s + v.likes, 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-text">
          Welcome back, {channel.name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Here&apos;s how your channel is performing
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total views"
          value={formatViews(totalViews)}
          change={12}
          changeLabel="vs last 28 days"
          icon={Eye}
          iconColor="text-primary"
          iconBg="bg-primary/10"
          index={0}
        />
        <StatsCard
          label="Subscribers"
          value={formatViews(channel.subscribers)}
          change={8}
          changeLabel="vs last 28 days"
          icon={Users}
          iconColor="text-secondary"
          iconBg="bg-secondary/10"
          index={1}
        />
        <StatsCard
          label="Total likes"
          value={formatViews(totalLikes)}
          change={5}
          changeLabel="vs last 28 days"
          icon={ThumbsUp}
          iconColor="text-success"
          iconBg="bg-success/10"
          index={2}
        />
        <StatsCard
          label="Videos"
          value={myVideos.length.toString()}
          change={0}
          changeLabel="no change"
          icon={TrendingUp}
          iconColor="text-accent"
          iconBg="bg-accent/10"
          index={3}
        />
      </div>

      {/* Quick actions */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text">
          Quick actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ href, label, icon: Icon, color, bg }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
            >
              <Link
                href={href}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-4 hover:bg-surface-secondary hover:border-primary/30 transition-all group"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}
                >
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <span className="text-xs font-medium text-text-secondary group-hover:text-text transition-colors text-center">
                  {label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent videos table */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text">
            Recent videos
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/studio/content">View all</Link>
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="py-3 pl-4 pr-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Video
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider hidden sm:table-cell">
                    Status
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">
                    Views
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">
                    Likes
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider hidden lg:table-cell">
                    Comments
                  </th>
                  <th className="py-3 pl-3 pr-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {myVideos.slice(0, 5).map((video, i) => (
                  <StudioVideoRow key={video.id} video={video} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
