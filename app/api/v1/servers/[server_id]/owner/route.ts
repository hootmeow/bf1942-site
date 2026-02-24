import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ server_id: string }> }
) {
    try {
        const { server_id } = await params;
        const serverId = parseInt(server_id, 10);

        if (isNaN(serverId)) {
            return NextResponse.json({ ok: false, error: "Invalid server ID" }, { status: 400 });
        }

        // Query for approved claim
        const result = await pool.query(
            `SELECT sc.user_id as owner_id, sc.discord_username, sc.created_at as claimed_at
             FROM server_claims sc
             WHERE sc.server_id = $1 AND sc.status = 'APPROVED'
             LIMIT 1`,
            [serverId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ ok: true, owner: null });
        }

        return NextResponse.json({
            ok: true,
            owner: result.rows[0]
        });

    } catch (e: any) {
        console.error("Server owner fetch error:", e);
        return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
    }
}
