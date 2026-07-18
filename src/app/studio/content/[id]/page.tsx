import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudioLayout } from "@/components/studio/StudioLayout";
import { mockVideos } from "@/data/videos";
import { StudioVideoEditView } from "@/features/studio/StudioVideoEditView";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mockVideos
    .filter((v) => v.channel.id === "u1")
    .map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const video = mockVideos.find((v) => v.id === id);
  return {
    title: video ? `Edit: ${video.title} – Studio` : "Edit Video – Studio",
  };
}

export default async function StudioVideoEditPage({ params }: Props) {
  const { id } = await params;
  const video = mockVideos.find((v) => v.id === id);
  if (!video) notFound();

  return (
    <StudioLayout>
      <StudioVideoEditView video={video} />
    </StudioLayout>
  );
}
