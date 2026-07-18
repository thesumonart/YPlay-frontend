"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function WatchError({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-6"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-danger/10 border border-danger/20">
        <AlertTriangle className="h-9 w-9 text-danger" />
      </div>

      <div className="flex flex-col gap-2 max-w-sm">
        <h1 className="text-xl font-bold text-text">
          Something went wrong
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          This video couldn&apos;t be loaded. It may have been removed or there
          was a temporary error.
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-text-secondary bg-surface-secondary rounded-lg px-3 py-1.5">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text hover:bg-surface-secondary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text hover:bg-surface-secondary transition-colors"
        >
          <Home className="h-4 w-4" />
          Home
        </Link>
      </div>
    </motion.div>
  );
}
