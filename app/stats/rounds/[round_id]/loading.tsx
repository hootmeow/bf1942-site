import { Skeleton } from "@/components/ui/skeleton";

export default function RoundLoading() {
  return (
    <div className="container py-6 md:py-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>

      {/* Hero Card */}
      <Skeleton className="h-[180px] rounded-xl" />

      {/* Scoreboards */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-[450px] rounded-xl" />
        <Skeleton className="h-[450px] rounded-xl" />
      </div>
    </div>
  );
}
