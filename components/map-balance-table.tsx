"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Scale } from "lucide-react";

export interface MapBalanceStat {
    map_name: string;
    total_rounds: number;
    axis_win_rate: number;
    allied_win_rate: number;
    average_duration: number;
}

export function MapBalanceTable({ stats }: { stats: MapBalanceStat[] }) {
    // Sort by total rounds (popularity) or maybe balanced-ness? Default to popularity.
    // Ideally, sort by most played.
    const sortedStats = [...stats].sort((a, b) => b.total_rounds - a.total_rounds);

    return (
        <Card className="border-border/60">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle as="h2" className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-primary" />
                            Map Balance Stats
                        </CardTitle>
                        <CardDescription>
                            Win rates for Axis vs Allies over recorded rounds.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {sortedStats.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-4 text-center">No map balance data available yet.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[180px]">Map</TableHead>
                                <TableHead className="text-center w-[100px]">Rounds</TableHead>
                                <TableHead className="w-[200px] text-center">Win Rate Balance</TableHead>
                                <TableHead className="text-right">Axis %</TableHead>
                                <TableHead className="text-right">Allied %</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedStats.map((map) => (
                                <TableRow key={map.map_name}>
                                    <TableCell className="font-medium">{map.map_name}</TableCell>
                                    <TableCell className="text-center">{map.total_rounds}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {/* Visual Balance Bar */}
                                            <div className="flex h-2 w-full overflow-hidden rounded-full bg-blue-500/20">
                                                <div
                                                    className="h-full bg-red-500"
                                                    style={{ width: `${map.axis_win_rate * 100}%` }}
                                                />
                                                <div
                                                    className="h-full bg-blue-500"
                                                    style={{ width: `${map.allied_win_rate * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-red-500 font-medium">
                                        {(map.axis_win_rate * 100).toFixed(0)}%
                                    </TableCell>
                                    <TableCell className="text-right text-blue-500 font-medium">
                                        {(map.allied_win_rate * 100).toFixed(0)}%
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
