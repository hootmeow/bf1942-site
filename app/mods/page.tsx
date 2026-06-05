import Link from "next/link";
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

const modThemes: Record<string, { icon: React.ElementType; color: string; bgColor: string; borderColor: string }> = {
    'desert-combat':     { icon: Plane,    color: 'text-amber-400',   bgColor: 'bg-amber-500/10',   borderColor: 'border-amber-500/25'   },
    'forgotten-hope':    { icon: Crosshair,color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/25' },
    'battlegroup42':     { icon: Globe,    color: 'text-blue-400',    bgColor: 'bg-blue-500/10',    borderColor: 'border-blue-500/25'    },
    'eve-of-destruction':{ icon: TreePine, color: 'text-green-400',   bgColor: 'bg-green-500/10',   borderColor: 'border-green-500/25'   },
    'interstate-82':     { icon: Car,      color: 'text-red-400',     bgColor: 'bg-red-500/10',     borderColor: 'border-red-500/25'     },
    'galactic-conquest': { icon: Rocket,   color: 'text-violet-400',  bgColor: 'bg-violet-500/10',  borderColor: 'border-violet-500/25'  },
};

export default function ModsPage() {
    return (
        <div className="space-y-10 pb-12">
            {/* Hero Section */}
            <div
                className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
                style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)" }}
            >
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/6 blur-[90px] pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/6 blur-[70px] pointer-events-none" />
                <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-12 max-w-3xl">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-3">
                        <Cog className="h-2.5 w-2.5" />
                        Community Content
                    </span>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-[#1e2a14] bg-[#070b05] p-4 text-center">
                    <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold text-foreground">{modsList.length}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50 mt-0.5">Featured Mods</p>
                </div>
                <div className="rounded-xl border border-[#1e2a14] bg-[#070b05] p-4 text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                    <p className="text-2xl font-bold text-foreground">Active</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50 mt-0.5">Communities</p>
                </div>
                <div className="rounded-xl border border-[#1e2a14] bg-[#070b05] p-4 text-center">
                    <Download className="h-6 w-6 mx-auto mb-2 text-emerald-400" />
                    <p className="text-2xl font-bold text-foreground">Free</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50 mt-0.5">All Downloads</p>
                </div>
                <div className="rounded-xl border border-[#1e2a14] bg-[#070b05] p-4 text-center">
                    <Star className="h-6 w-6 mx-auto mb-2 text-amber-400" />
                    <p className="text-2xl font-bold text-foreground">Tested</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50 mt-0.5">Compatibility</p>
                </div>
            </div>

            {/* Featured Mods Section */}
            <div className="space-y-5">
                <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Featured Mods</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#1e2a14] to-transparent" />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {modsList.map((mod) => {
                        const theme = modThemes[mod.slug] || {
                            icon: Cog,
                            color: 'text-primary',
                            bgColor: 'bg-primary/10',
                            borderColor: 'border-primary/25',
                        };
                        const Icon = theme.icon;

                        return (
                            <div
                                key={mod.slug}
                                className={`group relative flex flex-col overflow-hidden rounded-xl border bg-[#070b05] transition-all duration-300 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5 ${theme.borderColor}`}
                            >
                                {/* Accent top line */}
                                <div className={`h-[2px] w-full ${theme.bgColor}`} style={{ background: `var(--tw-gradient-stops, currentColor)` }} />

                                <div className="p-5 flex-1 flex flex-col gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${theme.bgColor}`}>
                                            <Icon className={`h-5 w-5 ${theme.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-foreground">{mod.name}</p>
                                            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/40 border border-[#1e2a14] bg-[#0a0f06] px-1.5 py-0.5 rounded inline-block mt-1">
                                                v{mod.version}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground/70 leading-relaxed flex-1">{mod.description}</p>
                                    <Link
                                        href={`/mods/${mod.slug}`}
                                        className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all hover:shadow-lg ${theme.color} ${theme.borderColor} ${theme.bgColor} hover:opacity-90`}
                                    >
                                        Learn More & Install
                                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>
                                <div className={`absolute inset-0 ${theme.bgColor} opacity-0 transition-opacity duration-500 group-hover:opacity-5 pointer-events-none`} />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Installation Notice */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400 shrink-0">
                    <Info className="h-4 w-4" />
                </div>
                <div className="text-sm">
                    <p className="text-foreground font-medium mb-1">Installation Notes</p>
                    <p className="text-muted-foreground/80">
                        Most mods require a clean installation of Battlefield 1942 (version 1.61). Each mod page includes
                        specific installation instructions, required patches, and troubleshooting tips. Always back up your
                        game files before installing modifications.
                    </p>
                </div>
            </div>

            {/* Community & Other Mods Section */}
            <div className="space-y-5">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Community & Other Mods</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#1e2a14] to-transparent" />
                </div>

                <div className="rounded-xl border border-[#1e2a14] bg-[#070b05] overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-[#1e2a14] bg-[#0a0f06] hover:bg-[#0a0f06]">
                                <TableHead className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50">Mod Name</TableHead>
                                <TableHead className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50">Author</TableHead>
                                <TableHead className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50 hidden md:table-cell">Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {otherModsList.map((mod) => (
                                <TableRow key={mod.name} className="border-[#1e2a14] hover:bg-[#0a0f06] transition-colors">
                                    <TableCell className="font-medium text-foreground">{mod.name}</TableCell>
                                    <TableCell>
                                        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50 border border-[#1e2a14] bg-[#0a0f06] px-1.5 py-0.5 rounded">
                                            {mod.author}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground/70 text-sm hidden md:table-cell">{mod.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Getting Started Tips */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
                    <Cog className="h-4 w-4 text-primary" />
                    Getting Started with Mods
                </h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                    {[
                        { n: "01", title: "Check Requirements", body: "Ensure you have BF1942 v1.61 installed. Most mods require specific game versions to function correctly." },
                        { n: "02", title: "Backup First", body: "Always backup your Mods folder and any game files before installing new modifications." },
                        { n: "03", title: "One Mod at a Time", body: "Only activate one major mod at a time. Running multiple mods simultaneously can cause conflicts." },
                        { n: "04", title: "Find Servers", body: "Use our Server Browser to find active servers running your favorite mod." },
                    ].map((step) => (
                        <div key={step.n} className="flex gap-3 rounded-lg border border-[#1e2a14] bg-[#070b05] p-4">
                            <span className="font-mono text-2xl font-black leading-none text-primary/15 select-none shrink-0">{step.n}</span>
                            <div>
                                <p className="font-semibold text-foreground mb-1">{step.title}</p>
                                <p className="text-muted-foreground/70">{step.body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
