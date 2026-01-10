import type { Metadata } from 'next';
import HistoryRankClient from './history-rank-client';

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const decodedName = decodeURIComponent(params.slug);
    return {
        title: `Rank History - ${decodedName} - BF1942 Stats`,
        description: `View detailed rank progression history for ${decodedName}.`,
    };
}

export default function RankHistoryPage({ params }: { params: Promise<{ slug: string }> }) {
    return (
        <div className="container py-6 md:py-10">
            <HistoryRankClient />
        </div>
    );
}
