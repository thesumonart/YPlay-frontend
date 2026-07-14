"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryChipsProps {
  categories: Category[];
  selected: string;
  onSelect: (slug: string) => void;
}

export function CategoryChips({ categories, selected, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Filter by category">
      {categories.map((cat) => {
        const isActive = selected === cat.slug;
        return (
          <button
            key={cat.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(cat.slug)}
            className={cn(
              "relative shrink-0 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
              isActive
                ? "text-white"
                : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--border)]"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 rounded-lg bg-[var(--text)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
