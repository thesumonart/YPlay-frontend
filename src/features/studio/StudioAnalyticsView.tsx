"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Clock, Users, DollarSign } from "lucide-react";
import {
  analyticsData28, analyticsData90,
  trafficSources, deviceBreakdown, ageBreakdown,
} from "@/data/analytics";
import { mockVideos } from "@/data/videos";
import { StatsCard } from "@/components/studio/StatsCard";
import {
  AnalyticsAreaChart,
  AnalyticsBarChart,
  AnalyticsDonutChart,
} from "@/components/studio/AnalyticsChart";
import { formatViews, formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";

const PERIODS = ["28 days", "90 days"] as const;
type Period = (typeof PERIODS)[number];

const myVideos = mockVideos
  .filter((v) => v.channel.id === "u1" && !v.isShort)
  .sort((a, b) => b.views - a.views)
  .slice(0, 5);

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-[var(--text)]">{title}</h3>
      {children}
    </div>
  );
}

export function StudioAnalyticsView() {
  const [period, setPeriod] = useState<Period>("28 days");
  const [activeMetric, setActiveMetric] = useState<"views" | "watchTime" | "subscribers">("views");

  const data = period === "28 days" ? analyticsData28 : analyticsData90;

  const totals = useMemo(() => ({
    views:       data.reduce((s, d) => s + d.views, 0),
    watchTime:   data.reduce((s, d) => s + d.watchTime, 0),
    subscribers: data[data.length - 1].subscribers - data[0].subscribers,
    revenue:     data.reduce((s, d) => s + d.revenue, 0),
  }), [data]);

  const metricConfig = {
    views:       { color: "var(--primary)",   label: "Views",       formatter: (v: number) => formatViews(v) },
    watchTime:   { color: "var(--secondary)", label: "Watch time",  formatter: (v: number) => `${formatViews(v)} min` },
    subscribers: { color: "var(--success)",   label: "Subscribers", formatter: (v: number) => formatViews(v) },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header + period selector */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-[var(--text)]">Analytics</h1>
        <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                period === p
                  ? "bg-[var(--surface-secondary)] text-[var(--text)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text)]"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Views"        value={formatViews(totals.views)}       change={12} changeLabel={`Last ${period}`} icon={Eye}        iconColor="text-[var(--primary)]"   iconBg="bg-[var(--primary)]/10"   index={0} />
        <StatsCard label="Watch time"   value={`${formatViews(totals.watchTime)}m`} change={8} changeLabel={`Last ${period}`} icon={Clock}      iconColor="text-[var(--secondary)]" iconBg="bg-[var(--secondary)]/10" index={1} />
        <StatsCard label="New subs"     value={`+${formatViews(totals.subscribers)}`} change={5} changeLabel={`Last ${period}`} icon={Users}      iconColor="text-[var(--success)]"   iconBg="bg-[var(--success)]/10"   index={2} />
        <StatsCard label="Est. revenue" value={`$${totals.revenue.toFixed(0)}`} change={3} changeLabel={`Last ${period}`} icon={DollarSign}  iconColor="text-[var(--warning)]"   iconBg="bg-[var(--warning)]/10"   index={3} />
      </div>

      {/* Main chart */}
      <ChartCard title="Performance over time">
        {/* Metric tabs */}
        <div className="flex gap-1">
          {(Object.keys(metricConfig) as (keyof typeof metricConfig)[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors capitalize",
                activeMetric === key
                  ? "bg-[var(--surface-secondary)] text-[var(--text)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text)]"
              )}
            >
              {metricConfig[key].label}
            </button>
          ))}
        </div>
        <motion.div
          key={`${activeMetric}-${period}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnalyticsAreaChart
            data={data}
            dataKey={activeMetric}
            color={metricConfig[activeMetric].color}
            label={metricConfig[activeMetric].label}
            formatter={metricConfig[activeMetric].formatter}
            height={260}
          />
        </motion.div>
      </ChartCard>

      {/* Two-column row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Traffic sources */}
        <ChartCard title="Traffic sources">
          <AnalyticsBarChart
            data={trafficSources}
            dataKey="views"
            xKey="source"
            label="Views"
            height={220}
          />
        </ChartCard>

        {/* Device breakdown */}
        <ChartCard title="Device type">
          <AnalyticsDonutChart
            data={deviceBreakdown.map((d) => ({ name: d.device, value: d.percentage }))}
            height={220}
          />
        </ChartCard>
      </div>

      {/* Two-column row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Age breakdown */}
        <ChartCard title="Viewer age">
          <AnalyticsBarChart
            data={ageBreakdown}
            dataKey="percentage"
            xKey="range"
            label="Share"
            color="var(--accent)"
            formatter={(v) => `${v}%`}
            height={200}
          />
        </ChartCard>

        {/* Top videos */}
        <ChartCard title="Top videos">
          <div className="flex flex-col gap-3">
            {myVideos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className="text-xs font-bold text-[var(--text-secondary)] w-4 shrink-0 tabular-nums">
                  {i + 1}
                </span>
                <Link href={`/watch/${video.id}`} className="relative shrink-0 w-16 aspect-video rounded-lg overflow-hidden bg-[var(--surface-secondary)]">
                  <Image src={video.thumbnail} alt={video.title} fill sizes="64px" className="object-cover" />
                </Link>
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <Link
                    href={`/watch/${video.id}`}
                    className="text-xs font-medium text-[var(--text)] line-clamp-1 hover:text-[var(--primary)] transition-colors"
                  >
                    {video.title}
                  </Link>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                    <span>{formatViews(video.views)} views</span>
                    <span>·</span>
                    <span>{formatDuration(video.duration)}</span>
                  </div>
                </div>
                {/* Mini bar */}
                <div className="w-16 shrink-0">
                  <div className="h-1.5 rounded-full bg-[var(--surface-secondary)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--primary)]"
                      style={{ width: `${(video.views / myVideos[0].views) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
