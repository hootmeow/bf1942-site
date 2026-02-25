"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LastUpdatedProps {
  timestamp: Date | string | number;
  className?: string;
  showIcon?: boolean;
}

function getRelativeTime(timestamp: Date | string | number): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) return "just now";
  if (diffSecs < 60) return `${diffSecs} seconds ago`;
  if (diffMins === 1) return "1 minute ago";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours === 1) return "1 hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;

  return then.toLocaleDateString();
}

export function LastUpdated({ timestamp, className, showIcon = true }: LastUpdatedProps) {
  const [relativeTime, setRelativeTime] = useState<string>(() => getRelativeTime(timestamp));

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(timestamp));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <div className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      {showIcon && <Clock className="h-3 w-3" />}
      <span>Updated {relativeTime}</span>
    </div>
  );
}
