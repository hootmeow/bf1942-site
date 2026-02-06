"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { TrendingUp, Clock, Calendar } from "lucide-react";

interface PeakTime7d {
    hour: number;
    avg_players: number;
    max_players: number;
}

interface PeakDay7d {
    day: number;
    day_name: string;
    avg_players: number;
}

interface HeatmapProps {
    data: { hour: string; avg_players: number }[]; // hour is ISO string (24h data)
    peakTimes7d?: PeakTime7d[];
    peakDays7d?: PeakDay7d[];
}

type TabMode = "24h" | "7d";

export function ServerPeakHeatmap({ data, peakTimes7d, peakDays7d }: HeatmapProps) {
    const has7dData = peakTimes7d && peakTimes7d.length > 0;
    const [activeTab, setActiveTab] = useState<TabMode>(has7dData ? "7d" : "24h");

    // Process 24h data (existing logic)
    const processedData24h = useMemo(() => {
        if (!data || data.length === 0) return [];

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

    // Process 7d hourly data
    const processedData7d = useMemo(() => {
        if (!peakTimes7d || peakTimes7d.length === 0) return [];

        const maxPlayers = Math.max(...peakTimes7d.map(r => r.avg_players), 1);

        return peakTimes7d.map(r => ({
            hour: r.hour,
            hourLabel: `${String(r.hour).padStart(2, '0')}:00`,
            players: Math.round(r.avg_players),
            maxPlayers: r.max_players,
            intensity: r.avg_players / maxPlayers,
        })).sort((a, b) => a.hour - b.hour);
    }, [peakTimes7d]);

    // Process day-of-week data
    const processedDays = useMemo(() => {
        if (!peakDays7d || peakDays7d.length === 0) return [];
        const maxPlayers = Math.max(...peakDays7d.map(d => d.avg_players), 1);
        return peakDays7d.map(d => ({
            ...d,
            intensity: d.avg_players / maxPlayers,
        }));
    }, [peakDays7d]);

    // Compute peak time/day
    const activeData = activeTab === "7d" ? processedData7d : processedData24h;

    const peakHour = useMemo(() => {
        if (activeData.length === 0) return null;
        return activeData.reduce((prev, current) => (current.players > prev.players) ? current : prev);
    }, [activeData]);

    const peakDay = useMemo(() => {
        if (processedDays.length === 0) return null;
        return processedDays.reduce((prev, current) => (current.avg_players > prev.avg_players) ? current : prev);
    }, [processedDays]);

    // "Best time to play" summary
    const bestTimeSummary = useMemo(() => {
        if (activeTab !== "7d") return null;
        if (!peakDay || !peakHour) return null;
        return `${peakDay.day_name}s around ${peakHour.hourLabel} UTC`;
    }, [activeTab, peakDay, peakHour]);

    if (processedData24h.length === 0 && processedData7d.length === 0) return null;

    return (
        <Card className="border-border/60">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle as="h2" className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Best Times to Play
                    </CardTitle>
                    {peakHour && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            <span>Peak Hour: <span className="text-foreground font-semibold">{peakHour.hourLabel} UTC</span></span>
                        </div>
                    )}
                </div>
                {/* Tab toggle */}
                {has7dData && (
                    <div className="flex gap-1 mt-2 bg-muted/30 rounded-lg p-1 w-fit border border-border/40">
                        <button
                            onClick={() => setActiveTab("24h")}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                activeTab === "24h"
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            24 Hours
                        </button>
                        <button
                            onClick={() => setActiveTab("7d")}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                activeTab === "7d"
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            7 Days
                        </button>
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                            {activeTab === "7d"
                                ? "Average players by hour (7-day average)"
                                : "Average players by hour (24-hour snapshot)"}
                        </span>
                    </div>
                    <div className="flex items-end gap-0.5 h-16 w-full">
                        {activeData.map((slot) => (
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
                                        {activeTab === "7d" && "maxPlayers" in slot && (
                                            <p className="text-xs text-muted-foreground">Peak: {(slot as any).maxPlayers} players</p>
                                        )}
                                        {slot.hour === peakHour?.hour && (
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

                {/* Day-of-week row (7d tab only) */}
                {activeTab === "7d" && processedDays.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Activity by day of week</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {processedDays.map((day) => (
                                <TooltipProvider key={day.day}>
                                    <Tooltip delayDuration={50}>
                                        <TooltipTrigger asChild>
                                            <div className="flex flex-col items-center gap-1">
                                                <div
                                                    className={cn(
                                                        "w-full h-8 rounded-md transition-all cursor-default",
                                                        day.avg_players === 0 ? "bg-muted/30" : "bg-primary"
                                                    )}
                                                    style={{
                                                        opacity: day.avg_players === 0 ? 1 : Math.max(0.2, day.intensity),
                                                    }}
                                                />
                                                <span className={cn(
                                                    "text-[10px]",
                                                    day.day === peakDay?.day
                                                        ? "text-primary font-bold"
                                                        : "text-muted-foreground"
                                                )}>
                                                    {day.day_name.slice(0, 3)}
                                                </span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="text-center">
                                            <p className="font-bold">{day.day_name}</p>
                                            <p className="text-sm text-muted-foreground">{Math.round(day.avg_players)} avg players</p>
                                            {day.day === peakDay?.day && (
                                                <p className="text-xs text-primary font-medium mt-1">Busiest Day</p>
                                            )}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>
                )}

                {/* Best time to play summary */}
                {bestTimeSummary && (
                    <div className="bg-primary/5 rounded-lg p-3 text-center border border-primary/20">
                        <p className="text-sm text-muted-foreground">
                            Best time to play:{" "}
                            <span className="text-foreground font-semibold">{bestTimeSummary}</span>
                        </p>
                    </div>
                )}

                {/* Fallback for 24h mode */}
                {activeTab === "24h" && peakHour && peakHour.players > 0 && (
                    <div className="bg-muted/30 rounded-lg p-3 text-center border border-border/40">
                        <p className="text-sm text-muted-foreground">
                            This server is most active around{" "}
                            <span className="text-foreground font-semibold">{peakHour.hourLabel} UTC</span>
                        </p>
                    </div>
                )}

                <p className="text-xs text-muted-foreground text-center">
                    {activeTab === "7d"
                        ? "Based on player activity over the last 7 days. Times shown in UTC."
                        : "Based on player activity over the last 24 hours. Times shown in UTC."}
                </p>
            </CardContent>
        </Card>
    );
}
