import { Skeleton } from "@/components/ui/skeleton";

export default function GameHealthLoading() {
  return (
    <div className="space-y-6">
      {/* Hero Section Skeleton */}
      <Skeleton className="h-[180px] sm:h-[210px] rounded-3xl" />

      {/* Key Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px] rounded-xl" />
        ))}
      </div>

      {/* Population Trend Chart */}
      <Skeleton className="h-[430px] rounded-xl" />

      {/* New vs Returning Players */}
      <Skeleton className="h-[430px] rounded-xl" />

      {/* Server & Rounds Trend — 2-column grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-[300px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>

      {/* Map Popularity */}
      <Skeleton className="h-[400px] rounded-xl" />

      {/* Churn & Experience — 2-column grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-[220px] rounded-xl" />
        <Skeleton className="h-[220px] rounded-xl" />
      </div>

      {/* Game Mode Breakdown */}
      <Skeleton className="h-[350px] rounded-xl" />

      {/* Network Quality */}
      <Skeleton className="h-[430px] rounded-xl" />
    </div>
  );
}
