import type { Metadata } from "next";
import { ShortsView } from "@/features/shorts/ShortsView";

export const metadata: Metadata = { title: "Shorts" };

export default function ShortsPage() {
  return (
    <div className="pt-[var(--header-height)] md:pl-[var(--sidebar-width)]">
      <ShortsView />
    </div>
  );
}
