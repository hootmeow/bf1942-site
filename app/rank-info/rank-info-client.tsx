"use client";

import { useEffect, useState } from "react";
import { LeaderboardTable, LeaderboardItem } from "@/components/leaderboard-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface LeaderboardResponse {
    ok: boolean;
    leaderboard: LeaderboardItem[];
    count: number;
}

export default function RankInfoClient() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                // Use relative path to leverage Next.js proxy/rewrite to API
                const res = await fetch("/api/v1/leaderboard");
                if (!res.ok) {
                    throw new Error(`Failed to fetch leaderboard: ${res.statusText}`);
                }
                const data: LeaderboardResponse = await res.json();
                if (data.ok) {
                    setLeaderboard(data.leaderboard);
                } else {
                    throw new Error("API returned an error");
                }
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Loading leaderboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-6 md:py-10 max-w-5xl mx-auto">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container py-6 md:py-10 space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Player Ranks</h1>
                    <p className="text-muted-foreground text-lg">
                        Global leaderboard based on Career XP.
                    </p>
                </div>
                {/* Snippet Card */}
                <Card className="border-border/60 bg-primary/5 md:max-w-md w-full">
                    <CardContent className="p-4 flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0 mt-0.5">
                            <Info className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm mb-1">Rank Score (XP) System</h3>
                            <p className="text-xs text-muted-foreground mb-3">
                                Rank Score accumulates forever. You earn XP for Kills (10),
                                Objectives (20), and just for Finishing Rounds (100).
                            </p>
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs gap-1" asChild>
                                <Link href="/rank-system">
                                    Read full breakdown <ChevronRight className="h-3 w-3" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {leaderboard ? (
                <LeaderboardTable players={leaderboard} />
            ) : (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <p>No leaderboard data found.</p>
                </div>
            )}
        </div>
    );
}
