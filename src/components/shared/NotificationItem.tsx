"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Upload,
  MessageSquare,
  ThumbsUp,
  Users,
  Reply,
  Radio,
  X,
} from "lucide-react";
import type { Notification } from "@/types";
import { timeAgo } from "@/lib/utils";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/shared/Avatar";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<
  Notification["type"],
  { icon: React.ElementType; color: string; bg: string }
> = {
  upload: {
    icon: Upload,
    color: "text-[var(--secondary)]",
    bg: "bg-[var(--secondary)]/10",
  },
  comment: {
    icon: MessageSquare,
    color: "text-[var(--accent)]",
    bg: "bg-[var(--accent)]/10",
  },
  reply: {
    icon: Reply,
    color: "text-[var(--accent)]",
    bg: "bg-[var(--accent)]/10",
  },
  like: {
    icon: ThumbsUp,
    color: "text-[var(--primary)]",
    bg: "bg-[var(--primary)]/10",
  },
  subscription: {
    icon: Users,
    color: "text-[var(--success)]",
    bg: "bg-[var(--success)]/10",
  },
  live: {
    icon: Radio,
    color: "text-[var(--danger)]",
    bg: "bg-[var(--danger)]/10",
  },
};

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({
  notification,
  onDismiss,
  onMarkRead,
}: NotificationItemProps) {
  const { icon: Icon, color, bg } = TYPE_CONFIG[notification.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.22 }}
      onClick={() => !notification.read && onMarkRead(notification.id)}
      className={cn(
        "group relative flex items-start gap-4 rounded-xl p-4 transition-colors cursor-pointer",
        notification.read
          ? "bg-transparent hover:bg-surface-secondary"
          : "bg-surface border border-border shadow-sm hover:border-primary/30",
      )}
    >
      {/* Unread dot */}
      {!notification.read && (
        <span className="absolute top-4 left-1.5 h-2 w-2 rounded-full bg-primary" />
      )}

      {/* Avatar + type badge */}
      <div className="relative shrink-0">
        <Avatar className="h-11 w-11">
          <AvatarImage
            src={notification.actor.avatar}
            alt={notification.actor.name}
          />
          <AvatarFallback>{notification.actor.name[0]}</AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full",
            bg,
          )}
        >
          <Icon className={cn("h-3 w-3", color)} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-start justify-between gap-3 min-w-0">
        <div className="flex flex-col gap-1 min-w-0">
          <p
            className={cn(
              "text-sm leading-snug",
              notification.read
                ? "text-text-secondary"
                : "text-text font-medium",
            )}
          >
            {notification.message}
          </p>
          <p className="text-xs text-text-secondary">
            {timeAgo(notification.createdAt)}
          </p>
        </div>

        {/* Video thumbnail */}
        {notification.videoId && notification.videoThumbnail && (
          <Link
            href={`/watch/${notification.videoId}`}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 relative w-20 aspect-video rounded-lg overflow-hidden bg-surface-secondary hover:opacity-80 transition-opacity"
          >
            <Image
              src={notification.videoThumbnail}
              alt="Video thumbnail"
              fill
              sizes="80px"
              className="object-cover"
            />
          </Link>
        )}
      </div>

      {/* Dismiss button */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(notification.id);
        }}
        aria-label="Dismiss notification"
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </motion.div>
  );
}
