import type { Video } from "@/types";
import { mockVideos } from "./videos";

export interface HistoryEntry {
  video: Video;
  watchedAt: string;
  progressSeconds: number;
}

export const mockHistory: HistoryEntry[] = [
  {
    video: mockVideos[0],
    watchedAt: "2025-06-10T09:15:00Z",
    progressSeconds: 3200,
  },
  {
    video: mockVideos[5],
    watchedAt: "2025-06-10T07:40:00Z",
    progressSeconds: 6100,
  },
  {
    video: mockVideos[2],
    watchedAt: "2025-06-09T21:00:00Z",
    progressSeconds: 1800,
  },
  {
    video: mockVideos[8],
    watchedAt: "2025-06-09T18:30:00Z",
    progressSeconds: 1780,
  },
  {
    video: mockVideos[4],
    watchedAt: "2025-06-08T20:00:00Z",
    progressSeconds: 2100,
  },
  {
    video: mockVideos[11],
    watchedAt: "2025-06-08T15:00:00Z",
    progressSeconds: 900,
  },
  {
    video: mockVideos[6],
    watchedAt: "2025-06-07T10:00:00Z",
    progressSeconds: 720,
  },
  {
    video: mockVideos[9],
    watchedAt: "2025-06-06T19:00:00Z",
    progressSeconds: 1200,
  },
];
