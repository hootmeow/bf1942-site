import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Event",
  description: "Plan a Battlefield 1942 tournament, game night, or community event on BF1942 Online.",
  robots: { index: false, follow: false },
};

export default function CreateEventLayout({ children }: { children: React.ReactNode }) {
  return children;
}
