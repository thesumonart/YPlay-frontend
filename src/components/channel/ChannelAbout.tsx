import { Calendar, Eye, PlaySquare, Users } from "lucide-react";
import type { User } from "@/types";
import { formatViews } from "@/lib/utils";

interface ChannelAboutProps {
  channel: User;
}

function StatItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[var(--border)] last:border-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-secondary)]">
        <Icon className="h-4 w-4 text-[var(--text-secondary)]" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-[var(--text-secondary)]">{label}</span>
        <span className="text-sm font-semibold text-[var(--text)]">{value}</span>
      </div>
    </div>
  );
}

export function ChannelAbout({ channel }: ChannelAboutProps) {
  const joinYear = new Date(channel.joinedAt).getFullYear();
  const joinMonth = new Date(channel.joinedAt).toLocaleString("default", { month: "long" });

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-4xl">
      {/* Description */}
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-[var(--text)]">About</h2>
        {channel.bio ? (
          <p className="text-sm text-[var(--text)] leading-relaxed">{channel.bio}</p>
        ) : (
          <p className="text-sm text-[var(--text-secondary)]">No description provided.</p>
        )}
      </div>

      {/* Stats */}
      <div className="w-full lg:w-72 shrink-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="text-sm font-semibold text-[var(--text)] mb-2">Channel stats</h2>
        <StatItem icon={Calendar} label="Joined" value={`${joinMonth} ${joinYear}`} />
        <StatItem icon={Eye} label="Total views" value={formatViews(channel.totalViews)} />
        <StatItem icon={Users} label="Subscribers" value={formatViews(channel.subscribers)} />
        <StatItem icon={PlaySquare} label="Videos" value={channel.videoCount.toLocaleString()} />
      </div>
    </div>
  );
}
