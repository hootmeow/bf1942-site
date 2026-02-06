import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Map,
    Flag,
    Swords,
    Shield,
    Target,
    Truck,
    AlertTriangle,
    ChevronRight,
    Users,
    Lightbulb,
    Image as ImageIcon,
    MapPin,
    Box,
    Crosshair,
} from "lucide-react";
import { getMapBySlug, wikiMaps, theaterColors, mapTypeColors, type ControlPoint } from "@/lib/wiki-maps";

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Generate static params for all maps
export async function generateStaticParams() {
    return wikiMaps.map((map) => ({
        slug: map.slug,
    }));
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const map = getMapBySlug(slug);
    if (!map) return { title: "Map Not Found" };

    return {
        title: `${map.name} - Map Guide | BF1942 Wiki`,
        description: `Complete guide to ${map.name} in Battlefield 1942. ${map.overview}`,
    };
}

// Control point card component
function ControlPointCard({ point, index }: { point: ControlPoint; index: number }) {
    const controlColors: Record<string, string> = {
        'Allies': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'American': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'British': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'Soviet': 'bg-red-500/20 text-red-400 border-red-500/30',
        'Axis': 'bg-red-500/20 text-red-400 border-red-500/30',
        'German': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        'Japanese': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        'Neutral': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };

    const colorClass = controlColors[point.initialControl] || controlColors['Neutral'];

    return (
        <Card className="border-border/60 bg-card/40 overflow-hidden">
            <div className="flex">
                {/* Image Placeholder */}
                <div className="w-32 h-full min-h-[180px] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shrink-0">
                    <ImageIcon className="h-8 w-8 text-slate-700" />
                </div>

                <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-muted-foreground">#{String.fromCharCode(65 + index)}</span>
                                <h4 className="font-bold text-foreground">{point.name}</h4>
                            </div>
                            {point.gridRef && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> Grid {point.gridRef}
                                </span>
                            )}
                        </div>
                        <Badge className={`${colorClass} border text-[10px]`}>
                            {point.initialControl}
                        </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {point.analysis}
                    </p>

                    <div className="flex flex-wrap gap-3 text-xs">
                        {point.vehicles && point.vehicles.length > 0 && (
                            <div className="flex items-center gap-1 text-green-500">
                                <Truck className="h-3 w-3" />
                                <span>{point.vehicles.length} vehicles</span>
                            </div>
                        )}
                        {point.defenses && point.defenses.length > 0 && (
                            <div className="flex items-center gap-1 text-red-500">
                                <Crosshair className="h-3 w-3" />
                                <span>{point.defenses.length} defenses</span>
                            </div>
                        )}
                        {point.supplies && point.supplies.length > 0 && (
                            <div className="flex items-center gap-1 text-amber-500">
                                <Box className="h-3 w-3" />
                                <span>{point.supplies.length} supplies</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

// Expanded control point view
function ControlPointExpanded({ point, index }: { point: ControlPoint; index: number }) {
    const controlColors: Record<string, string> = {
        'Allies': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'American': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'British': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'Soviet': 'bg-red-500/20 text-red-400 border-red-500/30',
        'Axis': 'bg-red-500/20 text-red-400 border-red-500/30',
        'German': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        'Japanese': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        'Neutral': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };

    const colorClass = controlColors[point.initialControl] || controlColors['Neutral'];

    return (
        <Card className="border-border/60 bg-card/40">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs font-mono">
                                {String.fromCharCode(65 + index)}
                            </Badge>
                            <CardTitle className="text-lg">{point.name}</CardTitle>
                        </div>
                        {point.gridRef && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> Grid Reference: {point.gridRef}
                            </span>
                        )}
                    </div>
                    <Badge className={`${colorClass} border`}>
                        {point.initialControl} Control
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Image Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <ImageIcon className="h-12 w-12 mx-auto text-slate-700 mb-2" />
                        <p className="text-xs text-slate-600">Screenshot coming soon</p>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                    {point.analysis}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Vehicles */}
                    {point.vehicles && point.vehicles.length > 0 && (
                        <div className="space-y-2">
                            <h5 className="text-xs font-semibold text-foreground flex items-center gap-2">
                                <Truck className="h-3 w-3 text-green-500" />
                                Vehicles
                            </h5>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                {point.vehicles.map((v, i) => (
                                    <li key={i} className="flex items-start gap-1">
                                        <span className="text-green-500/50">•</span>
                                        {v}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Defenses */}
                    {point.defenses && point.defenses.length > 0 && (
                        <div className="space-y-2">
                            <h5 className="text-xs font-semibold text-foreground flex items-center gap-2">
                                <Crosshair className="h-3 w-3 text-red-500" />
                                Defenses
                            </h5>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                {point.defenses.map((d, i) => (
                                    <li key={i} className="flex items-start gap-1">
                                        <span className="text-red-500/50">•</span>
                                        {d}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Supplies */}
                    {point.supplies && point.supplies.length > 0 && (
                        <div className="space-y-2">
                            <h5 className="text-xs font-semibold text-foreground flex items-center gap-2">
                                <Box className="h-3 w-3 text-amber-500" />
                                Supplies
                            </h5>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                {point.supplies.map((s, i) => (
                                    <li key={i} className="flex items-start gap-1">
                                        <span className="text-amber-500/50">•</span>
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default async function MapDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const map = getMapBySlug(slug);

    if (!map) {
        notFound();
    }

    const theaterColor = theaterColors[map.theater];
    const typeColor = mapTypeColors[map.mapType];

    return (
        <div className="space-y-8 pb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/wiki" className="hover:text-primary transition-colors">Wiki</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/wiki/maps" className="hover:text-primary transition-colors">Maps</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">{map.name}</span>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60">
                {/* Hero Image Placeholder */}
                <div className="h-64 md:h-80 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center relative">
                    <div className="text-center">
                        <ImageIcon className="h-16 w-16 mx-auto text-slate-700 mb-3" />
                        <p className="text-sm text-slate-600">Map overview image coming soon</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </div>

                {/* Map Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge className={`${theaterColor.bg} ${theaterColor.text} border-0`}>
                            {map.theater}
                        </Badge>
                        <Badge className={`${typeColor.bg} ${typeColor.text} border-0`}>
                            {map.mapType}
                        </Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                        {map.name}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {map.factions.allies} vs {map.factions.axis}
                        </span>
                        <span className="flex items-center gap-1">
                            <Flag className="h-4 w-4" />
                            {map.controlPoints.length} Control Points
                        </span>
                    </div>
                </div>
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-4 gap-2">
                {map.galleryImages.map((img, i) => (
                    <div key={i} className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-slate-700" />
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Overview */}
                    <Card className="border-border/60 bg-card/40">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Map className="h-5 w-5 text-primary" />
                                Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed">
                                {map.overview}
                            </p>
                            <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
                                <h4 className="text-sm font-semibold text-foreground mb-2">Historical Context</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {map.historicalContext}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Control Points */}
                    {map.controlPoints.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Flag className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Control Points</h2>
                            </div>

                            <Tabs defaultValue="grid" className="w-full">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                                    <TabsTrigger value="detailed">Detailed View</TabsTrigger>
                                </TabsList>

                                <TabsContent value="grid" className="mt-0">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {map.controlPoints.map((point, i) => (
                                            <ControlPointCard key={i} point={point} index={i} />
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="detailed" className="mt-0">
                                    <div className="space-y-4">
                                        {map.controlPoints.map((point, i) => (
                                            <ControlPointExpanded key={i} point={point} index={i} />
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}

                    {/* Key Tactics */}
                    {map.keyTactics.length > 0 && (
                        <Card className="border-border/60 bg-card/40">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-amber-500" />
                                    Key Tactics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {map.keyTactics.map((tactic, i) => (
                                        <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border/40">
                                            <h4 className="font-semibold text-foreground mb-2">{tactic.title}</h4>
                                            <p className="text-sm text-muted-foreground">{tactic.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column - Strategies */}
                <div className="space-y-6">
                    {/* Allied Strategy */}
                    {map.alliedStrategy.steps.length > 0 && (
                        <Card className="border-blue-500/30 bg-blue-500/5">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-blue-400">
                                    <Shield className="h-5 w-5" />
                                    {map.alliedStrategy.faction} Strategy
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ol className="space-y-3">
                                    {map.alliedStrategy.steps.map((step, i) => (
                                        <li key={i} className="flex gap-3 text-sm">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                                                {i + 1}
                                            </span>
                                            <span className="text-muted-foreground leading-relaxed">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </CardContent>
                        </Card>
                    )}

                    {/* Axis Strategy */}
                    {map.axisStrategy.steps.length > 0 && (
                        <Card className="border-red-500/30 bg-red-500/5">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-red-400">
                                    <Swords className="h-5 w-5" />
                                    {map.axisStrategy.faction} Strategy
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ol className="space-y-3">
                                    {map.axisStrategy.steps.map((step, i) => (
                                        <li key={i} className="flex gap-3 text-sm">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold">
                                                {i + 1}
                                            </span>
                                            <span className="text-muted-foreground leading-relaxed">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Info */}
                    <Card className="border-border/60 bg-card/40">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Quick Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Theater</span>
                                <Badge className={`${theaterColor.bg} ${theaterColor.text} border-0`}>
                                    {map.theater}
                                </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Map Type</span>
                                <Badge className={`${typeColor.bg} ${typeColor.text} border-0`}>
                                    {map.mapType}
                                </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Allies</span>
                                <span className="text-foreground">{map.factions.allies}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Axis</span>
                                <span className="text-foreground">{map.factions.axis}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Control Points</span>
                                <span className="text-foreground">{map.controlPoints.length}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
