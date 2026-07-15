import type { Metadata } from "next";
import { StudioLayout } from "@/components/studio/StudioLayout";
import { StudioUploadView } from "@/features/studio/StudioUploadView";

export const metadata: Metadata = { title: "Upload – Studio" };

export default function StudioUploadPage() {
  return (
    <StudioLayout>
      <StudioUploadView />
    </StudioLayout>
  );
}
