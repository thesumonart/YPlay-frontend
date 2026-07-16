"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link2, Check, Code2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
  videoId: string;
}

const TABS = ["Link", "Embed"] as const;
type Tab = (typeof TABS)[number];

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

const SOCIALS = [
  {
    label: "Twitter / X",
    icon: XIcon,
    color: "hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]",
    href: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    label: "Facebook",
    icon: FacebookIcon,
    color: "hover:bg-[#1877F2]/10 hover:text-[#1877F2]",
    href: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: "Email",
    icon: Mail,
    color: "hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]",
    href: (url: string, title: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
];

export function ShareModal({ open, onClose, url, title, videoId }: ShareModalProps) {
  const [tab, setTab] = useState<Tab>("Link");
  const [copied, setCopied] = useState(false);
  const [startAt, setStartAt] = useState(false);
  const [timestamp, setTimestamp] = useState("0:00");
  const overlayRef = useRef<HTMLDivElement>(null);

  const shareUrl = startAt ? `${url}?t=${timestamp}` : url;
  const embedCode = `<iframe width="560" height="315" src="https://yplay.app/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback: select input
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Trap focus / prevent body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const inputClass =
    "flex-1 min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-mono";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Share video"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl p-6 flex flex-col gap-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[var(--text)]">Share</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Social buttons */}
            <div className="flex gap-2">
              {SOCIALS.map(({ label, icon: Icon, color, href }) => (
                <a
                  key={label}
                  href={href(shareUrl, title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share on ${label}`}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-[var(--border)] py-3 text-[var(--text-secondary)] transition-colors",
                    color
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{label.split(" /")[0]}</span>
                </a>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 rounded-lg bg-[var(--surface-secondary)] p-1">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors",
                    tab === t
                      ? "bg-[var(--surface)] text-[var(--text)] shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text)]"
                  )}
                >
                  {t === "Link" ? <Link2 className="h-3.5 w-3.5" /> : <Code2 className="h-3.5 w-3.5" />}
                  {t}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {tab === "Link" ? (
                <motion.div
                  key="link"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={shareUrl}
                      className={inputClass}
                      onFocus={(e) => e.target.select()}
                    />
                    <button
                      onClick={() => copy(shareUrl)}
                      className={cn(
                        "flex h-10 items-center gap-1.5 rounded-lg px-4 text-sm font-medium transition-colors shrink-0",
                        copied
                          ? "bg-[var(--success)] text-white"
                          : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                      )}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  {/* Start at timestamp */}
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <div
                      role="checkbox"
                      aria-checked={startAt}
                      tabIndex={0}
                      onClick={() => setStartAt((s) => !s)}
                      onKeyDown={(e) => e.key === " " && setStartAt((s) => !s)}
                      className={cn(
                        "h-4 w-4 rounded border-2 flex items-center justify-center transition-colors",
                        startAt
                          ? "bg-[var(--primary)] border-[var(--primary)]"
                          : "border-[var(--border)] bg-[var(--surface)]"
                      )}
                    >
                      {startAt && <Check className="h-2.5 w-2.5 text-white" />}
                    </div>
                    <span className="text-sm text-[var(--text)]">Start at</span>
                    {startAt && (
                      <input
                        value={timestamp}
                        onChange={(e) => setTimestamp(e.target.value)}
                        className="w-16 rounded-md border border-[var(--border)] bg-[var(--surface-secondary)] px-2 py-0.5 text-sm text-[var(--text)] text-center focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                      />
                    )}
                  </label>
                </motion.div>
              ) : (
                <motion.div
                  key="embed"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col gap-3"
                >
                  <textarea
                    readOnly
                    value={embedCode}
                    rows={3}
                    className={cn(inputClass, "resize-none w-full text-xs leading-relaxed")}
                    onFocus={(e) => e.target.select()}
                  />
                  <button
                    onClick={() => copy(embedCode)}
                    className={cn(
                      "flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors",
                      copied
                        ? "bg-[var(--success)] text-white"
                        : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                    )}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Code2 className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy embed code"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
