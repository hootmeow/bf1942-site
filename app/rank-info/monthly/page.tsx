import type { Metadata } from 'next';
import RankInfoClient from "../rank-info-client";

export const metadata: Metadata = {
    title: "Monthly Leaderboard - BF1942 Stats",
    description: "Top 100 players ranked by Career Score (XP) in the last 30 days.",
};

export default function MonthlyRankPage() {
    return (
        <RankInfoClient
            endpoint="/api/v1/leaderboard/monthly"
            title="Monthly Leaderboard"
            description="Top players ranked by Career XP earned in the last 30 days."
        />
    );
}
