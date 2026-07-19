import type { Metadata } from "next";
import { SavedView } from "@/features/library/LibraryView";

export const metadata: Metadata = { title: "Saved" };

export default function SavedPage() {
  return <SavedView />;
}
