"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toggleRoundRanked } from "../actions"
import { Shield, ShieldOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ToggleRankedButton({
    roundId,
    isRanked,
}: {
    roundId: string
    isRanked: boolean
}) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleToggle = async () => {
        setLoading(true)
        try {
            const result = await toggleRoundRanked(roundId, !isRanked)
            if (result.success) {
                router.refresh()
            } else {
                alert(result.error || "Failed to update round")
            }
        } catch (e) {
            console.error(e)
            alert("Failed to update round")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handleToggle}
            disabled={loading}
            variant={isRanked ? "outline" : "default"}
            className="w-full"
        >
            {isRanked ? (
                <>
                    <ShieldOff className="h-4 w-4 mr-2" />
                    Mark as Unranked
                </>
            ) : (
                <>
                    <Shield className="h-4 w-4 mr-2" />
                    Mark as Ranked
                </>
            )}
        </Button>
    )
}
