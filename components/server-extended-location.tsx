"use client";

import { cn } from "@/lib/utils";
import { useServerGeo } from "@/hooks/use-server-geo";
import { Globe, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ServerExtendedLocationProps {
    ip: string;
    className?: string;
}

export function ServerExtendedLocation({ ip, className }: ServerExtendedLocationProps) {
    const { data: geo, loading } = useServerGeo(ip);

    if (loading) {
        return (
            <div className="rounded-lg border border-border/60 bg-card/40 p-4 animate-pulse">
                <div className="h-4 w-24 bg-muted mb-2 rounded" />
                <div className="h-6 w-32 bg-muted rounded" />
            </div>
        );
    }

    if (!geo) {
        return null;
    }

    return (
        <Card className={cn("border-border/60 bg-card/40", className)}>
            <CardContent className="p-4 flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Globe className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-xs font-medium text-muted-foreground">Location</h3>
                    <div className="flex items-center gap-2">
                        <img
                            src={`https://flagcdn.com/w40/${geo.country_code.toLowerCase()}.png`}
                            alt={`${geo.country_code} Flag`}
                            className="h-3.5 w-auto rounded-[2px] shadow-sm select-none"
                        />
                        <span className="text-base font-semibold text-foreground">
                            {geo.city}, {geo.region}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{geo.timezone.current_time.split('T')[1].split('-')[0].split('+')[0]} ({geo.timezone.abbr})</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
