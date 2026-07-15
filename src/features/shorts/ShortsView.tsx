"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { shortVideos } from "@/data/videos";
import { ShortCard } from "@/components/video/ShortCard";
import { cn } from "@/lib/utils";

export function ShortsView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(shortVideos.length - 1, index));
    setActiveIndex(clamped);
    const el = containerRef.current?.children[clamped] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    setActiveIndex(Math.max(0, Math.min(shortVideos.length - 1, index)));
  }, []);

  return (
    <div className="relative flex justify-center">
      {/* Scroll container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-[calc(100dvh-var(--header-height))] w-full max-w-sm overflow-y-scroll snap-y snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none" }}
        aria-label="Shorts feed"
      >
        {shortVideos.map((video, i) => (
          <div
            key={video.id}
            className="h-[calc(100dvh-var(--header-height))] w-full snap-start snap-always flex items-center justify-center py-3"
          >
            <ShortCard video={video} active={i === activeIndex} />
          </div>
        ))}
      </div>

      {/* Navigation arrows — desktop */}
      <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-2 z-40">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous short"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-sm transition-all",
            activeIndex === 0
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-[var(--surface-secondary)] hover:border-[var(--primary)]/40"
          )}
        >
          <ChevronUp className="h-5 w-5 text-[var(--text)]" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === shortVideos.length - 1}
          aria-label="Next short"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-sm transition-all",
            activeIndex === shortVideos.length - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-[var(--surface-secondary)] hover:border-[var(--primary)]/40"
          )}
        >
          <ChevronDown className="h-5 w-5 text-[var(--text)]" />
        </motion.button>
      </div>

      {/* Dot indicators */}
      <div className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 flex-col gap-1.5 z-40">
        {shortVideos.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to short ${i + 1}`}
            className={cn(
              "rounded-full transition-all duration-200",
              i === activeIndex
                ? "h-5 w-1.5 bg-[var(--primary)]"
                : "h-1.5 w-1.5 bg-[var(--border)] hover:bg-[var(--text-secondary)]"
            )}
          />
        ))}
      </div>
    </div>
  );
}
