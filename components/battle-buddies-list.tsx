"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, UserPlus, Heart, Handshake, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface RelatedPlayer {
    name: string;
    rounds_together: number;
    affinity_tier: "ACQUAINTANCE" | "SQUADMATE" | "BATTLE BUDDY";
}

const TIER_CONFIG = {
    "ACQUAINTANCE": {
        icon: User,
        colors: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        label: "Acquaintance",
        description: "Played together occasionally"
    },
    "SQUADMATE": {
        icon: Handshake,
        colors: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        label: "Squadmate",
        description: "Regular teammate"
    },
    "BATTLE BUDDY": {
        icon: Heart,
        colors: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        label: "Battle Buddy",
        description: "Frequent ally"
    }
};

export function BattleBuddiesList({ players }: { players: RelatedPlayer[] }) {
    if (!players || players.length === 0) return null;

    // Sort by rounds together
    const sortedPlayers = [...players].sort((a, b) => b.rounds_together - a.rounds_together);
    const maxRounds = Math.max(...players.map(p => p.rounds_together));

    return (
        <Card className="border-border/60 h-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle as="h3" className="flex items-center gap-2 text-lg">
                            <div className="p-1.5 rounded-lg bg-primary/10">
                                <Users className="h-4 w-4 text-primary" />
                            </div>
                            Battle Buddies
                        </CardTitle>
                        <CardDescription className="mt-1">
                            Players frequently on the same team
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-2">
                    {sortedPlayers.slice(0, 5).map((player, index) => {
                        const tierConfig = TIER_CONFIG[player.affinity_tier] || TIER_CONFIG.ACQUAINTANCE;
                        const TierIcon = tierConfig.icon;
                        const progressPercent = (player.rounds_together / maxRounds) * 100;

                        return (
                            <div
                                key={player.name}
                                className={cn(
                                    "group relative rounded-lg border border-border/40 bg-card/30 p-3 transition-all",
                                    "hover:border-primary/30 hover:bg-card/50"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Rank indicator */}
                                    <div className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold shrink-0",
                                        index === 0 ? "bg-amber-500/20 text-amber-500" :
                                        index === 1 ? "bg-slate-400/20 text-slate-400" :
                                        index === 2 ? "bg-orange-600/20 text-orange-600" :
                                        "bg-muted/50 text-muted-foreground"
                                    )}>
                                        #{index + 1}
                                    </div>

                                    {/* Player info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/player/${encodeURIComponent(player.name)}`}
                                                className="font-medium text-foreground hover:text-primary hover:underline underline-offset-2 truncate"
                                            >
                                                {player.name}
                                            </Link>
                                            <Badge
                                                variant="outline"
                                                className={cn("text-[9px] uppercase px-1.5 py-0 h-4 font-semibold", tierConfig.colors)}
                                            >
                                                <TierIcon className="h-2.5 w-2.5 mr-1" />
                                                {tierConfig.label}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <div className="flex-1 h-1 rounded-full bg-muted/30 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary/40 transition-all"
                                                    style={{ width: `${progressPercent}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                                                {player.rounds_together} rounds
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
