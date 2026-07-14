"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({ className, placeholder = "Search videos, channels..." }: SearchBarProps) {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative flex items-center", className)}>
      <Search
        className="absolute left-3 h-4 w-4 text-[var(--text-secondary)] pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className={cn(
          "h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]",
          "pl-10 pr-10 text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)]",
          "transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent focus:bg-[var(--surface)]"
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Clear search"
          className="absolute right-3 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
