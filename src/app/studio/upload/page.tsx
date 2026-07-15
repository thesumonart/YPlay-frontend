import type { Metadata } from "next";
import { StudioLayout } from "@/components/studio/StudioLayout";
import { Upload } from "lucide-react";

export const metadata: Metadata = { title: "Upload – Studio" };

export default function StudioUploadPage() {
  return (
    <StudioLayout>
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center rounded-xl border-2 border-dashed border-[var(--border)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-secondary)]">
          <Upload className="h-7 w-7 text-[var(--text-secondary)]" />
        </div>
        <p className="text-base font-semibold text-[var(--text)]">Upload a video</p>
        <p className="text-sm text-[var(--text-secondary)]">Drag and drop or click to select a file</p>
        <button className="mt-2 h-10 px-6 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors">
          Select file
        </button>
      </div>
    </StudioLayout>
  );
}
