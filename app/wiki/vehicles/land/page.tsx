import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Truck,
    ChevronRight,
    Shield,
    Swords,
    Users,
    Crosshair,
    Lightbulb,
} from "lucide-react";
import { getVehiclesByCategory, vehicles } from "@/lib/wiki-gameplay";

export const metadata = {
    title: "Land Vehicles | BF1942 Wiki",
    description: "Complete guide to tanks, APCs, jeeps, and artillery in Battlefield 1942.",
};

const typeOrder = ['Car', 'APC', 'Light Tank', 'Heavy Tank', 'Tank Destroyer', 'Artillery'];

const typeInfo: Record<string, { description: string; tactics: string[] }> = {
    'Car': {
        description: 'Light, fast, and unarmored vehicles primarily used for rapid transportation and reconnaissance.',
        tactics: [
            'Perfect for rushing to capture neutral control points at match start',
            '"Car Bombing": Ram at high speed, or load with C4 and detonate on impact for massive damage',
        ],
    },
    'APC': {
        description: 'Half-tracks designed to transport infantry safely and provide crucial logistical support.',
        tactics: [
            'Park behind frontlines to provide mobile resupply for health and ammo',
            'Can transport up to 6 soldiers with protection from small arms',
        ],
    },
    'Light Tank': {
        description: 'Versatile tanks that balance mobility, armor, and firepower. The workhorses of armored engagements.',
        tactics: [
            'Engage enemies from a distance to take advantage of frontal armor',
            'Always advance with friendly infantry to screen your flanks from AT soldiers',
        ],
    },
    'Heavy Tank': {
        description: 'Slower but more heavily armored, designed for spearheading assaults and head-to-head tank combat.',
        tactics: [
            'Park on Repair Platforms for constant healing - incredibly hard to destroy',
            'The Tiger can lurch forward when firing - adjust aim accordingly',
        ],
    },
    'Tank Destroyer': {
        description: 'Specialized vehicles with powerful guns for ambush tactics. Often have limited turret traverse.',
        tactics: [
            'Hide behind cover overlooking chokepoints and wait for side/rear shots',
            'Not meant for frontline assaults - "shoot and scoot" is essential',
        ],
    },
    'Artillery': {
        description: 'Lightly armored self-propelled guns for long-range indirect fire support.',
        tactics: [
            'Stay far from combat in concealed rear areas',
            'Requires Scout with binoculars for effective indirect fire',
            'Target areas like control points and chokepoints, not individual vehicles',
        ],
    },
};

export default function LandVehiclesPage() {
    const landVehicles = getVehiclesByCategory('Land');

    // Group by type
    const vehiclesByType = typeOrder.reduce((acc, type) => {
        acc[type] = landVehicles.filter(v => v.type === type);
        return acc;
    }, {} as Record<string, typeof landVehicles>);

    return (
        <div className="space-y-8 pb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/wiki" className="hover:text-primary transition-colors">Wiki</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/wiki/vehicles" className="hover:text-primary transition-colors">Vehicles</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">Land</span>
            </div>

            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10">
                        <Truck className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Land Vehicles</h1>
                        <p className="text-muted-foreground">Tanks, APCs, jeeps, and artillery</p>
                    </div>
                </div>
            </div>

            {/* General Tank Tactics */}
            <Card className="border-amber-500/30 bg-amber-500/5">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-amber-500">
                        <Lightbulb className="h-5 w-5" />
                        General Tank Combat Principles
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="p-3 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-1">Armor Angling</p>
                            <p className="text-muted-foreground">Tank armor is thickest in front, weakest in rear. Always face enemies head-on.</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-1">Infantry Support</p>
                            <p className="text-muted-foreground">Tanks are vulnerable to AT ambushes. Always advance with friendly infantry screening your flanks.</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-1">Repair Platforms</p>
                            <p className="text-muted-foreground">Tanks parked on Repair Platforms heal constantly, making them incredibly difficult to destroy.</p>
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
                            <Badge className="bg-amber-500/20 text-amber-400 border-0 text-sm px-3 py-1">
                                {type}s
                            </Badge>
                            <span className="text-sm text-muted-foreground">{typeVehicles.length} vehicles</span>
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
                                    <Lightbulb className="h-4 w-4 text-amber-500" />
                                    <span className="text-xs font-semibold text-amber-500 uppercase">{type} Tactics</span>
                                </div>
                                <ul className="space-y-1">
                                    {info.tactics.map((tactic, i) => (
                                        <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                            <span className="text-amber-500/50">•</span>
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
