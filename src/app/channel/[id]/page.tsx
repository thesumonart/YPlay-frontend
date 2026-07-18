import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mockUsers } from "@/data/users";
import { ChannelView } from "@/features/channel/ChannelView";

interface ChannelPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mockUsers.map((u) => ({ id: u.id }));
}

export async function generateMetadata({
  params,
}: ChannelPageProps): Promise<Metadata> {
  const { id } = await params;
  const channel = mockUsers.find((u) => u.id === id);
  if (!channel) return { title: "Channel not found" };
  return {
    title: channel.name,
    description: channel.bio ?? `${channel.name}'s channel on YPlay`,
  };
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { id } = await params;
  const channel = mockUsers.find((u) => u.id === id);
  if (!channel) notFound();

  return <ChannelView channel={channel} />;
}
