"use client";

import { Bell, Menu, Upload } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { SearchBar } from "@/components/shared/SearchBar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/shared/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shared/Avatar";
import { Tooltip } from "@/components/shared/Tooltip";
import { useUIStore } from "@/store/ui";
import { currentUser } from "@/data/users";
import { mockNotifications } from "@/data/notifications";

export function Header() {
  const { toggleSidebar, toggleSidebarCollapsed } = useUIStore();
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md">
      <div className="flex h-full items-center gap-3 px-4">
        {/* Menu + Logo */}
        <div className="flex items-center gap-2">
          <Tooltip content="Menu" side="bottom">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebarCollapsed}
              aria-label="Toggle sidebar"
              className="hidden md:inline-flex"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </Tooltip>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Open menu"
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Logo />
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto hidden sm:block">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label="Search"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </Button>

          <Tooltip content="Upload" side="bottom">
            <Button variant="ghost" size="icon" aria-label="Upload video">
              <Upload className="h-5 w-5" />
            </Button>
          </Tooltip>

          <Tooltip content="Notifications" side="bottom">
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--primary)]" />
              )}
            </Button>
          </Tooltip>

          <ThemeToggle />

          <Avatar className="h-8 w-8 cursor-pointer ml-1">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
