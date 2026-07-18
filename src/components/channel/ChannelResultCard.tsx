import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/Avatar";
import { Button } from "@/components/shared/Button";
import { formatViews } from "@/lib/utils";
import type { User } from "@/types";

interface ChannelResultCardProps {
  channel: User;
}

export function ChannelResultCard({ channel }: ChannelResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-5 rounded-xl border border-border bg-surface p-5"
    >
      <Link href={`/channel/${channel.id}`}>
        <Avatar className="h-20 w-20">
          <AvatarImage src={channel.avatar} alt={channel.name} />
          <AvatarFallback className="text-2xl">
            {channel.name[0]}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <Link
          href={`/channel/${channel.id}`}
          className="flex items-center gap-1.5 font-semibold text-text hover:text-primary transition-colors"
        >
          {channel.name}
          {channel.verified && (
            <CheckCircle2 className="h-4 w-4 text-text-secondary" />
          )}
        </Link>
        <p className="text-sm text-text-secondary">
          {channel.handle} · {formatViews(channel.subscribers)} subscribers ·{" "}
          {channel.videoCount} videos
        </p>
        {channel.bio && (
          <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
            {channel.bio}
          </p>
        )}
      </div>

      <Button variant="secondary" size="sm" className="shrink-0">
        Subscribe
      </Button>
    </motion.div>
  );
}
