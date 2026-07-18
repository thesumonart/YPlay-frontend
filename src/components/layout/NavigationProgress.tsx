"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Pathname changed — run the progress animation
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    // Reset and start
    setProgress(0);
    setVisible(true);

    // Quickly advance to ~85% then hold
    let current = 0;
    timerRef.current = setInterval(() => {
      current += Math.random() * 18 + 8;
      if (current >= 85) {
        current = 85;
        if (timerRef.current) clearInterval(timerRef.current);
      }
      setProgress(current);
    }, 80);

    // Complete after a short delay
    const completeTimer = setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      setProgress(100);
      setTimeout(() => setVisible(false), 300);
    }, 400);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearTimeout(completeTimer);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="nav-progress"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none"
        >
          <motion.div
            className="h-full bg-primary origin-left"
            style={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          />
          {/* Glow tip */}
          <div
            className="absolute top-0 h-[2px] w-16 rounded-full"
            style={{
              right: `${100 - progress}%`,
              background:
                "linear-gradient(to right, transparent, var(--primary))",
              opacity: progress < 100 ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
