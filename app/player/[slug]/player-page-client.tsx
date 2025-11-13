"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Loader2, AlertTriangle, Clock, Target, Skull, BarChart, Trophy, Map, Heart, Server, Star } from "lucide-react";
import { PlayerPlaytimeChart } from "@/components/charts"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

// --- API Types ---
interface PlayerInfo {
  player_id: number;
  canonical_name: string;
  last_known_name: string;
  first_seen: string;
  last_seen: string;
}
interface LifetimeStats {
  total_rounds_played: number;
  total_playtime_seconds: number;
  total_score: number;
  total_kills: number;
  total_deaths: number;
  overall_kdr: number;
  overall_kpm: number;
  average_score_per_round: number;
  average_ping: number;
}
interface PersonalBests {
  best_round_score: number;
  best_round_kills: number;
  best_round_kpm: number;
  best_kill_round_id: number;
}
interface PlaystyleHabits {
  favorite_map: {
    map_name: string;
    map_play_count: number;
  } | null; 
  favorite_server: {
    server_id: number;
    current_server_name: string;
    server_play_count: number;
  } | null; 
  favorite_team: {
    team: 1 | 2;
    team_play_count: number;
  } | null; 
  playtime_by_hour_utc: number[];
}
interface RecentRound {
  round_id: number;
  map_name: string;
  end_time: string;
  final_score: number;
  final_kills: number;
  final_deaths: number;
}
interface PlayerProfileApiResponse {
  ok: boolean;
  player_info: PlayerInfo;
  lifetime_stats: LifetimeStats | null; 
  personal_bests: PersonalBests | null; 
  playstyle_habits: PlaystyleHabits | null; 
  recent_rounds: RecentRound[] | null; 
}
// --- Helper Functions ---
function formatPlaytime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}
function getTeamName(team: 1 | 2): string {
  return team === 1 ? "Axis" : "Allies";
}
function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ElementType }) {
  const Icon = icon;
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}
function RecentRoundsTable({ rounds }: { rounds: RecentRound[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* --- THIS WAS THE JSX ERROR. I fixed the closing tag. --- */}
          <TableHead>Map</TableHead>
          {/* --- END FIX --- */}
          <TableHead>Finished</TableHead>
          <TableHead className="text-right">Score</TableHead>
          <TableHead className="text-right">Kills</TableHead>
          <TableHead className="text-right">Deaths</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rounds.map((round) => (
          <TableRow key={round.round_id}>
            <TableCell className="font-medium text-foreground">{round.map_name}</TableCell>
            <TableCell>{new Date(round.end_time).toLocaleString()}</TableCell>
            <TableCell className="text-right">{round.final_score}</TableCell>
            <TableCell className="text-right">{round.final_kills}</TableCell>
            <TableCell className="text-right">{round.final_deaths}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// --- Main Page Component ---
export default function PlayerPageClient() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  
  const playerName = slug ? decodeURIComponent(slug) : undefined;

  const [profile, setProfile] = useState<PlayerProfileApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!playerName) {
      setError("Invalid player name in URL.");
      setLoading(false);
      return;
    }

    async function fetchPlayerProfile() {
      try {
        const response = await fetch(`/api/v1/players/search/profile?name=${playerName}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch player data: ${response.statusText}`);
        }
        const data: PlayerProfileApiResponse = await response.json();
        if (data.ok) {
          setProfile(data);
        } else {
          throw new Error("API returned an error");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPlayerProfile();
  }, [playerName]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p>Loading player profile...</p>
      </div>
    );
  }

  if (error || !profile || !profile.player_info) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || "Failed to load player profile."}</AlertDescription>
      </Alert>
    );
  }

  const { player_info, lifetime_stats, personal_bests, playstyle_habits, recent_rounds } = profile;

  return (
    <div className="space-y-6">
      {/* Player Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {player_info.last_known_name}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Last seen: {new Date(player_info.last_seen).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Lifetime Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          title="Total Playtime"
          value={formatPlaytime(lifetime_stats?.total_playtime_seconds ?? 0)}
          icon={Clock}
        />
        <StatCard
          title="Overall KDR"
          value={lifetime_stats?.overall_kdr?.toFixed(2) ?? '0.00'}
          icon={Trophy}
        />
        <StatCard
          title="Total Kills"
          value={lifetime_stats?.total_kills ?? 0}
          icon={Target}
        />
        <StatCard
          title="Total Deaths"
          value={lifetime_stats?.total_deaths ?? 0}
          icon={Skull}
        />
      </div>

      {/* Playstyle & Bests Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Playstyle Habits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                Favorite Server:{" "}
                {playstyle_habits?.favorite_server ? (
                  <Link
                    href={`/servers/${playstyle_habits.favorite_server.server_id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {playstyle_habits.favorite_server.current_server_name}
                  </Link>
                ) : (
                  <span className="font-medium">N/A</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Map className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                Favorite Map: <span className="font-medium">{playstyle_habits?.favorite_map?.map_name ?? 'N/A'}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                Favorite Team: <span className="font-medium">{playstyle_habits?.favorite_team ? getTeamName(playstyle_habits.favorite_team.team) : 'N/A'}</span>
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/60 lg:col-span-2">
           <CardHeader>
            <CardTitle>Personal Bests</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
             <StatCard
              title="Best Round Score"
              value={personal_bests?.best_round_score ?? 0}
              icon={Star}
            />
             <StatCard
              title="Best Round Kills"
              value={personal_bests?.best_round_kills ?? 0}
              icon={Target}
            />
             <StatCard
              title="Best Round KPM"
              value={personal_bests?.best_round_kpm?.toFixed(2) ?? '0.00'}
              icon={BarChart}
            />
          </CardContent>
        </Card>
      </div>

      {/* 24h Activity Chart */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>24 Hour Activity (UTC)</CardTitle>
        </CardHeader>
        <CardContent>
          {playstyle_habits?.playtime_by_hour_utc ? (
            <PlayerPlaytimeChart data={playstyle_habits.playtime_by_hour_utc} />
          ) : (
            <p className="text-sm text-muted-foreground">No activity data available.</p>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Rounds */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Recent Rounds</CardTitle>
        </CardHeader>
        <CardContent>
          {recent_rounds && recent_rounds.length > 0 ? (
            <RecentRoundsTable rounds={recent_rounds} />
          ) : (
            <p className="text-sm text-muted-foreground">No recent rounds found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}