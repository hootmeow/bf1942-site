import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import RankInfoClient from "./rank-info-client";

export const metadata: Metadata = {
    title: "Leaderboards - BF1942 Stats",
    description: "Top 100 players ranked by Career Score (XP). View All Time, Weekly, and Monthly rankings.",
};

export default function RankInfoPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Loading leaderboards...</p>
            </div>
        }>
            <RankInfoClient />
        </Suspense>
    );
}
