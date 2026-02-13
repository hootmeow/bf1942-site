"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"
import Link from "next/link"

interface OrgCardProps {
  org: {
    org_id: number
    name: string
    tag?: string | null
    description?: string | null
    banner_url?: string | null
    member_count: number
  }
}

export function OrgCard({ org }: OrgCardProps) {
  return (
    <Link href={`/orgs/${org.org_id}`}>
      <Card className="border-border/60 bg-card/40 card-interactive overflow-hidden">
        {org.banner_url && (
          <div className="h-24 overflow-hidden bg-muted/30">
            <img src={org.banner_url} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {org.tag && (
                  <span className="text-xs font-bold text-primary">{org.tag}</span>
                )}
                <h3 className="font-semibold text-sm truncate">{org.name}</h3>
              </div>
              {org.description && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{org.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Users className="h-3.5 w-3.5" />
              {org.member_count}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
