"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe, Link2, ListVideo, Lock, Plus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { mockPlaylists } from "@/data/playlists";
import { cn } from "@/lib/utils";
import type { Playlist } from "@/types";

interface AddToPlaylistModalProps {
  open: boolean;
  onClose: () => void;
  videoId: string;
}

const VISIBILITY_ICONS = {
  public: Globe,
  unlisted: Link2,
  private: Lock,
} as const;

const VISIBILITY_OPTIONS = ["public", "unlisted", "private"] as const;

export function AddToPlaylistModal({
  open,
  onClose,
  videoId,
}: AddToPlaylistModalProps) {
  const userPlaylists = useMemo(
    () => mockPlaylists.filter((p) => p.owner.id === "u1"),
    [],
  );

  const [checked, setChecked] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const pl of userPlaylists) {
      if (pl.videos.some((v) => v.id === videoId)) initial.add(pl.id);
    }
    return initial;
  });

  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newVisibility, setNewVisibility] =
    useState<Playlist["visibility"]>("public");
  const [localPlaylists, setLocalPlaylists] =
    useState<Playlist[]>(userPlaylists);

  const triggerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement;
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const initial = new Set<string>();
    for (const pl of userPlaylists) {
      if (pl.videos.some((v) => v.id === videoId)) initial.add(pl.id);
    }
    setChecked(initial);
  }, [videoId, userPlaylists]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleCreate = () => {
    const title = newTitle.trim();
    if (!title) return;
    const newPl: Playlist = {
      id: `pl-new-${Date.now()}`,
      title,
      description: "",
      thumbnail: "https://picsum.photos/seed/new/640/360",
      videos: [],
      owner: mockPlaylists[0].owner,
      visibility: newVisibility,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLocalPlaylists((prev) => [newPl, ...prev]);
    setChecked((prev) => new Set([...prev, newPl.id]));
    setNewTitle("");
    setCreating(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Save to playlist"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-bold text-text">Save to playlist</h2>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-secondary hover:text-text transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Playlist list */}
            <div className="max-h-72 overflow-y-auto">
              {localPlaylists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                  <ListVideo className="h-8 w-8 text-text-secondary" />
                  <p className="text-sm text-text-secondary">
                    No playlists yet
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {localPlaylists.map((pl) => {
                    const VisIcon = VISIBILITY_ICONS[pl.visibility];
                    const isChecked = checked.has(pl.id);
                    return (
                      <motion.button
                        key={pl.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={() => toggle(pl.id)}
                        className="flex w-full items-center gap-3 px-5 py-3 hover:bg-surface-secondary transition-colors text-left"
                      >
                        {/* Checkbox */}
                        <div
                          className={cn(
                            "h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors",
                            isChecked
                              ? "bg-primary border-primary"
                              : "border-border bg-surface",
                          )}
                        >
                          {isChecked && (
                            <Check className="h-2.5 w-2.5 text-white" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                          <span className="text-sm font-medium text-text truncate">
                            {pl.title}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-text-secondary">
                            <VisIcon className="h-3 w-3" />
                            <span className="capitalize">{pl.visibility}</span>
                            <span>·</span>
                            <span>{pl.videos.length} videos</span>
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Create new playlist */}
            <div className="border-t border-border">
              <AnimatePresence initial={false}>
                {creating ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-3 px-5 py-4"
                  >
                    <input
                      autoFocus
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreate();
                        if (e.key === "Escape") setCreating(false);
                      }}
                      placeholder="Playlist name"
                      className="h-9 w-full rounded-lg border border-border bg-surface-secondary px-3 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />

                    {/* Visibility selector */}
                    <div className="flex gap-1">
                      {VISIBILITY_OPTIONS.map((v) => {
                        const Icon = VISIBILITY_ICONS[v];
                        return (
                          <button
                            key={v}
                            onClick={() => setNewVisibility(v)}
                            className={cn(
                              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium capitalize transition-colors border",
                              newVisibility === v
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-text-secondary hover:text-text",
                            )}
                          >
                            <Icon className="h-3 w-3" />
                            {v}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setCreating(false)}
                        className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-text-secondary hover:bg-surface-secondary transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreate}
                        disabled={!newTitle.trim()}
                        className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Create
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="trigger"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setCreating(true)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-text transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    New playlist
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-5 py-3 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
