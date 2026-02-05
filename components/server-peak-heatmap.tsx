"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { TrendingUp, Clock } from "lucide-react";

interface HeatmapProps {
    data: { hour: string; avg_players: number }[]; // hour is ISO string
}

export function ServerPeakHeatmap({ data }: HeatmapProps) {
    const processedData = useMemo(() => {
        if (!data || data.length === 0) return [];

        // Group by hour of day (UTC) and average across all data points
        const hourlyAverages: { [hour: number]: { sum: number; count: number } } = {};
        for (let i = 0; i < 24; i++) {
            hourlyAverages[i] = { sum: 0, count: 0 };
        }

        data.forEach(d => {
            const date = new Date(d.hour);
            const hour = date.getUTCHours();
            hourlyAverages[hour].sum += d.avg_players;
            hourlyAverages[hour].count += 1;
        });

        const results = Object.entries(hourlyAverages).map(([hour, { sum, count }]) => ({
            hour: parseInt(hour),
            hourLabel: `${hour.padStart(2, '0')}:00`,
            players: count > 0 ? Math.round(sum / count) : 0,
        }));

        const maxPlayers = Math.max(...results.map(r => r.players), 1);

        return results.map(r => ({
            ...r,
            intensity: r.players / maxPlayers,
        })).sort((a, b) => a.hour - b.hour);
    }, [data]);

    const peakTime = useMemo(() => {
        if (processedData.length === 0) return null;
        return processedData.reduce((prev, current) => (current.players > prev.players) ? current : prev);
    }, [processedData]);

    if (processedData.length === 0) return null;

    return (
        <Card className="border-border/60">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle as="h2" className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Best Times to Play
                    </CardTitle>
                    {peakTime && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            <span>Peak Hour: <span className="text-foreground font-semibold">{peakTime.hourLabel} UTC</span></span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Average players by hour (24-hour snapshot)</span>
                    </div>
                    <div className="flex items-end gap-0.5 h-16 w-full">
                        {processedData.map((slot) => (
                            <TooltipProvider key={slot.hour}>
                                <Tooltip delayDuration={50}>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={cn(
                                                "flex-1 rounded-sm transition-all hover:ring-2 hover:ring-primary/50 cursor-default min-w-[8px]",
                                                slot.players === 0 ? "bg-muted/30" : "bg-primary"
                                            )}
                                            style={{
                                                opacity: slot.players === 0 ? 1 : Math.max(0.15, slot.intensity),
                                                height: `${Math.max(10, slot.intensity * 100)}%`,
                                            }}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="text-center">
                                        <p className="font-bold text-base">{slot.hourLabel} UTC</p>
                                        <p className="text-sm text-muted-foreground">{slot.players} avg players</p>
                                        {slot.hour === peakTime?.hour && (
                                            <p className="text-xs text-primary font-medium mt-1">Peak Hour</p>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-0.5">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>23:00</span>
                    </div>
                </div>

                {peakTime && peakTime.players > 0 && (
                    <div className="bg-muted/30 rounded-lg p-3 text-center border border-border/40">
                        <p className="text-sm text-muted-foreground">
                            This server is most active around{" "}
                            <span className="text-foreground font-semibold">{peakTime.hourLabel} UTC</span>
                        </p>
                    </div>
                )}

                <p className="text-xs text-muted-foreground text-center">
                    Based on player activity over the last 24 hours. Times shown in UTC.
                </p>
            </CardContent>
        </Card>
    );
}
