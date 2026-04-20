"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";
import type { RelatedPlayer } from "@/components/battle-buddies-list";

const CX = 220;
const CY = 220;

const TIER_CFG: Record<string, { radius: number; duration: number; color: string; size: number; label: string }> = {
  "BATTLE BUDDY": { radius: 78,  duration: 26, color: "#f59e0b", size: 10, label: "Battle Buddy" },
  "SQUADMATE":    { radius: 138, duration: 44, color: "#3b82f6", size: 8,  label: "Squadmate"    },
  "ACQUAINTANCE": { radius: 198, duration: 68, color: "#6b7280", size: 6,  label: "Acquaintance" },
};

interface Planet {
  player: RelatedPlayer;
  radius: number;
  duration: number;
  color: string;
  size: number;
  initialAngleDeg: number;
}

interface HoveredPlanet {
  player: RelatedPlayer;
  x: number;
  y: number;
}

export function TeammateGalaxy({
  players,
  playerName,
}: {
  players: RelatedPlayer[];
  playerName: string;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<HoveredPlanet | null>(null);

  if (!players || players.length === 0) return null;

  // Group by tier, cap each orbit at 12 planets so they don't overlap
  const grouped: Record<string, RelatedPlayer[]> = {
    "BATTLE BUDDY": [],
    SQUADMATE:      [],
    ACQUAINTANCE:   [],
  };
  for (const p of players) {
    const t = p.affinity_tier ?? "ACQUAINTANCE";
    if (grouped[t] && grouped[t].length < 12) grouped[t].push(p);
  }

  const planets: Planet[] = [];
  for (const [tier, ps] of Object.entries(grouped)) {
    const cfg = TIER_CFG[tier];
    ps.forEach((p, i) => {
      planets.push({
        player: p,
        ...cfg,
        initialAngleDeg: (i / Math.max(ps.length, 1)) * 360,
      });
    });
  }

  const handlePlanetClick = (name: string) => {
    router.push(`/player/${encodeURIComponent(name)}`);
  };

  const handleMouseEnter = (e: React.MouseEvent<SVGCircleElement>, player: RelatedPlayer) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setHovered({ player, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const shortName = playerName.length > 14 ? playerName.slice(0, 13) + "…" : playerName;

  return (
    <Card className="border-border/60 bg-card/40">
      <CardHeader>
        <CardTitle as="h2" className="flex items-center gap-2">
          <Network className="h-5 w-5 text-amber-400" />
          Teammate Galaxy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <style>{`
          @keyframes tg-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes tg-pulse { 0%,100% { opacity:.15; r:30; } 50% { opacity:.30; r:34; } }
        `}</style>

        <div
          ref={containerRef}
          className="relative mx-auto"
          style={{ width: "100%", maxWidth: 440, aspectRatio: "1/1" }}
          onMouseLeave={() => setHovered(null)}
        >
          <svg
            viewBox="0 0 440 440"
            width="100%"
            height="100%"
            aria-label="Teammate relationship galaxy"
          >
            {/* Orbit rings */}
            {Object.entries(TIER_CFG).map(([tier, cfg]) => (
              <circle
                key={tier}
                cx={CX} cy={CY} r={cfg.radius}
                fill="none"
                stroke={cfg.color}
                strokeWidth={0.6}
                strokeDasharray="4 8"
                opacity={0.22}
              />
            ))}

            {/* Center glow rings */}
            <circle cx={CX} cy={CY} r={34} fill="hsl(var(--primary))" opacity={0.06} />
            <circle cx={CX} cy={CY} r={24} fill="hsl(var(--primary))" opacity={0.14} />
            <circle cx={CX} cy={CY} r={16} fill="hsl(var(--primary))" opacity={0.35} />
            <circle cx={CX} cy={CY} r={9}  fill="hsl(var(--primary))" opacity={0.80} />

            {/* Planets */}
            {planets.map((p, i) => (
              <g
                key={i}
                style={{
                  transformOrigin: `${CX}px ${CY}px`,
                  animation: `tg-orbit ${p.duration}s linear infinite`,
                  animationDelay: `-${(p.initialAngleDeg / 360) * p.duration}s`,
                }}
              >
                {/* Glow halo */}
                <circle
                  cx={CX}
                  cy={CY - p.radius}
                  r={p.size + 4}
                  fill={p.color}
                  opacity={0.18}
                  style={{ pointerEvents: "none" }}
                />
                {/* Planet body */}
                <circle
                  cx={CX}
                  cy={CY - p.radius}
                  r={p.size}
                  fill={p.color}
                  opacity={0.88}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => handleMouseEnter(e, p.player)}
                  onClick={() => handlePlanetClick(p.player.name)}
                />
              </g>
            ))}

            {/* Center label */}
            <text
              x={CX}
              y={CY + 28}
              textAnchor="middle"
              fontSize="10"
              fill="hsl(var(--muted-foreground))"
              fontFamily="inherit"
              opacity={0.7}
            >
              {shortName}
            </text>
          </svg>

          {/* Floating tooltip */}
          {hovered && (
            <div
              className="absolute z-50 pointer-events-none bg-card/95 border border-border/60 rounded-lg px-3 py-2 shadow-xl text-xs backdrop-blur-sm"
              style={{
                left: Math.min(hovered.x + 14, (containerRef.current?.clientWidth ?? 440) - 160),
                top: Math.max(hovered.y - 40, 4),
                whiteSpace: "nowrap",
              }}
            >
              <div className="font-semibold text-foreground">{hovered.player.name}</div>
              <div className="text-muted-foreground mt-0.5">{hovered.player.rounds_together} rounds together</div>
              <div
                className="text-[10px] font-medium mt-0.5 uppercase tracking-wide"
                style={{ color: TIER_CFG[hovered.player.affinity_tier]?.color ?? "#6b7280" }}
              >
                {hovered.player.affinity_tier}
              </div>
              <div className="text-[10px] text-muted-foreground/60 mt-0.5">click to view profile</div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-3 text-xs text-muted-foreground">
          {Object.entries(TIER_CFG).map(([tier, cfg]) => {
            const count = grouped[tier]?.length ?? 0;
            return (
              <div key={tier} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: cfg.color }}
                />
                <span>{cfg.label}</span>
                <span className="text-muted-foreground/50">({count})</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
