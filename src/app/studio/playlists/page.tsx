import type { Metadata } from "next";
import { StudioLayout } from "@/components/studio/StudioLayout";
import { StudioPlaylistsView } from "@/features/studio/StudioPlaylistsView";

export const metadata: Metadata = { title: "Playlists – Studio" };

export default function StudioPlaylistsPage() {
  return (
    <StudioLayout>
      <StudioPlaylistsView />
    </StudioLayout>
  );
}
