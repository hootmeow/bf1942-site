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
    Radio,
    Volume2,
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

// Keyboard key component for visual styling
function Key({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
    return (
        <kbd className={`inline-flex items-center justify-center px-2 py-1 text-xs font-mono font-bold rounded border border-border/80 bg-muted/50 text-foreground shadow-sm min-w-[28px] ${wide ? 'px-3' : ''}`}>
            {children}
        </kbd>
    );
}

// Radio command data structure
const radioCommands = {
    confirm: {
        title: "Confirm",
        key: "F1",
        vocal: false,
        commands: [
            { keys: ["F1", "F1"], action: "Roger" },
            { keys: ["F1", "F2"], action: "Negative" },
        ],
    },
    request: {
        title: "Request",
        key: "F2",
        vocal: false,
        commands: [
            { keys: ["F2", "F1"], action: "Requesting pickup" },
            { keys: ["F2", "F2"], action: "Requesting reinforcements" },
            { keys: ["F2", "F3"], action: "Requesting anti-tank support" },
            { keys: ["F2", "F4"], action: "Requesting naval support" },
            { keys: ["F2", "F5"], action: "Requesting air support" },
            { keys: ["F2", "F6"], action: "Artillery ready for barrage" },
            { keys: ["F2", "F7"], action: "Requesting APC support" },
        ],
    },
    spotted: {
        title: "Spotted",
        key: "F3",
        vocal: false,
        commands: [
            { keys: ["F3", "F1"], action: "Armor spotted!" },
            { keys: ["F3", "F2"], action: "Infantry spotted!" },
            { keys: ["F3", "F3"], action: "Unit spotted!" },
            { keys: ["F3", "F4"], action: "Ship spotted!" },
            { keys: ["F3", "F5"], action: "Submarine spotted!" },
            { keys: ["F3", "F6"], action: "Airplane spotted!" },
            { keys: ["F3", "F7"], action: "Scout spotted!" },
        ],
    },
    defendAttack: {
        title: "Defend/Attack",
        key: "F4",
        vocal: false,
        commands: [
            { keys: ["F4", "xx"], action: "Defend/Attack specific control point" },
            { keys: ["F4", "F4"], action: "Defend/Attack closest control point!" },
        ],
    },
    confirmVocal: {
        title: "Confirm (Vocal)",
        key: "F5",
        vocal: true,
        commands: [
            { keys: ["F5", "F3"], action: "Defending" },
            { keys: ["F5", "F4"], action: "Attacking" },
            { keys: ["F5", "F5"], action: "Roger" },
            { keys: ["F5", "F6"], action: "Negative" },
        ],
    },
    alarms: {
        title: "Alarms (Vocal)",
        key: "F6",
        vocal: true,
        commands: [
            { keys: ["F6", "F1"], action: "Wait" },
            { keys: ["F6", "F2"], action: "Fire" },
            { keys: ["F6", "F3"], action: "Hold fire" },
            { keys: ["F6", "F4"], action: "Fire in the hole" },
            { keys: ["F6", "F5"], action: "Medic! / Need repairs!" },
            { keys: ["F6", "F6"], action: "Take cover! / Watch your six!" },
            { keys: ["F6", "F7"], action: "Bail out!" },
        ],
    },
    tactics: {
        title: "Tactics (Vocal)",
        key: "F7",
        vocal: true,
        commands: [
            { keys: ["F7", "F1"], action: "Cover me" },
            { keys: ["F7", "F2"], action: "Hold this position" },
            { keys: ["F7", "F3"], action: "Go for the enemy flag" },
            { keys: ["F7", "F4"], action: "Fall back" },
            { keys: ["F7", "F5"], action: "Stick together / Get in!" },
            { keys: ["F7", "F6"], action: "Follow me" },
            { keys: ["F7", "F7"], action: "Go! Go! Go!" },
        ],
    },
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
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
                {/* Background blur orbs */}
                <div className="pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-green-500/10 blur-[80px]" />
                <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-primary/10 blur-[70px]" />

                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up">
                        <div className="rounded-xl bg-green-500/20 p-3">
                            <GraduationCap className="h-8 w-8 text-green-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                    Basic Training
                                </h1>
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                    Getting Started
                                </Badge>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                                Essential gameplay mechanics for new recruits — controls, combat, and communication
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Controls Reference */}
            <Card className="border-primary/30 bg-card/40 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Keyboard className="h-5 w-5 text-primary" />
                        Quick Controls Reference
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-3">
                            <Key wide>WASD</Key>
                            <span className="text-muted-foreground">Movement</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Key>Mouse</Key>
                            <span className="text-muted-foreground">Look/Aim</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Key wide>L Ctrl</Key>
                            <span className="text-muted-foreground">Crouch</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Key>Z</Key>
                            <span className="text-muted-foreground">Prone</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Key wide>Space</Key>
                            <span className="text-muted-foreground">Jump</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Key>R</Key>
                            <span className="text-muted-foreground">Reload</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Key>M</Key>
                            <span className="text-muted-foreground">Full Map</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Key>Tab</Key>
                            <span className="text-muted-foreground">Scoreboard</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Key>K</Key>
                            <span className="text-muted-foreground">Global Chat</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Key>L</Key>
                            <span className="text-muted-foreground">Team Chat</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Key>E</Key>
                            <span className="text-muted-foreground">Enter Vehicle</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="flex gap-1"><Key>F1</Key>-<Key>F7</Key></span>
                            <span className="text-muted-foreground">Radio</span>
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

            {/* Radio Commands Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                        <Radio className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Radio Commands</h2>
                        <p className="text-sm text-muted-foreground">Communicate with your team using quick radio messages</p>
                    </div>
                </div>

                {/* Radio vs Vocal explanation */}
                <Card className="border-blue-500/30 bg-blue-500/5">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4 text-sm">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="p-1.5 rounded bg-blue-500/20 text-blue-400 shrink-0">
                                    <Radio className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Radio Commands (F1-F4)</p>
                                    <p className="text-muted-foreground">Transmitted over radio - only your team can hear them regardless of distance.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 flex-1">
                                <div className="p-1.5 rounded bg-amber-500/20 text-amber-400 shrink-0">
                                    <Volume2 className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Vocal Commands (F5-F7)</p>
                                    <p className="text-muted-foreground">Shouted aloud - nearby enemies can hear them too!</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Radio Commands Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(radioCommands).map(([key, category]) => (
                        <Card key={key} className={`border-border/60 bg-card/40 ${category.vocal ? 'border-amber-500/20' : ''}`}>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center justify-between text-base">
                                    <span className="flex items-center gap-2">
                                        {category.vocal ? (
                                            <Volume2 className="h-4 w-4 text-amber-500" />
                                        ) : (
                                            <Radio className="h-4 w-4 text-blue-500" />
                                        )}
                                        {category.title}
                                    </span>
                                    <Key>{category.key}</Key>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {category.commands.map((cmd, i) => (
                                        <div key={i} className="flex items-center justify-between gap-2 text-sm">
                                            <span className="flex items-center gap-1">
                                                {cmd.keys.map((k, j) => (
                                                    <span key={j} className="flex items-center gap-1">
                                                        <Key>{k}</Key>
                                                        {j < cmd.keys.length - 1 && <span className="text-muted-foreground">+</span>}
                                                    </span>
                                                ))}
                                            </span>
                                            <span className="text-muted-foreground text-right text-xs">{cmd.action}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Radio Tips */}
                <Card className="border-amber-500/30 bg-amber-500/5">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <div className="space-y-2 text-sm">
                                <p className="font-medium text-foreground">Radio Command Tips</p>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• <strong>Spotting enemies (F3)</strong> marks them on the minimap for your entire team - use it constantly!</li>
                                    <li>• <strong>"Artillery ready" (F2 F6)</strong> tells Scouts you're manning an artillery piece and need targets.</li>
                                    <li>• <strong>"Medic!" (F6 F5)</strong> changes to "Need repairs!" when you're in a vehicle.</li>
                                    <li>• <strong>"Stick together" (F7 F5)</strong> changes to "Get in!" when you're driving a vehicle with empty seats.</li>
                                    <li>• Be careful with vocal commands (F5-F7) near enemies - they can hear you!</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
