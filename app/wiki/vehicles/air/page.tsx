import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Plane,
    ChevronRight,
    Users,
    Crosshair,
    Lightbulb,
} from "lucide-react";
import { getVehiclesByCategory } from "@/lib/wiki-gameplay";

export const metadata = {
    title: "Aircraft | BF1942 Wiki",
    description: "Complete guide to fighters, bombers, and other aircraft in Battlefield 1942.",
};

const typeOrder = ['Fighter', 'Dive Bomber', 'Fighter-Bomber', 'Heavy Bomber'];

const typeInfo: Record<string, { description: string; tactics: string[] }> = {
    'Fighter': {
        description: 'Fast and agile single-seat aircraft designed for air superiority and ground strafing. All carry one bomb.',
        tactics: [
            'Use Nosecam view (F9) for unobstructed dogfighting',
            'Get on enemy\'s "six" (behind them), match speed, fire at engine',
            'Lead turning targets when firing',
            'Attack bombers from below - rear gunners can\'t fire directly underneath',
            'Strafing is highly effective vs infantry, cars, APCs, artillery - not tanks',
        ],
    },
    'Dive Bomber': {
        description: 'Two-seat aircraft, slower than fighters but with heavier bomb loads. Rear-gunner provides defense against pursuing fighters.',
        tactics: [
            'Dive-Bombing: Approach high, enter 45° dive, release bombs, pull up sharply',
            'Glide-Bombing: Release in level flight a few seconds before target',
            'Torpedo Bombing: Approach low, slow, perpendicular to ship. Drop far enough to arm.',
            'Second seat can carry paratrooper for stealth missions',
        ],
    },
    'Fighter-Bomber': {
        description: 'Twin-engine hybrid aircraft bridging nimble fighters and heavy bombers. Fast enough for dogfights with 4-bomb payload.',
        tactics: [
            'Perfect for carpet-bombing narrow chokepoints like bridges',
            'BF-110 has rear gunner and can transport paratrooper',
            'Mosquito is extremely fast but has no defensive armament',
        ],
    },
    'Heavy Bomber': {
        description: 'Large multi-crew aircraft for strategic bombing. The B-17 is the heaviest aircraft in the game.',
        tactics: [
            'Carpet-Bombing: Drop all 8 bombs in quick succession while flying straight',
            'Devastating vs tank columns, bridges, and clustered control points',
            'Paratrooper Transport: Two gunner seats can drop soldiers behind enemy lines',
            'Flying Gunship: Fully crewed B-17 with 2 turrets is extremely hard to destroy',
        ],
    },
};

export default function AirVehiclesPage() {
    const airVehicles = getVehiclesByCategory('Air');

    // Group by type
    const vehiclesByType = typeOrder.reduce((acc, type) => {
        acc[type] = airVehicles.filter(v => v.type === type);
        return acc;
    }, {} as Record<string, typeof airVehicles>);

    return (
        <div className="space-y-8 pb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/wiki" className="hover:text-primary transition-colors">Wiki</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/wiki/vehicles" className="hover:text-primary transition-colors">Vehicles</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">Air</span>
            </div>

            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10">
                        <Plane className="h-6 w-6 text-cyan-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Aircraft</h1>
                        <p className="text-muted-foreground">Fighters, bombers, and close air support</p>
                    </div>
                </div>
            </div>

            {/* General Flight Tips */}
            <Card className="border-cyan-500/30 bg-cyan-500/5">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-cyan-500">
                        <Lightbulb className="h-5 w-5" />
                        Flight Combat Essentials
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="p-3 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-1">Repair Hangars</p>
                            <p className="text-muted-foreground">Land and taxi in to fully repair. You can also fly very low over the roof for quick repairs.</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-1">Rearming</p>
                            <p className="text-muted-foreground">Aircraft automatically rearm bombs and ammo when flying low over your team's airstrip.</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-1">Flying Grease Monkey</p>
                            <p className="text-muted-foreground">Engineers can land in flat terrain, hop out, repair their plane with wrench, and take off again.</p>
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
                            <Badge className="bg-cyan-500/20 text-cyan-400 border-0 text-sm px-3 py-1">
                                {type}s
                            </Badge>
                            <span className="text-sm text-muted-foreground">{typeVehicles.length} aircraft</span>
                        </div>

                        {info && (
                            <p className="text-muted-foreground text-sm">{info.description}</p>
                        )}

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

                                        {vehicle.specialFeatures && vehicle.specialFeatures.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {vehicle.specialFeatures.map((feature) => (
                                                    <Badge key={feature} className="bg-green-500/20 text-green-400 border-0 text-[10px]">
                                                        {feature}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {info && info.tactics.length > 0 && (
                            <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
                                <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="h-4 w-4 text-cyan-500" />
                                    <span className="text-xs font-semibold text-cyan-500 uppercase">{type} Tactics</span>
                                </div>
                                <ul className="space-y-1">
                                    {info.tactics.map((tactic, i) => (
                                        <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                            <span className="text-cyan-500/50">•</span>
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
