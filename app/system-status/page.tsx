import type { Metadata } from "next"
import SystemStatusClient from "./system-status-client"

export const metadata: Metadata = {
  title: "System Status",
  description:
    "Real-time status of all bf1942.online services, databases, and infrastructure components.",
  openGraph: {
    title: "System Status",
  },
}

export default function SystemStatusPage() {
  return <SystemStatusClient />
}
