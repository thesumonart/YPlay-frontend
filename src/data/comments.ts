import type { Comment } from "@/types";
import { mockUsers } from "./users";

export const mockComments: Comment[] = [
  // v1 – Building a Design System
  {
    id: "c1",
    videoId: "v1",
    author: mockUsers[2],
    content:
      "This is hands down the best design system tutorial I've seen. The token architecture section was incredibly insightful.",
    likes: 1_240,
    publishedAt: "2025-05-10T12:00:00Z",
    isPinned: true,
    replies: [
      {
        id: "c1r1",
        videoId: "v1",
        author: mockUsers[0],
        content:
          "Thanks so much! Glad the token section landed well — it's the part I spent the most time on.",
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
    content:
      "The part about semantic color tokens vs. raw values finally clicked for me. Bookmarked this forever.",
    likes: 876,
    publishedAt: "2025-05-11T09:00:00Z",
  },
  {
    id: "c3",
    videoId: "v1",
    author: mockUsers[4],
    content:
      "Would love a follow-up on how to handle dark mode tokens specifically. Great work!",
    likes: 543,
    publishedAt: "2025-05-12T16:00:00Z",
  },
  {
    id: "c4",
    videoId: "v1",
    author: mockUsers[3],
    content:
      "I've watched this three times and still pick up something new each time. The component composition patterns are gold.",
    likes: 412,
    publishedAt: "2025-05-13T10:30:00Z",
    replies: [
      {
        id: "c4r1",
        videoId: "v1",
        author: mockUsers[1],
        content: "Same here. The compound component pattern section alone is worth the watch.",
        likes: 67,
        publishedAt: "2025-05-13T11:00:00Z",
      },
    ],
  },
  {
    id: "c5",
    videoId: "v1",
    author: mockUsers[2],
    content:
      "Finally someone explains the difference between design tokens and CSS variables properly. Subscribed immediately.",
    likes: 298,
    publishedAt: "2025-05-14T08:00:00Z",
  },

  // v6 – Next.js 16 App Router
  {
    id: "c6",
    videoId: "v6",
    author: mockUsers[1],
    content:
      "The server actions section cleared up so much confusion I had. This is the definitive Next.js 16 guide.",
    likes: 2_100,
    publishedAt: "2025-05-16T10:00:00Z",
    isPinned: true,
    replies: [
      {
        id: "c6r1",
        videoId: "v6",
        author: mockUsers[0],
        content:
          "Server actions are genuinely game-changing once they click. Happy it helped!",
        likes: 540,
        publishedAt: "2025-05-16T11:00:00Z",
      },
    ],
  },
  {
    id: "c7",
    videoId: "v6",
    author: mockUsers[3],
    content:
      "I migrated my entire app to the App Router after watching this. Zero issues. Your migration checklist was perfect.",
    likes: 1_450,
    publishedAt: "2025-05-17T14:00:00Z",
  },
  {
    id: "c8",
    videoId: "v6",
    author: mockUsers[4],
    content:
      "The parallel routes demo was mind-blowing. I had no idea you could do that with the file system.",
    likes: 890,
    publishedAt: "2025-05-18T09:30:00Z",
  },
  {
    id: "c9",
    videoId: "v6",
    author: mockUsers[2],
    content:
      "Could you do a deep dive on caching strategies in Next.js 16? That's the one area I still find confusing.",
    likes: 634,
    publishedAt: "2025-05-19T16:00:00Z",
    replies: [
      {
        id: "c9r1",
        videoId: "v6",
        author: mockUsers[0],
        content: "Great suggestion — adding it to the list for the next video!",
        likes: 210,
        publishedAt: "2025-05-19T17:00:00Z",
      },
    ],
  },

  // v8 – Tailwind CSS v4
  {
    id: "c10",
    videoId: "v8",
    author: mockUsers[4],
    content:
      "The @theme inline syntax is so much cleaner than the old config. This video saved me hours of reading docs.",
    likes: 1_780,
    publishedAt: "2025-06-09T08:00:00Z",
    isPinned: true,
  },
  {
    id: "c11",
    videoId: "v8",
    author: mockUsers[1],
    content:
      "I was skeptical about v4 but after this video I'm fully convinced. The performance improvements alone are worth it.",
    likes: 1_230,
    publishedAt: "2025-06-09T10:00:00Z",
    replies: [
      {
        id: "c11r1",
        videoId: "v8",
        author: mockUsers[3],
        content: "The build speed difference is insane. My CI went from 45s to 8s.",
        likes: 345,
        publishedAt: "2025-06-09T11:30:00Z",
      },
    ],
  },
  {
    id: "c12",
    videoId: "v8",
    author: mockUsers[2],
    content:
      "The migration from v3 section was exactly what I needed. Clear, concise, no fluff.",
    likes: 567,
    publishedAt: "2025-06-10T07:00:00Z",
  },
  {
    id: "c13",
    videoId: "v8",
    author: mockUsers[3],
    content:
      "Does this work with shadcn/ui out of the box? Would love to see a video on that combo.",
    likes: 423,
    publishedAt: "2025-06-10T09:00:00Z",
    replies: [
      {
        id: "c13r1",
        videoId: "v8",
        author: mockUsers[0],
        content:
          "Yes! shadcn/ui v2 ships with Tailwind v4 support. I'll cover the setup in an upcoming video.",
        likes: 189,
        publishedAt: "2025-06-10T10:00:00Z",
      },
    ],
  },

  // v12 – Framer Motion
  {
    id: "c14",
    videoId: "v12",
    author: mockUsers[3],
    content:
      "The layout animations section is pure gold. I've been struggling with this for weeks and you explained it in 5 minutes.",
    likes: 934,
    publishedAt: "2025-06-11T08:00:00Z",
  },
  {
    id: "c15",
    videoId: "v12",
    author: mockUsers[1],
    content:
      "The stagger children pattern you showed is exactly what I needed for my portfolio. Thank you!",
    likes: 712,
    publishedAt: "2025-06-11T10:00:00Z",
    replies: [
      {
        id: "c15r1",
        videoId: "v12",
        author: mockUsers[4],
        content: "Same! The stagger + fade combo looks so professional.",
        likes: 98,
        publishedAt: "2025-06-11T11:00:00Z",
      },
    ],
  },
  {
    id: "c16",
    videoId: "v12",
    author: mockUsers[2],
    content:
      "Would love to see a video on combining Framer Motion with React Query for data-driven animations.",
    likes: 445,
    publishedAt: "2025-06-11T14:00:00Z",
  },
  {
    id: "c17",
    videoId: "v12",
    author: mockUsers[4],
    content:
      "The useMotionValue and useTransform hooks section was a revelation. Never thought about animations that way.",
    likes: 389,
    publishedAt: "2025-06-12T09:00:00Z",
  },
];
