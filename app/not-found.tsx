import Link from "next/link"
import { SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function NotFound() {
    return (
        <div className="space-y-8">
            {/* Hero Error Section */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-12 shadow-2xl">
                {/* Background blur orbs */}
                <div className="pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-red-500/10 blur-[80px]" />
                <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-orange-500/10 blur-[70px]" />

                <div className="relative z-10 text-center">
                    <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in-up">
                        <div className="rounded-xl bg-red-500/20 p-4">
                            <SearchX className="h-12 w-12 text-red-400" />
                        </div>
                    </div>

                    <div className="space-y-4 max-w-2xl mx-auto animate-fade-in-up stagger-1">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                                SECTOR NOT FOUND
                            </h1>
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                404
                            </Badge>
                        </div>
                        <p className="text-base sm:text-lg text-slate-400 max-w-[600px] mx-auto">
                            The coordinates you entered do not correspond to any active battlefield.
                            This sector is uncharted territory. Return to base immediately.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 animate-fade-in-up stagger-2">
                        <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                            <Link href="/">
                                Return to Dashboard
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/servers">
                                Browse Servers
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-8 text-xs text-slate-500 font-mono animate-fade-in-up stagger-3">
                        ERROR_CODE: 404_MIA // MISSION_STATUS: LOST
                    </div>
                </div>
            </div>
        </div>
    )
}
