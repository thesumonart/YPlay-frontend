"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
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
      <body className="min-h-screen bg-background text-text antialiased flex flex-col items-center justify-center px-6 text-center">
        <Link href="/" className="mb-10">
          <Logo />
        </Link>

        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-danger/10 border border-danger/20 mb-6">
          <AlertTriangle className="h-9 w-9 text-danger" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-text mb-3">
          Something went wrong
        </h1>
        <p className="text-text-secondary text-sm md:text-base max-w-sm mb-10 leading-relaxed">
          An unexpected error occurred. You can try again or head back to the
          home page.
        </p>

        {error.digest && (
          <p className="mb-6 font-mono text-xs text-text-secondary bg-surface-secondary rounded-lg px-3 py-1.5">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text hover:bg-surface-secondary transition-colors"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
        </div>
      </body>
    </html>
  );
}
