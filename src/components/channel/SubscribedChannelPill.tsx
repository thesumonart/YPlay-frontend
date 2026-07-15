import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import type { User } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shared/Avatar";
import { cn } from "@/lib/utils";

interface SubscribedChannelPillProps {
  channel: User;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function SubscribedChannelPill({ channel, selected, onSelect }: SubscribedChannelPillProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(channel.id)}
      aria-pressed={selected}
      className={cn(
        "relative flex shrink-0 flex-col items-center gap-1.5 rounded-xl p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
        selected
          ? "bg-[var(--surface-secondary)]"
          : "hover:bg-[var(--surface-secondary)]"
      )}
    >
      <div className="relative">
        <Avatar className={cn(
          "h-14 w-14 ring-2 transition-all",
          selected ? "ring-[var(--primary)]" : "ring-transparent"
        )}>
          <AvatarImage src={channel.avatar} alt={channel.name} />
          <AvatarFallback>{channel.name[0]}</AvatarFallback>
        </Avatar>
        {channel.verified && (
          <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 h-4 w-4 text-[var(--secondary)] bg-[var(--background)] rounded-full" />
        )}
      </div>
      <span className={cn(
        "text-xs font-medium max-w-16 truncate transition-colors",
        selected ? "text-[var(--text)]" : "text-[var(--text-secondary)]"
      )}>
        {channel.name.split(" ")[0]}
      </span>
    </motion.button>
  );
}
