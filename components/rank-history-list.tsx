"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { History, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface RankHistoryItem {
    timestamp: string;
    map_name: string;
    server_name: string;
    round_stats: {
        kills: number;
        deaths: number;
        score: number;
    };
    total_score_after: number;
    points_earned: number;
    rank_label_after: string;
}

export function RankHistoryList({ history, playerName }: { history: RankHistoryItem[], playerName: string }) {
    if (!history || history.length === 0) return null;

    // Show only the last 5 items for the summary
    const recentHistory = history.slice(0, 5);

    return (
        <Card className="border-border/60 h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle as="h2" className="flex items-center gap-2">
                            <History className="h-5 w-5 text-primary" />
                            Rank History
                        </CardTitle>
                        <CardDescription>
                            Recent progression updates.
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/player/${playerName}/history`}>
                            View Full History
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentHistory.map((item, index) => (
                        <div key={index} className="flex items-center justify-between group border-b border-border/40 pb-3 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${item.points_earned > 0 ? "bg-green-500/10 text-green-500" :
                                    item.points_earned < 0 ? "bg-red-500/10 text-red-500" : "bg-muted text-muted-foreground"
                                    }`}>
                                    {item.points_earned > 0 ? <TrendingUp className="h-4 w-4" /> :
                                        item.points_earned < 0 ? <TrendingDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-foreground">
                                        {item.map_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(item.timestamp).toLocaleDateString()} &middot; {item.server_name}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`font-bold text-sm ${item.points_earned > 0 ? "text-green-500" :
                                    item.points_earned < 0 ? "text-red-500" : "text-muted-foreground"
                                    }`}>
                                    {item.points_earned > 0 ? "+" : ""}{item.points_earned} pts
                                </div>
                                <span className="text-[10px] text-muted-foreground block">
                                    Total: {item.total_score_after.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
