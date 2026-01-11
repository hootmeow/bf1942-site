"use client";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useServerGeo } from "@/hooks/use-server-geo";

interface ServerFlagProps {
    ip: string;
    className?: string;
    showName?: boolean;
}

export function ServerFlag({ ip, className, showName = false }: ServerFlagProps) {
    const { data: geo, loading } = useServerGeo(ip);

    if (loading) {
        return <div className={cn("inline-block w-5 h-3.5 bg-muted animate-pulse rounded-[1px]", className)} />;
    }

    if (!geo) {
        return null;
    }

    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn("inline-flex items-center gap-1.5 align-middle", className)}>
                        <img
                            src={`https://flagcdn.com/w40/${geo.country_code.toLowerCase()}.png`}
                            srcSet={`https://flagcdn.com/w80/${geo.country_code.toLowerCase()}.png 2x`}
                            alt={`${geo.country_code} Flag`}
                            className="h-3.5 w-auto rounded-[2px] shadow-sm select-none object-cover min-w-[18px]"
                        />
                        {showName && <span className="text-xs text-muted-foreground">{geo.country}</span>}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{geo.city}, {geo.country}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
