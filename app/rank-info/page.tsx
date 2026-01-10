import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Swords, Flag, Clock, Medal } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Rank Info - BF1942 Stats",
    description: "Learn how the BF1942 Skill Rating and Rank system works.",
};

export default function RankInfoPage() {
    return (
        <div className="container py-6 md:py-10 space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Rank Score & XP System</h1>
                <p className="text-muted-foreground text-lg">
                    Understanding how your career rank is calculated.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Core Concept */}
                <Card className="border-border/60 bg-card/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Medal className="h-6 w-6 text-primary" />
                            How Ranking Works
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-relaxed">
                            Unlike K/D ratio, your <b>Rank Score</b> represents your total career contribution.
                            It is cumulative and will <b>only ever go up</b>. This system is designed to reward dedication and teamplay over time.
                        </p>
                    </CardContent>
                </Card>

                {/* Earning XP Section */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Combat XP */}
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Swords className="h-5 w-5 text-red-500" />
                                Combat XP
                            </CardTitle>
                            <CardDescription>
                                10 XP
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>Awarded for every neutralizer eliminated.</p>
                            <div className="p-2 bg-muted rounded font-mono text-xs">
                                Calculation: Total Kills × 10
                            </div>
                        </CardContent>
                    </Card>

                    {/* Objective XP */}
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Flag className="h-5 w-5 text-blue-500" />
                                Objective XP
                            </CardTitle>
                            <CardDescription>
                                20 XP
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>Awarded for playing the objective (Capturing flags, Defending bases, Team Assists).</p>
                            <div className="p-2 bg-muted rounded font-mono text-xs">
                                Calculation: (Score - Kills) × 20
                            </div>
                        </CardContent>
                    </Card>

                    {/* Service XP */}
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-green-500" />
                                Service XP
                            </CardTitle>
                            <CardDescription>
                                100 XP
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>Awarded for dedication. Simply finishing a round grants a large bonus.</p>
                            <div className="p-2 bg-muted rounded font-mono text-xs">
                                Calculation: Rounds Played × 100
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Philosophy */}
                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>Why this system?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-relaxed text-muted-foreground">
                            This ensures that dedicated support players (who capture flags) and veteran soldiers (who play every night)
                            can achieve the highest rank of General, even without a perfect K/D ratio. It prioritizes time in service and objective play alongside raw combat skill.
                        </p>
                        <div className="mt-8 pt-6 border-t border-border/40 text-center">
                            <p className="text-sm font-medium text-muted-foreground">Leaderboards coming soon...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
