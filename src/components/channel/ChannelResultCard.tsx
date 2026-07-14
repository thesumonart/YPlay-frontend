import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import type { User } from "@/types";
import { formatViews } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shared/Avatar";
import { Button } from "@/components/shared/Button";

interface ChannelResultCardProps {
  channel: User;
}

export function ChannelResultCard({ channel }: ChannelResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <Link href={`/channel/${channel.id}`}>
        <Avatar className="h-20 w-20">
          <AvatarImage src={channel.avatar} alt={channel.name} />
          <AvatarFallback className="text-2xl">{channel.name[0]}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <Link
          href={`/channel/${channel.id}`}
          className="flex items-center gap-1.5 font-semibold text-[var(--text)] hover:text-[var(--primary)] transition-colors"
        >
          {channel.name}
          {channel.verified && <CheckCircle2 className="h-4 w-4 text-[var(--text-secondary)]" />}
        </Link>
        <p className="text-sm text-[var(--text-secondary)]">
          {channel.handle} · {formatViews(channel.subscribers)} subscribers · {channel.videoCount} videos
        </p>
        {channel.bio && (
          <p className="text-xs text-[var(--text-secondary)] line-clamp-1 mt-0.5">{channel.bio}</p>
        )}
      </div>

      <Button variant="secondary" size="sm" className="shrink-0">
        Subscribe
      </Button>
    </motion.div>
  );
}
