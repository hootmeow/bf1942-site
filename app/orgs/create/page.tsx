"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrgEditor } from "@/components/org-editor"
import { createOrganization } from "@/app/actions/org-actions"
import { useToast } from "@/components/ui/toast-simple"
import { Users, Loader2, LogIn } from "lucide-react"
import { useSession, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function CreateOrgPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (status === "loading") {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Users className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">You must be logged in to create an organization.</p>
        <Button onClick={() => signIn("discord")} className="gap-2">
          <LogIn className="h-4 w-4" />
          Sign in with Discord
        </Button>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createOrganization(formData)

    if (result.ok) {
      toast({ title: "Organization Created", variant: "success" })
      router.push(`/orgs/${result.orgId}`)
    } else {
      setError(result.error || "Failed to create")
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Organization</h1>
          <p className="text-sm text-muted-foreground">Start a new community group</p>
        </div>
      </div>

      <Card className="border-border/60">
        <CardContent className="pt-6">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <OrgEditor loading={loading} />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
