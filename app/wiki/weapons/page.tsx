import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Crosshair,
    ChevronRight,
    Shield,
    Swords,
    Target,
    Lightbulb,
    Info,
    History,
    Gamepad2,
    BookOpen,
} from "lucide-react";
import { weapons, emplacements, getWeaponsByAffiliation } from "@/lib/wiki-gameplay";
import { detailedWeapons, weaponCategories, getWeaponsByCategory } from "@/lib/wiki-weapons-detailed";

export const metadata = {
    title: "Weapons & Emplacements | BF1942 Wiki",
    description: "Complete guide to infantry weapons and static gun emplacements in Battlefield 1942.",
};

const rangeColors: Record<string, string> = {
    'Short': 'bg-red-500/20 text-red-400',
    'Short-Intermediate': 'bg-orange-500/20 text-orange-400',
    'Intermediate-Long': 'bg-blue-500/20 text-blue-400',
    'Long': 'bg-purple-500/20 text-purple-400',
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    'Sidearm': { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
    'SMG': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
    'Assault Rifle': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
    'Rifle': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    'Sniper': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
    'Anti-Tank': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
    'Explosive': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
};

export default function WeaponsPage() {
    const alliedWeapons = getWeaponsByAffiliation('Allies');
    const axisWeapons = getWeaponsByAffiliation('Axis');

    return (
        <div className="space-y-8 pb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/wiki" className="hover:text-primary transition-colors">Wiki</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">Weapons & Emplacements</span>
            </div>

            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-500/10">
                        <Crosshair className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Weapons & Emplacements</h1>
                        <p className="text-muted-foreground">Infantry firearms and static gun positions</p>
                    </div>
                </div>
            </div>

            {/* Quick Navigation */}
            <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground mr-2">Jump to:</span>
                {weaponCategories.map((cat) => (
                    <a key={cat.id} href={`#${cat.id.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Badge variant="outline" className="hover:bg-primary/10 transition-colors cursor-pointer">
                            {cat.name}
                        </Badge>
                    </a>
                ))}
            </div>

            {/* Weapons by Faction */}
            <Tabs defaultValue="allies" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="allies" className="gap-2">
                        <Shield className="h-4 w-4" />
                        Allied Weapons
                    </TabsTrigger>
                    <TabsTrigger value="axis" className="gap-2">
                        <Swords className="h-4 w-4" />
                        Axis Weapons
                    </TabsTrigger>
                    <TabsTrigger value="emplacements" className="gap-2">
                        <Target className="h-4 w-4" />
                        Emplacements
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="allies">
                    <Card className="border-blue-500/30 bg-blue-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-400">
                                <Shield className="h-5 w-5" />
                                Allied Weapons
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border border-border/60 overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/30">
                                            <TableHead className="font-semibold">Weapon</TableHead>
                                            <TableHead className="font-semibold">Type</TableHead>
                                            <TableHead className="font-semibold">Kit</TableHead>
                                            <TableHead className="font-semibold hidden md:table-cell">Nationality</TableHead>
                                            <TableHead className="font-semibold text-center">Mag</TableHead>
                                            <TableHead className="font-semibold text-center hidden sm:table-cell">Ammo</TableHead>
                                            <TableHead className="font-semibold">Range</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {alliedWeapons.filter(w => w.affiliation === 'Allies' || w.affiliation === 'Both').map((weapon) => (
                                            <TableRow key={weapon.name}>
                                                <TableCell className="font-medium">{weapon.name}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm">{weapon.type}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-xs">{weapon.kit}</Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm hidden md:table-cell">{weapon.nationality}</TableCell>
                                                <TableCell className="text-center font-mono">{weapon.magCapacity}</TableCell>
                                                <TableCell className="text-center font-mono hidden sm:table-cell">{weapon.ammoCount}</TableCell>
                                                <TableCell>
                                                    <Badge className={`${rangeColors[weapon.effectiveRange]} border-0 text-xs`}>
                                                        {weapon.effectiveRange}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="axis">
                    <Card className="border-red-500/30 bg-red-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-400">
                                <Swords className="h-5 w-5" />
                                Axis Weapons
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border border-border/60 overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/30">
                                            <TableHead className="font-semibold">Weapon</TableHead>
                                            <TableHead className="font-semibold">Type</TableHead>
                                            <TableHead className="font-semibold">Kit</TableHead>
                                            <TableHead className="font-semibold hidden md:table-cell">Nationality</TableHead>
                                            <TableHead className="font-semibold text-center">Mag</TableHead>
                                            <TableHead className="font-semibold text-center hidden sm:table-cell">Ammo</TableHead>
                                            <TableHead className="font-semibold">Range</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {axisWeapons.filter(w => w.affiliation === 'Axis' || w.affiliation === 'Both').map((weapon) => (
                                            <TableRow key={weapon.name}>
                                                <TableCell className="font-medium">{weapon.name}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm">{weapon.type}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-xs">{weapon.kit}</Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm hidden md:table-cell">{weapon.nationality}</TableCell>
                                                <TableCell className="text-center font-mono">{weapon.magCapacity}</TableCell>
                                                <TableCell className="text-center font-mono hidden sm:table-cell">{weapon.ammoCount}</TableCell>
                                                <TableCell>
                                                    <Badge className={`${rangeColors[weapon.effectiveRange]} border-0 text-xs`}>
                                                        {weapon.effectiveRange}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="emplacements">
                    <div className="space-y-4">
                        {emplacements.map((emp) => (
                            <Card key={emp.name} className="border-border/60 bg-card/40">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5 text-primary" />
                                        {emp.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-muted-foreground">{emp.description}</p>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                                            <p className="text-xs font-semibold text-green-500 uppercase mb-2">Effective Against</p>
                                            <div className="flex flex-wrap gap-1">
                                                {emp.effectiveAgainst.map((target) => (
                                                    <Badge key={target} variant="outline" className="text-xs bg-green-500/10 border-green-500/30 text-green-400">
                                                        {target}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                                            <p className="text-xs font-semibold text-red-500 uppercase mb-2">Vulnerability</p>
                                            <p className="text-sm text-muted-foreground">{emp.vulnerability}</p>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Lightbulb className="h-4 w-4 text-amber-500" />
                                            <p className="text-xs font-semibold text-amber-500 uppercase">Tactics</p>
                                        </div>
                                        <ul className="space-y-1">
                                            {emp.tactics.map((tactic, i) => (
                                                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                                    <span className="text-amber-500/50">•</span>
                                                    {tactic}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Supplies Note */}
                        <Card className="border-border/60 bg-muted/20">
                            <CardContent className="p-4">
                                <h4 className="font-semibold text-foreground mb-2">Infantry Supplies</h4>
                                <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                    <div>
                                        <p className="font-medium text-foreground">First Aid Cabinets</p>
                                        <p>Found at control points. Standing nearby restores health over time. Radius can extend through walls.</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">Ammo Boxes</p>
                                        <p>Resupply all ammunition, grenades, mines, and explosives. Enables "grenade spamming" near boxes.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Detailed Weapon Guide Section */}
            <div className="space-y-6 pt-8 border-t border-border/60">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Detailed Weapon Guide</h2>
                        <p className="text-sm text-muted-foreground">In-depth analysis of every infantry weapon</p>
                    </div>
                </div>

                {/* Weapons by Category */}
                {weaponCategories.map((category) => {
                    const categoryWeapons = getWeaponsByCategory(category.id);
                    if (categoryWeapons.length === 0) return null;

                    const colors = categoryColors[category.id] || categoryColors['Sidearm'];

                    return (
                        <div key={category.id} id={category.id.toLowerCase().replace(/\s+/g, '-')} className="space-y-4 scroll-mt-24">
                            <div className="flex items-center gap-3">
                                <Badge className={`${colors.bg} ${colors.text} border-0 text-sm px-3 py-1`}>
                                    {category.name}
                                </Badge>
                                <span className="text-sm text-muted-foreground">{category.description}</span>
                            </div>

                            <div className="grid gap-4">
                                {categoryWeapons.map((weapon) => (
                                    <Card key={weapon.id} className={`${colors.border} border bg-card/40`}>
                                        <CardHeader className="pb-3">
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div>
                                                    <CardTitle className="flex items-center gap-2">
                                                        {weapon.name}
                                                    </CardTitle>
                                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                                        <Badge variant="outline" className={weapon.affiliation === 'Allies' ? 'border-blue-500/50 text-blue-400' : weapon.affiliation === 'Axis' ? 'border-red-500/50 text-red-400' : 'border-purple-500/50 text-purple-400'}>
                                                            {weapon.affiliation}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs">
                                                            {weapon.kit}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">{weapon.nationality}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right text-sm">
                                                    <p className="text-muted-foreground">
                                                        <span className="font-medium text-foreground">{weapon.magCapacity > 0 ? weapon.magCapacity : 'N/A'}</span> round mag
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">{weapon.totalAmmo} total</p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Specs Bar */}
                                            <div className="flex flex-wrap gap-4 text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="text-muted-foreground">{weapon.mechanism}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Target className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="text-muted-foreground">{weapon.effectiveRange}</span>
                                                </div>
                                            </div>

                                            {/* Three Column Info */}
                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <History className="h-4 w-4 text-muted-foreground" />
                                                        <p className="text-xs font-semibold uppercase text-muted-foreground">Historical Context</p>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{weapon.historicalContext}</p>
                                                </div>

                                                <div className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                                                        <p className="text-xs font-semibold uppercase text-muted-foreground">In-Game Performance</p>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{weapon.inGamePerformance}</p>
                                                </div>

                                                <div className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Lightbulb className="h-4 w-4 text-muted-foreground" />
                                                        <p className="text-xs font-semibold uppercase text-muted-foreground">Tactical Analysis</p>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{weapon.tacticalAnalysis}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tips Summary */}
            <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        Combat Tips
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="p-4 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-2">Weapon Switching</p>
                            <p className="text-muted-foreground">After firing a rocket launcher, immediately switch to your pistol for self-defense during the long reload animation.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-2">Trigger Discipline</p>
                            <p className="text-muted-foreground">Small magazine weapons like the BAR require controlled bursts. Fire 3-5 rounds at a time to maintain accuracy and conserve ammo.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-2">Range Awareness</p>
                            <p className="text-muted-foreground">SMGs suffer severe damage drop-off beyond 75m. Close the distance before engaging or switch to a captured rifle.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-2">Ammo Management</p>
                            <p className="text-muted-foreground">Engineers near ammo boxes can spam explosives indefinitely. Use this for area denial or rapid vehicle destruction.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
