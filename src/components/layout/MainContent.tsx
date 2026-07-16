"use client";

import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/layout/PageTransition";

export function MainContent({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <main
      id="main-content"
      className={cn(
        "pt-[var(--header-height)] transition-[padding-left] duration-[250ms] ease-in-out",
        "md:pl-[var(--sidebar-width)]",
        sidebarCollapsed && "md:pl-[var(--sidebar-collapsed-width)]"
      )}
    >
      <div className="mx-auto max-w-screen-2xl px-4 py-6 md:px-6 lg:px-8">
        <PageTransition>{children}</PageTransition>
      </div>
    </main>
  );
}
