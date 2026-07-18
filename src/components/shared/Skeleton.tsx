import { cn } from "@/lib/utils";

// ── Primitive ─────────────────────────────────────────────────────────────────
export function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-surface-secondary", className)}
    />
  );
}

// ── Video card ────────────────────────────────────────────────────────────────
export function VideoCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <SkeletonBox className="aspect-video w-full" />
      <div className="flex gap-3">
        <SkeletonBox className="h-9 w-9 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <SkeletonBox className="h-4 w-full" />
          <SkeletonBox className="h-3 w-2/3" />
          <SkeletonBox className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function VideoGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Home page ─────────────────────────────────────────────────────────────────
export function HomePageSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {/* Featured hero */}
      <SkeletonBox className="w-full rounded-2xl aspect-[21/9]" />

      {/* Category chips */}
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonBox key={i} className="h-8 w-20 rounded-full shrink-0" />
        ))}
      </div>

      {/* Video grid */}
      <VideoGridSkeleton count={8} />
    </div>
  );
}

// ── Watch page ────────────────────────────────────────────────────────────────
export function WatchPageSkeleton() {
  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Main column */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Player */}
        <SkeletonBox className="w-full aspect-video rounded-xl" />

        {/* Actions bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <SkeletonBox className="h-9 w-24 rounded-lg" />
            <SkeletonBox className="h-9 w-24 rounded-lg" />
            <SkeletonBox className="h-9 w-20 rounded-lg" />
          </div>
          <SkeletonBox className="h-9 w-28 rounded-lg" />
        </div>

        {/* Video info */}
        <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
          <SkeletonBox className="h-6 w-3/4" />
          <div className="flex items-center gap-3">
            <SkeletonBox className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <SkeletonBox className="h-4 w-40" />
              <SkeletonBox className="h-3 w-24" />
            </div>
            <SkeletonBox className="h-9 w-28 rounded-lg" />
          </div>
          <SkeletonBox className="h-3 w-full" />
          <SkeletonBox className="h-3 w-5/6" />
          <SkeletonBox className="h-3 w-2/3" />
        </div>

        {/* Comments */}
        <div className="flex flex-col gap-4 pt-2">
          <SkeletonBox className="h-5 w-32" />
          {Array.from({ length: 4 }).map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Up next sidebar */}
      <aside className="w-full xl:w-96 shrink-0 flex flex-col gap-3">
        <SkeletonBox className="h-5 w-20" />
        {Array.from({ length: 6 }).map((_, i) => (
          <UpNextCardSkeleton key={i} />
        ))}
      </aside>
    </div>
  );
}

function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      <SkeletonBox className="h-9 w-9 rounded-full shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <SkeletonBox className="h-3 w-32" />
        <SkeletonBox className="h-3 w-full" />
        <SkeletonBox className="h-3 w-4/5" />
      </div>
    </div>
  );
}

function UpNextCardSkeleton() {
  return (
    <div className="flex gap-3">
      <SkeletonBox className="w-40 aspect-video rounded-lg shrink-0" />
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <SkeletonBox className="h-3 w-full" />
        <SkeletonBox className="h-3 w-3/4" />
        <SkeletonBox className="h-3 w-1/2" />
      </div>
    </div>
  );
}

// ── Channel page ──────────────────────────────────────────────────────────────
export function ChannelPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Banner */}
      <SkeletonBox className="w-full h-40 md:h-52 rounded-2xl" />

      {/* Channel info */}
      <div className="flex items-end gap-4 -mt-10 px-4">
        <SkeletonBox className="h-20 w-20 rounded-full shrink-0 ring-4 ring-background" />
        <div className="flex flex-col gap-2 pb-1 flex-1">
          <SkeletonBox className="h-5 w-48" />
          <SkeletonBox className="h-3 w-32" />
        </div>
        <SkeletonBox className="h-9 w-28 rounded-lg shrink-0" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border pb-0">
        {["Videos", "Playlists", "About"].map((t) => (
          <SkeletonBox key={t} className="h-9 w-20 rounded-t-lg" />
        ))}
      </div>

      {/* Video grid */}
      <VideoGridSkeleton count={8} />
    </div>
  );
}

// ── Search page ───────────────────────────────────────────────────────────────
export function SearchPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Search bar */}
      <div className="flex gap-2">
        <SkeletonBox className="h-11 flex-1 rounded-lg" />
        <SkeletonBox className="h-11 w-24 rounded-lg" />
      </div>

      {/* Results */}
      <div className="flex flex-col gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <SearchResultSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function SearchResultSkeleton() {
  return (
    <div className="flex gap-4">
      <SkeletonBox className="w-64 aspect-video rounded-xl shrink-0" />
      <div className="flex flex-col gap-2 flex-1 min-w-0 pt-1">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-1/3" />
        <SkeletonBox className="h-3 w-full mt-2" />
        <SkeletonBox className="h-3 w-5/6" />
      </div>
    </div>
  );
}

// ── Trending page ─────────────────────────────────────────────────────────────
export function TrendingPageSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SkeletonBox className="h-10 w-10 rounded-xl" />
        <div className="flex flex-col gap-1.5">
          <SkeletonBox className="h-5 w-24" />
          <SkeletonBox className="h-3 w-40" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border pb-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBox key={i} className="h-9 w-20 rounded-t-lg" />
        ))}
      </div>

      {/* Hero card */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-10 w-8 rounded-lg" />
          <SkeletonBox className="h-4 w-28" />
        </div>
        <VideoCardSkeleton />
      </div>

      {/* Ranked list */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <TrendingRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function TrendingRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-2 border-b border-border last:border-0">
      <SkeletonBox className="h-6 w-6 rounded-md shrink-0" />
      <SkeletonBox className="w-36 aspect-video rounded-lg shrink-0" />
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-1/3" />
        <SkeletonBox className="h-3 w-1/4" />
      </div>
    </div>
  );
}

// ── Playlist page ─────────────────────────────────────────────────────────────
export function PlaylistPageSkeleton() {
  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Player area */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <SkeletonBox className="w-full aspect-video rounded-xl" />
        <div className="flex gap-2">
          <SkeletonBox className="h-9 w-24 rounded-lg" />
          <SkeletonBox className="h-9 w-24 rounded-lg" />
        </div>
        <div className="flex flex-col gap-2">
          <SkeletonBox className="h-5 w-3/4" />
          <SkeletonBox className="h-3 w-1/3" />
        </div>
      </div>

      {/* Playlist sidebar */}
      <aside className="w-full xl:w-96 shrink-0 flex flex-col gap-3">
        <SkeletonBox className="w-full aspect-video rounded-xl" />
        <div className="flex gap-2">
          <SkeletonBox className="h-9 flex-1 rounded-lg" />
          <SkeletonBox className="h-9 w-24 rounded-lg" />
        </div>
        <SkeletonBox className="h-4 w-24 mt-1" />
        {Array.from({ length: 5 }).map((_, i) => (
          <PlaylistRowSkeleton key={i} />
        ))}
      </aside>
    </div>
  );
}

function PlaylistRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <SkeletonBox className="h-4 w-4 rounded shrink-0" />
      <SkeletonBox className="w-28 aspect-video rounded-lg shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <SkeletonBox className="h-3 w-full" />
        <SkeletonBox className="h-3 w-2/3" />
      </div>
    </div>
  );
}

// ── Studio dashboard ──────────────────────────────────────────────────────────
export function StudioDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {/* Welcome */}
      <div className="flex flex-col gap-1.5">
        <SkeletonBox className="h-6 w-56" />
        <SkeletonBox className="h-4 w-40" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <SkeletonBox className="h-3 w-20" />
              <SkeletonBox className="h-8 w-8 rounded-lg" />
            </div>
            <SkeletonBox className="h-7 w-24" />
            <SkeletonBox className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-col gap-3">
        <SkeletonBox className="h-4 w-28" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col gap-3">
        <SkeletonBox className="h-4 w-28" />
        <div className="rounded-xl border border-border overflow-hidden">
          <SkeletonBox className="h-10 w-full rounded-none" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-3 border-t border-border"
            >
              <SkeletonBox className="w-24 aspect-video rounded-lg shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <SkeletonBox className="h-3 w-3/4" />
                <SkeletonBox className="h-3 w-1/2" />
              </div>
              <SkeletonBox className="h-6 w-16 rounded-md hidden sm:block" />
              <SkeletonBox className="h-3 w-12 hidden md:block" />
              <SkeletonBox className="h-3 w-12 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Generic page (notifications, library, settings, etc.) ────────────────────
export function GenericPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <SkeletonBox className="h-7 w-40" />
        <SkeletonBox className="h-4 w-56" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-border pb-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="h-9 w-20 rounded-t-lg" />
        ))}
      </div>

      {/* Content rows */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-border p-4"
          >
            <SkeletonBox className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <SkeletonBox className="h-4 w-2/3" />
              <SkeletonBox className="h-3 w-1/3" />
            </div>
            <SkeletonBox className="h-8 w-16 rounded-lg hidden sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
