"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Swords, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface SkillRating {
    score: number;
    label: string;
    global_rank?: number; // Added global rank
    breakdown: {
        skill_score?: number;
        obj_score?: number;
        exp_score?: number;
        // Old keys for backward comp (optional)
        kdr_score?: number;
        spm_score?: number;
        win_score?: number;
    };
}

// ... (RANK_THRESHOLDS and getRankIcon constants remain unchanged)


const RANK_THRESHOLDS = [
    { label: "Private (E-1)", minScore: 0, icon: "e1.png" },
    { label: "Private 1st Class (E-2)", minScore: 1350, icon: "e2.png" },
    { label: "PFC (E-3)", minScore: 2000, icon: "e3.png" },
    { label: "Corporal (E-4)", minScore: 2800, icon: "e4.png" },
    { label: "Sergeant (E-5)", minScore: 3500, icon: "e5.png" },
    { label: "Staff Sgt (E-6)", minScore: 4200, icon: "e6.png" },
    { label: "SFC (E-7)", minScore: 5300, icon: "e7.png" },
    { label: "Master Sgt (E-8)", minScore: 6300, icon: "e8_msg.png" },
    { label: "1st Sgt (E-8)", minScore: 7000, icon: "e8_1sg.png" },
    { label: "Sgt Major (E-9)", minScore: 7400, icon: "e9_sgm.png" },
    { label: "CSM (E-9)", minScore: 7600, icon: "e9_csm.png" },
    { label: "SMA (E-9)", minScore: 7800, icon: "e9_sma.png" },
    { label: "Warrant Officer 1 (WO1)", minScore: 8000, icon: "w1.png" },
    { label: "Chief Warrant Officer 2 (CW2)", minScore: 8150, icon: "w2.png" },
    { label: "Chief Warrant Officer 3 (CW3)", minScore: 8300, icon: "w3.png" },
    { label: "Chief Warrant Officer 4 (CW4)", minScore: 8450, icon: "w4.png" },
    { label: "Chief Warrant Officer 5 (CW5)", minScore: 8600, icon: "w5.png" },
    { label: "2nd Lt (O-1)", minScore: 8750, icon: "o1.png" },
    { label: "1st Lt (O-2)", minScore: 9400, icon: "o2.png" },
    { label: "Captain (O-3)", minScore: 10000, icon: "o3.png" },
    { label: "Major (O-4)", minScore: 11200, icon: "o4.png" },
    { label: "Lt Colonel (O-5)", minScore: 12400, icon: "o5.png" },
    { label: "Colonel (O-6)", minScore: 13700, icon: "o6.png" },
    { label: "Brigadier Gen (O-7)", minScore: 15300, icon: "o7.png" },
    { label: "Major Gen (O-8)", minScore: 17000, icon: "o8.png" },
    { label: "Lt Gen (O-9)", minScore: 18700, icon: "o9.png" },
    { label: "General (O-10)", minScore: 25000, icon: "o10.png" }
];

export function getRankIcon(rankLabel: string): string {
    const label = rankLabel.trim();
    // Enlisted
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
    // Warrant Officers
    if (label.includes("(WO1)")) return "w1.png";
    if (label.includes("(CW2)")) return "w2.png";
    if (label.includes("(CW3)")) return "w3.png";
    if (label.includes("(CW4)")) return "w4.png";
    if (label.includes("(CW5)")) return "w5.png";
    // Officers
    if (label.includes("(O-1)")) return "o1.png";
    if (label.includes("(O-2)")) return "o2.png";
    if (label.includes("(O-3)")) return "o3.png";
    if (label.includes("(O-4)")) return "o4.png";
    if (label.includes("(O-5)")) return "o5.png";
    if (label.includes("(O-6)")) return "o6.png";
    // Generals
    if (label.includes("(O-7)")) return "o7.png";
    if (label.includes("(O-8)")) return "o8.png";
    if (label.includes("(O-9)")) return "o9.png";
    if (label.includes("(O-10)")) return "o10.png";
    return "default_rank.png";
}

export function SkillRatingCard({ rating }: { rating: SkillRating | null }) {
    if (!rating) return null;

    // Calculate Progress to Next Rank
    const currentScore = rating.score;
    let nextRankIndex = RANK_THRESHOLDS.findIndex(r => r.minScore > currentScore);
    let prevRank = nextRankIndex > 0 ? RANK_THRESHOLDS[nextRankIndex - 1] : RANK_THRESHOLDS[0];
    let nextRank = nextRankIndex !== -1 ? RANK_THRESHOLDS[nextRankIndex] : null;

    // Handle Case: Player score higher than max defined threshold (General)
    if (nextRankIndex === -1 && currentScore >= RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1].minScore) {
        prevRank = RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1];
        nextRank = null; // Max rank achieved
    }

    let progressPercent = 100;
    if (nextRank) {
        const range = nextRank.minScore - prevRank.minScore;
        const progress = currentScore - prevRank.minScore;
        progressPercent = Math.min(100, Math.max(0, (progress / range) * 100));
    }

    return (
        <Card className="border-border/60 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Swords className="h-32 w-32" />
            </div>

            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle as="h2" className="flex items-center gap-2">
                        <Swords className="h-5 w-5 text-primary" />
                        Player Rank
                        {rating.global_rank && (
                            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                                Global #{rating.global_rank}
                            </Badge>
                        )}
                    </CardTitle>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
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
            <CardContent>
                <div className="flex items-center gap-4 mb-6">
                    {/* Placeholder for Icon - using a simple circle/badge for now if no image */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary/20 border border-border">
                        <span className="text-xl font-bold">{prevRank.label.split('(')[1]?.replace(')', '') || 'E-1'}</span>
                    </div>

                    <div className="flex flex-col flex-1">
                        <div className="flex items-baseline justify-between">
                            <div className="flex flex-col">
                                <span className="text-4xl font-extrabold tracking-tight">{rating.score.toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{rating.label}</span>
                            </div>
                            {nextRank && (
                                <span className="text-xs text-muted-foreground text-right">
                                    Next: {nextRank.label} <br />
                                    <span className="font-mono">{(nextRank.minScore - currentScore).toLocaleString()} pts to go</span>
                                </span>
                            )}
                        </div>

                        {/* Progress Bar to Next Rank */}
                        <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden mt-2">
                            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <BreakdownBar label="Skill Score" value={rating.breakdown?.skill_score ?? 0} color="bg-red-500" total={currentScore} />
                    <BreakdownBar label="Objective Score" value={rating.breakdown?.obj_score ?? 0} color="bg-blue-500" total={currentScore} />
                    <BreakdownBar label="Experience Score" value={rating.breakdown?.exp_score ?? 0} color="bg-green-500" total={currentScore} />
                </div>
            </CardContent>
        </Card>
    );
}

function BreakdownBar({ label, value, color, total }: { label: string, value: number, color: string, total: number }) {
    const percent = total > 0 ? (value / total) * 100 : 0;
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">+{value.toLocaleString()}</span>
            </div>
            <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                <div className={`${color} h-full`} style={{ width: `${Math.min(100, percent)}%` }} />
            </div>
        </div>
    );
}
