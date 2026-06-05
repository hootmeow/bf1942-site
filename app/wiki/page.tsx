import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
    Map,
    Crosshair,
    Shield,
    Truck,
    Plane,
    Anchor,
    GraduationCap,
    BookOpen,
    ArrowRight,
    Swords,
    Target,
    Compass,
    Info,
} from "lucide-react";
import { wikiMaps, getMapsByTheater, theaterColors } from "@/lib/wiki-maps";

export const metadata = {
    title: "Game Wiki",
    description: "Complete Battlefield 1942 wiki with map guides, strategies, weapons, vehicles, and game mechanics.",
};

interface WikiCategoryCardProps {
    href: string;
    icon: React.ElementType;
    title: string;
    description: string;
    count?: number;
    color: string;
    bgColor: string;
    available?: boolean;
}

function WikiCategoryCard({
    href,
    icon: Icon,
    title,
    description,
    count,
    color,
    bgColor,
    available = true,
}: WikiCategoryCardProps) {
    const content = (
        <div className={`group relative overflow-hidden rounded-xl border border-[#1e2a14] bg-[#070b05] transition-all duration-300 ${available ? "hover:border-[#2a3a1a] hover:shadow-lg hover:-translate-y-0.5 cursor-pointer" : "opacity-60"}`}>
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bgColor} ${color}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-foreground">{title}</h3>
                            {count !== undefined && (
                                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50 border border-[#1e2a14] bg-[#0a0f06] px-1.5 py-0.5 rounded">
                                    {count}
                                </span>
                            )}
                            {!available && (
                                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/40 border border-[#1e2a14] px-1.5 py-0.5 rounded">
                                    Soon
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground/70 leading-relaxed">
                            {description}
                        </p>
                    </div>
                    {available && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    )}
                </div>
            </div>
            {available && (
                <div className={`absolute inset-0 ${bgColor} opacity-0 transition-opacity duration-500 group-hover:opacity-10 pointer-events-none`} />
            )}
        </div>
    );

    if (!available) return content;
    return <Link href={href}>{content}</Link>;
}

export default function WikiPage() {
    const mapsByTheater = getMapsByTheater();
    const theaterCount = Object.keys(mapsByTheater).length;

    return (
        <div className="space-y-10 pb-12">
            {/* Hero Section */}
            <div
                className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
                style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)" }}
            >
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/6 blur-[90px] pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/6 blur-[70px] pointer-events-none" />
                <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-12 max-w-3xl">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-3">
                        <BookOpen className="h-2.5 w-2.5" />
                        Knowledge Base
                    </span>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                        BF1942 Wiki
                    </h1>
                    <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed">
                        Your complete guide to Battlefield 1942. Explore detailed map breakdowns, learn weapon mechanics,
                        master vehicle combat, and discover veteran strategies to dominate the battlefield.
                    </p>
                </div>
            </div>

            {/* Vanilla Game Notice */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 shrink-0">
                    <Info className="h-4 w-4" />
                </div>
                <div className="text-sm">
                    <p className="text-foreground font-medium mb-1">Vanilla Battlefield 1942</p>
                    <p className="text-muted-foreground/80">
                        This wiki covers the original, unmodified version of Battlefield 1942. Weapons, maps, vehicles, and gameplay mechanics
                        may differ when playing online with server-side modifications. For information on specific mods or expansion packs,
                        please visit the <Link href="/mods" className="text-primary hover:underline">Mods & Expansions</Link> section.
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-[#1e2a14] bg-[#070b05] p-4 text-center">
                    <Map className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                    <p className="text-2xl font-bold text-foreground">{wikiMaps.length}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50 mt-0.5">Maps</p>
                </div>
                <div className="rounded-xl border border-[#1e2a14] bg-[#070b05] p-4 text-center">
                    <Compass className="h-6 w-6 mx-auto mb-2 text-amber-400" />
                    <p className="text-2xl font-bold text-foreground">{theaterCount}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50 mt-0.5">Theaters</p>
                </div>
                <div className="rounded-xl border border-[#1e2a14] bg-[#070b05] p-4 text-center">
                    <Crosshair className="h-6 w-6 mx-auto mb-2 text-red-400" />
                    <p className="text-2xl font-bold text-foreground">5</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50 mt-0.5">Kits</p>
                </div>
                <div className="rounded-xl border border-[#1e2a14] bg-[#070b05] p-4 text-center">
                    <Truck className="h-6 w-6 mx-auto mb-2 text-emerald-400" />
                    <p className="text-2xl font-bold text-foreground">35+</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50 mt-0.5">Vehicles</p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <Swords className="h-4 w-4 text-primary" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Browse the Wiki</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#1e2a14] to-transparent" />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <WikiCategoryCard
                        href="/wiki/maps"
                        icon={Map}
                        title="Maps"
                        description="Detailed breakdowns of all 16 maps including control points, vehicle spawns, and strategic analysis."
                        count={wikiMaps.length}
                        color="text-blue-400"
                        bgColor="bg-blue-500/10"
                    />
                    <WikiCategoryCard
                        href="/wiki/basic-training"
                        icon={GraduationCap}
                        title="Basic Training"
                        description="Essential game mechanics, controls, and tips for new players to get started."
                        color="text-emerald-400"
                        bgColor="bg-emerald-500/10"
                    />
                    <WikiCategoryCard
                        href="/wiki/kits"
                        icon={Shield}
                        title="Soldier Kits"
                        description="Learn about the 5 soldier classes: Scout, Assault, Anti-Tank, Medic, and Engineer."
                        count={5}
                        color="text-orange-400"
                        bgColor="bg-orange-500/10"
                    />
                    <WikiCategoryCard
                        href="/wiki/weapons"
                        icon={Crosshair}
                        title="Weapons & Emplacements"
                        description="Infantry firearms and static gun positions - stats, tactics, and effective usage."
                        color="text-red-400"
                        bgColor="bg-red-500/10"
                    />
                    <WikiCategoryCard
                        href="/wiki/vehicles/land"
                        icon={Truck}
                        title="Land Vehicles"
                        description="Tanks, APCs, jeeps, and artillery - learn to dominate on the ground."
                        color="text-amber-400"
                        bgColor="bg-amber-500/10"
                    />
                    <WikiCategoryCard
                        href="/wiki/vehicles/air"
                        icon={Plane}
                        title="Aircraft"
                        description="Fighters, bombers, and dive bombers - master the skies."
                        color="text-cyan-400"
                        bgColor="bg-cyan-500/10"
                    />
                    <WikiCategoryCard
                        href="/wiki/vehicles/naval"
                        icon={Anchor}
                        title="Naval Vessels"
                        description="Battleships, carriers, destroyers, and landing craft."
                        color="text-indigo-400"
                        bgColor="bg-indigo-500/10"
                    />
                    <WikiCategoryCard
                        href="/wiki/tactics"
                        icon={Target}
                        title="Tactics & Strategy"
                        description="Veteran tactics for coordinated team play and map control."
                        color="text-slate-400"
                        bgColor="bg-slate-500/10"
                    />
                </div>
            </div>

            {/* Featured Maps by Theater */}
            <div className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <Map className="h-4 w-4 text-primary" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Maps by Theater</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#1e2a14] to-transparent" />
                </div>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(mapsByTheater).map(([theater, maps]) => {
                        const colors = theaterColors[theater];
                        return (
                            <Link href={`/wiki/maps?theater=${encodeURIComponent(theater)}`} key={theater}>
                                <div className="group rounded-xl border border-[#1e2a14] bg-[#070b05] hover:border-[#2a3a1a] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 p-4 h-full">
                                    <div className="flex items-center justify-between mb-3">
                                        <Badge className={`${colors.bg} ${colors.text} border-0 font-mono text-[9px] uppercase tracking-[0.12em]`}>
                                            {theater}
                                        </Badge>
                                        <span className="font-mono text-[9px] text-muted-foreground/40">{maps.length} maps</span>
                                    </div>
                                    <div className="space-y-1">
                                        {maps.slice(0, 3).map(map => (
                                            <p key={map.slug} className="text-sm text-muted-foreground/60 truncate group-hover:text-muted-foreground/80 transition-colors">
                                                {map.name}
                                            </p>
                                        ))}
                                        {maps.length > 3 && (
                                            <p className="font-mono text-[9px] text-muted-foreground/30">
                                                +{maps.length - 3} more
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
