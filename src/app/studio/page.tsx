import type { Metadata } from "next";
import { StudioLayout } from "@/components/studio/StudioLayout";
import { StudioDashboardView } from "@/features/studio/StudioDashboardView";

export const metadata: Metadata = { title: "Studio Dashboard" };

export default function StudioPage() {
  return (
    <StudioLayout>
      <StudioDashboardView />
    </StudioLayout>
  );
}
