"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  X,
  Trash2,
  Pencil,
  Check,
  Globe,
  Lock,
  Link as LinkIcon,
  ListVideo,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { mockPlaylists } from "@/data/playlists";
import { Button } from "@/components/shared/Button";
import { cn, timeAgo } from "@/lib/utils";
import type { Playlist } from "@/types";

type Visibility = Playlist["visibility"];
type VisibilityFilter = "all" | Visibility;

const VISIBILITY_CONFIG: Record<
  Visibility,
  { label: string; icon: React.ElementType; className: string }
> = {
  public: {
    label: "Public",
    icon: Globe,
    className: "text-[var(--success)] bg-[var(--success)]/10",
  },
  unlisted: {
    label: "Unlisted",
    icon: LinkIcon,
    className: "text-[var(--warning)] bg-[var(--warning)]/10",
  },
  private: {
    label: "Private",
    icon: Lock,
    className: "text-[var(--text-secondary)] bg-[var(--surface-secondary)]",
  },
};

const VISIBILITY_CYCLE: Visibility[] = ["public", "unlisted", "private"];

const FILTER_TABS: { id: VisibilityFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "public", label: "Public" },
  { id: "unlisted", label: "Unlisted" },
  { id: "private", label: "Private" },
];

type PlaylistState = Playlist & { deleted: boolean };

const myInitial: PlaylistState[] = mockPlaylists
  .filter((p) => p.owner.id === "u1")
  .map((p) => ({ ...p, deleted: false }));

export function StudioPlaylistsView() {
  const [playlists, setPlaylists] = useState<PlaylistState[]>(myInitial);
  const [query, setQuery] = useState("");
  const [visFilter, setVisFilter] = useState<VisibilityFilter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newVisibility, setNewVisibility] = useState<Visibility>("public");
  const editInputRef = useRef<HTMLInputElement>(null);
  const createInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);

  useEffect(() => {
    if (showCreate) createInputRef.current?.focus();
  }, [showCreate]);

  const visible = useMemo(() => {
    return playlists.filter((p) => {
      if (p.deleted) return false;
      if (visFilter !== "all" && p.visibility !== visFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [playlists, visFilter, query]);

  const counts = useMemo(() => {
    const base = playlists.filter((p) => !p.deleted);
    return {
      all: base.length,
      public: base.filter((p) => p.visibility === "public").length,
      unlisted: base.filter((p) => p.visibility === "unlisted").length,
      private: base.filter((p) => p.visibility === "private").length,
    };
  }, [playlists]);

  const startEdit = (p: PlaylistState) => {
    setEditingId(p.id);
    setEditTitle(p.title);
  };

  const commitEdit = (id: string) => {
    const trimmed = editTitle.trim();
    if (trimmed) {
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, title: trimmed, updatedAt: new Date().toISOString() }
            : p
        )
      );
    }
    setEditingId(null);
  };

  const cycleVisibility = (id: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const idx = VISIBILITY_CYCLE.indexOf(p.visibility);
        const next = VISIBILITY_CYCLE[(idx + 1) % VISIBILITY_CYCLE.length];
        return { ...p, visibility: next, updatedAt: new Date().toISOString() };
      })
    );
  };

  const deletePlaylist = (id: string) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, deleted: true } : p))
    );
  };

  const createPlaylist = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    const newPl: PlaylistState = {
      id: `pl-${Date.now()}`,
      title: trimmed,
      description: "",
      thumbnail: `https://picsum.photos/seed/pl${Date.now()}/640/360`,
      videos: [],
      owner: { id: "u1" } as PlaylistState["owner"],
      visibility: newVisibility,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
    };
    setPlaylists((prev) => [newPl, ...prev]);
    setNewTitle("");
    setNewVisibility("public");
    setShowCreate(false);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">Playlists</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {counts.all} playlist{counts.all !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowCreate((o) => !o)}
          className="gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          New playlist
        </Button>
      </div>

      {/* Create panel */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col gap-4">
              <p className="text-sm font-semibold text-[var(--text)]">
                Create new playlist
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Title
                </label>
                <input
                  ref={createInputRef}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") createPlaylist();
                    if (e.key === "Escape") setShowCreate(false);
                  }}
                  placeholder="Playlist title"
                  maxLength={100}
                  aria-label="New playlist title"
                  className={cn(
                    "h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]",
                    "px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                  )}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Visibility
                </label>
                <div className="flex gap-1.5">
                  {VISIBILITY_CYCLE.map((v) => {
                    const { label, icon: Icon } = VISIBILITY_CONFIG[v];
                    return (
                      <button
                        key={v}
                        onClick={() => setNewVisibility(v)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors",
                          newVisibility === v
                            ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                            : "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-secondary)]"
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCreate(false);
                    setNewTitle("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={!newTitle.trim()}
                  onClick={createPlaylist}
                >
                  Create
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visibility filter tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]" role="tablist">
        {FILTER_TABS.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            aria-selected={visFilter === id}
            onClick={() => setVisFilter(id)}
            className={cn(
              "relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none shrink-0",
              visFilter === id
                ? "text-[var(--text)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text)]"
            )}
          >
            {label}
            <span
              className={cn(
                "text-[10px] font-semibold tabular-nums",
                visFilter === id
                  ? "text-[var(--text-secondary)]"
                  : "text-[var(--border)]"
              )}
            >
              {counts[id]}
            </span>
            {visFilter === id && (
              <motion.div
                layoutId="playlists-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)] pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search playlists..."
          aria-label="Search playlists"
          className={cn(
            "h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)]",
            "pl-9 pr-8 text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
          )}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Playlist list */}
      <AnimatePresence mode="wait">
        {visible.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-3 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-secondary)]">
              <ListVideo className="h-6 w-6 text-[var(--text-secondary)]" />
            </div>
            <p className="text-base font-semibold text-[var(--text)]">
              No playlists found
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              {query ? "Try a different search" : "Create your first playlist"}
            </p>
            {!query && (
              <Button
                size="sm"
                className="mt-1 gap-1.5"
                onClick={() => setShowCreate(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                New playlist
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
          >
            <AnimatePresence initial={false}>
              {visible.map((playlist, i) => {
                const { label, icon: VisIcon, className: visCls } =
                  VISIBILITY_CONFIG[playlist.visibility];
                const isEditing = editingId === playlist.id;
                const thumb =
                  playlist.videos[0]?.thumbnail ?? playlist.thumbnail;

                return (
                  <motion.div
                    key={playlist.id}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="group flex items-center gap-4 px-4 py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-secondary)]/40 transition-colors"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/playlist/${playlist.id}`}
                      className="relative shrink-0 w-20 aspect-video rounded-lg overflow-hidden bg-[var(--surface-secondary)]"
                      tabIndex={isEditing ? -1 : 0}
                    >
                      <Image
                        src={thumb}
                        alt={playlist.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                      <div className="absolute inset-y-0 right-0 w-1/3 bg-black/60 flex flex-col items-center justify-center gap-0.5">
                        <ListVideo className="h-3.5 w-3.5 text-white" />
                        <span className="text-[10px] font-bold text-white">
                          {playlist.videos.length}
                        </span>
                      </div>
                    </Link>

                    {/* Title + meta */}
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            ref={editInputRef}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitEdit(playlist.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            onBlur={() => commitEdit(playlist.id)}
                            maxLength={100}
                            aria-label="Edit playlist title"
                            className={cn(
                              "flex-1 h-8 rounded-lg border border-[var(--primary)] bg-[var(--surface-secondary)]",
                              "px-2.5 text-sm text-[var(--text)]",
                              "focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                            )}
                          />
                          <button
                            onClick={() => commitEdit(playlist.id)}
                            aria-label="Save title"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shrink-0"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            aria-label="Cancel edit"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors shrink-0"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <Link
                          href={`/playlist/${playlist.id}`}
                          className="text-sm font-semibold text-[var(--text)] line-clamp-1 hover:text-[var(--primary)] transition-colors"
                        >
                          {playlist.title}
                        </Link>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Visibility badge — clickable to cycle */}
                        <button
                          onClick={() => cycleVisibility(playlist.id)}
                          title="Click to change visibility"
                          className={cn(
                            "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-colors hover:opacity-80",
                            visCls
                          )}
                        >
                          <VisIcon className="h-2.5 w-2.5" />
                          {label}
                        </button>

                        <span className="text-xs text-[var(--text-secondary)]">
                          {playlist.videos.length}{" "}
                          {playlist.videos.length === 1 ? "video" : "videos"}
                        </span>

                        <span className="text-xs text-[var(--text-secondary)] hidden sm:inline">
                          Updated {timeAgo(playlist.updatedAt)}
                        </span>
                      </div>

                      {playlist.description && (
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-1 hidden md:block">
                          {playlist.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(playlist)}
                        aria-label="Rename playlist"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text)] transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button
                            aria-label="More options"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text)] transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            align="end"
                            sideOffset={4}
                            className="z-50 min-w-40 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-lg animate-in fade-in-0 zoom-in-95"
                          >
                            <DropdownMenu.Item
                              onSelect={() => startEdit(playlist)}
                              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:bg-[var(--surface-secondary)] transition-colors"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Rename
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onSelect={() => cycleVisibility(playlist.id)}
                              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text)] outline-none focus:bg-[var(--surface-secondary)] transition-colors"
                            >
                              <VisIcon className="h-3.5 w-3.5" />
                              Change visibility
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="my-1 h-px bg-[var(--border)]" />
                            <DropdownMenu.Item
                              onSelect={() => deletePlaylist(playlist.id)}
                              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--danger)] outline-none focus:bg-[var(--danger)]/10 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Footer */}
            <div className="border-t border-[var(--border)] px-4 py-3 bg-[var(--surface-secondary)]/50">
              <p className="text-xs text-[var(--text-secondary)]">
                Showing{" "}
                <span className="font-medium text-[var(--text)]">
                  {visible.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[var(--text)]">
                  {counts.all}
                </span>{" "}
                playlists
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
