"use client";

import {
  BarChart2,
  ChevronLeft,
  Film,
  LayoutDashboard,
  ListVideo,
  MessageSquare,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

const STUDIO_NAV = [
  { href: "/studio", label: "Dashboard", icon: LayoutDashboard },
  { href: "/studio/upload", label: "Upload", icon: Upload },
  { href: "/studio/content", label: "Content", icon: Film },
  { href: "/studio/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/studio/comments", label: "Comments", icon: MessageSquare },
  { href: "/studio/playlists", label: "Playlists", icon: ListVideo },
];

export function StudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6">
      {/* Studio header bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Logo collapsed className="h-8 w-8" />
          </div>
          <div>
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">
              Creator Studio
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to YPlay
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Studio sidebar */}
        <div className="relative md:w-48 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
            {STUDIO_NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-surface-secondary text-text"
                      : "text-text-secondary hover:bg-surface-secondary hover:text-text",
                  )}
                >
                  <Icon
                    className={cn("h-4 w-4 shrink-0", active && "text-primary")}
                  />
                  {label}
                </Link>
              );
            })}
          </nav>
          {/* Scroll fade indicator — mobile only */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-background to-transparent md:hidden" />
        </div>

        {/* Page content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
