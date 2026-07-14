import type { Comment } from "@/types";
import { mockUsers } from "./users";

export const mockComments: Comment[] = [
  {
    id: "c1",
    videoId: "v1",
    author: mockUsers[2],
    content: "This is hands down the best design system tutorial I've seen. The token architecture section was incredibly insightful.",
    likes: 1_240,
    publishedAt: "2025-05-10T12:00:00Z",
    isPinned: true,
    replies: [
      {
        id: "c1r1",
        videoId: "v1",
        author: mockUsers[0],
        content: "Thanks so much! Glad the token section landed well — it's the part I spent the most time on.",
        likes: 342,
        publishedAt: "2025-05-10T13:30:00Z",
      },
      {
        id: "c1r2",
        videoId: "v1",
        author: mockUsers[3],
        content: "Agreed! I've been looking for something like this for months.",
        likes: 89,
        publishedAt: "2025-05-10T14:00:00Z",
      },
    ],
  },
  {
    id: "c2",
    videoId: "v1",
    author: mockUsers[1],
    content: "The part about semantic color tokens vs. raw values finally clicked for me. Bookmarked this forever.",
    likes: 876,
    publishedAt: "2025-05-11T09:00:00Z",
  },
  {
    id: "c3",
    videoId: "v1",
    author: mockUsers[4],
    content: "Would love a follow-up on how to handle dark mode tokens specifically. Great work!",
    likes: 543,
    publishedAt: "2025-05-12T16:00:00Z",
  },
];
