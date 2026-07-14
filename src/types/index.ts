export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  subscribers: number;
  verified: boolean;
  bio?: string;
  banner?: string;
  joinedAt: string;
  totalViews: number;
  videoCount: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  views: number;
  likes: number;
  dislikes: number;
  publishedAt: string;
  channel: User;
  category: string;
  tags: string[];
  isShort: boolean;
  isFeatured?: boolean;
}

export interface Comment {
  id: string;
  videoId: string;
  author: User;
  content: string;
  likes: number;
  publishedAt: string;
  replies?: Comment[];
  isPinned?: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videos: Video[];
  owner: User;
  visibility: "public" | "private" | "unlisted";
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: "upload" | "comment" | "reply" | "like" | "subscription" | "live";
  actor: User;
  message: string;
  videoId?: string;
  videoThumbnail?: string;
  read: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  label: string;
  slug: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
