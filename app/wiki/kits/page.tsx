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
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-500/10">
                        <Shield className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Soldier Kits</h1>
                        <p className="text-muted-foreground">The 5 infantry classes and their specialized roles</p>
                    </div>
                </div>
            </div>

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
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Primary</span>
                                                <span className="text-foreground font-medium">{kit.primaryWeapon}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Sidearm</span>
                                                <span className="text-foreground">{kit.sidearm}</span>
                                            </div>
                                            {kit.gadgets.length > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Gadgets</span>
                                                    <span className="text-foreground">{kit.gadgets.join(', ')}</span>
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
