import type { Metadata } from "next";
import { LibraryView } from "@/features/library/LibraryView";

export const metadata: Metadata = { title: "Watch Later" };

export default function WatchLaterPage() {
  return <LibraryView defaultTab="watch-later" />;
}
