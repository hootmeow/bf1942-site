import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    GraduationCap,
    ChevronRight,
    Footprints,
    Waves,
    Map,
    Crosshair,
    Bomb,
    Users,
    Flag,
    MessageSquare,
    Lightbulb,
    Keyboard,
} from "lucide-react";
import { basicTraining } from "@/lib/wiki-gameplay";

export const metadata = {
    title: "Basic Training | BF1942 Wiki",
    description: "Learn the fundamental gameplay mechanics of Battlefield 1942. Movement, combat, objectives, and communication.",
};

const iconMap: Record<string, React.ElementType> = {
    Footprints,
    Waves,
    Map,
    Crosshair,
    Bomb,
    Users,
    Flag,
    MessageSquare,
};

export default function BasicTrainingPage() {
    return (
        <div className="space-y-8 pb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/wiki" className="hover:text-primary transition-colors">Wiki</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">Basic Training</span>
            </div>

            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-green-500/10">
                        <GraduationCap className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Basic Training</h1>
                        <p className="text-muted-foreground">Essential gameplay mechanics for new recruits</p>
                    </div>
                </div>
            </div>

            {/* Quick Controls Reference */}
            <Card className="border-primary/30 bg-primary/5">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Keyboard className="h-5 w-5 text-primary" />
                        Quick Controls Reference
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="font-mono font-bold text-foreground">WASD</p>
                            <p className="text-muted-foreground">Movement</p>
                        </div>
                        <div>
                            <p className="font-mono font-bold text-foreground">Mouse</p>
                            <p className="text-muted-foreground">Look/Aim</p>
                        </div>
                        <div>
                            <p className="font-mono font-bold text-foreground">Left Ctrl</p>
                            <p className="text-muted-foreground">Crouch</p>
                        </div>
                        <div>
                            <p className="font-mono font-bold text-foreground">Z</p>
                            <p className="text-muted-foreground">Prone</p>
                        </div>
                        <div>
                            <p className="font-mono font-bold text-foreground">Space</p>
                            <p className="text-muted-foreground">Jump</p>
                        </div>
                        <div>
                            <p className="font-mono font-bold text-foreground">M</p>
                            <p className="text-muted-foreground">Full Map</p>
                        </div>
                        <div>
                            <p className="font-mono font-bold text-foreground">K</p>
                            <p className="text-muted-foreground">Team Chat</p>
                        </div>
                        <div>
                            <p className="font-mono font-bold text-foreground">F1-F8</p>
                            <p className="text-muted-foreground">Radio Commands</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Training Topics Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {basicTraining.map((topic) => {
                    const Icon = iconMap[topic.icon] || GraduationCap;
                    return (
                        <Card key={topic.id} className="border-border/60 bg-card/40">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-green-500/10">
                                        <Icon className="h-4 w-4 text-green-500" />
                                    </div>
                                    {topic.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-2">
                                    {topic.content.map((point, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                                            <span className="text-green-500/50 shrink-0">•</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>

                                {topic.tips && topic.tips.length > 0 && (
                                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Lightbulb className="h-4 w-4 text-amber-500" />
                                            <span className="text-xs font-semibold text-amber-500 uppercase">Pro Tips</span>
                                        </div>
                                        <ul className="space-y-1">
                                            {topic.tips.map((tip, i) => (
                                                <li key={i} className="text-xs text-muted-foreground">
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Next Steps */}
            <Card className="border-border/60 bg-card/40">
                <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4">Continue Learning</h3>
                    <div className="grid gap-3 md:grid-cols-3">
                        <Link href="/wiki/kits" className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group">
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors">Soldier Kits</p>
                            <p className="text-xs text-muted-foreground">Learn the 5 infantry classes</p>
                        </Link>
                        <Link href="/wiki/weapons" className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group">
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors">Weapons</p>
                            <p className="text-xs text-muted-foreground">Infantry firearms guide</p>
                        </Link>
                        <Link href="/wiki/maps" className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group">
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors">Maps</p>
                            <p className="text-xs text-muted-foreground">Strategic map breakdowns</p>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
