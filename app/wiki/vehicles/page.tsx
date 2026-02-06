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
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10">
                        <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Vehicles</h1>
                        <p className="text-muted-foreground">Master land, air, and sea combat</p>
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
