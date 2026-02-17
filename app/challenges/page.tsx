import type { Metadata } from "next"
import ChallengesClient from "./challenges-client"

export const metadata: Metadata = {
  title: "Global Challenges",
  description:
    "Community-wide Battlefield 1942 challenges. Track progress on kill counts, score goals, and team objectives.",
  openGraph: {
    title: "Global Challenges",
  },
}

export default function ChallengesPage() {
  return <ChallengesClient />
}
