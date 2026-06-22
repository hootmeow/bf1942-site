"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { toggleRoundRanked } from "../actions"
import { Loader2, Shield, ShieldOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast-simple"

export default function ToggleRankedButton({
    roundId,
    isRanked,
}: {
    roundId: string
    isRanked: boolean
}) {
    const [loading, startTransition] = useTransition()
    const router = useRouter()
    const { toast } = useToast()

    const handleToggle = () => {
        startTransition(async () => {
            try {
                const result = await toggleRoundRanked(roundId, !isRanked)
                if (result.success) {
                    toast({ title: isRanked ? "Round marked unranked" : "Round marked ranked", variant: "success" })
                    router.refresh()
                } else {
                    toast({ title: "Failed to update round", description: result.error, variant: "destructive" })
                }
            } catch (e) {
                console.error(e)
                toast({ title: "Failed to update round", variant: "destructive" })
            }
        })
    }

    return (
        <Button
            onClick={handleToggle}
            disabled={loading}
            variant={isRanked ? "outline" : "default"}
            className="w-full"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : isRanked ? (
                <ShieldOff className="h-4 w-4 mr-2" />
            ) : (
                <Shield className="h-4 w-4 mr-2" />
            )}
            {isRanked ? "Mark as Unranked" : "Mark as Ranked"}
        </Button>
    )
}
