"use client"

import { useState } from "react"
import { deleteRound } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DeleteRoundButton({
    roundId,
    className,
    redirectUrl
}: {
    roundId: string,
    className?: string,
    redirectUrl?: string
}) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this round? This action cannot be undone.")) {
            return
        }

        setIsDeleting(true)
        try {
            const res = await deleteRound(roundId)
            if (res.success) {
                // Determine if we are on the details page or list page
                if (redirectUrl) {
                    router.push(redirectUrl)
                } else {
                    // Just refresh if on list page
                    router.refresh()
                }
            } else {
                alert(`Failed to delete round: ${res.error}`)
            }
        } catch (e) {
            console.error(e)
            alert("Error deleting round")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className={className}
        >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            <span className="sr-only">Delete</span>
        </Button>
    )
}
