import type { Metadata } from 'next';
import RankInfoClient from "./rank-info-client";

export const metadata: Metadata = {
    title: "Player Ranks - BF1942 Stats",
    description: "Top 100 players ranked by Career Score (XP).",
};

export default function RankInfoPage() {
    return <RankInfoClient />;
}
