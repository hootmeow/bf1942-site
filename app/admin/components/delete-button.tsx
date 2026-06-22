"use client"

import { useTransition } from "react"
import { deleteRound } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast-simple"
import { useConfirm } from "./confirm-provider"

export default function DeleteRoundButton({
    roundId,
    className,
    redirectUrl
}: {
    roundId: string,
    className?: string,
    redirectUrl?: string
}) {
    const [isDeleting, startTransition] = useTransition()
    const router = useRouter()
    const { toast } = useToast()
    const confirm = useConfirm()

    const handleDelete = async () => {
        const ok = await confirm({
            title: "Delete this round?",
            description: "This permanently removes the round and all its player stats. This action cannot be undone.",
            confirmText: "Delete",
            variant: "destructive",
        })
        if (!ok) return

        startTransition(async () => {
            try {
                const res = await deleteRound(roundId)
                if (res.success) {
                    toast({ title: "Round deleted", variant: "success" })
                    if (redirectUrl) {
                        router.push(redirectUrl)
                    } else {
                        router.refresh()
                    }
                } else {
                    toast({ title: "Failed to delete round", description: res.error, variant: "destructive" })
                }
            } catch (e) {
                console.error(e)
                toast({ title: "Error deleting round", variant: "destructive" })
            }
        })
    }

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className={className}
            aria-label="Delete round"
        >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            <span className="sr-only">Delete</span>
        </Button>
    )
}
