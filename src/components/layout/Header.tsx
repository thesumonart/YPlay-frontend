"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CheckCheck,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Radio,
  Reply,
  Search,
  Settings,
  ThumbsUp,
  Upload,
  Upload as UploadIcon,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/Avatar";
import { Button } from "@/components/shared/Button";
import { Logo } from "@/components/shared/Logo";
import { SearchBar } from "@/components/shared/SearchBar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Tooltip } from "@/components/shared/Tooltip";
import { mockNotifications } from "@/data/notifications";
import { currentUser } from "@/data/users";
import { cn, formatViews, timeAgo } from "@/lib/utils";
import { useUIStore } from "@/store/ui";
import type { Notification } from "@/types";

// ── Notification type config ──────────────────────────────────────────────────
const NOTIF_TYPE: Record<
  Notification["type"],
  { icon: React.ElementType; color: string; bg: string }
> = {
  upload: { icon: UploadIcon, color: "text-secondary", bg: "bg-secondary/10" },
  comment: { icon: MessageSquare, color: "text-accent", bg: "bg-accent/10" },
  reply: { icon: Reply, color: "text-accent", bg: "bg-accent/10" },
  like: { icon: ThumbsUp, color: "text-primary", bg: "bg-primary/10" },
  subscription: { icon: Users, color: "text-success", bg: "bg-success/10" },
  live: { icon: Radio, color: "text-danger", bg: "bg-danger/10" },
};

// ── useClickOutside ───────────────────────────────────────────────────────────
function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
) {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// ── NotificationsPanel ────────────────────────────────────────────────────────
interface NotificationsPanelProps {
  onClose: () => void;
}

function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const [items, setItems] = useState<Notification[]>(mockNotifications);
  const unread = items.filter((n) => !n.read);

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const dismiss = (id: string) =>
    setItems((prev) => prev.filter((n) => n.id !== id));
  const markRead = (id: string) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const preview = items.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute right-0 top-full mt-2 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-surface shadow-xl overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text">Notifications</span>
          {unread.length > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
              {unread.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unread.length > 0 && (
            <Tooltip content="Mark all read" side="bottom">
              <button
                onClick={markAllRead}
                aria-label="Mark all notifications as read"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-secondary hover:text-text transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
              </button>
            </Tooltip>
          )}
          <Tooltip content="Close" side="bottom">
            <button
              onClick={onClose}
              aria-label="Close notifications"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-secondary hover:text-text transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto">
        {preview.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
            <Bell className="h-8 w-8 text-text-secondary" />
            <p className="text-sm font-medium text-text">All caught up!</p>
            <p className="text-xs text-text-secondary">
              No notifications right now
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {preview.map((n) => {
              const { icon: Icon, color, bg } = NOTIF_TYPE[n.type];
              return (
                <motion.div
                  key={n.id}
                  layout
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  transition={{ duration: 0.18 }}
                  onClick={() => !n.read && markRead(n.id)}
                  className={cn(
                    "group relative flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-border last:border-0",
                    n.read
                      ? "hover:bg-surface-secondary/60"
                      : "bg-surface-secondary/40 hover:bg-surface-secondary",
                  )}
                >
                  {/* Unread dot */}
                  {!n.read && (
                    <span className="absolute left-1.5 top-4 h-1.5 w-1.5 rounded-full bg-primary" />
                  )}

                  {/* Avatar + type badge */}
                  <div className="relative shrink-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={n.actor.avatar} alt={n.actor.name} />
                      <AvatarFallback>{n.actor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full",
                        bg,
                      )}
                    >
                      <Icon className={cn("h-2.5 w-2.5", color)} />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-xs leading-snug line-clamp-2",
                        n.read
                          ? "text-text-secondary"
                          : "text-text font-medium",
                      )}
                    >
                      {n.message}
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>

                  {/* Thumbnail */}
                  {n.videoId && n.videoThumbnail && (
                    <Link
                      href={`/watch/${n.videoId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="relative shrink-0 w-14 aspect-video rounded-lg overflow-hidden bg-surface-secondary hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={n.videoThumbnail}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </Link>
                  )}

                  {/* Dismiss */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismiss(n.id);
                    }}
                    aria-label="Dismiss"
                    className="shrink-0 flex h-6 w-6 items-center justify-center rounded-md text-text-secondary opacity-0 group-hover:opacity-100 hover:bg-border hover:text-text transition-all"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t border-border px-4 py-2.5">
          <Link
            href="/notifications"
            onClick={onClose}
            className="flex items-center justify-center gap-1 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
          >
            View all notifications
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </motion.div>
  );
}

// ── ProfilePanel ──────────────────────────────────────────────────────────────
interface ProfilePanelProps {
  onClose: () => void;
}

function ProfilePanel({ onClose }: ProfilePanelProps) {
  const menuItems = [
    { href: `/channel/u1`, icon: User, label: "Your channel" },
    { href: "/studio", icon: LayoutDashboard, label: "Creator Studio" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-surface shadow-xl overflow-hidden z-50"
    >
      {/* Profile header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>Y</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-sm font-semibold text-text truncate">
            {currentUser.name}
          </p>
          <p className="text-xs text-text-secondary truncate">
            {currentUser.handle}
          </p>
        </div>
      </div>

      {/* Menu items */}
      <div className="p-1.5">
        {menuItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text transition-colors"
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </div>

      {/* Divider + sign out */}
      <div className="border-t border-border p-1.5">
        <button
          onClick={onClose}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </motion.div>
  );
}

// ── MobileSearchOverlay ───────────────────────────────────────────────────────
interface MobileSearchOverlayProps {
  onClose: () => void;
}

function MobileSearchOverlay({ onClose }: MobileSearchOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="absolute left-0 right-0 top-full z-40 border-b border-border bg-surface px-4 py-3 sm:hidden shadow-md"
    >
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SearchBar placeholder="Search videos, channels..." />
        </div>
        <button
          onClick={onClose}
          aria-label="Close search"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-secondary hover:text-text transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
export function Header() {
  const { toggleSidebar, toggleSidebarCollapsed } = useUIStore();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const closeNotif = useCallback(() => setNotifOpen(false), []);
  const closeProfile = useCallback(() => setProfileOpen(false), []);

  useClickOutside(notifRef, closeNotif);
  useClickOutside(profileRef, closeProfile);

  // Close panels on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setProfileOpen(false);
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="flex h-full items-center gap-3 px-4">
        {/* Menu + Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <Tooltip content="Menu" side="bottom">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebarCollapsed}
              aria-label="Toggle sidebar"
              className="hidden md:inline-flex"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </Tooltip>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Open menu"
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Logo />
        </div>

        {/* Desktop search */}
        <div className="flex-1 max-w-xl mx-auto hidden sm:block">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1 shrink-0">
          {/* Mobile search toggle */}
          <Tooltip content="Search" side="bottom">
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              aria-label="Search"
              aria-expanded={mobileSearchOpen}
              onClick={() => {
                setMobileSearchOpen((o) => !o);
                setNotifOpen(false);
                setProfileOpen(false);
              }}
            >
              <Search className="h-5 w-5" />
            </Button>
          </Tooltip>

          {/* Upload */}
          <Tooltip content="Upload" side="bottom">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Upload video"
              asChild
            >
              <Link href="/studio/upload">
                <Upload className="h-5 w-5" />
              </Link>
            </Button>
          </Tooltip>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <Tooltip content="Notifications" side="bottom">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                aria-expanded={notifOpen}
                aria-haspopup="true"
                className="relative"
                onClick={() => {
                  setNotifOpen((o) => !o);
                  setProfileOpen(false);
                  setMobileSearchOpen(false);
                }}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1.5 right-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-primary"
                  />
                )}
              </Button>
            </Tooltip>
            <AnimatePresence>
              {notifOpen && <NotificationsPanel onClose={closeNotif} />}
            </AnimatePresence>
          </div>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Profile */}
          <div ref={profileRef} className="relative ml-1">
            <button
              onClick={() => {
                setProfileOpen((o) => !o);
                setNotifOpen(false);
                setMobileSearchOpen(false);
              }}
              aria-label="Account menu"
              aria-expanded={profileOpen}
              aria-haspopup="true"
              className="rounded-full ring-2 ring-transparent hover:ring-primary/40 transition-all focus-visible:outline-none focus-visible:ring-primary"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
            </button>
            <AnimatePresence>
              {profileOpen && <ProfilePanel onClose={closeProfile} />}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <MobileSearchOverlay onClose={() => setMobileSearchOpen(false)} />
        )}
      </AnimatePresence>
    </header>
  );
}
