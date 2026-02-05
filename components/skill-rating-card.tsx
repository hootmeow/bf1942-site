"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Swords, Info, TrendingUp, Target, Award } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface SkillRating {
    score: number;
    label: string;
    global_rank?: number;
    breakdown: {
        skill_score?: number;
        obj_score?: number;
        exp_score?: number;
        kdr_score?: number;
        spm_score?: number;
        win_score?: number;
    };
}

const RANK_THRESHOLDS = [
    { label: "Private (E-1)", minScore: 0, icon: "e1.png", tier: "enlisted" },
    { label: "Private 1st Class (E-2)", minScore: 7500, icon: "e2.png", tier: "enlisted" },
    { label: "PFC (E-3)", minScore: 10000, icon: "e3.png", tier: "enlisted" },
    { label: "Corporal (E-4)", minScore: 15000, icon: "e4.png", tier: "enlisted" },
    { label: "Sergeant (E-5)", minScore: 20000, icon: "e5.png", tier: "enlisted" },
    { label: "Staff Sgt (E-6)", minScore: 30000, icon: "e6.png", tier: "enlisted" },
    { label: "SFC (E-7)", minScore: 40000, icon: "e7.png", tier: "enlisted" },
    { label: "Master Sgt (E-8)", minScore: 50000, icon: "e8_msg.png", tier: "enlisted" },
    { label: "1st Sgt (E-8)", minScore: 60000, icon: "e8_1sg.png", tier: "enlisted" },
    { label: "Sgt Major (E-9)", minScore: 70000, icon: "e9_sgm.png", tier: "enlisted" },
    { label: "CSM (E-9)", minScore: 80000, icon: "e9_csm.png", tier: "enlisted" },
    { label: "SMA (E-9)", minScore: 90000, icon: "e9_sma.png", tier: "enlisted" },
    { label: "Warrant Officer 1 (WO1)", minScore: 100000, icon: "w1.png", tier: "warrant" },
    { label: "Chief Warrant Officer 2 (CW2)", minScore: 110000, icon: "w2.png", tier: "warrant" },
    { label: "Chief Warrant Officer 3 (CW3)", minScore: 120000, icon: "w3.png", tier: "warrant" },
    { label: "Chief Warrant Officer 4 (CW4)", minScore: 130000, icon: "w4.png", tier: "warrant" },
    { label: "Chief Warrant Officer 5 (CW5)", minScore: 140000, icon: "w5.png", tier: "warrant" },
    { label: "2nd Lt (O-1)", minScore: 150000, icon: "o1.png", tier: "officer" },
    { label: "1st Lt (O-2)", minScore: 160000, icon: "o2.png", tier: "officer" },
    { label: "Captain (O-3)", minScore: 170000, icon: "o3.png", tier: "officer" },
    { label: "Major (O-4)", minScore: 180000, icon: "o4.png", tier: "officer" },
    { label: "Lt Colonel (O-5)", minScore: 190000, icon: "o5.png", tier: "officer" },
    { label: "Colonel (O-6)", minScore: 200000, icon: "o6.png", tier: "officer" },
    { label: "Brigadier Gen (O-7)", minScore: 215000, icon: "o7.png", tier: "general" },
    { label: "Major Gen (O-8)", minScore: 230000, icon: "o8.png", tier: "general" },
    { label: "Lt Gen (O-9)", minScore: 240000, icon: "o9.png", tier: "general" },
    { label: "General (O-10)", minScore: 250000, icon: "o10.png", tier: "general" }
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

    // Calculate breakdown percentages
    const skillScore = rating.breakdown?.skill_score ?? 0;
    const objScore = rating.breakdown?.obj_score ?? 0;
    const expScore = rating.breakdown?.exp_score ?? 0;
    const breakdownTotal = skillScore + objScore + expScore;

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
                                <p className="font-semibold mb-2">Rank Score (XP)</p>
                                <p className="text-xs text-muted-foreground mb-2">Your rank never drops. Earn Career XP for every action:</p>
                                <ul className="text-xs list-disc pl-4 space-y-1">
                                    <li><b>Combat:</b> 10 XP per Kill</li>
                                    <li><b>Objective:</b> 20 XP per Flag Capture, Defense, or Assist</li>
                                    <li><b>Service:</b> 100 XP for every Round Completed</li>
                                </ul>
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
                                        {(nextRank.minScore - currentScore).toLocaleString()} XP to go
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

                {/* Score breakdown */}
                <div className="grid grid-cols-3 gap-3">
                    <ScoreBreakdownCard
                        label="Combat XP"
                        value={skillScore}
                        icon={Target}
                        color="red"
                        percent={breakdownTotal > 0 ? (skillScore / breakdownTotal) * 100 : 0}
                    />
                    <ScoreBreakdownCard
                        label="Objective XP"
                        value={objScore}
                        icon={Award}
                        color="blue"
                        percent={breakdownTotal > 0 ? (objScore / breakdownTotal) * 100 : 0}
                    />
                    <ScoreBreakdownCard
                        label="Service XP"
                        value={expScore}
                        icon={TrendingUp}
                        color="green"
                        percent={breakdownTotal > 0 ? (expScore / breakdownTotal) * 100 : 0}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

function ScoreBreakdownCard({
    label,
    value,
    icon: Icon,
    color,
    percent
}: {
    label: string;
    value: number;
    icon: React.ElementType;
    color: "red" | "blue" | "green";
    percent: number;
}) {
    const colorStyles = {
        red: { bg: "bg-red-500/10", text: "text-red-500", bar: "bg-gradient-to-r from-red-500 to-red-400" },
        blue: { bg: "bg-blue-500/10", text: "text-blue-500", bar: "bg-gradient-to-r from-blue-500 to-blue-400" },
        green: { bg: "bg-green-500/10", text: "text-green-500", bar: "bg-gradient-to-r from-green-500 to-green-400" },
    };

    const styles = colorStyles[color];

    return (
        <div className="rounded-lg border border-border/40 bg-card/30 p-3">
            <div className="flex items-center gap-2 mb-2">
                <div className={cn("p-1 rounded-md", styles.bg)}>
                    <Icon className={cn("h-3.5 w-3.5", styles.text)} />
                </div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
            </div>
            <div className={cn("text-lg font-bold tabular-nums", styles.text)}>
                +{value.toLocaleString()}
            </div>
            <div className="mt-2 h-1 w-full rounded-full bg-muted/30 overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all", styles.bar)}
                    style={{ width: `${Math.min(100, percent)}%` }}
                />
            </div>
            <div className="text-[10px] text-muted-foreground mt-1 tabular-nums">{percent.toFixed(0)}% of total</div>
        </div>
    );
}
