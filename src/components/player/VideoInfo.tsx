"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/Avatar";
import { Button } from "@/components/shared/Button";
import { formatViews, timeAgo } from "@/lib/utils";
import type { Video } from "@/types";

interface VideoInfoProps {
  video: Video;
}

export function VideoInfo({ video }: VideoInfoProps) {
  const [subscribed, setSubscribed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <h1 className="text-lg md:text-xl font-bold text-text leading-snug">
        {video.title}
      </h1>

      {/* Stats row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Channel */}
        <div className="flex items-center gap-3">
          <Link href={`/channel/${video.channel.id}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={video.channel.avatar}
                alt={video.channel.name}
              />
              <AvatarFallback>{video.channel.name[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col">
            <Link
              href={`/channel/${video.channel.id}`}
              className="flex items-center gap-1 text-sm font-semibold text-text hover:text-primary transition-colors"
            >
              {video.channel.name}
              {video.channel.verified && (
                <CheckCircle2 className="h-3.5 w-3.5 text-text-secondary" />
              )}
            </Link>
            <span className="text-xs text-text-secondary">
              {formatViews(video.channel.subscribers)} subscribers
            </span>
          </div>

          {/* Subscribe */}
          <motion.div whileTap={{ scale: 0.96 }}>
            <Button
              variant={subscribed ? "secondary" : "default"}
              size="sm"
              className="gap-1.5 ml-2"
              onClick={() => setSubscribed((s) => !s)}
              aria-pressed={subscribed}
            >
              {subscribed && <Bell className="h-3.5 w-3.5" />}
              {subscribed ? "Subscribed" : "Subscribe"}
            </Button>
          </motion.div>
        </div>

        {/* View count + date */}
        <p className="text-sm text-text-secondary">
          {formatViews(video.views)} views · {timeAgo(video.publishedAt)}
        </p>
      </div>

      {/* Description */}
      <div className="rounded-xl bg-surface-secondary p-4">
        <AnimatePresence initial={false}>
          <motion.div
            key={expanded ? "expanded" : "collapsed"}
            initial={false}
            animate={{ height: "auto" }}
            className={expanded ? "" : "line-clamp-3"}
          >
            <p className="text-sm text-text leading-relaxed whitespace-pre-line">
              {video.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Tags */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 mt-3"
          >
            {video.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-border px-2.5 py-1 text-xs text-text-secondary font-medium"
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        )}

        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 text-xs font-semibold text-text hover:text-primary transition-colors"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      </div>
    </div>
  );
}
