"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { mockNotifications } from "@/data/notifications";
import type { Notification } from "@/types";
import { NotificationItem } from "@/components/shared/NotificationItem";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Unread", "Comments", "Uploads", "Activity"] as const;
type Filter = (typeof FILTERS)[number];

function groupByDate(
  notifications: Notification[],
): Record<string, Notification[]> {
  const groups: Record<string, Notification[]> = {};
  const now = new Date();

  for (const n of notifications) {
    const date = new Date(n.createdAt);
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
    const key =
      diffDays === 0
        ? "Today"
        : diffDays === 1
          ? "Yesterday"
          : diffDays <= 7
            ? "This week"
            : "Earlier";
    if (!groups[key]) groups[key] = [];
    groups[key].push(n);
  }
  return groups;
}

const GROUP_ORDER = ["Today", "Yesterday", "This week", "Earlier"];

export function NotificationsView() {
  const [items, setItems] = useState<Notification[]>(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const unreadCount = items.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    switch (activeFilter) {
      case "Unread":
        return items.filter((n) => !n.read);
      case "Comments":
        return items.filter((n) => n.type === "comment" || n.type === "reply");
      case "Uploads":
        return items.filter((n) => n.type === "upload");
      case "Activity":
        return items.filter(
          (n) => n.type === "like" || n.type === "subscription",
        );
      default:
        return items;
    }
  }, [items, activeFilter]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  const markRead = (id: string) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const dismiss = (id: string) =>
    setItems((prev) => prev.filter((n) => n.id !== id));

  const clearAll = () => setItems([]);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-text-secondary">
                {unreadCount} unread
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllRead}
              className="gap-1.5 text-text-secondary"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="gap-1.5 text-text-secondary"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            role="tab"
            aria-selected={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "relative shrink-0 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
              activeFilter === filter
                ? "bg-text text-background"
                : "bg-surface-secondary text-text-secondary hover:text-text hover:bg-border",
            )}
          >
            {filter}
            {filter === "Unread" && unreadCount > 0 && (
              <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-3 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary">
              <Bell className="h-7 w-7 text-text-secondary" />
            </div>
            <p className="text-base font-semibold text-text">
              {activeFilter === "Unread"
                ? "All caught up!"
                : "No notifications"}
            </p>
            <p className="text-sm text-text-secondary">
              {activeFilter === "Unread"
                ? "You have no unread notifications"
                : "Nothing to show here yet"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-8"
          >
            {GROUP_ORDER.filter((g) => grouped[g]?.length).map((group) => (
              <div key={group} className="flex flex-col gap-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary px-1">
                  {group}
                </h2>
                <AnimatePresence>
                  {grouped[group].map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDismiss={dismiss}
                      onMarkRead={markRead}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
