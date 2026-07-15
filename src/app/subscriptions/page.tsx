import type { Metadata } from "next";
import { SubscriptionsView } from "@/features/subscriptions/SubscriptionsView";

export const metadata: Metadata = { title: "Subscriptions" };

export default function SubscriptionsPage() {
  return <SubscriptionsView />;
}
