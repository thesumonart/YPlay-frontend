"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Search,
  SlidersHorizontal,
  ThumbsUp,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/shared/Button";
import { mockVideos } from "@/data/videos";
import { cn, formatDuration, formatViews, timeAgo } from "@/lib/utils";

type StatusFilter = "all" | "published" | "draft" | "private";
type SortKey = "date" | "views" | "likes" | "title";

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "published", label: "Published" },
  { id: "draft", label: "Draft" },
  { id: "private", label: "Private" },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "date", label: "Date" },
  { value: "views", label: "Views" },
  { value: "likes", label: "Likes" },
  { value: "title", label: "Title" },
];

const STATUS_CONFIG: Record<
  Exclude<StatusFilter, "all">,
  { label: string; className: string }
> = {
  published: {
    label: "Published",
    className: "text-success bg-success/10",
  },
  draft: {
    label: "Draft",
    className: "text-warning bg-warning/10",
  },
  private: {
    label: "Private",
    className: "text-text-secondary bg-surface-secondary",
  },
};

function deriveStatus(index: number): Exclude<StatusFilter, "all"> {
  if (index % 5 === 3) return "draft";
  if (index % 7 === 0) return "private";
  return "published";
}

type VideoWithStatus = (typeof mockVideos)[number] & {
  status: Exclude<StatusFilter, "all">;
};

const initialVideos: VideoWithStatus[] = mockVideos
  .filter((v) => v.channel.id === "u1")
  .map((v, i) => ({ ...v, status: deriveStatus(i) }));

export function StudioContentView() {
  const router = useRouter();
  const [videos, setVideos] = useState(initialVideos);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showSort, setShowSort] = useState(false);

  const deleteVideos = useCallback((ids: Set<string>) => {
    setVideos((prev) => prev.filter((v) => !ids.has(v.id)));
    setSelected(new Set());
  }, []);

  const filtered = useMemo(() => {
    let result: VideoWithStatus[] = videos;

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((v) => v.status === statusFilter);
    }

    return [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date")
        cmp =
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      else if (sortKey === "views") cmp = b.views - a.views;
      else if (sortKey === "likes") cmp = b.likes - a.likes;
      else if (sortKey === "title") cmp = a.title.localeCompare(b.title);
      return sortAsc ? -cmp : cmp;
    });
  }, [query, statusFilter, sortKey, sortAsc]);

  const allSelected =
    filtered.length > 0 && filtered.every((v) => selected.has(v.id));

  const toggleAll = useCallback(() => {
    setSelected(allSelected ? new Set() : new Set(filtered.map((v) => v.id)));
  }, [allSelected, filtered]);

  const toggleOne = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const clearSelection = () => setSelected(new Set());

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = {
      all: videos.length,
      published: 0,
      draft: 0,
      private: 0,
    };
    for (const v of myVideos) counts[v.status]++;
    return counts;
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text">Content</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {videos.length} videos
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/studio/upload">
            <Upload className="h-3.5 w-3.5" />
            Upload video
          </Link>
        </Button>
      </div>

      {/* Status tabs */}
      <div
        className="flex gap-1 border-b border-border"
        role="tablist"
      >
        {STATUS_TABS.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            aria-selected={statusFilter === id}
            onClick={() => {
              setStatusFilter(id);
              clearSelection();
            }}
            className={cn(
              "relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none shrink-0",
              statusFilter === id
                ? "text-text"
                : "text-text-secondary hover:text-text",
            )}
          >
            {label}
            <span
              className={cn(
                "text-[10px] font-semibold tabular-nums",
                statusFilter === id
                  ? "text-text-secondary"
                  : "text-border",
              )}
            >
              {statusCounts[id]}
            </span>
            {statusFilter === id && (
              <motion.div
                layoutId="content-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Search + sort */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos..."
            aria-label="Search videos"
            className={cn(
              "h-9 w-full rounded-lg border border-border bg-surface",
              "pl-9 pr-8 text-sm text-text placeholder:text-text-secondary",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all",
            )}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSort((o) => !o)}
          className={cn("gap-1.5", showSort && "bg-surface-secondary")}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Sort
        </Button>
      </div>

      {/* Sort options */}
      <AnimatePresence>
        {showSort && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 flex-wrap pb-1">
              <span className="text-xs text-text-secondary font-medium">
                Sort by:
              </span>
              {SORT_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => {
                    if (sortKey === value) setSortAsc((a) => !a);
                    else {
                      setSortKey(value);
                      setSortAsc(false);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    sortKey === value
                      ? "bg-surface-secondary text-text"
                      : "text-text-secondary hover:text-text hover:bg-surface-secondary",
                  )}
                >
                  {label}
                  {sortKey === value && (
                    <span className="text-primary">
                      {sortAsc ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface-secondary px-4 py-2.5"
          >
            <span className="text-sm font-medium text-text">
              {selected.size} selected
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-danger hover:text-danger hover:bg-danger/10"
                onClick={() => deleteVideos(selected)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="text-text-secondary"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-3 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary">
              <Search className="h-6 w-6 text-text-secondary" />
            </div>
            <p className="text-base font-semibold text-text">
              No videos found
            </p>
            <p className="text-sm text-text-secondary">
              Try a different search or filter
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-border bg-surface overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary">
                    <th className="py-3 pl-4 pr-2 w-10">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        aria-label="Select all videos"
                        className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                      />
                    </th>
                    <th className="py-3 pr-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
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
                    <th className="py-3 pl-3 pr-4" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((video, i) => {
                    const isSelected = selected.has(video.id);
                    const { label, className } = STATUS_CONFIG[video.status];

                    return (
                      <motion.tr
                        key={video.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                        className={cn(
                          "group border-b border-border last:border-0 transition-colors",
                          isSelected
                            ? "bg-primary/5"
                            : "hover:bg-surface-secondary",
                        )}
                      >
                        {/* Checkbox */}
                        <td className="py-3 pl-4 pr-2 w-10">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleOne(video.id)}
                            aria-label={`Select ${video.title}`}
                            className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                          />
                        </td>

                        {/* Thumbnail + title */}
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/watch/${video.id}`}
                              className="relative shrink-0 w-24 aspect-video rounded-lg overflow-hidden bg-surface-secondary"
                            >
                              <Image
                                src={video.thumbnail}
                                alt={video.title}
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                              <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[10px] font-medium text-white">
                                {formatDuration(video.duration)}
                              </span>
                            </Link>
                            <div className="flex flex-col gap-1 min-w-0">
                              <Link
                                href={`/watch/${video.id}`}
                                className="text-sm font-medium text-text line-clamp-2 leading-snug hover:text-primary transition-colors"
                              >
                                {video.title}
                              </Link>
                              <p className="text-xs text-text-secondary line-clamp-1 hidden md:block">
                                {video.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 hidden sm:table-cell">
                          <span
                            className={cn(
                              "rounded-md px-2 py-1 text-xs font-medium",
                              className,
                            )}
                          >
                            {label}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3 px-3 hidden lg:table-cell">
                          <span className="text-xs text-text-secondary">
                            {timeAgo(video.publishedAt)}
                          </span>
                        </td>

                        {/* Views */}
                        <td className="py-3 px-3 hidden md:table-cell">
                          <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                            <Eye className="h-3.5 w-3.5" />
                            {formatViews(video.views)}
                          </span>
                        </td>

                        {/* Likes */}
                        <td className="py-3 px-3 hidden md:table-cell">
                          <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                            <ThumbsUp className="h-3.5 w-3.5" />
                            {formatViews(video.likes)}
                          </span>
                        </td>

                        {/* Comments */}
                        <td className="py-3 px-3 hidden lg:table-cell">
                          <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {Math.floor(video.likes * 0.04).toLocaleString()}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 pl-3 pr-4">
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                              <button
                                aria-label="Video options"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-border hover:text-text transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                              <DropdownMenu.Content
                                align="end"
                                sideOffset={4}
                                className="z-50 min-w-36 overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-lg animate-in fade-in-0 zoom-in-95"
                              >
                                {[
                                  {
                                    icon: Pencil,
                                    label: "Edit",
                                    action: () =>
                                      router.push(
                                        `/studio/content/${video.id}`,
                                      ),
                                    danger: false,
                                  },
                                  {
                                    icon: Eye,
                                    label: "View",
                                    action: () =>
                                      router.push(`/watch/${video.id}`),
                                    danger: false,
                                  },
                                  {
                                    icon: Trash2,
                                    label: "Delete",
                                    action: () => deleteVideos(new Set([video.id])),
                                    danger: true,
                                  },
                                ].map(
                                  ({
                                    icon: Icon,
                                    label: itemLabel,
                                    action,
                                    danger,
                                  }) => (
                                    <DropdownMenu.Item
                                      key={itemLabel}
                                      onSelect={action}
                                      className={cn(
                                        "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors",
                                        danger
                                          ? "text-danger focus:bg-danger/10"
                                          : "text-text focus:bg-surface-secondary",
                                      )}
                                    >
                                      <Icon className="h-3.5 w-3.5" />
                                      {itemLabel}
                                    </DropdownMenu.Item>
                                  ),
                                )}
                              </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                          </DropdownMenu.Root>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="border-t border-border px-4 py-3 flex items-center justify-between">
              <p className="text-xs text-text-secondary">
                Showing{" "}
                <span className="font-medium text-text">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-text">
                  {myVideos.length}
                </span>{" "}
                videos
              </p>
              {selected.size > 0 && (
                <p className="text-xs text-primary font-medium">
                  {selected.size} selected
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
