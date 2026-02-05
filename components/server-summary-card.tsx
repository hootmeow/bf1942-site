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
    const isPopulated = server.current_player_count > 0;

    return (
        <Card className="bg-card/40 border-l-4 border-l-primary hover:bg-card/60 transition-colors">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="space-y-1 overflow-hidden flex-1">
                        <h3 className="font-bold flex items-center gap-2 text-lg truncate pr-2">
                            <ServerFlag ip={server.ip} />
                            <Link href={`/servers/${server.server_id}`} className="hover:underline truncate text-foreground hover:text-primary transition-colors">
                                {server.current_server_name || "Unknown Server"}
                            </Link>
                        </h3>
                        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                            <span className="flex items-center gap-1 truncate"><MapIcon className="h-3 w-3" /> {server.current_map || "Unknown"}</span>
                            <span className="flex items-center gap-1 truncate" title={`Game Mode: ${server.current_gametype || 'Unknown'}`}>
                                {getGameModeIcon(server.current_gametype)}
                                <span className="uppercase">{server.current_gametype || "CONQ"}</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <Badge variant={server.current_player_count > 20 ? "default" : "secondary"} className="font-mono">
                            {server.current_player_count} / {server.current_max_players}
                        </Badge>
                    </div>
                </div>

                {/* Visual Player Bar */}
                <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden flex">
                    <div
                        className="h-full bg-primary transition-all duration-1000"
                        style={{ width: `${(server.current_player_count / server.current_max_players) * 100}%` }}
                    ></div>
                </div>
            </CardContent>
        </Card>
    );
}
