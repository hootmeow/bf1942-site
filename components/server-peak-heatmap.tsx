"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { Activity, Clock } from "lucide-react";

interface HeatmapProps {
    data: { hour: string; avg_players: number }[]; // hour is ISO string
}

export function ServerPeakHeatmap({ data }: HeatmapProps) {
    const processedData = useMemo(() => {
        if (!data || data.length === 0) return [];

        // Find absolute max for scaling
        const maxPlayers = Math.max(...data.map(d => d.avg_players), 1);

        return data.map(d => {
            const date = new Date(d.hour);
            const hour = date.getHours();
            const intensity = d.avg_players / maxPlayers;

            return {
                hour,
                hourLabel: `${hour.toString().padStart(2, '0')}:00`,
                players: Math.round(d.avg_players),
                intensity, // 0 to 1
                date: date
            };
        }).sort((a, b) => a.hour - b.hour);
    }, [data]);

    const peakTime = useMemo(() => {
        if (processedData.length === 0) return null;
        return processedData.reduce((prev, current) => (current.players > prev.players) ? current : prev);
    }, [processedData]);

    if (processedData.length === 0) return null;

    return (
        <Card className="border-border/60">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle as="h2" className="flex items-center gap-2 text-lg">
                        <Activity className="h-5 w-5 text-primary" />
                        Peak Activity
                    </CardTitle>
                    {peakTime && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                            <Clock className="h-3 w-3" />
                            <span>Peak: <span className="text-foreground font-medium">{peakTime.hourLabel}</span> ({peakTime.players} players)</span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex items-end gap-1 h-12 w-full">
                        {processedData.map((slot) => (
                            <TooltipProvider key={slot.hourLabel}>
                                <Tooltip delayDuration={100}>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={cn(
                                                "flex-1 rounded-sm transition-all hover:opacity-80 cursor-default",
                                                slot.players === 0 ? "bg-muted/20" : "bg-primary"
                                            )}
                                            style={{
                                                opacity: slot.players === 0 ? 1 : Math.max(0.2, slot.intensity),
                                                height: '100%'
                                            }}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        <div className="text-center">
                                            <p className="font-bold">{slot.hourLabel}</p>
                                            <p className="text-xs text-muted-foreground">{slot.players} Players</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                    {/* Hour Labels */}
                    <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>23:00</span>
                    </div>
                </div>

                <div className="mt-4 text-xs text-muted-foreground text-center">
                    Shows average player counts over the last 24 hours (UTC).
                </div>
            </CardContent>
        </Card>
    );
}
