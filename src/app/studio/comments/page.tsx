import type { Metadata } from "next";
import { StudioLayout } from "@/components/studio/StudioLayout";
import { mockComments } from "@/data/comments";
import { CommentItem } from "@/components/comments/CommentItem";

export const metadata: Metadata = { title: "Comments – Studio" };

export default function StudioCommentsPage() {
  return (
    <StudioLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold text-[var(--text)]">Comments</h1>
        <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          {mockComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </StudioLayout>
  );
}
