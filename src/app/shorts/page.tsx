import type { Metadata } from "next";
import { ShortsView } from "@/features/shorts/ShortsView";

export const metadata: Metadata = { title: "Shorts" };

export default function ShortsPage() {
  return (
    <div className="-mx-4 -my-6 md:-mx-6 lg:-mx-8">
      <ShortsView />
    </div>
  );
}
