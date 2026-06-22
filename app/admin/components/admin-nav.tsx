"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Shield, List, LayoutDashboard, UserCheck, Users, Calendar, Youtube,
    Newspaper, Bot, Server, Crown, Target, Eye, ScrollText, Menu, X,
    type LucideIcon,
} from "lucide-react"

interface NavItem {
    href: string
    label: string
    icon: LucideIcon
    /** Accent classes for special items (e.g. the ingest whitelist). */
    accent?: string
}

interface NavSection {
    items: NavItem[]
}

const sections: NavSection[] = [
    {
        items: [
            { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
            { href: "/admin/rounds", label: "Rounds", icon: List },
            { href: "/admin/bot-reports", label: "Bot Reports", icon: Bot },
            { href: "/admin/players/verified", label: "Verified Players", icon: Shield },
            { href: "/admin/claims", label: "Player Claims", icon: UserCheck },
            { href: "/admin/server-claims", label: "Server Claims", icon: Server },
            { href: "/admin/claimed-servers", label: "Claimed Servers", icon: Crown },
        ],
    },
    {
        items: [
            { href: "/admin/orgs", label: "Organizations", icon: Users },
            { href: "/admin/challenges", label: "Challenges", icon: Target },
            { href: "/admin/events", label: "Events", icon: Calendar },
            { href: "/admin/videos", label: "Videos", icon: Youtube },
            { href: "/admin/news", label: "News Articles", icon: Newspaper },
            { href: "/admin/digests", label: "Weekly Digests", icon: Newspaper },
        ],
    },
    {
        items: [
            { href: "/admin/integrity", label: "Integrity Dashboard", icon: Shield },
            { href: "/admin/review-queue", label: "Review Queue", icon: Eye },
        ],
    },
    {
        items: [
            { href: "/admin/whitelist", label: "Ingest Whitelist", icon: Shield, accent: "text-green-500" },
            { href: "/admin/audit-log", label: "Audit Log", icon: ScrollText },
        ],
    },
]

function isActive(pathname: string, href: string): boolean {
    if (href === "/admin") return pathname === "/admin"
    return pathname === href || pathname.startsWith(href + "/")
}

export function AdminNav() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const nav = (
        <nav className="space-y-2">
            {sections.map((section, i) => (
                <div key={i} className="space-y-1">
                    {i > 0 && <div className="h-px bg-border my-2" />}
                    {section.items.map(({ href, label, icon: Icon, accent }) => {
                        const active = isActive(pathname, href)
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
                                    active
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "hover:bg-secondary text-foreground/80 hover:text-foreground",
                                    accent && !active && accent,
                                )}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                {label}
                            </Link>
                        )
                    })}
                </div>
            ))}
        </nav>
    )

    return (
        <aside className="w-full md:w-64 bg-secondary/30 border-b md:border-b-0 md:border-r border-border md:shrink-0">
            <div className="flex items-center justify-between p-4 md:block">
                <div className="flex items-center gap-2 px-2 font-bold text-xl md:mb-8">
                    <Shield className="h-6 w-6 text-primary" />
                    <span>Admin Panel</span>
                </div>
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-secondary"
                    aria-label={open ? "Close navigation" : "Open navigation"}
                    aria-expanded={open}
                >
                    {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Desktop: always visible. Mobile: toggled. */}
            <div className={cn("px-4 pb-4 md:block", open ? "block" : "hidden")}>
                {nav}
            </div>
        </aside>
    )
}
