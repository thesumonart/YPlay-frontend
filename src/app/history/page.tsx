import type { Metadata } from "next";
import { HistoryView } from "@/features/library/LibraryView";

export const metadata: Metadata = { title: "History" };

export default function HistoryPage() {
  return <HistoryView />;
}
