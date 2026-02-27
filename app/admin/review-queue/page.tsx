import { getReviewQueue } from "../actions/integrity-actions"
import ReviewQueueClient from "./review-queue-client"

export const metadata = {
    title: "Review Queue | Admin",
    description: "Review flagged rounds, players, and servers for integrity issues",
}

export default async function ReviewQueuePage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>
}) {
    const params = await searchParams
    const status = params.status || 'pending'

    const data = await getReviewQueue(status, 100)

    if (!data.ok) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Review Queue</h1>
                <p className="text-destructive">Failed to load review queue: {data.error}</p>
            </div>
        )
    }

    return <ReviewQueueClient initialItems={data.items || []} initialStatus={status} />
}
