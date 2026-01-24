
"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Star, Shield, Zap, Medal, Trophy, Crosshair, Clock, Users, Info } from "lucide-react";

export interface Achievement {
    achievement_id: string;
    name: string;
    description: string;
    tier: "Bronze" | "Silver" | "Gold" | "Legend";
    category: string;
    achieved_at: string;
    value_at_achievement: string;
    image_url?: string;
}

interface AchievementsListProps {
    achievements: Achievement[];
}

const TIER_COLORS = {
    Bronze: "text-orange-500 border-orange-500/20 bg-orange-500/10",
    Silver: "text-slate-400 border-slate-400/20 bg-slate-400/10",
    Gold: "text-yellow-500 border-yellow-500/20 bg-yellow-500/10",
    Legend: "text-purple-500 border-purple-500/20 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
};

const CATEGORY_ICONS: Record<string, any> = {
    performance: Zap,
    efficiency: Crosshair,
    strategy: Medal,
    consistency: Shield,
    milestone: Trophy,
    time: Clock,
    social: Users,
    default: Star,
};

export function AchievementsList({ achievements }: AchievementsListProps) {
    if (!achievements || achievements.length === 0) {
        return (
            <Card className="border-border/60">
                <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6 text-muted-foreground text-sm">
                    No achievements earned yet.
                </CardContent>
            </Card>
        );
    }

    // Pre-sort achievements: Legend > Gold > Silver > Bronze, then desc date
    const TIER_RANK = { Legend: 4, Gold: 3, Silver: 2, Bronze: 1 };

    const sorted = [...achievements].sort((a, b) => {
        const rankA = TIER_RANK[a.tier] || 0;
        const rankB = TIER_RANK[b.tier] || 0;
        if (rankA !== rankB) return rankB - rankA;
        return new Date(b.achieved_at).getTime() - new Date(a.achieved_at).getTime();
    });

    return (
        <Card className="border-border/60">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle>Achievements ({sorted.length})</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-[200px] text-xs">
                                        Earn these medals by meeting specific criteria in-game. Some track lifetime stats, others single-round feats.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="flex gap-2 text-xs">
                        {Object.entries(TIER_COLORS).map(([tier, colorClass]) => {
                            const count = sorted.filter(a => a.tier === tier).length;
                            if (count === 0) return null;
                            return (
                                <Badge key={tier} variant="outline" className={cn("font-normal border", colorClass.split(' ')[0], colorClass.split(' ')[1])}>
                                    {tier}: {count}
                                </Badge>
                            );
                        })}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {sorted.map((ach) => {
                        const Icon = CATEGORY_ICONS[ach.category] || CATEGORY_ICONS.default;
                        const tierStyle = TIER_COLORS[ach.tier] || TIER_COLORS.Bronze;

                        return (
                            <TooltipProvider key={ach.achievement_id}>
                                <Tooltip delayDuration={100}>
                                    <TooltipTrigger asChild>
                                        <div className={cn(
                                            "group relative flex flex-col items-center justify-center p-4 rounded-lg border transition-all hover:bg-muted/50 text-center gap-2 cursor-pointer",
                                            tierStyle
                                        )}>
                                            {ach.image_url ? (
                                                <div className="w-[82px] h-[32px] rounded-sm overflow-hidden shadow-md bg-background/50">
                                                    <img src={ach.image_url} alt={ach.name} className="w-full h-full object-fill" />
                                                </div>
                                            ) : (
                                                <div className={cn("p-2 rounded-sm bg-background/50 shadow-sm")}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                            )}

                                            <div className="space-y-0.5">
                                                <h4 className="font-semibold text-sm leading-tight text-foreground">
                                                    {ach.name === "Centurion" ? "Recruit" : ach.name}
                                                </h4>
                                                <span className="text-[10px] uppercase tracking-wider opacity-80 font-medium">
                                                    {ach.tier}
                                                </span>
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="w-64 p-4 space-y-2">
                                        <div className="space-y-1">
                                            <p className="font-semibold text-sm text-foreground flex items-center justify-between">
                                                {ach.name}
                                                <span className={cn("text-[10px] px-1.5 py-0.5 rounded border ml-2", tierStyle)}>
                                                    {ach.tier}
                                                </span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">{ach.description}</p>
                                        </div>

                                        <div className="pt-2 border-t border-border/50 flex flex-col gap-1 text-[10px] text-muted-foreground">
                                            <div className="flex justify-between">
                                                <span>Achieved:</span>
                                                <span>{new Date(ach.achieved_at).toLocaleDateString()}</span>
                                            </div>
                                            {ach.value_at_achievement && (
                                                <div className="flex justify-between font-mono">
                                                    <span>Stat:</span>
                                                    <span className="text-foreground">{ach.value_at_achievement}</span>
                                                </div>
                                            )}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
