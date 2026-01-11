"use client";

import { useState } from "react";
import { PlayerSearchAutocomplete, PlayerSearchResult } from "@/components/player-search-autocomplete";
import { ComparisonView } from "@/components/comparison-view";
import { Scale, ArrowRightLeft, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ComparisonPage() {
    const [player1, setPlayer1] = useState<PlayerSearchResult | null>(null);
    const [player2, setPlayer2] = useState<PlayerSearchResult | null>(null);

    return (
        <div className="container mx-auto py-8 space-y-8 max-w-5xl">
            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-2">
                    <ArrowRightLeft className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Player Comparison</h1>
                <p className="text-muted-foreground max-w-lg">
                    Select two soldiers to compare their combat records, K/D ratios, and overall performance side-by-side.
                </p>
            </div>

            {/* Selection Area */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start relative">

                {/* Player 1 Selector */}
                <Card className="border-border/60 bg-card/40">
                    <CardContent className="p-6 space-y-4">
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-center">
                            Soldier A
                        </div>
                        {player1 ? (
                            <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
                                <div className="text-xl font-bold text-primary">{player1.last_known_name}</div>
                                <Button variant="outline" size="sm" onClick={() => setPlayer1(null)} className="h-8 gap-2">
                                    <XCircle className="h-3.5 w-3.5" /> Change
                                </Button>
                            </div>
                        ) : (
                            <PlayerSearchAutocomplete
                                onSelect={setPlayer1}
                                placeholder="Find soldier..."
                                excludePlayerId={player2?.player_id}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* VS Badge (Absolute centered on desktop, static on mobile) */}
                <div className="flex items-center justify-center py-2 md:py-12">
                    <div className="bg-muted text-muted-foreground font-black text-xl italic px-3 py-1 rounded-md">
                        VS
                    </div>
                </div>

                {/* Player 2 Selector */}
                <Card className="border-border/60 bg-card/40">
                    <CardContent className="p-6 space-y-4">
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-center">
                            Soldier B
                        </div>
                        {player2 ? (
                            <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
                                <div className="text-xl font-bold text-red-500">{player2.last_known_name}</div>
                                <Button variant="outline" size="sm" onClick={() => setPlayer2(null)} className="h-8 gap-2">
                                    <XCircle className="h-3.5 w-3.5" /> Change
                                </Button>
                            </div>
                        ) : (
                            <PlayerSearchAutocomplete
                                onSelect={setPlayer2}
                                placeholder="Find opponent..."
                                excludePlayerId={player1?.player_id}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Comparison View */}
            {player1 && player2 ? (
                <div className="mt-8">
                    <ComparisonView player1={player1} player2={player2} />
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border/50">
                    <Scale className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Select both soldiers above to generate comparison.</p>
                </div>
            )}

        </div>
    );
}
