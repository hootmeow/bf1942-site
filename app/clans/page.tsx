"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Shield, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClansLandingPage() {
    const [tag, setTag] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (tag.trim().length > 0) {
            router.push(`/clans/${encodeURIComponent(tag.trim())}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-4 max-w-2xl">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                    <Shield className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                    Clan Headquarters
                </h1>
                <p className="text-xl text-muted-foreground">
                    Find active platoons, view rosters, and track aggregate stats.
                    Enter a clan tag to begin.
                </p>
            </div>

            <Card className="w-full max-w-md border-border/60 bg-card/50 backdrop-blur">
                <CardContent className="pt-6">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Enter Tag (e.g. EA, 1942)..."
                                className="pl-9"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                            />
                        </div>
                        <Button type="submit">
                            Inspect
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-center">
                <div className="space-y-2">
                    <Users className="h-8 w-8 mx-auto text-blue-500" />
                    <h3 className="font-bold text-foreground">Roster Tracking</h3>
                    <p className="text-sm text-muted-foreground">See who is active and who has gone AWOL.</p>
                </div>
                <div className="space-y-2">
                    <Shield className="h-8 w-8 mx-auto text-orange-500" />
                    <h3 className="font-bold text-foreground">Unit Performance</h3>
                    <p className="text-sm text-muted-foreground">Aggregate K/D and Win Rates for the entire unit.</p>
                </div>
                <div className="space-y-2">
                    <Search className="h-8 w-8 mx-auto text-green-500" />
                    <h3 className="font-bold text-foreground">Recruitment</h3>
                    <p className="text-sm text-muted-foreground">Find potential recruits from the top 500.</p>
                </div>
            </div>
        </div>
    );
}
