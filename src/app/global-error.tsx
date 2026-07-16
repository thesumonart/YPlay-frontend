"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-[var(--background)] text-[var(--text)] antialiased flex flex-col items-center justify-center px-6 text-center">
        <Link href="/" className="mb-10">
          <Logo />
        </Link>

        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--danger)]/10 border border-[var(--danger)]/20 mb-6">
          <AlertTriangle className="h-9 w-9 text-[var(--danger)]" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text)] mb-3">
          Something went wrong
        </h1>
        <p className="text-[var(--text-secondary)] text-sm md:text-base max-w-sm mb-10 leading-relaxed">
          An unexpected error occurred. You can try again or head back to the home page.
        </p>

        {error.digest && (
          <p className="mb-6 font-mono text-xs text-[var(--text-secondary)] bg-[var(--surface-secondary)] rounded-lg px-3 py-1.5">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-hover)] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-secondary)] transition-colors"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
        </div>
      </body>
    </html>
  );
}
