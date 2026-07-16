import type { Metadata } from "next";
import { StudioLayout } from "@/components/studio/StudioLayout";
import { StudioCommentsView } from "@/features/studio/StudioCommentsView";

export const metadata: Metadata = { title: "Comments – Studio" };

export default function StudioCommentsPage() {
  return (
    <StudioLayout>
      <StudioCommentsView />
    </StudioLayout>
  );
}
