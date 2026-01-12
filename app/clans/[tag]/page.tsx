"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, Trophy, Target, Users, AlertTriangle, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Matches API v1/clans/search response
interface ClanData {
    ok: boolean;
    tag: string;
    stats: {
        member_count: number;
        total_score: number;
        total_kills: number;
        total_deaths: number;
        avg_score: number;
        kdr: number;
    };
    roster: {
        player_id: number;
        name: string;
        last_seen: string;
        score: number;
        kills: number;
        deaths: number;
        kdr: number | null; // API allows null
    }[];
    error?: string;
}

export default function ClanDetailPage() {
    const params = useParams();
    const rawTag = params.tag as string;
    const tag = decodeURIComponent(rawTag);

    const [loading, setLoading] = useState(true);
    const [clanData, setClanData] = useState<ClanData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchClanData() {
            setLoading(true);
            try {
                // Use the new Backend Search API
                // Note: The API cleans the tag, but we strip brackets just in case the user typed them in the URL
                const cleanTag = tag.replace(/^\[|\]$/g, '');

                // Use relative path for client-side fetch (proxy handles it)
                // Or absolute URL if environment variable is set
                const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
                const res = await fetch(`${baseUrl}/api/v1/clans/search?tag=${encodeURIComponent(cleanTag)}`);

                if (!res.ok) {
                    throw new Error(`API Error: ${res.status}`);
                }

                const json = await res.json();
                if (json.ok) {
                    setClanData(json);
                } else {
                    setError(json.error || "Clan not found.");
                }
            } catch (e) {
                console.error(e);
                setError("Could not retrieve clan roster. API may be unreachable.");
            } finally {
                setLoading(false);
            }
        }

        if (tag) fetchClanData();
    }, [tag]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" />
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <h1 className="text-2xl font-bold">Error Loading Unit</h1>
                <p className="text-muted-foreground">{error}</p>
                <Button variant="outline" asChild>
                    <Link href="/clans">back to Search</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/clans">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-md font-mono text-3xl">[{clanData?.tag || tag}]</span>
                        Unit Profile
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {clanData ? `Found active unit with ${clanData.stats.member_count} members.` : "Searching records..."}
                    </p>
                </div>
            </div>

            {clanData && clanData.stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-card/40 border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Unit Score</CardTitle>
                            <Trophy className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{clanData.stats.total_score.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/40 border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Confirmed Kills</CardTitle>
                            <Target className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{clanData.stats.total_kills.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/40 border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Strength</CardTitle>
                            <Users className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{clanData.stats.member_count}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/40 border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unit K/D</CardTitle>
                            <Shield className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{clanData.stats.kdr}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card className="border-border/60">
                <CardHeader>
                    <CardTitle>Unit Roster</CardTitle>
                </CardHeader>
                <CardContent>
                    {clanData && clanData.roster.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Soldier</TableHead>
                                    <TableHead className="text-right">Score</TableHead>
                                    <TableHead className="text-right">Kills</TableHead>
                                    <TableHead className="text-right">K/D</TableHead>
                                    <TableHead className="text-right">Last Seen</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clanData.roster.map((player) => (
                                    <TableRow key={player.player_id}>
                                        <TableCell>
                                            <Link href={`/player/${encodeURIComponent(player.name)}`} className="font-bold hover:underline">
                                                {player.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right">{player.score.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">{player.kills.toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {player.kdr !== null && player.kdr !== undefined ? player.kdr.toFixed(2) : "N/A"}
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">{new Date(player.last_seen).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <AlertTriangle className="h-10 w-10 mb-4 opacity-50" />
                            <p>No soldiers found matching tag "{tag}".</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
