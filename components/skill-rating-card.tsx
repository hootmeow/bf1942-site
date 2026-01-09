"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Swords, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface SkillRating {
    score: number;
    label: string;
    breakdown: {
        kdr_score: number;
        spm_score: number;
        win_score: number;
    };
}

const RANK_COLORS: Record<string, string> = {
    "Provisional": "bg-gray-500 text-white hover:bg-gray-600",
    "Private": "bg-stone-500 text-white hover:bg-stone-600",
    "Sergeant": "bg-green-600 text-white hover:bg-green-700",
    "Lieutenant": "bg-blue-600 text-white hover:bg-blue-700",
    "General": "bg-amber-500 text-white hover:bg-amber-600"
};

export function SkillRatingCard({ rating }: { rating: SkillRating | null }) {
    if (!rating) return null;

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
                        BF Rating
                    </CardTitle>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[300px]">
                                <p className="font-semibold mb-1">How it works</p>
                                <p className="text-xs">
                                    A composite score calculated from KDR (max 5.0), Score Per Minute, and Win Rate.
                                    <br /><br />
                                    Formula: <code>(KDR*400) + (SPM*5) + (Win%*200)</code>
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex flex-col">
                        <span className="text-4xl font-extrabold tracking-tight">{rating.score.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Skill Score</span>
                    </div>
                    <Badge className={`text-sm px-3 py-1 ${RANK_COLORS[rating.label] || "bg-primary"}`}>
                        {rating.label}
                    </Badge>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Combat (KDR)</span>
                        <span className="font-medium">+{rating.breakdown.kdr_score}</span>
                    </div>
                    <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full" style={{ width: `${Math.min(100, (rating.breakdown.kdr_score / 2000) * 100)}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Objective (SPM)</span>
                        <span className="font-medium">+{rating.breakdown.spm_score}</span>
                    </div>
                    <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: `${Math.min(100, (rating.breakdown.spm_score / 1000) * 100)}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Victory (Win %)</span>
                        <span className="font-medium">+{rating.breakdown.win_score}</span>
                    </div>
                    <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{ width: `${Math.min(100, (rating.breakdown.win_score / 200) * 100)}%` }} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
