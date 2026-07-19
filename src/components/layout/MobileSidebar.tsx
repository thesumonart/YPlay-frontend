"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BookMarked,
  Clock,
  Compass,
  History,
  Home,
  LayoutDashboard,
  ListVideo,
  PlaySquare,
  Settings,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shorts", href: "/shorts", icon: Zap },
  { label: "Subscriptions", href: "/subscriptions", icon: PlaySquare },
  { label: "Trending", href: "/trending", icon: TrendingUp },
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "History", href: "/history", icon: History },
  { label: "Watch Later", href: "/watch-later", icon: Clock },
  { label: "Playlists", href: "/library", icon: ListVideo },
  { label: "Saved", href: "/saved", icon: BookMarked },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Studio", href: "/studio", icon: LayoutDashboard },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function MobileSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-surface border-r border-border flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between px-4 h-[var(--header-height)] border-b border-border">
              <Link href="/" onClick={() => setSidebarOpen(false)} aria-label="YPlay home">
                <Logo />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-0.5 p-3 overflow-y-auto flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    "hover:bg-surface-secondary hover:text-text",
                    pathname === item.href
                      ? "bg-surface-secondary text-text"
                      : "text-text-secondary",
                  )}
                >
                  <item.icon
                    size={18}
                    className={cn(pathname === item.href && "text-primary")}
                  />
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
