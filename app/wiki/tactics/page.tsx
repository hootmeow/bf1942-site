import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Target,
    ChevronRight,
    ShieldAlert,
    Anchor,
    Plane,
    Castle,
    Users,
    Lightbulb,
} from "lucide-react";
import { advancedTactics } from "@/lib/wiki-gameplay";

export const metadata = {
    title: "Tactics & Strategy | BF1942 Wiki",
    description: "Advanced tactical principles and strategic concepts for Battlefield 1942.",
};

const iconMap: Record<string, React.ElementType> = {
    ShieldAlert,
    Anchor,
    Plane,
    Castle,
    Target,
    Users,
};

export default function TacticsPage() {
    return (
        <div className="space-y-8 pb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/wiki" className="hover:text-primary transition-colors">Wiki</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">Tactics & Strategy</span>
            </div>

            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
                {/* Background blur orbs */}
                <div className="pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-purple-500/10 blur-[80px]" />
                <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-primary/10 blur-[70px]" />

                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up">
                        <div className="rounded-xl bg-purple-500/20 p-3">
                            <Target className="h-8 w-8 text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                    Tactics & Strategy
                                </h1>
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                                    Advanced
                                </Badge>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                                Veteran tactics for coordinated team play and map control
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-2">
                {advancedTactics.map((tactic) => (
                    <a key={tactic.id} href={`#${tactic.id}`}>
                        <Badge variant="outline" className="hover:bg-primary/10 transition-colors cursor-pointer">
                            {tactic.title}
                        </Badge>
                    </a>
                ))}
            </div>

            {/* Tactics Grid */}
            <div className="space-y-6">
                {advancedTactics.map((tactic) => {
                    const Icon = iconMap[tactic.icon] || Target;

                    return (
                        <Card key={tactic.id} id={tactic.id} className="border-border/60 bg-card/40 scroll-mt-24">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-500/10">
                                        <Icon className="h-5 w-5 text-purple-500" />
                                    </div>
                                    {tactic.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground leading-relaxed">
                                    {tactic.description}
                                </p>

                                <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Lightbulb className="h-4 w-4 text-purple-500" />
                                        <span className="text-sm font-semibold text-purple-400">Key Points</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {tactic.points.map((point, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                                                <span className="text-purple-500 font-bold shrink-0">{i + 1}.</span>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Summary Card */}
            <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        The Golden Rules
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="p-4 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-2">Communication Wins Games</p>
                            <p className="text-muted-foreground">Use radio commands (F1-F8) constantly. Spotting enemies, calling for backup, and coordinating attacks separates winning teams from losing ones.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-2">Control Points = Victory</p>
                            <p className="text-muted-foreground">Holding majority of control points causes enemy ticket drain. Capture strategically, defend aggressively.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-2">Combined Arms</p>
                            <p className="text-muted-foreground">Infantry, armor, and air support must work together. Tanks without infantry support get ambushed. Infantry without armor get overwhelmed.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-2">Support Roles Matter</p>
                            <p className="text-muted-foreground">Engineers keeping tanks repaired and Medics keeping squads alive are often the difference between successful pushes and failed assaults.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
