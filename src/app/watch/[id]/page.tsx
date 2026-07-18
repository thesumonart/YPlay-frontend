import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mockComments } from "@/data/comments";
import { mockVideos } from "@/data/videos";
import { WatchView } from "@/features/watch/WatchView";

interface WatchPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mockVideos.map((v) => ({ id: v.id }));
}

export async function generateMetadata({
  params,
}: WatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const video = mockVideos.find((v) => v.id === id);
  if (!video) return { title: "Video not found" };
  return {
    title: video.title,
    description: video.description,
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params;
  const video = mockVideos.find((v) => v.id === id);
  if (!video) notFound();

  const upNext = mockVideos
    .filter((v) => v.id !== id && !v.isShort)
    .slice(0, 10);

  return <WatchView video={video} upNext={upNext} comments={mockComments} />;
}
