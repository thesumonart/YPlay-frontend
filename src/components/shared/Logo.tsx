import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path d="M5 3.5L13 8L5 12.5V3.5Z" fill="white" />
        </svg>
      </div>
      {!collapsed && (
        <span className="text-lg font-semibold tracking-tight text-[var(--text)]">
          Y<span className="text-[var(--primary)]">Play</span>
        </span>
      )}
    </div>
  );
}
