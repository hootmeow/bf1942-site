"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, XAxis, YAxis, Tooltip as ReTooltip, CartesianGrid, LineChart, Line, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

interface PlayerTimelineData {
    timestamp: string;
    score: number;
    kills: number;
    deaths: number;
}

interface RoundPlayerTimelineChartProps {
    playerScores: Record<string, PlayerTimelineData[]>;
}

const PLAYER_COLORS = [
    "#ef4444", // red
    "#3b82f6", // blue
    "#22c55e", // green
    "#f59e0b", // amber
    "#a855f7", // purple
];

export function RoundPlayerTimelineChart({ playerScores }: RoundPlayerTimelineChartProps) {
    const { chartData, playerNames } = useMemo(() => {
        if (!playerScores || Object.keys(playerScores).length === 0) {
            return { chartData: [], playerNames: [] };
        }

        const names = Object.keys(playerScores);

        // Build a unified timeline. Each data point has a time index and one score key per player.
        // First, collect all unique timestamps across all players
        const allTimestamps = new Set<string>();
        names.forEach(name => {
            playerScores[name].forEach(d => allTimestamps.add(d.timestamp));
        });

        const sortedTimestamps = [...allTimestamps].sort();

        // Build chart data array
        const data = sortedTimestamps.map((ts, index) => {
            const point: Record<string, any> = {
                time: index,
                label: new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            names.forEach(name => {
                // Find the closest score for this player at or before this timestamp
                const playerData = playerScores[name];
                const match = [...playerData].reverse().find(d => d.timestamp <= ts);
                point[name] = match ? match.score : 0;
            });
            return point;
        });

        return { chartData: data, playerNames: names };
    }, [playerScores]);

    if (chartData.length === 0 || playerNames.length === 0) return null;

    return (
        <Card className="border-border/60">
            <CardHeader>
                <CardTitle as="h3" className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Top Scorers Over Time
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis
                            dataKey="time"
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                            tickLine={false}
                            axisLine={{ stroke: "hsl(var(--border))" }}
                            interval="preserveStartEnd"
                            tickFormatter={(value) => {
                                const point = chartData[value];
                                return point?.label || '';
                            }}
                        />
                        <YAxis
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                            tickLine={false}
                            axisLine={{ stroke: "hsl(var(--border))" }}
                        />
                        <ReTooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                                fontSize: "12px",
                            }}
                            labelFormatter={(value) => {
                                const point = chartData[value];
                                return point?.label || '';
                            }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: "12px" }}
                        />
                        {playerNames.map((name, i) => (
                            <Line
                                key={name}
                                type="monotone"
                                dataKey={name}
                                stroke={PLAYER_COLORS[i % PLAYER_COLORS.length]}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
