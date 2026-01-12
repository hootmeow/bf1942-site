import type { Metadata } from 'next';
import RoundsHistoryClient from './rounds-history-client';

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const decodedName = decodeURIComponent(params.slug);
    return {
        title: `Round History - ${decodedName} - BF1942 Stats`,
        description: `View complete round history for ${decodedName}.`,
    };
}

export default function RoundsHistoryPage({ params }: { params: Promise<{ slug: string }> }) {
    return (
        <div className="container py-6 md:py-10">
            <RoundsHistoryClient />
        </div>
    );
}
