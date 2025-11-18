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
    popular_maps_7_days: z.array(PopularMapSchema),
    global_concurrency_heatmap_24h: z.array(z.number()),
    global_concurrency_heatmap_7d: z.array(z.number()),

    export type ServerInfo = z.infer<typeof ServerInfoSchema>;
    export type ServerListResponse = z.infer<typeof ServerListSchema>;
