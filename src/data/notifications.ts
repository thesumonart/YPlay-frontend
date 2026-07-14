import type { Notification } from "@/types";
import { mockUsers } from "./users";

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "upload",
    actor: mockUsers[0],
    message: "Alex Rivera uploaded a new video: Building a Design System from Scratch in 2025",
    videoId: "v1",
    videoThumbnail: "https://picsum.photos/seed/v1/640/360",
    read: false,
    createdAt: "2025-06-10T10:05:00Z",
  },
  {
    id: "n2",
    type: "comment",
    actor: mockUsers[2],
    message: "Jordan Blake commented on your video",
    videoId: "v6",
    videoThumbnail: "https://picsum.photos/seed/v6/640/360",
    read: false,
    createdAt: "2025-06-10T08:30:00Z",
  },
  {
    id: "n3",
    type: "like",
    actor: mockUsers[1],
    message: "Mia Chen liked your video",
    videoId: "v6",
    videoThumbnail: "https://picsum.photos/seed/v6/640/360",
    read: true,
    createdAt: "2025-06-09T22:00:00Z",
  },
  {
    id: "n4",
    type: "subscription",
    actor: mockUsers[3],
    message: "Sofia Patel subscribed to your channel",
    read: true,
    createdAt: "2025-06-09T15:00:00Z",
  },
  {
    id: "n5",
    type: "upload",
    actor: mockUsers[4],
    message: "Luca Moretti uploaded: Mixing Masterclass – Vocals in the Mix",
    videoId: "v11",
    videoThumbnail: "https://picsum.photos/seed/v11/640/360",
    read: true,
    createdAt: "2025-06-08T14:00:00Z",
  },
];
