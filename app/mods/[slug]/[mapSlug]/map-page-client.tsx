"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ModMapData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
    AlertTriangle,
    Loader2,
    ChevronRight,
    Map,
    Plane,
    Crosshair,
    Globe,
    TreePine,
    Car,
    Rocket,
    Cog,
    BookOpen,
    Images,
} from "lucide-react";

// Icon and color mapping for mods (same as mod-page-client)
const modThemes: Record<string, { icon: React.ElementType; color: string; bgColor: string; borderColor: string; gradientFrom: string }> = {
    'desert-combat': {
        icon: Plane,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        gradientFrom: 'from-amber-900/20',
    },
    'forgotten-hope': {
        icon: Crosshair,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        gradientFrom: 'from-green-900/20',
    },
    'battlegroup42': {
        icon: Globe,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        gradientFrom: 'from-blue-900/20',
    },
    'eve-of-destruction': {
        icon: TreePine,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        gradientFrom: 'from-emerald-900/20',
    },
    'interstate-82': {
        icon: Car,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        gradientFrom: 'from-red-900/20',
    },
    'galactic-conquest': {
        icon: Rocket,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        gradientFrom: 'from-purple-900/20',
    },
};

const defaultTheme = {
    icon: Cog,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    gradientFrom: 'from-primary/20',
};

// Helper to format mod slug for display
function formatModName(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function MapDetailPageClient() {
    const params = useParams();

    const modSlug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
    const mapSlug = Array.isArray(params.mapSlug) ? params.mapSlug.join('/') : params.mapSlug;

    const [map, setMap] = useState<ModMapData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const theme = modSlug ? (modThemes[modSlug] || defaultTheme) : defaultTheme;
    const ModIcon = theme.icon;

    useEffect(() => {
        if (!modSlug || !mapSlug) return;

        const loadMapData = async () => {
            try {
                setLoading(true);
                const mapDataModule = await import(`@/content/maps/${modSlug}/${mapSlug}`);
                const mapData: ModMapData = mapDataModule.default;
                setMap(mapData);
            } catch (e) {
                console.error("Failed to load map data", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadMapData();
    }, [modSlug, mapSlug]);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Loading Map...</p>
            </div>
        );
    }

    if (error || !map) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Map Not Found</AlertTitle>
                <AlertDescription>
                    This map could not be found.
                    <Button asChild variant="link" className="p-0 pl-2">
                        <Link href={modSlug ? `/mods/${modSlug}` : "/mods"}>Return to Mod</Link>
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    const modName = formatModName(modSlug || '');

    return (
        <div className="space-y-8 pb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <Link href="/mods" className="hover:text-primary transition-colors">Mods</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href={`/mods/${modSlug}`} className="hover:text-primary transition-colors">{modName}</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">{map.name}</span>
            </div>

            {/* Hero Section */}
            <div className={`relative overflow-hidden rounded-3xl border ${theme.borderColor} bg-gradient-to-br ${theme.gradientFrom} via-slate-900 to-slate-950 px-6 py-10 shadow-2xl sm:px-12 md:py-14`}>
                <div className={`absolute -right-20 -top-20 h-[350px] w-[350px] rounded-full ${theme.bgColor} blur-[100px]`} />
                <div className="absolute -bottom-20 -left-20 h-[250px] w-[250px] rounded-full bg-slate-500/10 blur-[80px]" />

                <div className="relative z-10">
                    <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${theme.bgColor} shrink-0`}>
                            <Map className={`h-6 w-6 ${theme.color}`} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className={`${theme.borderColor} ${theme.bgColor} ${theme.color}`}>
                                    <ModIcon className="h-3 w-3 mr-1" />
                                    {modName}
                                </Badge>
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                {map.name}
                            </h1>
                            <p className="mt-2 text-base text-slate-400 max-w-2xl leading-relaxed">
                                {map.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Section */}
            {map.galleryImages && map.galleryImages.length > 0 && (
                <Card className="border-border/60 bg-card/40">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2">
                            <Images className={`h-5 w-5 ${theme.color}`} />
                            Screenshots
                        </CardTitle>
                        <CardDescription>
                            In-game screenshots from {map.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center px-4 sm:px-12">
                        <Carousel
                            className="w-full max-w-2xl"
                            opts={{ loop: true }}
                            plugins={[
                                Autoplay({
                                    delay: 4000,
                                    stopOnInteraction: true,
                                }),
                            ]}
                        >
                            <CarouselContent>
                                {map.galleryImages.map((src, index) => (
                                    <CarouselItem key={index}>
                                        <Image
                                            src={src}
                                            alt={`Screenshot of ${map.name} ${index + 1}`}
                                            width={1280}
                                            height={720}
                                            className="aspect-video w-full rounded-lg border border-border/60 object-cover"
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </CardContent>
                </Card>
            )}

            {/* Map Guide Content */}
            <Card className="border-border/60 bg-card/40">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className={`h-5 w-5 ${theme.color}`} />
                        Map Guide
                    </CardTitle>
                    <CardDescription>
                        Tactical information and gameplay tips
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm prose-invert max-w-none text-muted-foreground
                        prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
                        prose-h3:text-lg prose-h3:border-b prose-h3:border-border/40 prose-h3:pb-2
                        prose-p:leading-relaxed prose-p:mb-4
                        prose-ul:my-4 prose-li:my-1
                        prose-strong:text-foreground
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                        {map.content}
                    </div>
                </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button asChild variant="outline" size="lg">
                    <Link href={`/mods/${modSlug}`}>
                        <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                        Back to {modName}
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/mods">
                        View All Mods
                    </Link>
                </Button>
            </div>
        </div>
    );
}
