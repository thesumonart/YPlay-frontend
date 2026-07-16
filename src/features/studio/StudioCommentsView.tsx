"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Trash2,
  Pin,
  PinOff,
  CheckCheck,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  CornerDownRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { mockComments } from "@/data/comments";
import { mockVideos } from "@/data/videos";
import { Button } from "@/components/shared/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shared/Avatar";
import { cn, formatViews, timeAgo } from "@/lib/utils";
import type { Comment } from "@/types";

// Only comments on videos owned by u1
const myVideoIds = new Set(
  mockVideos.filter((v) => v.channel.id === "u1").map((v) => v.id)
);
const myVideos = mockVideos.filter((v) => v.channel.id === "u1" && !v.isShort);

type ReadFilter = "all" | "unread" | "read";

interface CommentState extends Comment {
  read: boolean;
  deleted: boolean;
}

function buildInitialState(): CommentState[] {
  return mockComments
    .filter((c) => myVideoIds.has(c.videoId))
    .map((c, i) => ({ ...c, read: i % 3 !== 0, deleted: false }));
}

export function StudioCommentsView() {
  const [comments, setComments] = useState<CommentState[]>(buildInitialState);
  const [query, setQuery] = useState("");
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [videoFilter, setVideoFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const visible = useMemo(() => {
    return comments.filter((c) => {
      if (c.deleted) return false;
      if (videoFilter !== "all" && c.videoId !== videoFilter) return false;
      if (readFilter === "unread" && c.read) return false;
      if (readFilter === "read" && !c.read) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !c.content.toLowerCase().includes(q) &&
          !c.author.name.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [comments, videoFilter, readFilter, query]);

  const unreadCount = useMemo(
    () => comments.filter((c) => !c.deleted && !c.read).length,
    [comments]
  );

  const counts: Record<ReadFilter, number> = useMemo(
    () => ({
      all: comments.filter((c) => !c.deleted).length,
      unread: comments.filter((c) => !c.deleted && !c.read).length,
      read: comments.filter((c) => !c.deleted && c.read).length,
    }),
    [comments]
  );

  const allSelected =
    visible.length > 0 && visible.every((c) => selected.has(c.id));

  const toggleAll = useCallback(() => {
    setSelected(
      allSelected ? new Set() : new Set(visible.map((c) => c.id))
    );
  }, [allSelected, visible]);

  const toggleOne = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const markRead = useCallback((ids: string[]) => {
    setComments((prev) =>
      prev.map((c) => (ids.includes(c.id) ? { ...c, read: true } : c))
    );
    setSelected(new Set());
  }, []);

  const deleteComments = useCallback((ids: string[]) => {
    setComments((prev) =>
      prev.map((c) => (ids.includes(c.id) ? { ...c, deleted: true } : c))
    );
    setSelected(new Set());
  }, []);

  const togglePin = useCallback((id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  }, []);

  const toggleReplies = useCallback((id: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const submitReply = useCallback(
    (commentId: string) => {
      if (!replyText.trim()) return;
      setReplyingTo(null);
      setReplyText("");
    },
    [replyText]
  );

  const videoForComment = useCallback(
    (videoId: string) => mockVideos.find((v) => v.id === videoId),
    []
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">Comments</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {unreadCount > 0 ? (
              <>
                <span className="font-medium text-[var(--primary)]">
                  {unreadCount} unread
                </span>{" "}
                · {counts.all} total
              </>
            ) : (
              `${counts.all} comments`
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              markRead(comments.filter((c) => !c.read && !c.deleted).map((c) => c.id))
            }
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Read filter tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]" role="tablist">
        {(["all", "unread", "read"] as ReadFilter[]).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={readFilter === f}
            onClick={() => {
              setReadFilter(f);
              setSelected(new Set());
            }}
            className={cn(
              "relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium capitalize transition-colors focus-visible:outline-none shrink-0",
              readFilter === f
                ? "text-[var(--text)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text)]"
            )}
          >
            {f}
            <span
              className={cn(
                "text-[10px] font-semibold tabular-nums",
                readFilter === f ? "text-[var(--text-secondary)]" : "text-[var(--border)]"
              )}
            >
              {counts[f]}
            </span>
            {readFilter === f && (
              <motion.div
                layoutId="comments-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Search + video filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)] pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search comments..."
            aria-label="Search comments"
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

        <select
          value={videoFilter}
          onChange={(e) => {
            setVideoFilter(e.target.value);
            setSelected(new Set());
          }}
          aria-label="Filter by video"
          className={cn(
            "h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)]",
            "px-3 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all",
            "max-w-[200px] truncate"
          )}
        >
          <option value="all">All videos</option>
          {myVideos.map((v) => (
            <option key={v.id} value={v.id}>
              {v.title.length > 30 ? `${v.title.slice(0, 30)}…` : v.title}
            </option>
          ))}
        </select>
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-2.5"
          >
            <span className="text-sm font-medium text-[var(--text)]">
              {selected.size} selected
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-[var(--text-secondary)]"
                onClick={() => markRead([...selected])}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-[var(--danger)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10"
                onClick={() => deleteComments([...selected])}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelected(new Set())}
                className="text-[var(--text-secondary)]"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment list */}
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
              <MessageSquare className="h-6 w-6 text-[var(--text-secondary)]" />
            </div>
            <p className="text-base font-semibold text-[var(--text)]">
              No comments found
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Try a different search or filter
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
          >
            {/* Table header */}
            <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-2.5">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                aria-label="Select all comments"
                className="h-4 w-4 rounded border-[var(--border)] accent-[var(--primary)] cursor-pointer shrink-0"
              />
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Comment
              </span>
              <span className="ml-auto text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:block">
                Video
              </span>
            </div>

            <AnimatePresence initial={false}>
              {visible.map((comment, i) => {
                const video = videoForComment(comment.videoId);
                const isSelected = selected.has(comment.id);
                const repliesExpanded = expandedReplies.has(comment.id);
                const isReplying = replyingTo === comment.id;

                return (
                  <motion.div
                    key={comment.id}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className={cn(
                      "border-b border-[var(--border)] last:border-0 transition-colors",
                      isSelected
                        ? "bg-[var(--primary)]/5"
                        : !comment.read
                        ? "bg-[var(--surface-secondary)]/40"
                        : "hover:bg-[var(--surface-secondary)]/30"
                    )}
                  >
                    <div className="flex gap-3 px-4 py-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(comment.id)}
                        aria-label={`Select comment by ${comment.author.name}`}
                        className="h-4 w-4 rounded border-[var(--border)] accent-[var(--primary)] cursor-pointer shrink-0 mt-1"
                      />

                      {/* Unread dot */}
                      <div className="flex items-start pt-2 shrink-0 w-2">
                        {!comment.read && (
                          <div className="h-2 w-2 rounded-full bg-[var(--primary)] shrink-0" />
                        )}
                      </div>

                      {/* Avatar */}
                      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                        <AvatarImage
                          src={comment.author.avatar}
                          alt={comment.author.name}
                        />
                        <AvatarFallback>
                          {comment.author.name[0]}
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                        {/* Author + meta */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-[var(--text)]">
                            {comment.author.name}
                          </span>
                          {comment.isPinned && (
                            <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] bg-[var(--surface-secondary)] rounded-md px-1.5 py-0.5">
                              <Pin className="h-2.5 w-2.5" />
                              Pinned
                            </span>
                          )}
                          {!comment.read && (
                            <span className="text-[11px] font-semibold text-[var(--primary)] bg-[var(--primary)]/10 rounded-md px-1.5 py-0.5">
                              New
                            </span>
                          )}
                          <span className="text-xs text-[var(--text-secondary)]">
                            {timeAgo(comment.publishedAt)}
                          </span>
                        </div>

                        {/* Comment text */}
                        <p className="text-sm text-[var(--text)] leading-relaxed">
                          {comment.content}
                        </p>

                        {/* Actions row */}
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                            <ThumbsUp className="h-3 w-3" />
                            {formatViews(comment.likes)}
                          </span>

                          <button
                            onClick={() => {
                              setReplyingTo(isReplying ? null : comment.id);
                              setReplyText("");
                            }}
                            className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                          >
                            <CornerDownRight className="h-3 w-3" />
                            Reply
                          </button>

                          <button
                            onClick={() => togglePin(comment.id)}
                            className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                          >
                            {comment.isPinned ? (
                              <>
                                <PinOff className="h-3 w-3" />
                                Unpin
                              </>
                            ) : (
                              <>
                                <Pin className="h-3 w-3" />
                                Pin
                              </>
                            )}
                          </button>

                          {!comment.read && (
                            <button
                              onClick={() => markRead([comment.id])}
                              className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                            >
                              <CheckCheck className="h-3 w-3" />
                              Mark read
                            </button>
                          )}

                          <button
                            onClick={() => deleteComments([comment.id])}
                            className="flex items-center gap-1 text-xs font-medium text-[var(--danger)]/70 hover:text-[var(--danger)] transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>

                        {/* Reply input */}
                        <AnimatePresence>
                          {isReplying && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="flex gap-2 mt-2">
                                <input
                                  autoFocus
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      submitReply(comment.id);
                                    }
                                    if (e.key === "Escape") {
                                      setReplyingTo(null);
                                      setReplyText("");
                                    }
                                  }}
                                  placeholder={`Reply to ${comment.author.name}…`}
                                  aria-label="Write a reply"
                                  className={cn(
                                    "flex-1 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]",
                                    "px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)]",
                                    "focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                                  )}
                                />
                                <Button
                                  size="sm"
                                  disabled={!replyText.trim()}
                                  onClick={() => submitReply(comment.id)}
                                >
                                  Reply
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText("");
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Replies toggle */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-1">
                            <button
                              onClick={() => toggleReplies(comment.id)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--secondary)] hover:text-[var(--primary)] transition-colors"
                            >
                              {repliesExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )}
                              {comment.replies.length}{" "}
                              {comment.replies.length === 1 ? "reply" : "replies"}
                            </button>

                            <AnimatePresence>
                              {repliesExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="flex flex-col gap-3 mt-3 pl-4 border-l-2 border-[var(--border)]">
                                    {comment.replies.map((reply) => (
                                      <div
                                        key={reply.id}
                                        className="flex gap-2.5"
                                      >
                                        <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                                          <AvatarImage
                                            src={reply.author.avatar}
                                            alt={reply.author.name}
                                          />
                                          <AvatarFallback>
                                            {reply.author.name[0]}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-[var(--text)]">
                                              {reply.author.name}
                                            </span>
                                            <span className="text-[11px] text-[var(--text-secondary)]">
                                              {timeAgo(reply.publishedAt)}
                                            </span>
                                          </div>
                                          <p className="text-xs text-[var(--text)] leading-relaxed">
                                            {reply.content}
                                          </p>
                                          <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] mt-0.5">
                                            <ThumbsUp className="h-2.5 w-2.5" />
                                            {formatViews(reply.likes)}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>

                      {/* Video thumbnail — desktop */}
                      {video && (
                        <Link
                          href={`/watch/${video.id}`}
                          className="hidden sm:flex items-start gap-2 shrink-0 group/video"
                          title={video.title}
                        >
                          <div className="relative w-20 aspect-video rounded-lg overflow-hidden bg-[var(--surface-secondary)] shrink-0">
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              sizes="80px"
                              className="object-cover transition-opacity group-hover/video:opacity-80"
                            />
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 max-w-[120px] group-hover/video:text-[var(--text)] transition-colors leading-snug">
                            {video.title}
                          </p>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Footer */}
            <div className="border-t border-[var(--border)] px-4 py-3 flex items-center justify-between bg-[var(--surface-secondary)]/50">
              <p className="text-xs text-[var(--text-secondary)]">
                Showing{" "}
                <span className="font-medium text-[var(--text)]">
                  {visible.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[var(--text)]">
                  {counts.all}
                </span>{" "}
                comments
              </p>
              {selected.size > 0 && (
                <p className="text-xs text-[var(--primary)] font-medium">
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
