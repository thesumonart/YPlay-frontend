"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, ThumbsUp, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { Video } from "@/types";
import { formatViews, formatDuration, timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface StudioVideoRowProps {
  video: Video;
  index: number;
}

const STATUS_CONFIG = {
  published: { label: "Published", className: "text-[var(--success)] bg-[var(--success)]/10" },
  draft:     { label: "Draft",     className: "text-[var(--warning)] bg-[var(--warning)]/10" },
  private:   { label: "Private",   className: "text-[var(--text-secondary)] bg-[var(--surface-secondary)]" },
} as const;

type Status = keyof typeof STATUS_CONFIG;

function getStatus(index: number): Status {
  if (index % 5 === 3) return "draft";
  if (index % 7 === 0) return "private";
  return "published";
}

export function StudioVideoRow({ video, index }: StudioVideoRowProps) {
  const router = useRouter();
  const status = getStatus(index);
  const { label, className } = STATUS_CONFIG[status];

  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className="group border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-secondary)] transition-colors"
    >
      {/* Thumbnail + title */}
      <td className="py-3 pl-4 pr-3">
        <div className="flex items-center gap-3">
          <Link href={`/watch/${video.id}`} className="relative shrink-0 w-24 aspect-video rounded-lg overflow-hidden bg-[var(--surface-secondary)]">
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
              className="text-sm font-medium text-[var(--text)] line-clamp-2 leading-snug hover:text-[var(--primary)] transition-colors"
            >
              {video.title}
            </Link>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-1 hidden md:block">
              {video.description}
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="py-3 px-3 hidden sm:table-cell">
        <span className={cn("rounded-md px-2 py-1 text-xs font-medium", className)}>
          {label}
        </span>
      </td>

      {/* Date */}
      <td className="py-3 px-3 hidden lg:table-cell">
        <span className="text-xs text-[var(--text-secondary)]">{timeAgo(video.publishedAt)}</span>
      </td>

      {/* Views */}
      <td className="py-3 px-3 hidden md:table-cell">
        <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <Eye className="h-3.5 w-3.5" />
          {formatViews(video.views)}
        </span>
      </td>

      {/* Likes */}
      <td className="py-3 px-3 hidden md:table-cell">
        <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <ThumbsUp className="h-3.5 w-3.5" />
          {formatViews(video.likes)}
        </span>
      </td>

      {/* Comments */}
      <td className="py-3 px-3 hidden lg:table-cell">
        <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
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
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text)] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={4}
              className="z-50 min-w-36 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-lg animate-in fade-in-0 zoom-in-95"
            >
              {[
                { icon: Pencil, label: "Edit",   action: () => router.push(`/studio/content/${video.id}`) },
                { icon: Eye,    label: "View",   action: () => router.push(`/watch/${video.id}`) },
                { icon: Trash2, label: "Delete", action: () => {}, danger: true },
              ].map(({ icon: Icon, label: itemLabel, action, danger }) => (
                <DropdownMenu.Item
                  key={itemLabel}
                  onSelect={action}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors",
                    danger
                      ? "text-[var(--danger)] focus:bg-[var(--danger)]/10"
                      : "text-[var(--text)] focus:bg-[var(--surface-secondary)]"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {itemLabel}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </td>
    </motion.tr>
  );
}
