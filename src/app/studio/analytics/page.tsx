import type { Metadata } from "next";
import { StudioLayout } from "@/components/studio/StudioLayout";
import { BarChart2 } from "lucide-react";

export const metadata: Metadata = { title: "Analytics – Studio" };

export default function StudioAnalyticsPage() {
  return (
    <StudioLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold text-[var(--text)]">Analytics</h1>
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-secondary)]">
            <BarChart2 className="h-7 w-7 text-[var(--text-secondary)]" />
          </div>
          <p className="text-base font-semibold text-[var(--text)]">Analytics coming soon</p>
          <p className="text-sm text-[var(--text-secondary)]">Detailed charts and insights will appear here</p>
        </div>
      </div>
    </StudioLayout>
  );
}
