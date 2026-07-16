"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Keyboard } from "lucide-react";
import { shortVideos } from "@/data/videos";
import { ShortCard } from "@/components/video/ShortCard";
import { cn } from "@/lib/utils";

export function ShortsView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrolling = useRef(false);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(shortVideos.length - 1, index));
    setActiveIndex(clamped);
    const el = containerRef.current?.children[clamped] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowDown" || e.key === "j" || e.key === "J") {
        e.preventDefault();
        goTo(activeIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "k" || e.key === "K") {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, goTo]);

  // Hide hint after 4s
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  // Sync activeIndex from scroll position
  const handleScroll = useCallback(() => {
    if (!containerRef.current || scrolling.current) return;
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
        className="h-[calc(100dvh-var(--header-height))] w-full max-w-sm overflow-y-scroll snap-y snap-mandatory"
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

      {/* Progress counter — top center */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white/80 tabular-nums"
        >
          {activeIndex + 1} / {shortVideos.length}
        </motion.div>
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
              : "hover:bg-[var(--surface-secondary)] hover:border-[var(--primary)]/40",
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
              : "hover:bg-[var(--surface-secondary)] hover:border-[var(--primary)]/40",
          )}
        >
          <ChevronDown className="h-5 w-5 text-[var(--text)]" />
        </motion.button>
      </div>

      {/* Dot indicators — desktop */}
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
                : "h-1.5 w-1.5 bg-[var(--border)] hover:bg-[var(--text-secondary)]",
            )}
          />
        ))}
      </div>

      {/* Keyboard hint toast */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-sm px-4 py-2 text-xs text-white/80 shadow-lg">
              <Keyboard className="h-3.5 w-3.5 shrink-0" />
              <span>Use</span>
              <kbd className="inline-flex h-5 items-center rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px]">↑</kbd>
              <kbd className="inline-flex h-5 items-center rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px]">↓</kbd>
              <span>or</span>
              <kbd className="inline-flex h-5 items-center rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px]">J</kbd>
              <kbd className="inline-flex h-5 items-center rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px]">K</kbd>
              <span>to navigate</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
