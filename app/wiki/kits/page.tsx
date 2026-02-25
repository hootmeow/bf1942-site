import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Shield,
    ChevronRight,
    Crosshair,
    Swords,
    Target,
    Heart,
    Wrench,
    Check,
    X,
    Lightbulb,
    ExternalLink,
} from "lucide-react";
import { soldierKits } from "@/lib/wiki-gameplay";

export const metadata = {
    title: "Soldier Kits | BF1942 Wiki",
    description: "Detailed guide to all 5 soldier classes in Battlefield 1942: Scout, Assault, Anti-Tank, Medic, and Engineer.",
};

const iconMap: Record<string, React.ElementType> = {
    Crosshair,
    Swords,
    Target,
    Heart,
    Wrench,
};

// Map weapon names/keywords to their category anchors on the weapons page
const weaponCategoryMap: Record<string, string> = {
    // Sniper Rifles
    'sniper': 'sniper',
    'no. 4 sniper': 'sniper',
    'k98 sniper': 'sniper',
    // Assault Rifles / LMGs
    'bar': 'assault-rifle',
    'bar 1918': 'assault-rifle',
    'stg44': 'assault-rifle',
    'stg 44': 'assault-rifle',
    'breda': 'assault-rifle',
    'assault rifle': 'assault-rifle',
    // Anti-Tank
    'bazooka': 'anti-tank',
    'panzerschreck': 'anti-tank',
    'rocket': 'anti-tank',
    // SMGs
    'thompson': 'smg',
    'mp40': 'smg',
    'mp18': 'smg',
    'sten': 'smg',
    'smg': 'smg',
    // Rifles
    'no. 4': 'rifle',
    'k98': 'rifle',
    'bolt-action': 'rifle',
    'rifle': 'rifle',
    // Sidearms
    'colt': 'sidearm',
    'walther': 'sidearm',
    'p38': 'sidearm',
    'pistol': 'sidearm',
    // Explosives
    'explosive': 'explosive',
    'land mine': 'explosive',
    'landmine': 'explosive',
    'expack': 'explosive',
    'c4': 'explosive',
};

// Helper function to get weapon category from weapon text
function getWeaponCategory(weaponText: string): string | null {
    const lowerText = weaponText.toLowerCase();

    // Check for specific matches first (more specific patterns)
    if (lowerText.includes('sniper')) return 'sniper';
    if (lowerText.includes('bazooka') || lowerText.includes('panzerschreck')) return 'anti-tank';
    if (lowerText.includes('thompson') || lowerText.includes('mp40') || lowerText.includes('mp18') || lowerText.includes('sten') || lowerText.includes('smg')) return 'smg';
    if (lowerText.includes('bar') || lowerText.includes('stg') || lowerText.includes('breda') || lowerText.includes('assault rifle')) return 'assault-rifle';
    if (lowerText.includes('bolt-action') || (lowerText.includes('no. 4') && !lowerText.includes('sniper')) || (lowerText.includes('k98') && !lowerText.includes('sniper'))) return 'rifle';
    if (lowerText.includes('colt') || lowerText.includes('walther') || lowerText.includes('pistol') || lowerText.includes('p38')) return 'sidearm';
    if (lowerText.includes('mine') || lowerText.includes('expack') || lowerText.includes('explosive')) return 'explosive';

    return null;
}

// Component to render a weapon link
function WeaponLink({ weapon }: { weapon: string }) {
    const category = getWeaponCategory(weapon);

    if (category) {
        return (
            <Link
                href={`/wiki/weapons#${category}`}
                className="text-foreground font-medium hover:text-primary transition-colors inline-flex items-center gap-1 group"
            >
                {weapon}
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
        );
    }

    return <span className="text-foreground font-medium">{weapon}</span>;
}

// Component to render sidearm link
function SidearmLink({ sidearm }: { sidearm: string }) {
    return (
        <Link
            href="/wiki/weapons#sidearm"
            className="text-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
        >
            {sidearm}
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
    );
}

// Component to render gadget links
function GadgetLink({ gadget }: { gadget: string }) {
    const lowerGadget = gadget.toLowerCase();

    // Link explosives to the explosives section
    if (lowerGadget.includes('mine') || lowerGadget.includes('expack') || lowerGadget.includes('explosive')) {
        return (
            <Link
                href="/wiki/weapons#explosive"
                className="hover:text-primary transition-colors"
            >
                {gadget}
            </Link>
        );
    }

    return <span>{gadget}</span>;
}

export default function KitsPage() {
    return (
        <div className="space-y-8 pb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/wiki" className="hover:text-primary transition-colors">Wiki</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">Soldier Kits</span>
            </div>

            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
                {/* Background blur orbs */}
                <div className="pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-orange-500/10 blur-[80px]" />
                <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-primary/10 blur-[70px]" />

                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up">
                        <div className="rounded-xl bg-orange-500/20 p-3">
                            <Shield className="h-8 w-8 text-orange-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                    Soldier Kits
                                </h1>
                                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                                    5 Classes
                                </Badge>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                                Master the 5 infantry classes and their specialized roles on the battlefield
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tip about weapon links */}
            <Card className="border-blue-500/30 bg-blue-500/5">
                <CardContent className="p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                        <Crosshair className="h-4 w-4" />
                    </div>
                    <div className="text-sm">
                        <p className="text-foreground font-medium mb-1">Weapon Details</p>
                        <p className="text-muted-foreground">
                            Click on any weapon name to view detailed information including historical context, in-game performance, and tactical analysis on the <Link href="/wiki/weapons" className="text-primary hover:underline">Weapons page</Link>.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {soldierKits.map((kit) => {
                    const Icon = iconMap[kit.icon] || Shield;
                    return (
                        <a href={`#${kit.id}`} key={kit.id} className="group">
                            <Card className={`border-border/60 bg-card/40 hover:shadow-lg hover:-translate-y-1 transition-all text-center ${kit.bgColor} border`}>
                                <CardContent className="p-4">
                                    <Icon className={`h-8 w-8 mx-auto mb-2 ${kit.color}`} />
                                    <p className="font-bold text-foreground">{kit.name}</p>
                                    <p className="text-xs text-muted-foreground">{kit.role}</p>
                                </CardContent>
                            </Card>
                        </a>
                    );
                })}
            </div>

            {/* Detailed Kit Breakdowns */}
            <div className="space-y-8">
                {soldierKits.map((kit) => {
                    const Icon = iconMap[kit.icon] || Shield;
                    return (
                        <Card key={kit.id} id={kit.id} className="border-border/60 bg-card/40 overflow-hidden scroll-mt-24">
                            {/* Kit Header */}
                            <div className={`${kit.bgColor} border-b border-border/40 px-6 py-4`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl bg-background/50 ${kit.color}`}>
                                        <Icon className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">{kit.name}</h2>
                                        <Badge variant="outline" className={`${kit.color} border-current`}>
                                            {kit.role}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-6 space-y-6">
                                {/* Description */}
                                <p className="text-muted-foreground leading-relaxed">
                                    {kit.description}
                                </p>

                                {/* Pros & Cons */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                                        <h4 className="font-semibold text-green-500 mb-3 flex items-center gap-2">
                                            <Check className="h-4 w-4" /> Strengths
                                        </h4>
                                        <ul className="space-y-2">
                                            {kit.pros.map((pro, i) => (
                                                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                                    <span className="text-green-500/50 shrink-0">+</span>
                                                    {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                                        <h4 className="font-semibold text-red-500 mb-3 flex items-center gap-2">
                                            <X className="h-4 w-4" /> Weaknesses
                                        </h4>
                                        <ul className="space-y-2">
                                            {kit.cons.map((con, i) => (
                                                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                                    <span className="text-red-500/50 shrink-0">-</span>
                                                    {con}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Equipment */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
                                        <h4 className="font-semibold text-foreground mb-3">Equipment</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Primary</span>
                                                <WeaponLink weapon={kit.primaryWeapon} />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Sidearm</span>
                                                <SidearmLink sidearm={kit.sidearm} />
                                            </div>
                                            {kit.gadgets.length > 0 && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Gadgets</span>
                                                    <span className="text-foreground">
                                                        {kit.gadgets.map((gadget, i) => (
                                                            <span key={gadget}>
                                                                <GadgetLink gadget={gadget} />
                                                                {i < kit.gadgets.length - 1 && ', '}
                                                            </span>
                                                        ))}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Grenades</span>
                                                <span className="text-foreground">{kit.grenades}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tactics */}
                                    <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                                        <h4 className="font-semibold text-amber-500 mb-3 flex items-center gap-2">
                                            <Lightbulb className="h-4 w-4" /> Key Tactics
                                        </h4>
                                        <ul className="space-y-2">
                                            {kit.tactics.map((tactic, i) => (
                                                <li key={i} className="text-sm text-muted-foreground">
                                                    {tactic}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
