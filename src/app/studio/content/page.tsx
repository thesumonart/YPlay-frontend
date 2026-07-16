import type { Metadata } from "next";
import { StudioLayout } from "@/components/studio/StudioLayout";
import { StudioContentView } from "@/features/studio/StudioContentView";

export const metadata: Metadata = { title: "Content – Studio" };

export default function StudioContentPage() {
  return (
    <StudioLayout>
      <StudioContentView />
    </StudioLayout>
  );
}
