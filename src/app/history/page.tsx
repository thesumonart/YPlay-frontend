import type { Metadata } from "next";
import { LibraryView } from "@/features/library/LibraryView";

export const metadata: Metadata = { title: "History" };

export default function HistoryPage() {
  return <LibraryView defaultTab="history" />;
}
