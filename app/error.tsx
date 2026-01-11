"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global Error Caught:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center p-4">
            <div className="p-4 rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-10 w-10" />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Something went wrong!</h1>
                <p className="text-muted-foreground max-w-[500px]">
                    We encountered an unexpected error. Usually this is temporary.
                </p>
            </div>
            <div className="flex gap-4">
                <Button onClick={() => window.location.reload()} variant="outline">
                    Reload Page
                </Button>
                <Button onClick={() => reset()}>Try Again</Button>
            </div>
        </div>
    );
}
