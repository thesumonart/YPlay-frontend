"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BookMarked,
  ChevronRight,
  Clock,
  Compass,
  History,
  Home,
  LayoutDashboard,
  ListVideo,
  PlaySquare,
  Search,
  Settings,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip } from "@/components/shared/Tooltip";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui";

const navSections = [
  {
    items: [
      { label: "Home", href: "/", icon: Home },
      { label: "Shorts", href: "/shorts", icon: Zap },
      { label: "Subscriptions", href: "/subscriptions", icon: PlaySquare },
    ],
  },
  {
    label: "Explore",
    items: [
      { label: "Trending", href: "/trending", icon: TrendingUp },
      { label: "Search", href: "/search", icon: Search },
      { label: "Discover", href: "/discover", icon: Compass },
    ],
  },
  {
    label: "Library",
    items: [
      { label: "History", href: "/history", icon: History },
      { label: "Watch Later", href: "/watch-later", icon: Clock },
      { label: "Playlists", href: "/library", icon: ListVideo },
      { label: "Saved", href: "/saved", icon: BookMarked },
    ],
  },
  {
    label: "You",
    items: [
      { label: "Notifications", href: "/notifications", icon: Bell },
      { label: "Studio", href: "/studio", icon: LayoutDashboard },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  active: boolean;
}

function NavItem({ href, icon: Icon, label, collapsed, active }: NavItemProps) {
  const item = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
        "hover:bg-surface-secondary hover:text-text",
        active ? "bg-surface-secondary text-text" : "text-text-secondary",
        collapsed && "justify-center px-2",
      )}
    >
      <Icon
        className={cn(
          "shrink-0",
          active ? "text-primary" : "h-[18px] w-[18px]",
        )}
        size={18}
      />
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip content={label} side="right">
        {item}
      </Tooltip>
    );
  }
  return item;
}

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed } = useUIStore();

  return (
    <motion.aside
      animate={{
        width: sidebarCollapsed
          ? "var(--sidebar-collapsed-width)"
          : "var(--sidebar-width)",
      }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="hidden md:flex flex-col fixed left-0 top-[var(--header-height)] bottom-0 z-40 border-r border-border bg-surface overflow-hidden"
    >
      <nav className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto overflow-x-hidden">
        {navSections.map((section, si) => (
          <div
            key={si}
            className={cn("flex flex-col gap-0.5", si > 0 && "mt-2")}
          >
            <AnimatePresence initial={false}>
              {!sidebarCollapsed && section.label && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>
            {section.items.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                collapsed={sidebarCollapsed}
                active={pathname === item.href}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse toggle at bottom */}
      <div className="p-2 border-t border-border">
        <Tooltip
          content={sidebarCollapsed ? "Expand" : "Collapse"}
          side="right"
        >
          <button
            onClick={useUIStore.getState().toggleSidebarCollapsed}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary",
              "hover:bg-surface-secondary hover:text-text transition-colors",
              sidebarCollapsed && "justify-center px-2",
            )}
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            <motion.div
              animate={{ rotate: sidebarCollapsed ? 0 : 180 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronRight size={16} />
            </motion.div>
            <AnimatePresence initial={false}>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap text-xs"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </Tooltip>
      </div>
    </motion.aside>
  );
}
