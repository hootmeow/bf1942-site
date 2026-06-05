
"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Star, Shield, Zap, Medal, Trophy, Crosshair, Clock, Users } from "lucide-react";

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

const TIER_CONFIG = {
    Bronze: {
        card: "border-orange-700/40 bg-gradient-to-b from-orange-950/40 to-orange-950/10",
        glow: "",
        badge: "text-orange-400 border-orange-500/30 bg-orange-500/10",
        label: "text-orange-400/70",
        dot: "bg-orange-500",
        rank: 1,
    },
    Silver: {
        card: "border-slate-500/40 bg-gradient-to-b from-slate-800/30 to-slate-900/10",
        glow: "",
        badge: "text-slate-300 border-slate-400/30 bg-slate-400/10",
        label: "text-slate-400/70",
        dot: "bg-slate-400",
        rank: 2,
    },
    Gold: {
        card: "border-yellow-600/40 bg-gradient-to-b from-yellow-950/40 to-yellow-950/10",
        glow: "",
        badge: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
        label: "text-yellow-400/70",
        dot: "bg-yellow-500",
        rank: 3,
    },
    Legend: {
        card: "border-purple-500/50 bg-gradient-to-b from-purple-950/50 to-purple-950/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]",
        glow: "after:absolute after:inset-0 after:rounded-lg after:bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.12),transparent_70%)] after:pointer-events-none",
        badge: "text-purple-300 border-purple-500/40 bg-purple-500/15",
        label: "text-purple-400/70",
        dot: "bg-purple-500",
        rank: 4,
    },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    performance: Zap,
    efficiency: Crosshair,
    strategy: Medal,
    consistency: Shield,
    milestone: Trophy,
    time: Clock,
    social: Users,
    default: Star,
};

const TIER_ORDER: Array<Achievement["tier"]> = ["Legend", "Gold", "Silver", "Bronze"];

export function AchievementsList({ achievements }: AchievementsListProps) {
    if (!achievements || achievements.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-border/50 bg-muted/10 flex flex-col items-center justify-center gap-2 py-14 text-muted-foreground/50">
                <Trophy className="h-8 w-8 opacity-40" />
                <p className="text-sm">No achievements earned yet.</p>
            </div>
        );
    }

    const sorted = [...achievements].sort((a, b) => {
        const ra = TIER_CONFIG[a.tier]?.rank ?? 0;
        const rb = TIER_CONFIG[b.tier]?.rank ?? 0;
        if (ra !== rb) return rb - ra;
        return new Date(b.achieved_at).getTime() - new Date(a.achieved_at).getTime();
    });

    const countByTier = TIER_ORDER.reduce<Record<string, number>>((acc, tier) => {
        acc[tier] = sorted.filter(a => a.tier === tier).length;
        return acc;
    }, {});

    return (
        <div className="space-y-4">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    Achievements
                    <span className="text-muted-foreground font-normal text-sm">({sorted.length})</span>
                </h3>
                <div className="flex items-center gap-1.5">
                    {TIER_ORDER.map(tier => {
                        const count = countByTier[tier];
                        if (!count) return null;
                        const cfg = TIER_CONFIG[tier];
                        return (
                            <span key={tier} className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", cfg.badge)}>
                                {tier[0]} ×{count}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Grid */}
            <TooltipProvider delayDuration={100}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
                    {sorted.map((ach) => {
                        const Icon = CATEGORY_ICONS[ach.category] ?? CATEGORY_ICONS.default;
                        const cfg = TIER_CONFIG[ach.tier] ?? TIER_CONFIG.Bronze;

                        return (
                            <Tooltip key={ach.achievement_id}>
                                <TooltipTrigger asChild>
                                    <div className={cn(
                                        "relative group flex flex-col items-center gap-2.5 p-3 rounded-lg border cursor-default",
                                        "transition-all duration-200 hover:scale-[1.03] hover:brightness-110",
                                        cfg.card,
                                        cfg.glow,
                                    )}>
                                        {/* Tier dot */}
                                        <span className={cn("absolute top-2 right-2 h-1.5 w-1.5 rounded-full", cfg.dot)} />

                                        {/* Image or icon */}
                                        {ach.image_url ? (
                                            <div className="w-[80px] h-[32px] rounded overflow-hidden bg-black/30 border border-white/5 shadow-inner">
                                                <img
                                                    src={ach.image_url}
                                                    alt={ach.name}
                                                    className="w-full h-full object-fill"
                                                    loading="lazy"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                                />
                                            </div>
                                        ) : (
                                            <div className={cn("p-2 rounded bg-background/40 border border-white/5")}>
                                                <Icon className="h-5 w-5 text-foreground/70" />
                                            </div>
                                        )}

                                        {/* Name + tier */}
                                        <div className="text-center space-y-0.5 w-full">
                                            <p className="text-[11px] font-semibold text-foreground leading-tight line-clamp-2">
                                                {ach.name === "Centurion" ? "Recruit" : ach.name}
                                            </p>
                                            <p className={cn("text-[9px] uppercase tracking-widest font-bold", cfg.label)}>
                                                {ach.tier}
                                            </p>
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="w-60 p-3.5 space-y-2.5 bg-popover border-border">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="font-semibold text-sm text-foreground leading-snug">
                                            {ach.name === "Centurion" ? "Recruit" : ach.name}
                                        </p>
                                        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 mt-0.5", cfg.badge)}>
                                            {ach.tier}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{ach.description}</p>
                                    <div className="pt-2 border-t border-border/50 space-y-1 text-[10px] text-muted-foreground">
                                        <div className="flex justify-between">
                                            <span>Earned</span>
                                            <span className="text-foreground">{new Date(ach.achieved_at).toLocaleDateString()}</span>
                                        </div>
                                        {ach.value_at_achievement && (
                                            <div className="flex justify-between font-mono">
                                                <span>Value</span>
                                                <span className="text-foreground">{ach.value_at_achievement}</span>
                                            </div>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            </TooltipProvider>
        </div>
    );
}
