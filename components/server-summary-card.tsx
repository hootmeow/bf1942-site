"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServerFlag } from "@/components/server-flag";
import Link from "next/link";
import { Map as MapIcon, Server } from "lucide-react";
import { Sparkline } from "@/components/sparkline";

interface LiveServer {
    server_id: number;
    current_server_name: string | null;
    current_map: string | null;
    current_player_count: number;
    current_max_players: number;
    ip: string;
    current_gametype?: string | null;
    history?: number[];
}

import { Flag, Skull, Users, Gamepad2, FlagTriangleRight } from "lucide-react";

function getGameModeIcon(mode: string | null | undefined) {
    const m = (mode || "").toLowerCase();
    if (m.includes("conq")) return <Flag className="h-3 w-3" />;
    if (m.includes("ctf")) return <FlagTriangleRight className="h-3 w-3" />;
    if (m.includes("tdm") || m.includes("team death")) return <Skull className="h-3 w-3" />;
    if (m.includes("coop")) return <Users className="h-3 w-3" />;
    return <Gamepad2 className="h-3 w-3" />;
}

function getPlayerTier(count: number, max: number) {
    if (count === 0) return {
        label: "empty",
        barClass: "bg-transparent",
        glowClass: "",
        countClass: "text-foreground",
        borderClass: "border-l-transparent",
        pulse: false,
    };
    if (count >= 40) return {
        label: "packed",
        barClass: "bg-gradient-to-r from-green-500 to-emerald-400",
        glowClass: "shadow-[0_0_10px_rgba(34,197,94,0.5)]",
        countClass: "text-green-500 font-semibold",
        borderClass: "border-l-green-500",
        pulse: true,
    };
    if (count >= 20) return {
        label: "active",
        barClass: "bg-gradient-to-r from-amber-500 to-yellow-400",
        glowClass: "shadow-[0_0_8px_rgba(245,158,11,0.4)]",
        countClass: "text-amber-400 font-semibold",
        borderClass: "border-l-amber-500",
        pulse: true,
    };
    if (count >= 5) return {
        label: "warming",
        barClass: "bg-primary/70",
        glowClass: "",
        countClass: "text-foreground font-semibold",
        borderClass: "border-l-primary/60",
        pulse: false,
    };
    return {
        label: "low",
        barClass: "bg-primary/40",
        glowClass: "",
        countClass: "text-foreground font-semibold",
        borderClass: "border-l-primary/30",
        pulse: false,
    };
}

export function ServerSummaryCard({ server }: { server: LiveServer }) {
    const fillPercent = (server.current_player_count / (server.current_max_players || 64)) * 100;
    const tier = getPlayerTier(server.current_player_count, server.current_max_players || 64);

    return (
        <Card className={cn(
            "group bg-card/40 border border-border/60 hover:border-primary/40 hover:bg-card/60 transition-all duration-200 overflow-hidden hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 card-glow border-l-2",
            tier.borderClass
        )}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="space-y-1.5 overflow-hidden flex-1 min-w-0">
                        <h3 className="font-bold flex items-center gap-2 text-base">
                            <ServerFlag ip={server.ip} className="flex-shrink-0" />
                            <Link
                                href={`/servers/${server.server_id}`}
                                className="hover:underline underline-offset-2 truncate text-foreground group-hover:text-primary transition-colors"
                            >
                                {server.current_server_name || "Unknown Server"}
                            </Link>
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5 truncate">
                                <MapIcon className="h-3 w-3 text-primary/70" />
                                <span className="truncate">{server.current_map || "Unknown"}</span>
                            </span>
                            <span className="flex items-center gap-1.5" title={`Game Mode: ${server.current_gametype || 'Unknown'}`}>
                                {getGameModeIcon(server.current_gametype)}
                                <span className="uppercase font-medium">{server.current_gametype || "N/A"}</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                            <span className={tier.countClass}>
                                {server.current_player_count}
                            </span>
                            <span className="text-muted-foreground">/ {server.current_max_players}</span>
                        </div>
                        {server.history && server.history.length > 0 && (
                            <div className="h-4 w-14 opacity-70">
                                <Sparkline data={server.history} width={56} height={16} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Visual Player Bar */}
                <div className="relative mt-1">
                    <div className={cn(
                        "w-full bg-muted/40 rounded-full overflow-hidden transition-all duration-300",
                        tier.pulse ? "h-2" : "h-1.5"
                    )}>
                        <div
                            className={cn("h-full rounded-full transition-all duration-500", tier.barClass)}
                            style={{ width: `${fillPercent}%` }}
                        />
                    </div>
                    {/* Glow effect rendered outside overflow-hidden */}
                    {tier.pulse && fillPercent > 0 && (
                        <div
                            className={cn(
                                "absolute top-1/2 -translate-y-1/2 h-4 rounded-full blur-md animate-pulse",
                                tier.label === "packed" ? "bg-green-500/40" : "bg-amber-500/35"
                            )}
                            style={{ width: `${fillPercent}%` }}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
