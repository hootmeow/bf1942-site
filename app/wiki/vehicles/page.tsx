import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Truck,
    Plane,
    Anchor,
    ChevronRight,
    ArrowRight,
} from "lucide-react";
import { getVehiclesByCategory } from "@/lib/wiki-gameplay";

export const metadata = {
    title: "Vehicles | BF1942 Wiki",
    description: "Complete guide to all vehicles in Battlefield 1942 - land, air, and naval.",
};

const categories = [
    {
        id: 'land',
        name: 'Land Vehicles',
        icon: Truck,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        description: 'Tanks, APCs, jeeps, artillery, and tank destroyers',
        href: '/wiki/vehicles/land',
    },
    {
        id: 'air',
        name: 'Aircraft',
        icon: Plane,
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-500/10',
        borderColor: 'border-cyan-500/30',
        description: 'Fighters, dive bombers, fighter-bombers, and heavy bombers',
        href: '/wiki/vehicles/air',
    },
    {
        id: 'naval',
        name: 'Naval Vessels',
        icon: Anchor,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-500/10',
        borderColor: 'border-indigo-500/30',
        description: 'Destroyers, submarines, battleships, carriers, and landing craft',
        href: '/wiki/vehicles/naval',
    },
];

export default function VehiclesPage() {
    return (
        <div className="space-y-8 pb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/wiki" className="hover:text-primary transition-colors">Wiki</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">Vehicles</span>
            </div>

            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
                {/* Background blur orbs */}
                <div className="pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-amber-500/10 blur-[80px]" />
                <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-primary/10 blur-[70px]" />

                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up">
                        <div className="rounded-xl bg-amber-500/20 p-3">
                            <Truck className="h-8 w-8 text-amber-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                    Vehicles
                                </h1>
                                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                                    35+ Vehicles
                                </Badge>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                                Master land, air, and sea combat with tanks, aircraft, and warships
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    const vehicleCount = getVehiclesByCategory(cat.id === 'land' ? 'Land' : cat.id === 'air' ? 'Air' : 'Naval').length;

                    return (
                        <Link href={cat.href} key={cat.id}>
                            <Card className={`group h-full border-border/60 ${cat.borderColor} bg-card/40 hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden`}>
                                <div className={`${cat.bgColor} p-8 text-center`}>
                                    <Icon className={`h-16 w-16 mx-auto ${cat.color}`} />
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-xl font-bold text-foreground">{cat.name}</h2>
                                        <Badge variant="secondary">{vehicleCount} vehicles</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {cat.description}
                                    </p>
                                    <div className={`flex items-center gap-2 text-sm ${cat.color} font-medium group-hover:gap-3 transition-all`}>
                                        View all <ArrowRight className="h-4 w-4" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Stats */}
            <Card className="border-border/60 bg-card/40">
                <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4">Vehicle Combat Tips</h3>
                    <div className="grid md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <p className="font-medium text-amber-500 mb-2">Land Vehicles</p>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• Tank armor is thickest in front, weakest in rear</li>
                                <li>• APCs provide mobile resupply for health and ammo</li>
                                <li>• Engineers can repair vehicles with wrench</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium text-cyan-500 mb-2">Aircraft</p>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• Use nosecam (F9) for dogfighting</li>
                                <li>• Lead your target when firing</li>
                                <li>• Fly low over airstrips to rearm</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium text-indigo-500 mb-2">Naval Vessels</p>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• Destroyers can use depth charges vs submarines</li>
                                <li>• Battleship guns have devastating broadside power</li>
                                <li>• Move carriers from spawn to hide them</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
