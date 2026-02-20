"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Swords, Info, TrendingUp, Target, Award, Crosshair, Zap, Trophy, Map as MapIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface SkillRating {
    score: number;
    label: string;
    global_rank?: number;
    breakdown: {
        obj_r?: number;
        kdr_norm?: number;
        kpm_norm?: number;
        wr_norm?: number;
        mp_norm?: number;
        spr_norm?: number;
    };
}

const RANK_THRESHOLDS = [
    { label: "Private (E-1)", minScore: 0, icon: "e1.png", tier: "enlisted" },
    { label: "PFC (E-2)", minScore: 100, icon: "e2.png", tier: "enlisted" },
    { label: "PFC (E-3)", minScore: 200, icon: "e3.png", tier: "enlisted" },
    { label: "Corporal (E-4)", minScore: 300, icon: "e4.png", tier: "enlisted" },
    { label: "Sergeant (E-5)", minScore: 400, icon: "e5.png", tier: "enlisted" },
    { label: "Staff Sgt (E-6)", minScore: 500, icon: "e6.png", tier: "enlisted" },
    { label: "SFC (E-7)", minScore: 600, icon: "e7.png", tier: "enlisted" },
    { label: "Master Sgt (E-8)", minScore: 700, icon: "e8_msg.png", tier: "enlisted" },
    { label: "1st Sgt (E-8)", minScore: 800, icon: "e8_1sg.png", tier: "enlisted" },
    { label: "Sgt Major (E-9)", minScore: 900, icon: "e9_sgm.png", tier: "enlisted" },
    { label: "CSM (E-9)", minScore: 1000, icon: "e9_csm.png", tier: "enlisted" },
    { label: "SMA (E-9)", minScore: 1050, icon: "e9_sma.png", tier: "enlisted" },
    { label: "Warrant Officer 1 (WO1)", minScore: 1100, icon: "w1.png", tier: "warrant" },
    { label: "CWO 2 (CW2)", minScore: 1150, icon: "w2.png", tier: "warrant" },
    { label: "CWO 3 (CW3)", minScore: 1200, icon: "w3.png", tier: "warrant" },
    { label: "CWO 4 (CW4)", minScore: 1250, icon: "w4.png", tier: "warrant" },
    { label: "CWO 5 (CW5)", minScore: 1300, icon: "w5.png", tier: "warrant" },
    { label: "2nd Lt (O-1)", minScore: 1400, icon: "o1.png", tier: "officer" },
    { label: "1st Lt (O-2)", minScore: 1500, icon: "o2.png", tier: "officer" },
    { label: "Captain (O-3)", minScore: 1600, icon: "o3.png", tier: "officer" },
    { label: "Major (O-4)", minScore: 1700, icon: "o4.png", tier: "officer" },
    { label: "Lt Colonel (O-5)", minScore: 1750, icon: "o5.png", tier: "officer" },
    { label: "Colonel (O-6)", minScore: 1800, icon: "o6.png", tier: "officer" },
    { label: "Brigadier Gen (O-7)", minScore: 1850, icon: "o7.png", tier: "general" },
    { label: "Major Gen (O-8)", minScore: 1900, icon: "o8.png", tier: "general" },
    { label: "Lt Gen (O-9)", minScore: 1950, icon: "o9.png", tier: "general" },
    { label: "General (O-10)", minScore: 1975, icon: "o10.png", tier: "general" }
];

const TIER_COLORS = {
    enlisted: { bg: "bg-slate-500/10", border: "border-slate-500/30", text: "text-slate-400" },
    warrant: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-500" },
    officer: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-500" },
    general: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-500" },
};

export function getRankIcon(rankLabel: string): string {
    const label = rankLabel.trim();
    if (label.includes("(E-1)")) return "e1.png";
    if (label.includes("(E-2)")) return "e2.png";
    if (label.includes("(E-3)")) return "e3.png";
    if (label.includes("(E-4)")) return "e4.png";
    if (label.includes("(E-5)")) return "e5.png";
    if (label.includes("(E-6)")) return "e6.png";
    if (label.includes("(E-7)")) return "e7.png";
    if (label.includes("First Sergeant")) return "e8_1sg.png";
    if (label.includes("(E-8)")) return "e8_msg.png";
    if (label.includes("Sergeant Major of the Army")) return "e9_sma.png";
    if (label.includes("Command Sergeant Major")) return "e9_csm.png";
    if (label.includes("(E-9)")) return "e9_sgm.png";
    if (label.includes("(WO1)")) return "w1.png";
    if (label.includes("(CW2)")) return "w2.png";
    if (label.includes("(CW3)")) return "w3.png";
    if (label.includes("(CW4)")) return "w4.png";
    if (label.includes("(CW5)")) return "w5.png";
    if (label.includes("(O-1)")) return "o1.png";
    if (label.includes("(O-2)")) return "o2.png";
    if (label.includes("(O-3)")) return "o3.png";
    if (label.includes("(O-4)")) return "o4.png";
    if (label.includes("(O-5)")) return "o5.png";
    if (label.includes("(O-6)")) return "o6.png";
    if (label.includes("(O-7)")) return "o7.png";
    if (label.includes("(O-8)")) return "o8.png";
    if (label.includes("(O-9)")) return "o9.png";
    if (label.includes("(O-10)")) return "o10.png";
    return "default_rank.png";
}

export function SkillRatingCard({ rating }: { rating: SkillRating | null }) {
    if (!rating) return null;

    const currentScore = rating.score;
    let nextRankIndex = RANK_THRESHOLDS.findIndex(r => r.minScore > currentScore);
    let prevRank = nextRankIndex > 0 ? RANK_THRESHOLDS[nextRankIndex - 1] : RANK_THRESHOLDS[0];
    let nextRank = nextRankIndex !== -1 ? RANK_THRESHOLDS[nextRankIndex] : null;

    if (nextRankIndex === -1 && currentScore >= RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1].minScore) {
        prevRank = RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1];
        nextRank = null;
    }

    let progressPercent = 100;
    if (nextRank) {
        const range = nextRank.minScore - prevRank.minScore;
        const progress = currentScore - prevRank.minScore;
        progressPercent = Math.min(100, Math.max(0, (progress / range) * 100));
    }

    const tierColors = TIER_COLORS[prevRank.tier as keyof typeof TIER_COLORS] || TIER_COLORS.enlisted;
    const rankCode = prevRank.label.split('(')[1]?.replace(')', '') || 'E-1';

    // RP breakdown components (normalized 0-1 from backend)
    const breakdown = rating.breakdown || {};

    const components = [
        { label: "Objective/R", weight: 30, value: breakdown.obj_r ?? 0, icon: Target, color: "orange" as const },
        { label: "KDR", weight: 25, value: breakdown.kdr_norm ?? 0, icon: Crosshair, color: "red" as const },
        { label: "Kills/Min", weight: 20, value: breakdown.kpm_norm ?? 0, icon: Zap, color: "yellow" as const },
        { label: "Win Rate", weight: 10, value: breakdown.wr_norm ?? 0, icon: Trophy, color: "green" as const },
        { label: "Map Variety", weight: 10, value: breakdown.mp_norm ?? 0, icon: MapIcon, color: "blue" as const },
        { label: "Score/Round", weight: 5, value: breakdown.spr_norm ?? 0, icon: TrendingUp, color: "purple" as const },
    ];

    return (
        <Card className="border-border/60 relative overflow-hidden">
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                <Award className="h-40 w-40" />
            </div>

            <CardHeader className="pb-2 relative">
                <div className="flex items-center justify-between">
                    <CardTitle as="h2" className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                            <Swords className="h-5 w-5 text-primary" />
                        </div>
                        Player Rank
                    </CardTitle>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button className="p-1.5 rounded-md hover:bg-muted/50 transition-colors">
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[320px]">
                                <p className="font-semibold mb-2">Rating Points (RP)</p>
                                <p className="text-xs text-muted-foreground mb-2">RP measures skill on a 0–2,000 scale. Coop rounds are excluded. Components:</p>
                                <ul className="text-xs list-disc pl-4 space-y-1">
                                    <li><b>Objective/Round (30%):</b> Flag caps, defenses per round</li>
                                    <li><b>KDR (25%):</b> Kill/Death ratio</li>
                                    <li><b>Kills/Min (20%):</b> Combat tempo</li>
                                    <li><b>Win Rate (10%):</b> Rounds won</li>
                                    <li><b>Map Variety (10%):</b> Unique maps played</li>
                                    <li><b>Score/Round (5%):</b> Average score</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-2">Requires 3+ ranked rounds, active in last 60 days. Coop rounds excluded. Full credit at 30+ rounds.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>

            <CardContent className="relative">
                {/* Main rank display */}
                <div className="flex items-center gap-5 mb-6">
                    {/* Rank badge */}
                    <div className={cn(
                        "flex h-20 w-20 items-center justify-center rounded-xl border-2 transition-colors",
                        tierColors.bg, tierColors.border
                    )}>
                        <span className={cn("text-2xl font-bold", tierColors.text)}>{rankCode}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-4xl font-extrabold tracking-tight tabular-nums">
                                    {rating.score.toLocaleString()}
                                    <span className="text-lg font-normal text-muted-foreground ml-1">RP</span>
                                </div>
                                <div className={cn("text-sm font-semibold uppercase tracking-wider", tierColors.text)}>
                                    {rating.label}
                                </div>
                            </div>
                            {nextRank && (
                                <div className="text-right shrink-0">
                                    <div className="text-xs text-muted-foreground">Next Rank</div>
                                    <div className="text-sm font-medium text-foreground">{nextRank.label.split('(')[0].trim()}</div>
                                    <div className="text-xs text-muted-foreground font-mono">
                                        {(nextRank.minScore - currentScore).toLocaleString()} RP to go
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>{prevRank.label.split('(')[0].trim()}</span>
                                <span>{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-muted/40 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-700 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score breakdown — 3x2 grid */}
                <div className="grid grid-cols-3 gap-3">
                    {components.map((comp) => (
                        <RPBreakdownCard
                            key={comp.label}
                            label={comp.label}
                            value={comp.value}
                            weight={comp.weight}
                            icon={comp.icon}
                            color={comp.color}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function RPBreakdownCard({
    label,
    value,
    weight,
    icon: Icon,
    color,
}: {
    label: string;
    value: number;
    weight: number;
    icon: React.ElementType;
    color: "orange" | "red" | "yellow" | "green" | "blue" | "purple";
}) {
    const colorStyles = {
        orange: { bg: "bg-orange-500/10", text: "text-orange-500", bar: "bg-gradient-to-r from-orange-500 to-orange-400" },
        red: { bg: "bg-red-500/10", text: "text-red-500", bar: "bg-gradient-to-r from-red-500 to-red-400" },
        yellow: { bg: "bg-yellow-500/10", text: "text-yellow-500", bar: "bg-gradient-to-r from-yellow-500 to-yellow-400" },
        green: { bg: "bg-green-500/10", text: "text-green-500", bar: "bg-gradient-to-r from-green-500 to-green-400" },
        blue: { bg: "bg-blue-500/10", text: "text-blue-500", bar: "bg-gradient-to-r from-blue-500 to-blue-400" },
        purple: { bg: "bg-purple-500/10", text: "text-purple-500", bar: "bg-gradient-to-r from-purple-500 to-purple-400" },
    };

    const styles = colorStyles[color];
    const percent = Math.round(value * 100);
    const rpContribution = Math.round(value * weight * 20); // weight% of 2000

    return (
        <div className="rounded-lg border border-border/40 bg-card/30 p-3">
            <div className="flex items-center gap-2 mb-2">
                <div className={cn("p-1 rounded-md", styles.bg)}>
                    <Icon className={cn("h-3.5 w-3.5", styles.text)} />
                </div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
            </div>
            <div className={cn("text-lg font-bold tabular-nums", styles.text)}>
                {percent}%
            </div>
            <div className="mt-2 h-1 w-full rounded-full bg-muted/30 overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all", styles.bar)}
                    style={{ width: `${Math.min(100, percent)}%` }}
                />
            </div>
            <div className="text-[10px] text-muted-foreground mt-1 tabular-nums">
                {weight}% weight &middot; +{rpContribution} RP
            </div>
        </div>
    );
}
