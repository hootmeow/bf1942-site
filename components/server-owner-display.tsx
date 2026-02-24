"use client";

import { useEffect, useState } from "react";
import { Shield, Loader2, Crown, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import { submitServerClaimRequest } from "@/app/actions/claim-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

interface ServerOwnerDisplayProps {
    serverId: number;
    serverName: string;
    serverSlug?: string;
}

interface OwnerInfo {
    owner_id: string;
    discord_username: string;
    claimed_at: Date;
}

export function ServerOwnerDisplay({ serverId, serverName, serverSlug }: ServerOwnerDisplayProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [owner, setOwner] = useState<OwnerInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(false);

    const isOwner = session?.user?.id && owner?.owner_id === session.user.id;

    useEffect(() => {
        async function fetchOwner() {
            try {
                const res = await fetch(`/api/v1/servers/${serverId}/owner`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.ok && data.owner) {
                        setOwner(data.owner);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch server owner:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchOwner();
    }, [serverId]);

    const handleClaim = async () => {
        if (status !== "authenticated") {
            router.push("/auth/signin");
            return;
        }

        setClaiming(true);
        try {
            const result = await submitServerClaimRequest(serverId, serverName);
            if (result.ok) {
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

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading owner info...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {owner ? (
                <>
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span>Owned by</span>
                    <span className="font-semibold text-foreground">{owner.discord_username}</span>
                    {isOwner && serverSlug && (
                        <>
                            <span>•</span>
                            <Link
                                href={`/servers/${serverSlug}/admin`}
                                className="text-primary hover:underline flex items-center gap-1"
                            >
                                <Settings className="h-3 w-3" />
                                Manage
                            </Link>
                        </>
                    )}
                </>
            ) : (
                <>
                    <Shield className="h-4 w-4" />
                    <span>Unclaimed</span>
                    <span>•</span>
                    {claiming ? (
                        <span className="flex items-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Submitting...
                        </span>
                    ) : (
                        <button
                            onClick={handleClaim}
                            className="text-primary hover:underline flex items-center gap-1"
                        >
                            Claim this server
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
