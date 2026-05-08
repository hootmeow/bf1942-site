"use client";

import { useState } from "react";
import { Shield, Loader2, Crown, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import { submitServerClaimRequest } from "@/app/actions/claim-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

interface ServerOwnerDisplayProps {
    serverId: number;
    serverName: string;
    serverSlug?: string;
    initialOwner?: {
        owner_id: string;
        discord_username: string;
        claimed_at: string;
    } | null;
}

export function ServerOwnerDisplay({ serverId, serverName, serverSlug, initialOwner }: ServerOwnerDisplayProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [owner] = useState(initialOwner ?? null);
    const [claiming, setClaiming] = useState(false);

    const isOwner = session?.user?.id && owner?.owner_id === session.user.id;

    const handleClaim = async () => {
        if (status !== "authenticated") {
            router.push("/auth/signin");
            return;
        }

        setClaiming(true);
        try {
            const result = await submitServerClaimRequest(serverId, serverName);
            if (result.ok) {
                trackEvent("claim_server", { server_name: serverName });
                toast.success(result.message);
            } else {
                toast.error(result.error);
            }
        } catch (e: any) {
            toast.error("Failed to submit claim request: " + e.message);
        } finally {
            setClaiming(false);
        }
    };

    return (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {owner ? (
                <>
                    <div className="flex items-center gap-2 shrink-0">
                        <Crown className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-xs text-muted-foreground/70">Owned by</span>
                        <span className="text-xs font-semibold text-foreground">{owner.discord_username}</span>
                    </div>
                    {isOwner && serverSlug && (
                        <>
                            <div className="h-4 w-px bg-border/60 shrink-0" />
                            <Link
                                href={`/servers/${serverSlug}/admin`}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground/70 hover:text-foreground transition-colors"
                            >
                                <Settings className="h-3 w-3" />
                                Manage
                            </Link>
                        </>
                    )}
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2 shrink-0">
                        <Shield className="h-3.5 w-3.5 text-muted-foreground/50" />
                        <span className="text-xs text-muted-foreground/60">Unclaimed</span>
                    </div>
                    <div className="h-4 w-px bg-border/60 shrink-0" />
                    {claiming ? (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Submitting…
                        </span>
                    ) : (
                        <button
                            onClick={handleClaim}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground/70 hover:text-primary transition-colors"
                        >
                            Claim this server
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
