"use client";

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

export function ServerSummaryCard({ server }: { server: LiveServer }) {
    const fillPercent = (server.current_player_count / (server.current_max_players || 64)) * 100;
    const isHot = server.current_player_count >= 20;
    const isActive = server.current_player_count > 0;

    return (
        <Card className="group bg-card/40 border border-border/60 hover:border-primary/40 hover:bg-card/60 transition-all duration-200 overflow-hidden hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
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
                                <span className="uppercase font-medium">{server.current_gametype || "CONQ"}</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                            <span className={
                                isHot
                                    ? "text-green-500 font-semibold"
                                    : isActive
                                    ? "text-foreground font-semibold"
                                    : "text-muted-foreground"
                            }>
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
                <div className="relative h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${
                            isHot
                                ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                : isActive
                                ? "bg-primary/60"
                                : "bg-transparent"
                        }`}
                        style={{ width: `${fillPercent}%` }}
                    />
                    {isHot && (
                        <div
                            className="absolute top-0 h-full bg-green-500/30 animate-pulse rounded-full"
                            style={{ width: `${fillPercent}%` }}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
