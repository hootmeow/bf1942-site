"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CARD_STYLES, CARD_HOVER } from "@/lib/design-tokens";
import { LucideIcon } from "lucide-react";

interface UnifiedCardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  variant?: "base" | "enhanced" | "subtle";
  hover?: "base" | "enhanced" | "interactive" | "none";
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  headerActions?: React.ReactNode;
}

/**
 * Unified card component with consistent styling across the application
 * Uses design tokens for consistent appearance
 */
export function UnifiedCard({
  title,
  description,
  icon: Icon,
  variant = "base",
  hover = "enhanced",
  children,
  className,
  headerClassName,
  contentClassName,
  headerActions,
}: UnifiedCardProps) {
  const cardVariant = CARD_STYLES[variant];
  const hoverEffect = hover !== "none" ? CARD_HOVER[hover] : "";

  return (
    <Card className={cn(
      CARD_STYLES.border,
      cardVariant,
      hoverEffect,
      className
    )}>
      {(title || description) && (
        <CardHeader className={cn(
          "border-b border-border/30 bg-gradient-to-r from-primary/[0.02] to-transparent",
          headerClassName
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              {Icon && (
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              )}
              <div>
                {title && <CardTitle as="h2">{title}</CardTitle>}
                {description && <CardDescription>{description}</CardDescription>}
              </div>
            </div>
            {headerActions && <div>{headerActions}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn("p-4", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}

/**
 * Interactive card for clickable items (events, servers, etc.)
 */
export function InteractiveCard({
  children,
  className,
  onClick,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}) {
  const Component = href ? "a" : "div";

  return (
    <Component
      href={href}
      onClick={onClick}
      className={cn(
        "rounded-lg border",
        CARD_STYLES.border,
        CARD_STYLES.base,
        "transition-all duration-300",
        "hover:shadow-lg hover:border-primary/30 hover:from-card/70 hover:to-card/50",
        "active:scale-[0.98]",
        "cursor-pointer",
        className
      )}
    >
      {children}
    </Component>
  );
}

/**
 * Stat card for displaying metrics
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: {
  label: string;
  value: string | number | React.ReactNode;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}) {
  return (
    <div className={cn(
      "rounded-lg border p-4 relative overflow-hidden group/stat",
      CARD_STYLES.border,
      CARD_STYLES.base,
      CARD_HOVER.interactive,
      className
    )}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.02] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />

      <div className="flex items-center gap-3 relative z-10">
        {Icon && (
          <div className="rounded-full bg-primary/10 p-2 text-primary transition-all duration-300 group-hover/stat:bg-primary/15 group-hover/stat:shadow-[0_0_16px_rgba(var(--primary-rgb),0.2)] group-hover/stat:scale-110 relative">
            <div className="absolute inset-0 rounded-full blur-md bg-primary/30 opacity-0 group-hover/stat:opacity-50 transition-opacity duration-300" />
            <Icon className="h-4 w-4 relative z-10" />
          </div>
        )}
        <div className="flex-1">
          <div className="text-xs font-medium text-muted-foreground group-hover/stat:text-muted-foreground/80 transition-colors">
            {label}
          </div>
          <div className="text-base font-semibold text-foreground group-hover/stat:text-primary transition-colors duration-300">
            {value}
          </div>
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-medium",
            trend === "up" && "text-green-500",
            trend === "down" && "text-red-500",
            trend === "neutral" && "text-muted-foreground"
          )}>
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trend === "neutral" && "→"}
          </div>
        )}
      </div>
    </div>
  );
}
