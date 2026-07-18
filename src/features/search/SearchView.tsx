"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ChannelResultCard } from "@/components/channel/ChannelResultCard";
import {
  defaultFilters,
  type SearchFilters,
  SearchFiltersPanel,
} from "@/components/shared/SearchFilters";
import { SearchResultCard } from "@/components/video/SearchResultCard";
import { mockUsers } from "@/data/users";
import { mockVideos } from "@/data/videos";
import { cn } from "@/lib/utils";

function matchesQuery(text: string, query: string) {
  return text.toLowerCase().includes(query.toLowerCase());
}

function applyDurationFilter(
  duration: number,
  filter: SearchFilters["duration"],
) {
  if (filter === "short") return duration < 240;
  if (filter === "medium") return duration >= 240 && duration <= 1200;
  if (filter === "long") return duration > 1200;
  return true;
}

function applySortFilter(
  videos: typeof mockVideos,
  sort: SearchFilters["sort"],
) {
  return [...videos].sort((a, b) => {
    if (sort === "date")
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    if (sort === "views") return b.views - a.views;
    if (sort === "rating") return b.likes - a.likes;
    return 0;
  });
}

interface SearchViewProps {
  initialQuery: string;
}

export function SearchView({ initialQuery }: SearchViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    setQuery(trimmed);
    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    router.push(`/search?${params.toString()}`);
  };

  const videoResults = useMemo(() => {
    if (!query) return [];
    let results = mockVideos.filter(
      (v) =>
        !v.isShort &&
        (matchesQuery(v.title, query) ||
          matchesQuery(v.description, query) ||
          matchesQuery(v.channel.name, query) ||
          v.tags.some((t) => matchesQuery(t, query))),
    );
    if (filters.duration !== "any") {
      results = results.filter((v) =>
        applyDurationFilter(v.duration, filters.duration),
      );
    }
    return applySortFilter(results, filters.sort);
  }, [query, filters]);

  const channelResults = useMemo(() => {
    if (!query || filters.type === "video") return [];
    return mockUsers.filter(
      (u) =>
        matchesQuery(u.name, query) ||
        matchesQuery(u.handle, query) ||
        (u.bio && matchesQuery(u.bio, query)),
    );
  }, [query, filters.type]);

  const totalResults = videoResults.length + channelResults.length;
  const showChannels = filters.type === "all" || filters.type === "channel";
  const showVideos = filters.type === "all" || filters.type === "video";

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Search input */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search videos, channels, topics..."
            aria-label="Search"
            className={cn(
              "h-11 w-full rounded-lg border border-border bg-surface",
              "pl-10 pr-4 text-sm text-text placeholder:text-text-secondary",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all",
            )}
          />
        </div>
        <button
          type="submit"
          className="h-11 px-5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          Search
        </button>
      </form>

      {/* Filters */}
      {query && (
        <SearchFiltersPanel
          filters={filters}
          onChange={setFilters}
          open={filtersOpen}
          onToggle={() => setFiltersOpen((o) => !o)}
        />
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {!query ? (
          <motion.div
            key="empty-query"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-3 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary">
              <Search className="h-7 w-7 text-text-secondary" />
            </div>
            <p className="text-base font-semibold text-text">
              Search for anything
            </p>
            <p className="text-sm text-text-secondary">
              Find videos, channels, and more
            </p>
          </motion.div>
        ) : totalResults === 0 ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-3 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary">
              <Search className="h-7 w-7 text-text-secondary" />
            </div>
            <p className="text-base font-semibold text-text">
              No results for &ldquo;{query}&rdquo;
            </p>
            <p className="text-sm text-text-secondary">
              Try different keywords or remove filters
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-8"
          >
            {/* Result count */}
            <p className="text-sm text-text-secondary">
              About{" "}
              <span className="font-medium text-text">
                {totalResults}
              </span>{" "}
              results for{" "}
              <span className="font-medium text-text">
                &ldquo;{query}&rdquo;
              </span>
            </p>

            {/* Channel results */}
            {showChannels && channelResults.length > 0 && (
              <div className="flex flex-col gap-3">
                {channelResults.map((channel) => (
                  <ChannelResultCard key={channel.id} channel={channel} />
                ))}
              </div>
            )}

            {/* Video results */}
            {showVideos && videoResults.length > 0 && (
              <div className="flex flex-col gap-6">
                {videoResults.map((video) => (
                  <SearchResultCard key={video.id} video={video} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
