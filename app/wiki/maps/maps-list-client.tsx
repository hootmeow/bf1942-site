"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Map,
    Search,
    ArrowRight,
    Filter,
    Users,
    Swords,
    Image as ImageIcon,
} from "lucide-react";
import { wikiMaps, getMapsByTheater, theaterColors, mapTypeColors } from "@/lib/wiki-maps";

export default function MapsListClient() {
    const searchParams = useSearchParams();
    const initialTheater = searchParams.get("theater") || "";

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTheater, setSelectedTheater] = useState(initialTheater);
    const [selectedType, setSelectedType] = useState("");

    const mapsByTheater = getMapsByTheater();
    const theaters = Object.keys(mapsByTheater);
    const mapTypes = ["Assault", "Head-On", "Conquest"];

    // Filter maps
    const filteredMaps = wikiMaps.filter(map => {
        const matchesSearch = map.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            map.overview.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTheater = !selectedTheater || map.theater === selectedTheater;
        const matchesType = !selectedType || map.mapType === selectedType;
        return matchesSearch && matchesTheater && matchesType;
    });

    // Group by theater for display
    const displayMaps = selectedTheater
        ? { [selectedTheater]: filteredMaps }
        : filteredMaps.reduce((acc, map) => {
            if (!acc[map.theater]) acc[map.theater] = [];
            acc[map.theater].push(map);
            return acc;
        }, {} as Record<string, typeof wikiMaps>);

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/wiki" className="hover:text-primary transition-colors">Wiki</Link>
                    <span>/</span>
                    <span className="text-foreground">Maps</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-blue-500/10">
                                <Map className="h-6 w-6 text-blue-500" />
                            </div>
                            Map Guides
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Detailed breakdowns for all {wikiMaps.length} maps across {theaters.length} theaters of war
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-border/60 bg-card/40">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search maps..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-background/50"
                            />
                        </div>

                        {/* Theater Filter */}
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={selectedTheater === "" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedTheater("")}
                                className="text-xs"
                            >
                                All Theaters
                            </Button>
                            {theaters.map(theater => {
                                const colors = theaterColors[theater];
                                const isActive = selectedTheater === theater;
                                return (
                                    <Button
                                        key={theater}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedTheater(isActive ? "" : theater)}
                                        className={`text-xs ${isActive ? `${colors.bg} ${colors.text} ${colors.border}` : ''}`}
                                    >
                                        {theater}
                                    </Button>
                                );
                            })}
                        </div>

                        {/* Type Filter */}
                        <div className="flex flex-wrap gap-2">
                            {mapTypes.map(type => {
                                const colors = mapTypeColors[type];
                                const isActive = selectedType === type;
                                return (
                                    <Button
                                        key={type}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedType(isActive ? "" : type)}
                                        className={`text-xs ${isActive ? `${colors.bg} ${colors.text}` : ''}`}
                                    >
                                        {type}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(selectedTheater || selectedType || searchQuery) && (
                        <div className="mt-3 pt-3 border-t border-border/40 flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-muted-foreground">Showing {filteredMaps.length} of {wikiMaps.length} maps</span>
                            {(selectedTheater || selectedType || searchQuery) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-6 px-2"
                                    onClick={() => {
                                        setSelectedTheater("");
                                        setSelectedType("");
                                        setSearchQuery("");
                                    }}
                                >
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Maps Grid by Theater */}
            {Object.entries(displayMaps).map(([theater, maps]) => {
                if (maps.length === 0) return null;
                const colors = theaterColors[theater];

                return (
                    <div key={theater} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge className={`${colors.bg} ${colors.text} border-0`}>
                                {theater}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{maps.length} maps</span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {maps.map(map => {
                                const typeColors = mapTypeColors[map.mapType];
                                return (
                                    <Link href={`/wiki/maps/${map.slug}`} key={map.slug}>
                                        <Card className="group h-full border-border/60 bg-card/40 hover:border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                                            {/* Map Image Placeholder */}
                                            <div className="relative h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                                <ImageIcon className="h-12 w-12 text-slate-700" />
                                                <div className="absolute top-3 left-3">
                                                    <Badge className={`${typeColors.bg} ${typeColors.text} border-0 text-[10px]`}>
                                                        {map.mapType}
                                                    </Badge>
                                                </div>
                                                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-card/90 to-transparent" />
                                            </div>

                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                        {map.name}
                                                    </h3>
                                                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                                                </div>

                                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                                    {map.overview}
                                                </p>

                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        <span>{map.factions.allies} vs {map.factions.axis}</span>
                                                    </div>
                                                    {map.controlPoints.length > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <Swords className="h-3 w-3" />
                                                            <span>{map.controlPoints.length} points</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {/* No Results */}
            {filteredMaps.length === 0 && (
                <div className="text-center py-16">
                    <Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No maps found</h3>
                    <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filters
                    </p>
                </div>
            )}
        </div>
    );
}
