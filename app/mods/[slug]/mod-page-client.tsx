"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ModData } from "@/lib/types";
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
import {
    AlertTriangle,
    Download,
    Map,
    Loader2,
    ChevronRight,
    Plane,
    Crosshair,
    Globe,
    TreePine,
    Car,
    Rocket,
    Cog,
    BookOpen,
    Images,
    ExternalLink,
    ArrowRight,
    Info,
} from "lucide-react";

// Icon and color mapping for mods
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

export default function ModDetailPageClient() {
    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;

    const [mod, setMod] = useState<ModData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const theme = slug ? (modThemes[slug] || defaultTheme) : defaultTheme;
    const Icon = theme.icon;

    useEffect(() => {
        if (!slug) return;

        const loadModData = async () => {
            try {
                setLoading(true);
                const modData = await import(`@/content/mods/${slug}`);
                setMod(modData.default);
            } catch (e) {
                console.error("Failed to load mod data", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadModData();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Loading Mod...</p>
            </div>
        );
    }

    if (error || !mod) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Mod Not Found</AlertTitle>
                <AlertDescription>
                    This mod could not be found.
                    <Button asChild variant="link" className="p-0 pl-2">
                        <Link href="/mods">Return to Mods</Link>
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/mods" className="hover:text-primary transition-colors">Mods & Expansions</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">{mod.name}</span>
            </div>

            {/* Hero Section */}
            <div className={`relative overflow-hidden rounded-3xl border ${theme.borderColor} bg-gradient-to-br ${theme.gradientFrom} via-slate-900 to-slate-950 px-6 py-12 shadow-2xl sm:px-12 md:py-16`}>
                <div className={`absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full ${theme.bgColor} blur-[120px]`} />
                <div className="absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-slate-500/10 blur-[100px]" />

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${theme.bgColor} shrink-0`}>
                                <Icon className={`h-7 w-7 ${theme.color}`} />
                            </div>
                            <div>
                                <Badge variant="outline" className={`mb-2 ${theme.borderColor} ${theme.bgColor} ${theme.color}`}>
                                    <Cog className="h-3 w-3 mr-1" />
                                    Modification
                                </Badge>
                                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                    {mod.name}
                                </h1>
                                <p className="mt-2 text-lg text-slate-400 max-w-2xl leading-relaxed">
                                    {mod.description}
                                </p>
                                <div className="flex items-center gap-3 mt-4">
                                    <Badge variant="outline" className="text-slate-300 border-slate-600">
                                        Version {mod.version}
                                    </Badge>
                                    {mod.maps && mod.maps.length > 0 && (
                                        <Badge variant="outline" className="text-slate-300 border-slate-600">
                                            <Map className="h-3 w-3 mr-1" />
                                            {mod.maps.length} Maps
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Download Button in Hero */}
                        {mod.downloadLinks && mod.downloadLinks.length > 0 && (
                            <div className="shrink-0">
                                <Button asChild size="lg" className={`${theme.bgColor} ${theme.color} border ${theme.borderColor} hover:bg-opacity-20`}>
                                    <a href={mod.downloadLinks[0].url} target="_blank" rel="noreferrer">
                                        <Download className="mr-2 h-5 w-5" />
                                        Download Now
                                    </a>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Downloads Section */}
            {mod.downloadLinks && mod.downloadLinks.length > 0 && (
                <Card className={`${theme.borderColor} border ${theme.bgColor}`}>
                    <CardHeader className="pb-3">
                        <CardTitle className={`flex items-center gap-2 ${theme.color}`}>
                            <Download className="h-5 w-5" />
                            Downloads
                        </CardTitle>
                        <CardDescription>
                            Official download links for {mod.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {mod.downloadLinks.map((link) => (
                                <Button
                                    asChild
                                    key={link.name}
                                    variant="outline"
                                    className={`justify-between h-auto py-3 px-4 ${theme.borderColor} hover:${theme.bgColor}`}
                                >
                                    <a href={link.url} target="_blank" rel="noreferrer">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${theme.bgColor}`}>
                                                <Download className={`h-4 w-4 ${theme.color}`} />
                                            </div>
                                            <span className="font-medium">{link.name}</span>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Gallery Section */}
            {mod.galleryImages && mod.galleryImages.length > 0 && (
                <Card className="border-border/60 bg-card/40">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2">
                            <Images className="h-5 w-5 text-primary" />
                            Gallery
                        </CardTitle>
                        <CardDescription>
                            Screenshots from {mod.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center px-4 sm:px-12">
                        <Carousel className="w-full max-w-2xl" opts={{ loop: true }}>
                            <CarouselContent>
                                {mod.galleryImages.map((src, index) => (
                                    <CarouselItem key={index}>
                                        <Image
                                            src={src}
                                            alt={`${mod.name} gallery image ${index + 1}`}
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

            {/* Mod Details / Content Section */}
            <Card className="border-border/60 bg-card/40">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        About {mod.name}
                    </CardTitle>
                    <CardDescription>
                        Detailed information, features, and installation guide
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm prose-invert max-w-none text-muted-foreground
                        prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
                        prose-h3:text-lg prose-h3:border-b prose-h3:border-border/40 prose-h3:pb-2
                        prose-p:leading-relaxed prose-p:mb-4
                        prose-ul:my-4 prose-li:my-1
                        prose-table:border prose-table:border-border/60 prose-table:rounded-lg prose-table:overflow-hidden
                        prose-th:bg-muted/50 prose-th:text-foreground prose-th:font-semibold
                        prose-td:border-border/40
                        prose-strong:text-foreground
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                        {mod.content}
                    </div>
                </CardContent>
            </Card>

            {/* Installation Notice */}
            <Card className="border-blue-500/30 bg-blue-500/5">
                <CardContent className="p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                        <Info className="h-4 w-4" />
                    </div>
                    <div className="text-sm">
                        <p className="text-foreground font-medium mb-1">Installation Reminder</p>
                        <p className="text-muted-foreground">
                            Most mods require Battlefield 1942 version 1.61. Always back up your Mods folder before installing.
                            If you encounter issues, try running the game as administrator or check compatibility mode settings.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Maps Section */}
            {mod.maps && mod.maps.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className={`rounded-lg ${theme.bgColor} p-2 ${theme.color}`}>
                            <Map className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Maps in {mod.name}</h2>
                            <p className="text-sm text-muted-foreground">Browse all maps included in this modification</p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {mod.maps.map((map) => (
                            <Link
                                key={map.slug}
                                href={`/mods/${slug}/${map.slug}`}
                                className={`group relative flex items-start gap-4 rounded-xl border ${theme.borderColor} bg-card/40 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                            >
                                <div className={`rounded-lg ${theme.bgColor} p-2.5 ${theme.color} shrink-0`}>
                                    <Map className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {map.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {map.description}
                                    </p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 self-center" />
                                <div className={`absolute inset-0 ${theme.bgColor} opacity-0 transition-opacity duration-500 group-hover:opacity-10 pointer-events-none rounded-xl`} />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Back to Mods */}
            <div className="flex justify-center pt-4">
                <Button asChild variant="outline" size="lg">
                    <Link href="/mods">
                        <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                        Back to All Mods
                    </Link>
                </Button>
            </div>
        </div>
    );
}
