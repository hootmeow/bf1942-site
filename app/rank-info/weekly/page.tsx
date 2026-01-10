import type { Metadata } from 'next';
import RankInfoClient from "../rank-info-client";

export const metadata: Metadata = {
    title: "Weekly Leaderboard - BF1942 Stats",
    description: "Top 100 players ranked by Career Score (XP) in the last 7 days.",
};

export default function WeeklyRankPage() {
    return (
        <RankInfoClient
            endpoint="/api/v1/leaderboard/weekly"
            title="Weekly Leaderboard"
            description="Top players ranked by Career XP earned in the last 7 days."
        />
    );
}
