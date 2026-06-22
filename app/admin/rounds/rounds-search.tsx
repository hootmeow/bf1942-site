"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Loader2, Search } from "lucide-react"

/**
 * Debounced rounds search. Updates the `search` query param (resetting to page 1)
 * ~400ms after the user stops typing, so no submit button is needed.
 */
export function RoundsSearch({ initialQuery }: { initialQuery: string }) {
    const router = useRouter()
    const [value, setValue] = useState(initialQuery)
    const [pending, setPending] = useState(false)
    const firstRender = useRef(true)

    useEffect(() => {
        // Don't fire on mount (value already reflects the URL).
        if (firstRender.current) {
            firstRender.current = false
            return
        }
        setPending(true)
        const t = setTimeout(() => {
            const params = new URLSearchParams()
            if (value.trim()) params.set("search", value.trim())
            router.push(`/admin/rounds${params.toString() ? `?${params}` : ""}`)
            setPending(false)
        }, 400)
        return () => clearTimeout(t)
    }, [value, router])

    return (
        <div className="relative w-full sm:w-[320px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search map, ID, server, or player…"
                aria-label="Search rounds"
                className="pl-9 pr-9"
            />
            {pending && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
        </div>
    )
}
