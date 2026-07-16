import Link from "next/link";
import { motion } from "framer-motion";
import { VideoOff, Home, TrendingUp, Search } from "lucide-react";

export default function WatchNotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-6"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)]">
        <VideoOff className="h-9 w-9 text-[var(--text-secondary)]" />
      </div>

      <div className="flex flex-col gap-2 max-w-sm">
        <h1 className="text-xl font-bold text-[var(--text)]">
          Video not found
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          This video may have been removed by the creator, or the link might be incorrect.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-hover)] transition-colors"
        >
          <Home className="h-4 w-4" />
          Go home
        </Link>
        <Link
          href="/trending"
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-secondary)] transition-colors"
        >
          <TrendingUp className="h-4 w-4" />
          Trending
        </Link>
        <Link
          href="/search"
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-secondary)] transition-colors"
        >
          <Search className="h-4 w-4" />
          Search
        </Link>
      </div>
    </motion.div>
  );
}
