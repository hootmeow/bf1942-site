"use client";

import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  variant?: "spinner" | "skeleton";
  message?: string;
  className?: string;
  skeletonCount?: number;
  skeletonHeight?: string;
}

/**
 * Unified loading state component for consistent loading UI across the site
 */
export function LoadingState({
  variant = "spinner",
  message = "Loading...",
  className,
  skeletonCount = 3,
  skeletonHeight = "h-24",
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} className={cn("w-full rounded-lg", skeletonHeight)} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

/**
 * Inline loading spinner for buttons and small areas
 */
export function LoadingSpinner({ className, size = "sm" }: { className?: string; size?: "xs" | "sm" | "md" | "lg" }) {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-8 w-8",
  };

  return <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />;
}

/**
 * Card skeleton for consistent card loading states
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border/60 bg-card/40 p-4", className)}>
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

/**
 * Grid of card skeletons
 */
export function CardGridSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
