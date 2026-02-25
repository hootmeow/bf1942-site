"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
        <div className="space-y-8">
            {/* Hero Error Section */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-12 shadow-2xl">
                {/* Background blur orbs */}
                <div className="pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-orange-500/10 blur-[80px]" />
                <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-red-500/10 blur-[70px]" />

                <div className="relative z-10 text-center">
                    <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in-up">
                        <div className="rounded-xl bg-orange-500/20 p-4">
                            <AlertTriangle className="h-12 w-12 text-orange-400" />
                        </div>
                    </div>

                    <div className="space-y-4 max-w-2xl mx-auto animate-fade-in-up stagger-1">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                                SYSTEM MALFUNCTION
                            </h1>
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                                Error
                            </Badge>
                        </div>
                        <p className="text-base sm:text-lg text-slate-400 max-w-[600px] mx-auto">
                            We encountered an unexpected error during your mission.
                            This is usually temporary. Try again or return to base.
                        </p>
                        {error.digest && (
                            <p className="text-xs text-slate-500 font-mono">
                                DIGEST: {error.digest}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 animate-fade-in-up stagger-2">
                        <Button onClick={() => reset()} size="lg" className="shadow-lg shadow-primary/20">
                            Try Again
                        </Button>
                        <Button onClick={() => window.location.reload()} size="lg" variant="outline">
                            Reload Page
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <a href="/">Return Home</a>
                        </Button>
                    </div>

                    <div className="mt-8 text-xs text-slate-500 font-mono animate-fade-in-up stagger-3">
                        ERROR_CODE: SYSTEM_FAILURE // STATUS: RECOVERABLE
                    </div>
                </div>
            </div>
        </div>
    );
}
