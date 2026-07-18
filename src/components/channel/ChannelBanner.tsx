"use client";

import { motion } from "framer-motion";
import { Bell, CheckCircle2, Share2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/Avatar";
import { Button } from "@/components/shared/Button";
import { formatViews } from "@/lib/utils";
import type { User } from "@/types";

interface ChannelBannerProps {
  channel: User;
}

export function ChannelBanner({ channel }: ChannelBannerProps) {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="flex flex-col gap-0">
      {/* Banner */}
      <div className="relative w-full h-32 sm:h-44 md:h-52 overflow-hidden rounded-2xl bg-surface-secondary">
        {channel.banner && (
          <Image
            src={channel.banner}
            alt={`${channel.name} banner`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Channel info row */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 px-2 -mt-10 sm:-mt-12 relative z-10">
        {/* Avatar */}
        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-background shrink-0">
          <AvatarImage src={channel.avatar} alt={channel.name} />
          <AvatarFallback className="text-3xl">
            {channel.name[0]}
          </AvatarFallback>
        </Avatar>

        {/* Name + stats */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between flex-1 gap-3 pb-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-text">{channel.name}</h1>
              {channel.verified && (
                <CheckCircle2 className="h-5 w-5 text-secondary" />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
              <span>{channel.handle}</span>
              <span>·</span>
              <span>{formatViews(channel.subscribers)} subscribers</span>
              <span>·</span>
              <span>{channel.videoCount} videos</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.div whileTap={{ scale: 0.96 }}>
              <Button
                variant={subscribed ? "secondary" : "default"}
                size="md"
                className="gap-2"
                onClick={() => setSubscribed((s) => !s)}
                aria-pressed={subscribed}
              >
                {subscribed && <Bell className="h-4 w-4" />}
                {subscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </motion.div>
            <Button variant="outline" size="icon" aria-label="Share channel">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
