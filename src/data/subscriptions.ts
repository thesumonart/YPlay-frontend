import type { User } from "@/types";
import { mockUsers } from "./users";

// Channels the current user is subscribed to
export const mockSubscriptions: User[] = [
  mockUsers[0], // Alex Rivera
  mockUsers[2], // Jordan Blake
  mockUsers[4], // Luca Moretti
  mockUsers[1], // Mia Chen
];
