import { Home, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background px-6 text-center">
      {/* Glitchy 404 */}
      <div className="relative select-none mb-6">
        <span className="text-[120px] md:text-[160px] font-black leading-none text-surface-secondary tracking-tighter">
          404
        </span>
        {/* Accent overlay */}
        <span
          className="absolute inset-0 flex items-center justify-center text-[120px] md:text-[160px] font-black leading-none tracking-tighter text-primary opacity-20 blur-sm"
          aria-hidden="true"
        >
          404
        </span>
        {/* Play icon watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <svg
              width="24"
              height="24"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M5 3.5L13 8L5 12.5V3.5Z" fill="var(--primary)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Copy */}
      <h1 className="text-2xl md:text-3xl font-bold text-text mb-3">
        This page doesn&apos;t exist
      </h1>
      <p className="text-text-secondary text-sm md:text-base max-w-sm mb-10 leading-relaxed">
        The video, channel, or page you&apos;re looking for may have been
        removed or the link might be wrong.
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
        >
          <Home className="h-4 w-4" />
          Go home
        </Link>
        <Link
          href="/trending"
          className="flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text hover:bg-surface-secondary transition-colors"
        >
          <TrendingUp className="h-4 w-4" />
          Trending
        </Link>

      </div>
    </div>
  );
}
