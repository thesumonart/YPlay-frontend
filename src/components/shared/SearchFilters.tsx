"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/Button";

export interface SearchFilters {
  sort: "relevance" | "date" | "views" | "rating";
  uploadDate: "any" | "hour" | "today" | "week" | "month" | "year";
  type: "all" | "video" | "channel" | "playlist";
  duration: "any" | "short" | "medium" | "long";
}

export const defaultFilters: SearchFilters = {
  sort: "relevance",
  uploadDate: "any",
  type: "all",
  duration: "any",
};

interface FilterGroupProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}

function FilterGroup({ label, options, value, onChange }: FilterGroupProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-[var(--text-secondary)] shrink-0 w-24">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              value === opt.value
                ? "bg-[var(--text)] text-[var(--background)]"
                : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--border)]"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface SearchFiltersProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  open: boolean;
  onToggle: () => void;
}

const hasActiveFilters = (f: SearchFilters) =>
  f.sort !== "relevance" || f.uploadDate !== "any" || f.type !== "all" || f.duration !== "any";

export function SearchFiltersPanel({ filters, onChange, open, onToggle }: SearchFiltersProps) {
  const active = hasActiveFilters(filters);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button
          variant={active ? "default" : "outline"}
          size="sm"
          onClick={onToggle}
          className="gap-2"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {active && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
              !
            </span>
          )}
        </Button>
        {active && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(defaultFilters)}
            className="gap-1.5 text-[var(--text-secondary)]"
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {open && (
        <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <FilterGroup
            label="Sort by"
            options={[
              { value: "relevance", label: "Relevance" },
              { value: "date", label: "Upload date" },
              { value: "views", label: "View count" },
              { value: "rating", label: "Rating" },
            ]}
            value={filters.sort}
            onChange={(v) => onChange({ ...filters, sort: v as SearchFilters["sort"] })}
          />
          <FilterGroup
            label="Upload date"
            options={[
              { value: "any", label: "Any time" },
              { value: "hour", label: "Last hour" },
              { value: "today", label: "Today" },
              { value: "week", label: "This week" },
              { value: "month", label: "This month" },
              { value: "year", label: "This year" },
            ]}
            value={filters.uploadDate}
            onChange={(v) => onChange({ ...filters, uploadDate: v as SearchFilters["uploadDate"] })}
          />
          <FilterGroup
            label="Type"
            options={[
              { value: "all", label: "All" },
              { value: "video", label: "Video" },
              { value: "channel", label: "Channel" },
              { value: "playlist", label: "Playlist" },
            ]}
            value={filters.type}
            onChange={(v) => onChange({ ...filters, type: v as SearchFilters["type"] })}
          />
          <FilterGroup
            label="Duration"
            options={[
              { value: "any", label: "Any" },
              { value: "short", label: "Under 4 min" },
              { value: "medium", label: "4–20 min" },
              { value: "long", label: "Over 20 min" },
            ]}
            value={filters.duration}
            onChange={(v) => onChange({ ...filters, duration: v as SearchFilters["duration"] })}
          />
        </div>
      )}
    </div>
  );
}
