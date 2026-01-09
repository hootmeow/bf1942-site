"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, UserPlus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export interface RelatedPlayer {
    name: string;
    rounds_together: number;
    affinity_tier: "ACQUAINTANCE" | "SQUADMATE" | "BATTLE BUDDY";
}

const TIER_COLORS = {
    "ACQUAINTANCE": "bg-muted text-muted-foreground hover:bg-muted/80",
    "SQUADMATE": "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
    "BATTLE BUDDY": "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300"
};

export function BattleBuddiesList({ players }: { players: RelatedPlayer[] }) {
    if (!players || players.length === 0) return null;

    return (
        <Card className="border-border/60">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle as="h2" className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Battle Buddies
                        </CardTitle>
                        <CardDescription>
                            Players monitored on the same team.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {players.map((player) => (
                        <div key={player.name} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <UserPlus className="h-4 w-4" />
                                </div>
                                <div>
                                    <Link href={`/player/${player.name}`} className="font-medium hover:underline text-foreground">
                                        {player.name}
                                    </Link>
                                    <p className="text-xs text-muted-foreground">{player.rounds_together} rounds together</p>
                                </div>
                            </div>
                            <Badge className={`text-[10px] uppercase ${TIER_COLORS[player.affinity_tier] || "bg-secondary"}`}>
                                {player.affinity_tier}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
