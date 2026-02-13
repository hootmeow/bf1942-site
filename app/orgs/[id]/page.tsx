import type { Metadata } from "next"
import OrgDetailClient from "./org-detail-client"

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const params = await props.params
  const orgId = params.id

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bf1942.online"
    const res = await fetch(`${baseUrl}/api/v1/orgs/${orgId}`, {
      next: { revalidate: 600 },
    })
    if (res.ok) {
      const data = await res.json()
      if (data.ok && data.org) {
        const org = data.org
        const memberCount = data.members?.length || 0
        return {
          title: `${org.tag ? org.tag + " " : ""}${org.name}`,
          description: `${org.description?.slice(0, 150) || `Battlefield 1942 organization with ${memberCount} members.`}`,
          openGraph: {
            title: `${org.name} | BF1942 Organization`,
            description: org.description?.slice(0, 150) || `BF1942 organization with ${memberCount} members.`,
          },
        }
      }
    }
  } catch {
    // Fall through to default
  }

  return {
    title: "Organization",
    description: "View this Battlefield 1942 community organization, its members, and stats.",
  }
}

export default function OrgDetailPage() {
  return <OrgDetailClient />
}
