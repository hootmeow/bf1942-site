import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Swords, Flag, Clock, Medal, Trophy, AlertTriangle, Info } from "lucide-react";

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "How Ranking Works",
    description: "Detailed breakdown of the BF1942 RP Rating System.",
};

export default function RankSystemPage() {
    return (
        <div className="space-y-8">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
                {/* Background blur orbs */}
                <div className="pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-primary/10 blur-[80px]" />
                <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-blue-500/10 blur-[70px]" />

                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up">
                        <div className="rounded-xl bg-primary/20 p-3">
                            <Medal className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                    Ranking System
                                </h1>
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                    RP Rating
                                </Badge>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                                Understanding how your Rating Points (RP) are calculated and what makes a round count.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Core Concept */}
                <Card className="border-border/60 bg-card/40 card-hover">
                    <CardHeader>
                        <CardTitle as="h2" className="flex items-center gap-2">
                            <div className="rounded-lg bg-primary/15 p-2 text-primary">
                                <Medal className="h-5 w-5" />
                            </div>
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
                            Only <b>ranked rounds</b> contribute to your RP. Rounds are automatically marked as <b>unranked</b> and excluded
                            from RP calculations if they are Co-op (bot) rounds, have fewer than 4 players, last under 2 minutes,
                            or are flagged for suspected stat manipulation. You can see whether a round is ranked or unranked on the
                            round detail page and in server round history.
                        </p>
                    </CardContent>
                </Card>

                {/* RP Components */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="border-border/60 bg-card/40 card-hover">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <div className="rounded-lg bg-orange-500/15 p-2 text-orange-400">
                                    <Flag className="h-4 w-4" />
                                </div>
                                Objective / Round
                            </CardTitle>
                            <CardDescription>30% weight</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="text-muted-foreground">Objective score per round — flag captures, defenses, and team assists. Calculated as (Score - Kills) / Rounds.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 bg-card/40 card-hover">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <div className="rounded-lg bg-red-500/15 p-2 text-red-400">
                                    <Swords className="h-4 w-4" />
                                </div>
                                Kill/Death Ratio
                            </CardTitle>
                            <CardDescription>25% weight</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="text-muted-foreground">Your overall KDR across all ranked rounds. Higher KDR means more efficient combat.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 bg-card/40 card-hover">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <div className="rounded-lg bg-yellow-500/15 p-2 text-yellow-400">
                                    <Clock className="h-4 w-4" />
                                </div>
                                Kills / Minute
                            </CardTitle>
                            <CardDescription>20% weight</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="text-muted-foreground">Combat tempo — how quickly you eliminate enemies relative to round duration.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 bg-card/40 card-hover">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <div className="rounded-lg bg-green-500/15 p-2 text-green-400">
                                    <Trophy className="h-4 w-4" />
                                </div>
                                Win Rate
                            </CardTitle>
                            <CardDescription>10% weight</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="text-muted-foreground">Percentage of rounds where your team won. Rewards teamplay and choosing the right moments.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 bg-card/40 card-hover">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <div className="rounded-lg bg-blue-500/15 p-2 text-blue-400">
                                    <Medal className="h-4 w-4" />
                                </div>
                                Map Variety
                            </CardTitle>
                            <CardDescription>10% weight</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="text-muted-foreground">Number of distinct maps played. Encourages versatility across different battlefields.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 bg-card/40 card-hover">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <div className="rounded-lg bg-purple-500/15 p-2 text-purple-400">
                                    <Info className="h-4 w-4" />
                                </div>
                                Score / Round
                            </CardTitle>
                            <CardDescription>5% weight</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="text-muted-foreground">Average total score per round. A general measure of overall impact each game.</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Eligibility */}
                <Card className="border-border/60 bg-card/40">
                    <CardHeader>
                        <CardTitle as="h2" className="flex items-center gap-2">
                            <div className="rounded-lg bg-cyan-500/15 p-2 text-cyan-400">
                                <Info className="h-5 w-5" />
                            </div>
                            Eligibility
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="leading-relaxed text-muted-foreground">
                            To appear on the leaderboard and receive an RP score, you must meet these criteria:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                            <li><b className="text-foreground">3+ ranked rounds</b> played (with at least 1 kill or 1 death each)</li>
                            <li><b className="text-foreground">Active in the last 60 days</b></li>
                            <li><b className="text-foreground">Experience multiplier:</b> RP scales linearly up to 30 rounds — players with fewer rounds receive proportionally less RP to prevent small-sample-size inflation</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Important Notes & Warnings */}
                <div id="ranked-unranked" className="space-y-4 scroll-mt-20">
                    <Card className="border-yellow-500/50 bg-yellow-500/5">
                        <CardHeader>
                            <CardTitle className="text-yellow-600 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Important Notes on Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-yellow-600/90">
                            <p>
                                <strong>Ranked vs Unranked Rounds:</strong> Each round is individually classified as <span className="text-green-500 font-bold">RANKED</span> or <span className="text-orange-400 font-bold">UNRANKED</span>.
                                Only ranked rounds contribute to your RP, leaderboard position, and achievements. You can see the status on each round&apos;s detail page and in the server rounds table.
                            </p>
                            <p>
                                <strong>What makes a round unranked?</strong> Rounds are automatically marked unranked if any of the following apply:
                            </p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li><strong>Co-op (Bot) rounds</strong> — Coop gametype is always unranked</li>
                                <li><strong>Too few players</strong> — fewer than 4 tracked human players</li>
                                <li><strong>Too short</strong> — round lasted less than 2 minutes</li>
                                <li><strong>No combat</strong> — zero kills and zero deaths (map transitions)</li>
                                <li><strong>Suspected bot farming</strong> — flagged by automated detection for abnormal stats (admin reviewed)</li>
                                <li><strong>Blacklisted server</strong> — rounds from blacklisted servers are not ingested at all</li>
                            </ul>
                            <p>
                                <strong>Ranked Game Modes:</strong> Conquest, Team Deathmatch, and Capture the Flag (CTF) rounds all contribute to your ranking when they pass the above filters.
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
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Trophy className="h-6 w-6 text-primary" />
                            Earnable Achievements
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            Unlock achievements by completing various in-game milestones and challenges.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ALL_ACHIEVEMENTS.map((ach) => (
                            <Card key={ach.name} className="border-border/60 bg-card/40 overflow-hidden hover:bg-muted/30 transition-colors">
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
