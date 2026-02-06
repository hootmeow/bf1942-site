"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/animated-counter";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon | React.ElementType;
    className?: string;
    description?: string;
    trend?: "up" | "down" | "neutral";
    highlight?: boolean;
    animate?: boolean;
    decimals?: number;
    suffix?: string;
    prefix?: string;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    className,
    description,
    trend,
    highlight,
    animate = false,
    decimals = 0,
    suffix = "",
    prefix = ""
}: StatCardProps) {
    const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, ''));
    const canAnimate = animate && !isNaN(numericValue);

    return (
        <div className={cn(
            "group relative rounded-xl border border-border/60 bg-card/40 p-4 transition-all duration-300",
            "hover:border-primary/30 hover:bg-card/60 hover:shadow-lg hover:shadow-primary/5",
            highlight && "border-primary/40 bg-primary/5",
            className
        )}>
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative flex items-center gap-3">
                <div className={cn(
                    "rounded-lg p-2.5 transition-colors",
                    highlight
                        ? "bg-primary/20 text-primary"
                        : "bg-primary/10 text-primary group-hover:bg-primary/20"
                )}>
                    <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
                    <div className="flex items-baseline gap-2">
                        <p className={cn(
                            "text-xl font-bold text-foreground tabular-nums",
                            highlight && "text-primary"
                        )}>
                            {canAnimate ? (
                                <AnimatedCounter
                                    value={numericValue}
                                    decimals={decimals}
                                    prefix={prefix}
                                    suffix={suffix}
                                />
                            ) : (
                                <>{prefix}{value}{suffix}</>
                            )}
                        </p>
                        {trend && (
                            <span className={cn(
                                "text-xs font-medium",
                                trend === "up" && "text-green-500",
                                trend === "down" && "text-red-500",
                                trend === "neutral" && "text-muted-foreground"
                            )}>
                                {trend === "up" && "↑"}
                                {trend === "down" && "↓"}
                            </span>
                        )}
                    </div>
                    {description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Compact variant for dense grids
interface StatCardCompactProps {
    title: string;
    value: string | number;
    icon: LucideIcon | React.ElementType;
    className?: string;
    animate?: boolean;
    decimals?: number;
    suffix?: string;
    prefix?: string;
}

export function StatCardCompact({
    title,
    value,
    icon: Icon,
    className,
    animate = false,
    decimals = 0,
    suffix = "",
    prefix = ""
}: StatCardCompactProps) {
    const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, ''));
    const canAnimate = animate && !isNaN(numericValue);

    return (
        <div className={cn(
            "group flex items-center gap-3 rounded-lg border border-border/40 bg-card/30 px-3 py-2.5 transition-all",
            "hover:border-border/60 hover:bg-card/50",
            className
        )}>
            <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{title}</p>
                <p className="text-base font-bold text-foreground tabular-nums truncate">
                    {canAnimate ? (
                        <AnimatedCounter
                            value={numericValue}
                            decimals={decimals}
                            prefix={prefix}
                            suffix={suffix}
                            duration={800}
                        />
                    ) : (
                        <>{prefix}{value}{suffix}</>
                    )}
                </p>
            </div>
        </div>
    );
}
