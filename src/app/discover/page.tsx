import type { Metadata } from "next";
import { TrendingView } from "@/features/trending/TrendingView";

export const metadata: Metadata = { title: "Discover" };

export default function DiscoverPage() {
  return <TrendingView />;
}
