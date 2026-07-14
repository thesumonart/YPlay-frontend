import type { Playlist } from "@/types";
import { mockUsers } from "./users";
import { mockVideos } from "./videos";

export const mockPlaylists: Playlist[] = [
  {
    id: "pl1",
    title: "Web Dev Essentials 2025",
    description: "Everything you need to build modern web apps.",
    thumbnail: "https://picsum.photos/seed/v6/640/360",
    videos: [mockVideos[5], mockVideos[7], mockVideos[11]],
    owner: mockUsers[0],
    visibility: "public",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-06-10T00:00:00Z",
  },
  {
    id: "pl2",
    title: "Gaming Highlights",
    description: "Best gaming moments and guides.",
    thumbnail: "https://picsum.photos/seed/v3/640/360",
    videos: [mockVideos[2], mockVideos[8]],
    owner: mockUsers[2],
    visibility: "public",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-05-20T00:00:00Z",
  },
  {
    id: "pl3",
    title: "Watch Later",
    description: "",
    thumbnail: "https://picsum.photos/seed/v4/640/360",
    videos: [mockVideos[3], mockVideos[9], mockVideos[1]],
    owner: mockUsers[0],
    visibility: "private",
    createdAt: "2025-03-10T00:00:00Z",
    updatedAt: "2025-06-09T00:00:00Z",
  },
];
