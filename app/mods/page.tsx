import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Cog,
    Download,
    Users,
    ArrowRight,
    Star,
    Plane,
    Crosshair,
    Globe,
    TreePine,
    Car,
    Rocket,
    Sparkles,
    Package,
    Info,
} from "lucide-react";
import { modsList, otherModsList } from "@/lib/mods-list";

export const metadata = {
    title: "Mods & Expansions",
    description: "Curated Battlefield 1942 mods vetted for stability, authenticity, and active communities.",
};

// Icon and color mapping for featured mods
const modThemes: Record<string, { icon: React.ElementType; color: string; bgColor: string; borderColor: string }> = {
    'desert-combat': {
        icon: Plane,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
    },
    'forgotten-hope': {
        icon: Crosshair,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
    },
    'battlegroup42': {
        icon: Globe,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
    },
    'eve-of-destruction': {
        icon: TreePine,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
    },
    'interstate-82': {
        icon: Car,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
    },
    'galactic-conquest': {
        icon: Rocket,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
    },
};

export default function ModsPage() {
    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-6 py-16 shadow-2xl sm:px-12 md:py-24">
                <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px]" />

                <div className="relative z-10 max-w-3xl">
                    <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
                        <Cog className="h-3 w-3 mr-1" />
                        Community Content
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                        Mods & Expansions
                    </h1>
                    <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed">
                        Curated Battlefield 1942 modifications vetted for stability, authenticity, and active communities.
                        From modern warfare to the Vietnam jungle, these mods transform the classic experience.
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-border/60 bg-card/40">
                    <CardContent className="p-4 text-center">
                        <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold text-foreground">{modsList.length}</p>
                        <p className="text-xs text-muted-foreground">Featured Mods</p>
                    </CardContent>
                </Card>
                <Card className="border-border/60 bg-card/40">
                    <CardContent className="p-4 text-center">
                        <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                        <p className="text-2xl font-bold text-foreground">Active</p>
                        <p className="text-xs text-muted-foreground">Communities</p>
                    </CardContent>
                </Card>
                <Card className="border-border/60 bg-card/40">
                    <CardContent className="p-4 text-center">
                        <Download className="h-6 w-6 mx-auto mb-2 text-green-500" />
                        <p className="text-2xl font-bold text-foreground">Free</p>
                        <p className="text-xs text-muted-foreground">All Downloads</p>
                    </CardContent>
                </Card>
                <Card className="border-border/60 bg-card/40">
                    <CardContent className="p-4 text-center">
                        <Star className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                        <p className="text-2xl font-bold text-foreground">Tested</p>
                        <p className="text-xs text-muted-foreground">Compatibility</p>
                    </CardContent>
                </Card>
            </div>

            {/* Featured Mods Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Star className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Featured Mods</h2>
                        <p className="text-sm text-muted-foreground">Top-tier modifications with active player bases</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {modsList.map((mod) => {
                        const theme = modThemes[mod.slug] || {
                            icon: Cog,
                            color: 'text-primary',
                            bgColor: 'bg-primary/10',
                            borderColor: 'border-primary/30',
                        };
                        const Icon = theme.icon;

                        return (
                            <Card
                                key={mod.slug}
                                className={`group relative flex flex-col overflow-hidden border ${theme.borderColor} bg-card/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start gap-3">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${theme.bgColor}`}>
                                            <Icon className={`h-5 w-5 ${theme.color}`} />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-foreground">{mod.name}</CardTitle>
                                            <CardDescription className="mt-1">
                                                <Badge variant="outline" className="text-xs">
                                                    v{mod.version}
                                                </Badge>
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-muted-foreground leading-relaxed">{mod.description}</p>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button asChild variant="outline" className="w-full group-hover:border-primary/50 group-hover:text-primary transition-colors">
                                        <Link href={`/mods/${mod.slug}`}>
                                            Learn More & Install
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                                <div className={`absolute inset-0 ${theme.bgColor} opacity-0 transition-opacity duration-500 group-hover:opacity-10 pointer-events-none`} />
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Installation Notice */}
            <Card className="border-blue-500/30 bg-blue-500/5">
                <CardContent className="p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                        <Info className="h-4 w-4" />
                    </div>
                    <div className="text-sm">
                        <p className="text-foreground font-medium mb-1">Installation Notes</p>
                        <p className="text-muted-foreground">
                            Most mods require a clean installation of Battlefield 1942 (version 1.61). Each mod page includes
                            specific installation instructions, required patches, and troubleshooting tips. Always back up your
                            game files before installing modifications.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Community & Other Mods Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Community & Other Mods</h2>
                        <p className="text-sm text-muted-foreground">Additional modifications worth exploring</p>
                    </div>
                </div>

                <Card className="border-border/60 bg-card/40">
                    <CardContent className="pt-6">
                        <div className="rounded-lg border border-border/60 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead className="font-semibold">Mod Name</TableHead>
                                        <TableHead className="font-semibold">Author</TableHead>
                                        <TableHead className="font-semibold hidden md:table-cell">Description</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {otherModsList.map((mod) => (
                                        <TableRow key={mod.name} className="hover:bg-muted/20">
                                            <TableCell className="font-medium text-foreground">{mod.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs">{mod.author}</Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm hidden md:table-cell">{mod.description}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Getting Started Tips */}
            <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <Cog className="h-5 w-5 text-primary" />
                        Getting Started with Mods
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="p-4 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-2">1. Check Requirements</p>
                            <p className="text-muted-foreground">Ensure you have BF1942 v1.61 installed. Most mods require specific game versions to function correctly.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-2">2. Backup First</p>
                            <p className="text-muted-foreground">Always backup your Mods folder and any game files before installing new modifications.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-2">3. One Mod at a Time</p>
                            <p className="text-muted-foreground">Only activate one major mod at a time. Running multiple mods simultaneously can cause conflicts.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background/50">
                            <p className="font-medium text-foreground mb-2">4. Find Servers</p>
                            <p className="text-muted-foreground">Use our <Link href="/servers" className="text-primary hover:underline">Server Browser</Link> to find active servers running your favorite mod.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
