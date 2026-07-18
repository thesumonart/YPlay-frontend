import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mockPlaylists } from "@/data/playlists";
import { PlaylistView } from "@/features/playlist/PlaylistView";

interface PlaylistPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mockPlaylists.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: PlaylistPageProps): Promise<Metadata> {
  const { id } = await params;
  const playlist = mockPlaylists.find((p) => p.id === id);
  if (!playlist) return { title: "Playlist not found" };
  return {
    title: playlist.title,
    description:
      playlist.description ||
      `${playlist.videos.length} videos · ${playlist.owner.name}`,
  };
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const { id } = await params;
  const playlist = mockPlaylists.find((p) => p.id === id);
  if (!playlist) notFound();

  return <PlaylistView playlist={playlist} />;
}
