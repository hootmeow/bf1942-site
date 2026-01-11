import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center text-center p-4">
            <div className="rounded-full bg-muted/30 p-6 mb-6">
                <ShieldAlert className="h-16 w-16 text-muted-foreground" />
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                SOLDIER, YOU ARE LOST!
            </h1>

            <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
                This sector is uncharted territory. The coordinates you entered do not correspond to any active battlefield. Return to base immediately.
            </p>

            <div className="flex gap-4">
                <Link href="/">
                    <Button size="lg" className="font-semibold">
                        Return to Dashboard
                    </Button>
                </Link>
                <Link href="/stats">
                    <Button size="lg" variant="outline">
                        View Stats
                    </Button>
                </Link>
            </div>

            <div className="mt-12 text-sm text-muted-foreground opacity-50 font-mono">
                ERROR_CODE: 404_MIA
            </div>
        </div>
    )
}
