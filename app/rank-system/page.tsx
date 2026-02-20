import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Swords, Flag, Clock, Medal, Trophy, AlertTriangle, Info } from "lucide-react";

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "How Ranking Works",
    description: "Detailed breakdown of the BF1942 RP Rating System.",
};

export default function RankSystemPage() {
    return (
        <div className="container py-6 md:py-10 space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Ranking System</h1>
                <p className="text-muted-foreground text-lg">
                    Understanding how your Rating Points (RP) are calculated.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Core Concept */}
                <Card className="border-border/60 bg-card/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Medal className="h-6 w-6 text-primary" />
                            How RP Works
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="leading-relaxed">
                            Your <b>Rating Points (RP)</b> measure skill on a <b>0–2,000</b> scale. Unlike a cumulative grind score,
                            RP is rate-based — it rewards how well you play, not just how much you play. Each component is normalized
                            against the 95th percentile of the eligible player population, so your score reflects your standing relative to other active players.
                        </p>
                        <p className="leading-relaxed text-muted-foreground">
                            Co-op (bot) rounds are automatically excluded from RP calculations.
                        </p>
                    </CardContent>
                </Card>

                {/* RP Components */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Flag className="h-5 w-5 text-orange-500" />
                                Objective / Round
                            </CardTitle>
                            <CardDescription>30% weight</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>Objective score per round — flag captures, defenses, and team assists. Calculated as (Score - Kills) / Rounds.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Swords className="h-5 w-5 text-red-500" />
                                Kill/Death Ratio
                            </CardTitle>
                            <CardDescription>25% weight</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>Your overall KDR across all ranked rounds. Higher KDR means more efficient combat.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-yellow-500" />
                                Kills / Minute
                            </CardTitle>
                            <CardDescription>20% weight</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>Combat tempo — how quickly you eliminate enemies relative to round duration.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-green-500" />
                                Win Rate
                            </CardTitle>
                            <CardDescription>10% weight</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>Percentage of rounds where your team won. Rewards teamplay and choosing the right moments.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Medal className="h-5 w-5 text-blue-500" />
                                Map Variety
                            </CardTitle>
                            <CardDescription>10% weight</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>Number of distinct maps played. Encourages versatility across different battlefields.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Info className="h-5 w-5 text-purple-500" />
                                Score / Round
                            </CardTitle>
                            <CardDescription>5% weight</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>Average total score per round. A general measure of overall impact each game.</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Eligibility */}
                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>Eligibility</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="leading-relaxed text-muted-foreground">
                            To appear on the leaderboard and receive an RP score, you must meet these criteria:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                            <li><b>3+ ranked rounds</b> played (with at least 1 kill or 1 death each)</li>
                            <li><b>Active in the last 60 days</b></li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Important Notes & Warnings */}
                <div className="space-y-4">
                    <Card className="border-yellow-500/50 bg-yellow-500/5">
                        <CardHeader>
                            <CardTitle className="text-yellow-600 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Important Notes on Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-yellow-600/90">
                            <p>
                                <strong>Co-op (Bot) Rounds:</strong> Rounds played on Coop gametype servers are automatically marked as <u>unranked</u> and excluded from RP calculations.
                            </p>
                            <p>
                                <strong>Ranked Game Modes:</strong> Conquest, Team Deathmatch, and Capture the Flag (CTF) rounds all contribute to your ranking.
                            </p>
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-600">
                                <strong className="block mb-1 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    WARNING: Zero Tolerance Policy
                                </strong>
                                <p>
                                    Stats padding and manipulation (e.g. killing bots/AFK players, empty server farming, or using server-side mods to artificially inflate scores) will <strong>not be tolerated</strong>.
                                    Engaging in such behavior will result in your <strong>server and/or username being permanently blacklisted</strong> from the global ranking system.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Achievements List */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold tracking-tight">Earnable Achievements</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ALL_ACHIEVEMENTS.map((ach) => (
                            <Card key={ach.name} className="border-border/60 overflow-hidden hover:bg-muted/50 transition-colors">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="shrink-0 w-[82px] h-[32px] bg-background/50 rounded-sm overflow-hidden shadow-sm border border-border/50">
                                        <img
                                            src={`/images/achievements/${ach.image}`}
                                            alt={ach.name}
                                            className="w-full h-full object-fill"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-sm leading-none">{ach.name}</h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{ach.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const ALL_ACHIEVEMENTS = [
    // Kill Streaks
    { name: "Kill Streak 5", image: "kill_streak_5.png", description: "Achieve 5 kills in a single life without dying." },
    { name: "Kill Streak 10", image: "kill_streak_10.png", description: "Achieve 10 kills in a single life without dying." },
    { name: "Kill Streak 15", image: "kill_streak_15.png", description: "Achieve 15 kills in a single life without dying." },
    { name: "Kill Streak 20", image: "kill_streak_20.png", description: "Achieve 20 kills in a single life without dying." },
    { name: "Kill Streak 25", image: "kill_streak_25.png", description: "Achieve 25 kills in a single life without dying." },
    { name: "Kill Streak 30", image: "kill_streak_30.png", description: "Achieve 30 kills in a single life without dying." },
    { name: "Kill Streak 50", image: "kill_streak_50.png", description: "Achieve 50 kills in a single life without dying." },

    // Total Kills Milestones
    { name: "Killer 100", image: "total_kills_100.png", description: "Reach 100 total lifetime kills." },
    { name: "Killer 500", image: "total_kills_500.png", description: "Reach 500 total lifetime kills." },
    { name: "Killer 1,000", image: "total_kills_1000.png", description: "Reach 1,000 total lifetime kills." },
    { name: "Killer 2,500", image: "total_kills_2500.png", description: "Reach 2,500 total lifetime kills." },
    { name: "Killer 5,000", image: "total_kills_5000.png", description: "Reach 5,000 total lifetime kills." },
    { name: "Killer 10,000", image: "total_kills_10000.png", description: "Reach 10,000 total lifetime kills." },
    { name: "Killer 25,000", image: "total_kills_25000.png", description: "Reach 25,000 total lifetime kills." },
    { name: "Killer 50,000", image: "total_kills_50000.png", description: "Reach 50,000 total lifetime kills." },
    { name: "Legendary Killer", image: "total_kills_legend.png", description: "Reach a legendary number of lifetime kills." },

    // Score Milestones
    { name: "Score 10k", image: "total_score_10000.png", description: "Reach 10,000 total career score." },
    { name: "Score 50k", image: "total_score_50000.png", description: "Reach 50,000 total career score." },
    { name: "Score 100k", image: "total_score_100000.png", description: "Reach 100,000 total career score." },
    { name: "Score 500k", image: "total_score_500000.png", description: "Reach 500,000 total career score." },
    { name: "Millionaire", image: "total_score_1000000.png", description: "Reach 1,000,000 total career score." },

    // Playtime Milestones
    { name: "Recruit (10h)", image: "milestone_playtime_10h.png", description: "Play on ranked servers for 10 hours." },
    { name: "Regular (50h)", image: "milestone_playtime_50h.png", description: "Play on ranked servers for 50 hours." },
    { name: "Veteran (100h)", image: "milestone_playtime_100h.png", description: "Play on ranked servers for 100 hours." },
    { name: "Dedicated (500h)", image: "milestone_playtime_500h.png", description: "Play on ranked servers for 500 hours." },
    { name: "Life-er (1000h)", image: "milestone_playtime_1000h.png", description: "Play on ranked servers for 1,000 hours." },

    // --- Skill & Style ---
    { name: "Elite Warrior (Bronze)", image: "elite_warrior_bronze.png", description: "Top performing combatant." },
    { name: "Elite Warrior (Silver)", image: "elite_warrior_silver.png", description: "Superior combat performance." },
    { name: "Elite Warrior (Gold)", image: "elite_warrior_gold.png", description: "Exceptional combat performance." },
    { name: "Elite Warrior (Legend)", image: "elite_warrior_legend.png", description: "Legendary combat performance." },

    // Habits
    { name: "Early Bird", image: "early_bird.png", description: "Play games in the early morning hours." },
    { name: "Night Owl", image: "night_owl.png", description: "Play games late into the night." },
    { name: "Server Regular", image: "server_regular.png", description: "Play consistently on the same server." },

    // Performance
    { name: "Comeback King", image: "comeback_king.png", description: "Win a round after your team was significantly behind." },
    { name: "Consistent Killer", image: "consistent_killer.png", description: "Maintain a high KPM over many consecutive rounds." },
    { name: "Rock Solid", image: "rock_solid.png", description: "Complete a round with very few deaths and high playtime." },
    { name: "Map Dominator", image: "map_dominator.png", description: "Win at least one round on every official map." },
    { name: "Map Specialist", image: "map_specialist.png", description: "Achieve a very high win rate on a specific map." },
    { name: "Map Legend", image: "map_legend.png", description: "Achieve legend status on a specific map." },
];
