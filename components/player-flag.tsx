import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PlayerFlagProps {
    isoCode?: string | null;
    className?: string;
    showName?: boolean;
}

export function PlayerFlag({ isoCode, className, showName = false }: PlayerFlagProps) {
    if (!isoCode || isoCode.length !== 2) {
        return null;
    }

    const code = isoCode.toLowerCase();

    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn("inline-flex items-center gap-1.5 align-middle", className)}>
                        <img
                            src={`https://flagcdn.com/w40/${code}.png`}
                            srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
                            alt={`${isoCode} Flag`}
                            className="h-full w-auto object-contain rounded-[2px] shadow-sm select-none min-w-[18px]"
                        />
                        {showName && <span className="text-xs text-muted-foreground">{isoCode}</span>}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isoCode.toUpperCase()}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
