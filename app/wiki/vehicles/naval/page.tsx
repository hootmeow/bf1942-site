import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Anchor,
    ChevronRight,
    Users,
    Crosshair,
    Lightbulb,
} from "lucide-react";
import { getVehiclesByCategory } from "@/lib/wiki-gameplay";

export const metadata = {
    title: "Naval Vessels | BF1942 Wiki",
    description: "Complete guide to ships, submarines, and landing craft in Battlefield 1942.",
};

const typeOrder = ['Destroyer', 'Submarine', 'Battleship', 'Carrier', 'Landing Craft'];

const typeInfo: Record<string, { description: string; tactics: string[] }> = {
    'Destroyer': {
        description: 'Fast, versatile warships that serve as the backbone of a naval fleet. All-purpose vessels for engaging ships, submarines, and bombarding shore targets.',
        tactics: [
            'Shore Bombardment: Use deck guns to shell coastal control points',
            'Rear gun turret can use indirect fire with Scout targeting',
            'Only vessel that can reliably hunt submerged submarines',
            'Use sonar (visible on mini-map) to detect subs, sail over them to drop depth charges',
        ],
    },
    'Submarine': {
        description: 'The ultimate stealth weapon of the sea. Designed to ambush and sink large enemy ships with powerful torpedoes.',
        tactics: [
            'Stay submerged to avoid detection from planes and ships',
            'Manage oxygen supply - diving too deep causes hull damage',
            'Fire torpedoes at 90° angle to ship\'s side for largest target',
            'Torpedoes from deep water need distance to surface before impact',
            'Can stealthily capture or contest sea-based control points',
        ],
    },
    'Battleship': {
        description: 'The most powerful surface warships. Floating fortresses with massive guns capable of destroying ships and bombarding land from extreme range.',
        tactics: [
            'Primary target should always be the enemy battleship',
            'Broadside: Maneuver parallel to enemy to fire both gun batteries',
            'Both batteries can use indirect fire with Scout coordination',
            'Yamato recoil causes drift - re-aim after each volley',
        ],
    },
    'Carrier': {
        description: 'Floating airfields that serve as the heart of a naval task force. Mobile spawn points for all carrier-based aircraft.',
        tactics: [
            'Extremely vulnerable - must be defended at all times',
            'Man AA guns with engineers who can also repair the ship',
            'Have fighters fly Combat Air Patrol (CAP) around the carrier',
            'Move carrier from spawn position to a far corner of the map to hide it',
        ],
    },
    'Landing Craft': {
        description: 'Small, lightly armored boats designed to ferry infantry from ships to shore for amphibious assaults.',
        tactics: [
            'Keep front ramp raised during approach for machine gun protection',
            'Can serve as patrol boats - machine gun is effective vs infantry and other LCVPs',
            'Stay behind enemy LCVPs to destroy them safely',
            'Use for stealth landings on undefended coastlines',
        ],
    },
};

export default function NavalVehiclesPage() {
    const navalVehicles = getVehiclesByCategory('Naval');

    // Group by type
    const vehiclesByType = typeOrder.reduce((acc, type) => {
        acc[type] = navalVehicles.filter(v => v.type === type);
        return acc;
    }, {} as Record<string, typeof navalVehicles>);

    return (
        <div className="space-y-8 pb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/wiki" className="hover:text-primary transition-colors">Wiki</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/wiki/vehicles" className="hover:text-primary transition-colors">Vehicles</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">Naval</span>
            </div>

            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
                {/* Background blur orbs */}
                <div className="pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-indigo-500/10 blur-[80px]" />
                <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-primary/10 blur-[70px]" />

                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up">
                        <div className="rounded-xl bg-indigo-500/20 p-3">
                            <Anchor className="h-8 w-8 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                    Naval Vessels
                                </h1>
                                <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-xs">
                                    Naval Warfare
                                </Badge>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                                Destroyers, submarines, battleships, carriers, and landing craft
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Naval Combat Tips */}
            <Card className="border-indigo-500/30 bg-indigo-500/5">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-indigo-500">
                        <Lightbulb className="h-5 w-5" />
                        Naval Combat Essentials
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="p-3 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-1">Torpedo Hits</p>
                            <p className="text-muted-foreground">Hits below the waterline are far more devastating than deck bombs. Position for broadside shots.</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-1">Scout Coordination</p>
                            <p className="text-muted-foreground">Naval guns are most effective with Scout binoculars providing targeting coordinates for indirect fire.</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-1">Engineer Defense</p>
                            <p className="text-muted-foreground">Engineers manning AA guns can also repair the ship between attacks, dramatically increasing survivability.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Vehicles by Type */}
            {typeOrder.map((type) => {
                const typeVehicles = vehiclesByType[type];
                if (!typeVehicles || typeVehicles.length === 0) return null;

                const info = typeInfo[type];

                return (
                    <div key={type} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-indigo-500/20 text-indigo-400 border-0 text-sm px-3 py-1">
                                {type}s
                            </Badge>
                            <span className="text-sm text-muted-foreground">{typeVehicles.length} vessels</span>
                        </div>

                        {info && (
                            <p className="text-muted-foreground text-sm">{info.description}</p>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            {typeVehicles.map((vehicle) => (
                                <Card key={vehicle.name} className="border-border/60 bg-card/40">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div>
                                                <h3 className="font-bold text-foreground">{vehicle.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className={vehicle.affiliation === 'Allies' ? 'border-blue-500/50 text-blue-400' : 'border-red-500/50 text-red-400'}>
                                                        {vehicle.affiliation}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">{vehicle.nationality}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Users className="h-3 w-3" />
                                                {vehicle.capacity}
                                            </div>
                                        </div>

                                        <p className="text-sm text-muted-foreground mb-3">{vehicle.description}</p>

                                        {vehicle.weapons && vehicle.weapons.length > 0 && (
                                            <div className="flex items-center gap-2 text-xs">
                                                <Crosshair className="h-3 w-3 text-red-500" />
                                                <span className="text-muted-foreground">{vehicle.weapons.join(', ')}</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {info && info.tactics.length > 0 && (
                            <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
                                <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="h-4 w-4 text-indigo-500" />
                                    <span className="text-xs font-semibold text-indigo-500 uppercase">{type} Tactics</span>
                                </div>
                                <ul className="space-y-1">
                                    {info.tactics.map((tactic, i) => (
                                        <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                            <span className="text-indigo-500/50">•</span>
                                            {tactic}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
