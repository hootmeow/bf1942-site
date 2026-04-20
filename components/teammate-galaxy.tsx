"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";
import type { RelatedPlayer } from "@/components/battle-buddies-list";

// ─── Layout constants ────────────────────────────────────────────────────────
const CX = 240;
const CY = 240;
const VIEW = 480;

// ─── Tier configuration ───────────────────────────────────────────────────────
const TIER_CFG: Record<string, {
  radius:   number;
  duration: number;
  colors:   string[];
  minSize:  number;
  maxSize:  number;
  label:    string;
  glow:     string;
}> = {
  "BATTLE BUDDY": {
    radius:   88,
    duration: 28,
    colors:   ["#fbbf24", "#f59e0b", "#fde68a", "#d97706", "#f97316"],
    minSize:  9,
    maxSize:  15,
    label:    "Battle Buddy",
    glow:     "#f59e0b",
  },
  "SQUADMATE": {
    radius:   158,
    duration: 48,
    colors:   ["#60a5fa", "#3b82f6", "#818cf8", "#2563eb", "#6366f1"],
    minSize:  7,
    maxSize:  11,
    label:    "Squadmate",
    glow:     "#3b82f6",
  },
  "ACQUAINTANCE": {
    radius:   228,
    duration: 78,
    colors:   ["#9ca3af", "#6b7280", "#94a3b8", "#64748b", "#a8a29e"],
    minSize:  4,
    maxSize:  7,
    label:    "Acquaintance",
    glow:     "#6b7280",
  },
};

// ─── Deterministic star generator (LCG) ──────────────────────────────────────
function makeStars(count: number) {
  let s = 42;
  const rand = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  return Array.from({ length: count }, () => ({
    x:  rand() * VIEW,
    y:  rand() * VIEW,
    r:  rand() * 1.2 + 0.3,
    op: rand() * 0.6 + 0.15,
  }));
}
const STARS = makeStars(90);

// ─── Planet size from rounds_together ────────────────────────────────────────
function planetSize(tier: string, rounds: number): number {
  const cfg = TIER_CFG[tier];
  if (!cfg) return 5;
  const t = Math.min(rounds / 120, 1);           // 120 rounds = max size
  return cfg.minSize + t * (cfg.maxSize - cfg.minSize);
}

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface Planet {
  player:         RelatedPlayer;
  tier:           string;
  radius:         number;
  duration:       number;
  color:          string;
  gradId:         string;
  size:           number;
  initialAngleDeg: number;
}

interface HoveredPlanet { player: RelatedPlayer; x: number; y: number }

// ─── Component ────────────────────────────────────────────────────────────────
export function TeammateGalaxy({
  players,
  playerName,
}: {
  players:    RelatedPlayer[];
  playerName: string;
}) {
  const router       = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<HoveredPlanet | null>(null);

  if (!players || players.length === 0) return null;

  // Group players by tier (cap per orbit so planets don't overlap)
  const MAX_PER_ORBIT: Record<string, number> = {
    "BATTLE BUDDY": 10,
    "SQUADMATE":    14,
    "ACQUAINTANCE": 20,
  };
  const grouped: Record<string, RelatedPlayer[]> = {
    "BATTLE BUDDY": [], SQUADMATE: [], ACQUAINTANCE: [],
  };
  for (const p of players) {
    const t = p.affinity_tier ?? "ACQUAINTANCE";
    if (grouped[t] && grouped[t].length < (MAX_PER_ORBIT[t] ?? 20)) grouped[t].push(p);
  }

  // Build planet list + SVG gradient definitions
  const planets: Planet[] = [];
  const gradDefs: JSX.Element[] = [];

  for (const [tier, ps] of Object.entries(grouped)) {
    const cfg = TIER_CFG[tier];
    ps.forEach((p, i) => {
      const color  = cfg.colors[i % cfg.colors.length];
      const gradId = `pg-${tier.replace(/\s/g, "")}-${i}`;
      const size   = planetSize(tier, p.rounds_together);

      // Radial gradient for 3-D sphere look
      gradDefs.push(
        <radialGradient key={gradId} id={gradId} cx="35%" cy="32%" r="65%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity={0.55} />
          <stop offset="40%"  stopColor={color}   stopOpacity={0.90} />
          <stop offset="100%" stopColor={color}   stopOpacity={0.30} />
        </radialGradient>
      );

      planets.push({
        player: p,
        tier,
        radius: cfg.radius,
        duration: cfg.duration,
        color,
        gradId,
        size,
        initialAngleDeg: (i / Math.max(ps.length, 1)) * 360,
      });
    });
  }

  const handleMouseEnter = (e: React.MouseEvent<SVGCircleElement>, player: RelatedPlayer) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setHovered({ player, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const shortCenter = playerName.length > 12 ? playerName.slice(0, 11) + "…" : playerName;

  return (
    <Card className="border-border/60 bg-card/40 h-full">
      <CardHeader>
        <CardTitle as="h2" className="flex items-center gap-2">
          <Network className="h-5 w-5 text-amber-400" />
          Teammate Galaxy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <style>{`
          @keyframes tg-orbit   { from { transform: rotate(0deg);    } to { transform: rotate(360deg);  } }
          @keyframes tg-counter { from { transform: rotate(0deg);    } to { transform: rotate(-360deg); } }
          @keyframes tg-pulse   { 0%,100% { opacity: 0.08; } 50% { opacity: 0.22; } }
          @keyframes tg-pulse2  { 0%,100% { opacity: 0.15; } 50% { opacity: 0.40; } }
          @keyframes tg-shoot   { 0% { opacity:0; stroke-dashoffset:0; } 8% { opacity:.7; } 20% { opacity:0; stroke-dashoffset:-120; } 100% { opacity:0; stroke-dashoffset:-120; } }
        `}</style>

        <div
          ref={containerRef}
          className="relative mx-auto"
          style={{ width: "100%", maxWidth: 480, aspectRatio: "1/1" }}
          onMouseLeave={() => setHovered(null)}
        >
          <svg
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            width="100%"
            height="100%"
            aria-label="Teammate relationship galaxy"
          >
            <defs>
              {/* Background gradient */}
              <radialGradient id="bg-grad" cx="50%" cy="50%" r="70%">
                <stop offset="0%"   stopColor="#0f172a" />
                <stop offset="60%"  stopColor="#080e1c" />
                <stop offset="100%" stopColor="#030712" />
              </radialGradient>

              {/* Nebula blobs */}
              <radialGradient id="neb-1" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#7c3aed" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0}    />
              </radialGradient>
              <radialGradient id="neb-2" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#1d4ed8" stopOpacity={0.10} />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0}    />
              </radialGradient>
              <radialGradient id="neb-3" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#f59e0b" stopOpacity={0.07} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0}    />
              </radialGradient>

              {/* Center sun gradient */}
              <radialGradient id="sun-grad" cx="38%" cy="35%" r="62%">
                <stop offset="0%"   stopColor="#fef3c7" stopOpacity={1}    />
                <stop offset="45%"  stopColor="hsl(var(--primary))" stopOpacity={0.95} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.30} />
              </radialGradient>

              {/* Per-planet sphere gradients */}
              {gradDefs}

              {/* Glow filter */}
              <filter id="glow-sm" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow-lg" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* ── Deep space background ── */}
            <rect x={0} y={0} width={VIEW} height={VIEW} rx={16} fill="url(#bg-grad)" />

            {/* ── Nebula clouds ── */}
            <ellipse cx={150} cy={130} rx={130} ry={110} fill="url(#neb-1)" />
            <ellipse cx={340} cy={320} rx={150} ry={120} fill="url(#neb-2)" />
            <ellipse cx={360} cy={110} rx={90}  ry={80}  fill="url(#neb-3)" />

            {/* ── Stars ── */}
            {STARS.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" opacity={s.op} />
            ))}

            {/* ── Shooting star ── */}
            <line
              x1={60} y1={80} x2={160} y2={130}
              stroke="white" strokeWidth={1.5}
              strokeDasharray="60 200"
              style={{ animation: "tg-shoot 7s ease-in 1.5s infinite" }}
              opacity={0}
            />

            {/* ── Orbit rings (3 overlapping = glow effect) ── */}
            {Object.entries(TIER_CFG).map(([, cfg]) => (
              <g key={cfg.radius}>
                <circle cx={CX} cy={CY} r={cfg.radius} fill="none" stroke={cfg.glow} strokeWidth={10} opacity={0.03} />
                <circle cx={CX} cy={CY} r={cfg.radius} fill="none" stroke={cfg.glow} strokeWidth={3}  opacity={0.07} />
                <circle cx={CX} cy={CY} r={cfg.radius} fill="none" stroke={cfg.glow} strokeWidth={0.8} opacity={0.30} strokeDasharray="3 9" />
              </g>
            ))}

            {/* ── Decorative minor rings ── */}
            {[123, 193].map((r) => (
              <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="#ffffff" strokeWidth={0.3} opacity={0.06} strokeDasharray="2 12" />
            ))}

            {/* ── Center sun ── */}
            {/* Outer corona pulses */}
            <circle cx={CX} cy={CY} r={52} fill="hsl(var(--primary))" opacity={0.05}
              style={{ animation: "tg-pulse 3.2s ease-in-out infinite" }} />
            <circle cx={CX} cy={CY} r={40} fill="hsl(var(--primary))" opacity={0.08}
              style={{ animation: "tg-pulse 3.2s ease-in-out 0.4s infinite" }} />
            {/* Static glow rings */}
            <circle cx={CX} cy={CY} r={34} fill="hsl(var(--primary))" opacity={0.12} filter="url(#glow-lg)" />
            <circle cx={CX} cy={CY} r={24} fill="hsl(var(--primary))" opacity={0.20} />
            <circle cx={CX} cy={CY} r={16} fill="hsl(var(--primary))" opacity={0.55} />
            {/* Sun body */}
            <circle cx={CX} cy={CY} r={11} fill="url(#sun-grad)" filter="url(#glow-sm)" />
            {/* Center label */}
            <text
              x={CX} y={CY + 26}
              textAnchor="middle"
              fontSize="9"
              fill="#94a3b8"
              fontFamily="inherit"
              fontWeight="600"
              letterSpacing="0.03em"
            >
              {shortCenter}
            </text>

            {/* ── Planets ── */}
            {planets.map((p, i) => {
              const delay = `-${(p.initialAngleDeg / 360) * p.duration}s`;
              const planetY = CY - p.radius;
              return (
                <g
                  key={i}
                  style={{
                    transformOrigin: `${CX}px ${CY}px`,
                    animation: `tg-orbit ${p.duration}s linear infinite`,
                    animationDelay: delay,
                  }}
                >
                  {/* Outer glow halo */}
                  <circle
                    cx={CX} cy={planetY}
                    r={p.size + 5}
                    fill={p.color}
                    opacity={0.15}
                    style={{ pointerEvents: "none" }}
                  />
                  {/* Planet sphere */}
                  <circle
                    cx={CX} cy={planetY}
                    r={p.size}
                    fill={`url(#${p.gradId})`}
                    filter="url(#glow-sm)"
                    opacity={0.92}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => handleMouseEnter(e, p.player)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => router.push(`/player/${encodeURIComponent(p.player.name)}`)}
                  />
                  {/* Counter-rotating name label */}
                  <g
                    style={{
                      transformOrigin: `${CX}px ${planetY}px`,
                      animation: `tg-counter ${p.duration}s linear infinite`,
                      animationDelay: delay,
                      pointerEvents: "none",
                    }}
                  >
                    <text
                      x={CX}
                      y={planetY - p.size - 3}
                      textAnchor="middle"
                      fontSize={p.tier === "BATTLE BUDDY" ? "8.5" : p.tier === "SQUADMATE" ? "7.5" : "6.5"}
                      fill={p.color}
                      fontFamily="inherit"
                      fontWeight="500"
                      opacity={0.85}
                    >
                      {p.player.name.length > 10 ? p.player.name.slice(0, 9) + "…" : p.player.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* ── Hover tooltip ── */}
          {hovered && (
            <div
              className="absolute z-50 pointer-events-none bg-card/95 border border-border/50 rounded-xl px-3 py-2.5 shadow-2xl text-xs backdrop-blur-md"
              style={{
                left: Math.min(hovered.x + 14, (containerRef.current?.clientWidth ?? 480) - 170),
                top: Math.max(hovered.y - 44, 4),
                whiteSpace: "nowrap",
              }}
            >
              <div className="font-bold text-foreground tracking-tight">{hovered.player.name}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: TIER_CFG[hovered.player.affinity_tier]?.glow ?? "#6b7280" }}
                />
                <span
                  className="font-semibold text-[10px] uppercase tracking-widest"
                  style={{ color: TIER_CFG[hovered.player.affinity_tier]?.glow ?? "#6b7280" }}
                >
                  {hovered.player.affinity_tier}
                </span>
              </div>
              <div className="text-muted-foreground mt-1">{hovered.player.rounds_together} rounds together</div>
              <div className="text-[10px] text-muted-foreground/50 mt-0.5">click to view profile →</div>
            </div>
          )}
        </div>

        {/* ── Legend ── */}
        <div className="flex items-center justify-center gap-6 mt-3 text-xs text-muted-foreground">
          {Object.entries(TIER_CFG).map(([tier, cfg]) => {
            const count = grouped[tier]?.length ?? 0;
            return (
              <div key={tier} className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: cfg.glow }} />
                <span>{cfg.label}</span>
                <span className="text-muted-foreground/40">({count})</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
