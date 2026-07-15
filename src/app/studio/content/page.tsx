import type { Metadata } from "next";
import { StudioLayout } from "@/components/studio/StudioLayout";
import { StudioVideoRow } from "@/components/studio/StudioVideoRow";
import { mockVideos } from "@/data/videos";

export const metadata: Metadata = { title: "Content – Studio" };

const myVideos = mockVideos.filter((v) => v.channel.id === "u1");

export default function StudioContentPage() {
  return (
    <StudioLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold text-[var(--text)]">Content</h1>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-secondary)]">
                  <th className="py-3 pl-4 pr-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Video</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden md:table-cell">Views</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden md:table-cell">Likes</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden lg:table-cell">Comments</th>
                  <th className="py-3 pl-3 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {myVideos.map((video, i) => (
                  <StudioVideoRow key={video.id} video={video} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StudioLayout>
  );
}
