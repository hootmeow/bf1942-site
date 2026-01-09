"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, User, Trophy, Target, Clock, BarChart, Skull, Star } from "lucide-react";
import { PlayerPlaytimeChart, PlayerTopMapsChart, PlayerTopServersChart, PlayerTeamPreferenceChart, PlayerActivityLast7DaysChart } from "@/components/charts";

// --- Interfaces (Updated to match API) ---
interface PlayerInfo {
  id: number;
  last_known_name: string;
  last_seen: string;
}
interface LifetimeStats {
  total_playtime_seconds: number;
  overall_kdr: number;
  total_kills: number;
  total_deaths: number;
  score_per_minute: number;
  kills_per_round: number;
  unique_servers_played: number;
  unique_maps_played: number;
}
interface PersonalBests {
  best_round_score: number;
  best_round_kills: number;
  best_round_kpm: number;
}
interface PlaystyleHabits {
  top_maps: { map_name: string; map_play_count: number }[];
  top_servers: { current_server_name: string; server_play_count: number }[];
  team_preference: { axis: number; allied: number };
  activity_last_7_days: { date: string; rounds: number }[];
  playtime_by_hour_utc: number[];
}
interface RecentRound {
  round_id: number;
  server_name: string;
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

// --- New Advanced Stats Interfaces ---
import { SkillRatingCard, SkillRating } from "@/components/skill-rating-card";
import { BattleBuddiesList, RelatedPlayer } from "@/components/battle-buddies-list";

interface AdvancedProfileResponse {
  ok: boolean;
  skill_rating?: SkillRating;
  related_players?: RelatedPlayer[];
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
          <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
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
          <TableHead>Map</TableHead>
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

  const [advancedProfile, setAdvancedProfile] = useState<AdvancedProfileResponse | null>(null);

  useEffect(() => {
    if (!playerName) return;
    async function fetchAdvancedProfile() {
      try {
        const res = await fetch(`/api/v1/players/search/profile_advanced?name=${playerName}`);
        if (res.ok) {
          const data = await res.json();
          if (data.ok) {
            setAdvancedProfile(data);
          }
        }
      } catch (e) {
        console.error("Failed to fetch advanced profile", e);
      }
    }
    fetchAdvancedProfile();
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

      {/* Advanced Stats: Skill Rating */}
      {advancedProfile?.skill_rating && (
        <div className="mb-6">
          <SkillRatingCard rating={advancedProfile.skill_rating} />
        </div>
      )}

      {/* Lifetime Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
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
          title="Score/Min"
          value={lifetime_stats?.score_per_minute?.toFixed(2) ?? '0.00'}
          icon={BarChart}
        />
        <StatCard
          title="Kills/Round"
          value={lifetime_stats?.kills_per_round?.toFixed(2) ?? '0.00'}
          icon={Skull}
        />
      </div>

      {/* Personal Bests */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle as="h2">Personal Bests</CardTitle>
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

      {/* Activity Charts Row (Side-by-Side) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 24h Activity Chart */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle as="h2">24 Hour Activity (UTC)</CardTitle>
          </CardHeader>
          <CardContent>
            {playstyle_habits?.playtime_by_hour_utc ? (
              <PlayerPlaytimeChart data={playstyle_habits.playtime_by_hour_utc} />
            ) : (
              <p className="text-sm text-muted-foreground">No activity data available.</p>
            )}
          </CardContent>
        </Card>

        {/* Activity Last 7 Days */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle as="h3">Activity (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {playstyle_habits?.activity_last_7_days && playstyle_habits.activity_last_7_days.length > 0 ? (
              <PlayerActivityLast7DaysChart data={playstyle_habits.activity_last_7_days} />
            ) : (
              <p className="text-sm text-muted-foreground">No activity data available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Team Preference & Habits Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Team Preference */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle as="h3">Team Preference</CardTitle>
          </CardHeader>
          <CardContent>
            {playstyle_habits?.team_preference ? (
              <PlayerTeamPreferenceChart
                data={[
                  { name: "Axis", value: playstyle_habits.team_preference.axis },
                  { name: "Allies", value: playstyle_habits.team_preference.allied }
                ]}
              />
            ) : (
              <p className="text-sm text-muted-foreground">No team preference data available.</p>
            )}
          </CardContent>
        </Card>

        {/* Top Maps */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle as="h3">Top Maps</CardTitle>
          </CardHeader>
          <CardContent>
            {playstyle_habits?.top_maps && playstyle_habits.top_maps.length > 0 ? (
              <PlayerTopMapsChart data={playstyle_habits.top_maps} />
            ) : (
              <p className="text-sm text-muted-foreground">No map data available.</p>
            )}
          </CardContent>
        </Card>

        {/* Top Servers */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle as="h3">Top Servers</CardTitle>
          </CardHeader>
          <CardContent>
            {playstyle_habits?.top_servers && playstyle_habits.top_servers.length > 0 ? (
              <PlayerTopServersChart data={playstyle_habits.top_servers} />
            ) : (
              <p className="text-sm text-muted-foreground">No server data available.</p>
            )}
          </CardContent>
        </Card>

        {/* Battle Buddies */}
        {advancedProfile?.related_players && (
          <div className="lg:col-span-1">
            <BattleBuddiesList players={advancedProfile.related_players} />
          </div>
        )}
      </div>

      {/* Recent Rounds */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle as="h2">Recent Rounds</CardTitle>
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