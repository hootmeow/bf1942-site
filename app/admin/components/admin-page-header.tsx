import type { ReactNode } from "react"

/**
 * Standard admin page header. Keeps title sizing/spacing consistent across pages.
 */
export function AdminPageHeader({
    title,
    subtitle,
    action,
}: {
    title: string
    subtitle?: string
    action?: ReactNode
}) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    )
}
