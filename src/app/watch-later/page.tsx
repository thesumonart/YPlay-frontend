import type { Metadata } from "next";
import { WatchLaterView } from "@/features/library/LibraryView";

export const metadata: Metadata = { title: "Watch Later" };

export default function WatchLaterPage() {
  return <WatchLaterView />;
}
