"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServerFlag } from "@/components/server-flag";
import Link from "next/link";
import { Map as MapIcon, Server } from "lucide-react";

interface LiveServer {
    server_id: number;
    current_server_name: string;
    current_map: string;
    current_player_count: number;
    current_max_players: number;
    ip: string;
    port: number;
}

export function ServerSummaryCard({ server }: { server: LiveServer }) {
    const isPopulated = server.current_player_count > 0;

    return (
        <Card className="bg-card/40 border-l-4 border-l-primary hover:bg-card/60 transition-colors">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="space-y-1 overflow-hidden">
                        <h3 className="font-bold flex items-center gap-2 text-lg truncate pr-2">
                            <ServerFlag ip={server.ip} />
                            <Link href={`/servers/${server.server_id}`} className="hover:underline truncate text-blue-100">
                                {server.current_server_name}
                            </Link>
                        </h3>
                        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                            <span className="flex items-center gap-1 truncate"><MapIcon className="h-3 w-3" /> {server.current_map}</span>
                            <span className="flex items-center gap-1 truncate"><Server className="h-3 w-3" /> {server.ip}</span>
                        </div>
                    </div>
                    <Badge variant={server.current_player_count > 20 ? "default" : "secondary"} className="font-mono shrink-0">
                        {server.current_player_count} / {server.current_max_players}
                    </Badge>
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
