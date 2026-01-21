import { z } from "zod";

// --- Global Metrics Schema ---
export const PopularMapSchema = z.object({
    map_name: z.string(),
    rounds_played: z.number(),
});

export const GlobalMetricsSchema = z.object({
    total_rounds_processed: z.number(),
    total_players_seen: z.number(),
    active_players_24h: z.number(),
    active_players_24h_change_pct: z.number(),
    // --- ADDED NEW FIELDS ---
    active_players_7d: z.number(),
    active_players_7d_change_pct: z.number(),
    current_active_players: z.number(),
    // --- END ADDED SECTION ---
    popular_maps_7_days: z.array(PopularMapSchema),
    global_concurrency_heatmap_24h: z.array(z.number()),
    global_concurrency_heatmap_7d: z.array(z.number()),
    // Updated to match "Total Only" simplified format
    global_concurrency_timeline_7d: z.array(z.object({
        timestamp: z.string(),
        total: z.number(),
        // Optional legacy fields to prevent breaking if old API sends them
        conquest: z.number().optional(),
        coop: z.number().optional(),
        ctf: z.number().optional(),
        other: z.number().optional(),
        avg_ping: z.number().nullable().optional(),
    })).optional().nullable(),
    // New 24h timeline
    global_concurrency_timeline_24h: z.array(z.object({
        timestamp: z.string(),
        total: z.number(),
        avg_ping: z.number().nullable().optional(),
    })).optional().nullable(),
    debug_timeline_error: z.string().optional().nullable(),
});

export type GlobalMetrics = z.infer<typeof GlobalMetricsSchema>;

// --- Server List Schema ---
// Updated to match the Server interface in components/server-directory.tsx
export const ServerInfoSchema = z.object({
    server_id: z.number(),
    ip: z.string(),
    query_port: z.number(),
    current_game_port: z.number(),
    current_state: z.enum(["ACTIVE", "EMPTY", "OFFLINE"]),
    current_server_name: z.string().nullable(),
    current_map: z.string().nullable(),
    current_player_count: z.number(),
    current_max_players: z.number(),
    current_gametype: z.string().nullable(),
    last_successful_poll: z.string().nullable(),
});

export const ServerListSchema = z.object({
    ok: z.boolean(),
    servers: z.array(ServerInfoSchema),
});

export type ServerInfo = z.infer<typeof ServerInfoSchema>;
export type ServerListResponse = z.infer<typeof ServerListSchema>;