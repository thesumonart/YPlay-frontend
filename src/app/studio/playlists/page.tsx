import type { Metadata } from "next";
import { StudioLayout } from "@/components/studio/StudioLayout";
import { mockPlaylists } from "@/data/playlists";
import { PlaylistCard } from "@/components/video/PlaylistCard";

export const metadata: Metadata = { title: "Playlists – Studio" };

export default function StudioPlaylistsPage() {
  return (
    <StudioLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold text-[var(--text)]">Playlists</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
          {mockPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </div>
    </StudioLayout>
  );
}
