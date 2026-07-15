import type { Metadata } from "next";
import { StudioLayout } from "@/components/studio/StudioLayout";
import { StudioAnalyticsView } from "@/features/studio/StudioAnalyticsView";

export const metadata: Metadata = { title: "Analytics – Studio" };

export default function StudioAnalyticsPage() {
  return (
    <StudioLayout>
      <StudioAnalyticsView />
    </StudioLayout>
  );
}
