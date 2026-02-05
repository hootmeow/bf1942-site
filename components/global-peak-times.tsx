"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { Clock, TrendingUp, Calendar } from "lucide-react";

interface TimelineEntry {
  timestamp: string;
  total: number;
}

interface GlobalPeakTimesProps {
  heatmap7d: number[]; // Array of 24 values (avg players per hour over 7 days)
  timeline7d?: TimelineEntry[]; // Optional: hourly data points for day-of-week analysis
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function GlobalPeakTimes({ heatmap7d, timeline7d }: GlobalPeakTimesProps) {
  // Process hourly heatmap (24 hours)
  const hourlyData = useMemo(() => {
    if (!heatmap7d || heatmap7d.length !== 24) return [];

    const maxPlayers = Math.max(...heatmap7d, 1);

    return heatmap7d.map((avg, hour) => ({
      hour,
      hourLabel: `${hour.toString().padStart(2, "0")}:00`,
      players: Math.round(avg),
      intensity: avg / maxPlayers,
    }));
  }, [heatmap7d]);

  // Find peak hour
  const peakHour = useMemo(() => {
    if (hourlyData.length === 0) return null;
    return hourlyData.reduce((prev, current) =>
      current.players > prev.players ? current : prev
    );
  }, [hourlyData]);

  // Process day-of-week breakdown from timeline (if available)
  const dayOfWeekData = useMemo(() => {
    if (!timeline7d || timeline7d.length === 0) return null;

    // Group by day of week and calculate average
    const dayTotals: { [key: number]: { sum: number; count: number } } = {};

    for (let i = 0; i < 7; i++) {
      dayTotals[i] = { sum: 0, count: 0 };
    }

    timeline7d.forEach((entry) => {
      const date = new Date(entry.timestamp);
      const dayOfWeek = date.getUTCDay();
      dayTotals[dayOfWeek].sum += entry.total;
      dayTotals[dayOfWeek].count += 1;
    });

    const results = DAYS_OF_WEEK.map((day, index) => ({
      day,
      dayFull: DAYS_FULL[index],
      avgPlayers: dayTotals[index].count > 0
        ? Math.round(dayTotals[index].sum / dayTotals[index].count)
        : 0,
    }));

    const maxAvg = Math.max(...results.map(r => r.avgPlayers), 1);

    return results.map(r => ({
      ...r,
      intensity: r.avgPlayers / maxAvg,
    }));
  }, [timeline7d]);

  // Find peak day
  const peakDay = useMemo(() => {
    if (!dayOfWeekData) return null;
    return dayOfWeekData.reduce((prev, current) =>
      current.avgPlayers > prev.avgPlayers ? current : prev
    );
  }, [dayOfWeekData]);

  if (hourlyData.length === 0) return null;

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
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hourly Heatmap */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Average players by hour (7-day average)</span>
          </div>
          <div className="flex items-end gap-0.5 h-16 w-full">
            {hourlyData.map((slot) => (
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

        {/* Day of Week Breakdown */}
        {dayOfWeekData && (
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Average players by day of week</span>
              {peakDay && (
                <span className="ml-auto text-xs bg-muted/50 px-2 py-0.5 rounded">
                  Peak: <span className="text-foreground font-medium">{peakDay.dayFull}</span>
                </span>
              )}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {dayOfWeekData.map((dayData) => (
                <TooltipProvider key={dayData.day}>
                  <Tooltip delayDuration={50}>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            "w-full h-8 rounded-md transition-all hover:ring-2 hover:ring-primary/50 cursor-default",
                            dayData.avgPlayers === 0 ? "bg-muted/30" : "bg-primary"
                          )}
                          style={{
                            opacity: dayData.avgPlayers === 0 ? 1 : Math.max(0.2, dayData.intensity),
                          }}
                        />
                        <span className={cn(
                          "text-[10px]",
                          dayData.day === peakDay?.day ? "text-primary font-bold" : "text-muted-foreground"
                        )}>
                          {dayData.day}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-center">
                      <p className="font-bold">{dayData.dayFull}</p>
                      <p className="text-sm text-muted-foreground">{dayData.avgPlayers} avg players</p>
                      {dayData.day === peakDay?.day && (
                        <p className="text-xs text-primary font-medium mt-1">Best Day</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {peakHour && peakDay && (
          <div className="bg-muted/30 rounded-lg p-3 text-center border border-border/40">
            <p className="text-sm text-muted-foreground">
              For the best experience, play on{" "}
              <span className="text-foreground font-semibold">{peakDay.dayFull}s</span>{" "}
              around{" "}
              <span className="text-foreground font-semibold">{peakHour.hourLabel} UTC</span>
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Based on global player activity over the last 7 days. Times shown in UTC.
        </p>
      </CardContent>
    </Card>
  );
}
