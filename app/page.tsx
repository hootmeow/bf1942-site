import type { Metadata } from "next"
import HomeClient from "./home-client"

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Live Battlefield 1942 server monitoring, player counts, and global activity. Track active servers and player statistics in real-time.",
  openGraph: {
    title: "BF1942 Command Center — Live Server Dashboard",
  },
}

export default function HomePage() {
  return <HomeClient />
}
