import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
        <Card className={`group relative overflow-hidden border-border/60 bg-card/40 transition-all duration-300 ${available ? 'hover:border-border hover:shadow-lg hover:-translate-y-1 cursor-pointer' : 'opacity-60'}`}>
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bgColor} ${color}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-foreground">{title}</h3>
                            {count !== undefined && (
                                <Badge variant="secondary" className="text-xs">
                                    {count} entries
                                </Badge>
                            )}
                            {!available && (
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                    Coming Soon
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>
                    {available && (
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    )}
                </div>
            </CardContent>
            {available && (
                <div className={`absolute inset-0 ${bgColor} opacity-0 transition-opacity duration-500 group-hover:opacity-10 pointer-events-none`} />
            )}
        </Card>
    );

    if (!available) return content;

    return <Link href={href}>{content}</Link>;
}

export default function WikiPage() {
    const mapsByTheater = getMapsByTheater();
    const theaterCount = Object.keys(mapsByTheater).length;

    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-[#0d1208] via-[#0a0f06] to-[#060a04] px-6 py-16 shadow-2xl sm:px-12 md:py-24">
                {/* Amber rim light */}
                <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.13),transparent_65%)] pointer-events-none" />
                {/* Soft white glow */}
                <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.03),transparent_65%)] pointer-events-none" />
                {/* Topographic contour lines */}
                <svg aria-hidden className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1200 400">
                  <defs>
                    <linearGradient id="topoWiki" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="rgba(255,255,255,0.0)" />
                      <stop offset="0.4" stopColor="rgba(255,255,255,0.08)" />
                      <stop offset="1" stopColor="rgba(255,255,255,0.0)" />
                    </linearGradient>
                  </defs>
                  <path d="M0,70 L150,63 L300,78 L450,60 L600,74 L750,57 L900,71 L1050,61 L1200,70" fill="none" stroke="url(#topoWiki)" strokeWidth="1.2" opacity="0.5" />
                  <path d="M0,130 L150,123 L300,138 L450,120 L600,134 L750,117 L900,131 L1050,121 L1200,130" fill="none" stroke="url(#topoWiki)" strokeWidth="0.6" opacity="0.5" />
                  <path d="M0,190 L150,183 L300,198 L450,180 L600,194 L750,177 L900,191 L1050,181 L1200,190" fill="none" stroke="url(#topoWiki)" strokeWidth="1.2" opacity="0.5" />
                  <path d="M0,250 L150,243 L300,258 L450,240 L600,254 L750,237 L900,251 L1050,241 L1200,250" fill="none" stroke="url(#topoWiki)" strokeWidth="0.6" opacity="0.5" />
                  <path d="M0,320 L150,313 L300,328 L450,310 L600,324 L750,307 L900,321 L1050,311 L1200,320" fill="none" stroke="url(#topoWiki)" strokeWidth="1.2" opacity="0.5" />
                </svg>
                {/* Film grain */}
                <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "3px 3px, 7px 7px", backgroundPosition: "0 0, 1px 2px" }} />

                <div className="relative z-10 max-w-3xl">
                    <Badge variant="outline" className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-400">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Knowledge Base
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                        BF1942 Wiki
                    </h1>
                    <p className="mt-6 text-lg text-zinc-400 max-w-2xl leading-relaxed">
                        Your complete guide to Battlefield 1942. Explore detailed map breakdowns, learn weapon mechanics,
                        master vehicle combat, and discover veteran strategies to dominate the battlefield.
                    </p>
                </div>
            </div>

            {/* Vanilla Game Notice */}
            <Card className="border-amber-500/20 bg-amber-500/5">
                <CardContent className="p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                        <Info className="h-4 w-4" />
                    </div>
                    <div className="text-sm">
                        <p className="text-foreground font-medium mb-1">Vanilla Battlefield 1942</p>
                        <p className="text-muted-foreground">
                            This wiki covers the original, unmodified version of Battlefield 1942. Weapons, maps, vehicles, and gameplay mechanics
                            may differ when playing online with server-side modifications. For information on specific mods or expansion packs,
                            please visit the <Link href="/mods" className="text-primary hover:underline">Mods & Expansions</Link> section.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-border/60 bg-card/40">
                    <CardContent className="p-4 text-center">
                        <Map className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                        <p className="text-2xl font-bold text-foreground">{wikiMaps.length}</p>
                        <p className="text-xs text-muted-foreground">Maps</p>
                    </CardContent>
                </Card>
                <Card className="border-border/60 bg-card/40">
                    <CardContent className="p-4 text-center">
                        <Compass className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                        <p className="text-2xl font-bold text-foreground">{theaterCount}</p>
                        <p className="text-xs text-muted-foreground">Theaters</p>
                    </CardContent>
                </Card>
                <Card className="border-border/60 bg-card/40">
                    <CardContent className="p-4 text-center">
                        <Crosshair className="h-6 w-6 mx-auto mb-2 text-red-500" />
                        <p className="text-2xl font-bold text-foreground">5</p>
                        <p className="text-xs text-muted-foreground">Kits</p>
                    </CardContent>
                </Card>
                <Card className="border-border/60 bg-card/40">
                    <CardContent className="p-4 text-center">
                        <Truck className="h-6 w-6 mx-auto mb-2 text-green-500" />
                        <p className="text-2xl font-bold text-foreground">35+</p>
                        <p className="text-xs text-muted-foreground">Vehicles</p>
                    </CardContent>
                </Card>
            </div>

            {/* Categories Grid */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Swords className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Browse the Wiki</h2>
                        <p className="text-sm text-muted-foreground">Choose a category to explore</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <WikiCategoryCard
                        href="/wiki/maps"
                        icon={Map}
                        title="Maps"
                        description="Detailed breakdowns of all 16 maps including control points, vehicle spawns, and strategic analysis."
                        count={wikiMaps.length}
                        color="text-blue-500"
                        bgColor="bg-blue-500/10"
                    />
                    <WikiCategoryCard
                        href="/wiki/basic-training"
                        icon={GraduationCap}
                        title="Basic Training"
                        description="Essential game mechanics, controls, and tips for new players to get started."
                        color="text-green-500"
                        bgColor="bg-green-500/10"
                    />
                    <WikiCategoryCard
                        href="/wiki/kits"
                        icon={Shield}
                        title="Soldier Kits"
                        description="Learn about the 5 soldier classes: Scout, Assault, Anti-Tank, Medic, and Engineer."
                        count={5}
                        color="text-orange-500"
                        bgColor="bg-orange-500/10"
                    />
                    <WikiCategoryCard
                        href="/wiki/weapons"
                        icon={Crosshair}
                        title="Weapons & Emplacements"
                        description="Infantry firearms and static gun positions - stats, tactics, and effective usage."
                        color="text-red-500"
                        bgColor="bg-red-500/10"
                    />
                    <WikiCategoryCard
                        href="/wiki/vehicles/land"
                        icon={Truck}
                        title="Land Vehicles"
                        description="Tanks, APCs, jeeps, and artillery - learn to dominate on the ground."
                        color="text-amber-500"
                        bgColor="bg-amber-500/10"
                    />
                    <WikiCategoryCard
                        href="/wiki/vehicles/air"
                        icon={Plane}
                        title="Aircraft"
                        description="Fighters, bombers, and dive bombers - master the skies."
                        color="text-cyan-500"
                        bgColor="bg-cyan-500/10"
                    />
                    <WikiCategoryCard
                        href="/wiki/vehicles/naval"
                        icon={Anchor}
                        title="Naval Vessels"
                        description="Battleships, carriers, destroyers, and landing craft."
                        color="text-indigo-500"
                        bgColor="bg-indigo-500/10"
                    />
                    <WikiCategoryCard
                        href="/wiki/tactics"
                        icon={Target}
                        title="Tactics & Strategy"
                        description="Veteran tactics for coordinated team play and map control."
                        color="text-purple-500"
                        bgColor="bg-purple-500/10"
                    />
                </div>
            </div>

            {/* Featured Maps by Theater */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Map className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Maps by Theater</h2>
                        <p className="text-sm text-muted-foreground">Quick access to maps organized by war theater</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(mapsByTheater).map(([theater, maps]) => {
                        const colors = theaterColors[theater];
                        return (
                            <Link href={`/wiki/maps?theater=${encodeURIComponent(theater)}`} key={theater}>
                                <Card className={`group border-border/60 bg-card/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${colors.border} border`}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <Badge className={`${colors.bg} ${colors.text} border-0`}>
                                                {theater}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">{maps.length} maps</span>
                                        </div>
                                        <div className="space-y-1">
                                            {maps.slice(0, 3).map(map => (
                                                <p key={map.slug} className="text-sm text-muted-foreground truncate">
                                                    {map.name}
                                                </p>
                                            ))}
                                            {maps.length > 3 && (
                                                <p className="text-xs text-muted-foreground">
                                                    +{maps.length - 3} more
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
