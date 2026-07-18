"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Ban, BookmarkPlus, Check, Link2, MoreVertical } from "lucide-react";
import { useState } from "react";
import { AddToPlaylistModal } from "@/components/shared/AddToPlaylistModal";
import { cn } from "@/lib/utils";

interface VideoCardMenuProps {
  videoId: string;
  videoTitle: string;
}

export function VideoCardMenu({ videoId, videoTitle }: VideoCardMenuProps) {
  const [saveOpen, setSaveOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const url = `${window.location.origin}/watch/${videoId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback silent fail
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const items = [
    {
      icon: copied ? Check : Link2,
      label: copied ? "Copied!" : "Copy link",
      action: copyLink,
    },
    {
      icon: BookmarkPlus,
      label: "Save to playlist",
      action: () => setSaveOpen(true),
    },
    {
      icon: Ban,
      label: "Not interested",
      action: () => {},
      danger: false,
    },
  ];

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            aria-label="More options"
            onClick={(e) => e.preventDefault()}
            className={cn(
              "absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg",
              "bg-black/70 text-white backdrop-blur-sm",
              "opacity-0 group-hover:opacity-100 focus:opacity-100",
              "transition-opacity duration-150",
              "hover:bg-black/90",
            )}
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={4}
            className={cn(
              "z-50 min-w-[176px] rounded-xl border border-border bg-surface p-1 shadow-xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            )}
          >
            {items.map(({ icon: Icon, label, action }) => (
              <DropdownMenu.Item
                key={label}
                onSelect={action}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary outline-none transition-colors select-none focus:bg-surface-secondary focus:text-text"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <AddToPlaylistModal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        videoId={videoId}
      />
    </>
  );
}
