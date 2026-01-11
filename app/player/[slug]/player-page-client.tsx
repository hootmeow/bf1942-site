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
import { Loader2, AlertTriangle, User, Trophy, Target, Clock, BarChart, Skull, Star, Hash, Zap, TrendingUp, Wifi, Server, Map, Ghost, Share2 } from "lucide-react";
import { PlayerPlaytimeChart, PlayerTopMapsChart, PlayerTopServersChart, PlayerTeamPreferenceChart, PlayerActivityLast7DaysChart } from "@/components/charts";
import { useToast } from "@/components/ui/toast-simple";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { StatCard } from "@/components/stat-card"; // Import StatCard

// --- Interfaces (Updated to match API) ---
interface PlayerInfo {
  id: number;
  last_known_name: string;
  last_seen: string;
}

// Correcting the Interface completely to match the USER'S JSON
interface LifetimeStats {
  total_rounds_played: number;
  total_score: number;
  total_kills: number;
  total_deaths: number;
  overall_kdr: number;
  overall_kpm: number;
  average_score_per_round: number;
  average_ping: number;
  unique_servers: number;
  unique_maps: number;
  total_playtime_seconds: number;
  score_per_minute: number;
  kills_per_round: number;
  deaths_per_round: number;
  win_rate?: number;
  // Legacy support if needed, but likely these are the real keys now
  unique_servers_played?: number;
  unique_maps_played?: number;
}

interface PersonalBests {
  best_round_score: number;
  best_round_kills: number;
  best_round_kpm: number;
  best_kill_round_id?: number;
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
import { RankHistoryList, RankHistoryItem } from "@/components/rank-history-list";
import { RecentRoundsList } from "@/components/recent-rounds-list";

interface AdvancedProfileResponse {
  ok: boolean;
  skill_rating?: SkillRating;
  related_players?: RelatedPlayer[];
}

interface RankHistoryResponse {
  ok: boolean;
  player: string;
  history: RankHistoryItem[];
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

// StatCard removed (imported)



// --- Main Page Component ---
export default function PlayerPageClient() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;

  const playerName = slug ? decodeURIComponent(slug) : undefined;
  const { toast } = useToast();

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
  const [rankHistory, setRankHistory] = useState<RankHistoryItem[] | null>(null);

  useEffect(() => {
    if (!playerName) return;

    async function fetchAdvancedProfile() {
      try {
        const res = await fetch(`/api/v1/players/search/profile_advanced?name=${playerName}`);
        let advancedData = null;
        if (res.ok) {
          advancedData = await res.json();
        }

        // Fetch Global Rank (Client-side workaround since backend doesn't provide it yet)
        let globalRankVal = undefined;
        try {
          const lbRes = await fetch('/api/v1/leaderboard');
          if (lbRes.ok) {
            const lbData = await lbRes.json();
            if (lbData.ok && Array.isArray(lbData.leaderboard)) {
              // Find player in leaderboard
              const foundStat = lbData.leaderboard.find((p: any) => p.name.toLowerCase() === playerName?.toLowerCase());
              if (foundStat) {
                globalRankVal = foundStat.rank;
              }
            }
          }
        } catch (lbErr) {
          console.error("Failed to fetch leaderboard for rank", lbErr);
        }

        // Merge Data
        if (advancedData && advancedData.ok) {
          if (globalRankVal && advancedData.skill_rating) {
            advancedData.skill_rating.global_rank = globalRankVal;
          }
          setAdvancedProfile(advancedData);
        }

      } catch (e) {
        console.error("Failed to fetch advanced profile", e);
      }
    }

    async function fetchRankHistory() {
      try {
        const res = await fetch(`/api/v1/players/search/history_rank?name=${playerName}`);
        if (res.ok) {
          const data: RankHistoryResponse = await res.json();
          if (data.ok) {
            setRankHistory(data.history);
          }
        }
      } catch (e) {
        console.error("Failed to fetch rank history", e);
      }
    }

    fetchAdvancedProfile();
    fetchRankHistory();
  }, [playerName]);

  const handleShare = () => {
    const url = window.location.href;
    const kdr = profile?.lifetime_stats?.overall_kdr?.toFixed(2) || "N/A";
    const rank = advancedProfile?.skill_rating?.label || "Soldier";
    const text = `🎖️ ${profile?.player_info.last_known_name} | Rank: ${rank} | K/D: ${kdr} | ${url}`;

    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Profile Copied!",
        description: "Share link copied to clipboard.",
        variant: "success"
      });
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 15 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
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
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            "mainEntity": {
              "@type": "Person",
              "name": player_info.last_known_name,
              "interactionStatistic": [
                {
                  "@type": "InteractionCounter",
                  "interactionType": "https://schema.org/PlayAction",
                  "userInteractionCount": lifetime_stats?.total_rounds_played || 0
                }
              ],
              "description": `Combat record for ${player_info.last_known_name}: ${lifetime_stats?.overall_kdr?.toFixed(2)} K/D, ${lifetime_stats?.total_score?.toLocaleString()} Score`
            }
          })
        }}
      />
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

        <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
          <Share2 className="h-4 w-4" />
          Share Profile
        </Button>
      </div>

      {/* Advanced Stats: Skill Rating */}
      {advancedProfile?.skill_rating && (
        <div className="mb-6">
          <SkillRatingCard rating={advancedProfile.skill_rating} />
        </div>
      )}

      {/* Lifetime Stats */}
      {/* Lifetime Stats */}
      <h3 className="text-xl font-semibold tracking-tight">Lifetime Stats</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        <StatCard title="Playtime" value={formatPlaytime(lifetime_stats?.total_playtime_seconds ?? 0)} icon={Clock} />
        <StatCard title="Rounds Played" value={lifetime_stats?.total_rounds_played ?? 0} icon={Hash} />
        <StatCard title="Total Score" value={lifetime_stats?.total_score?.toLocaleString() ?? 0} icon={Star} />
        <StatCard title="Win Rate" value={lifetime_stats?.win_rate ? `${lifetime_stats.win_rate}%` : 'N/A'} icon={Trophy} />
        <StatCard title="Total Kills" value={lifetime_stats?.total_kills?.toLocaleString() ?? 0} icon={Target} />
        <StatCard title="Total Deaths" value={lifetime_stats?.total_deaths?.toLocaleString() ?? 0} icon={Ghost} />

        <StatCard title="K/D Ratio" value={lifetime_stats?.overall_kdr?.toFixed(2) ?? '0.00'} icon={Trophy} />
        <StatCard title="Avg. Kills/Round" value={lifetime_stats?.kills_per_round?.toFixed(2) ?? '0.00'} icon={Skull} />
        <StatCard title="Avg. Deaths/Round" value={lifetime_stats?.deaths_per_round?.toFixed(2) ?? '0.00'} icon={Ghost} />
        <StatCard title="KPM" value={lifetime_stats?.overall_kpm?.toFixed(2) ?? '0.00'} icon={Zap} />
        <StatCard title="Score/Min" value={lifetime_stats?.score_per_minute?.toFixed(2) ?? '0.00'} icon={BarChart} />

        <StatCard title="Avg Score/Round" value={lifetime_stats?.average_score_per_round?.toFixed(2) ?? '0.00'} icon={TrendingUp} />
        <StatCard title="Avg Ping" value={Math.round(lifetime_stats?.average_ping ?? 0)} icon={Wifi} />
        <StatCard title="Unique Servers" value={lifetime_stats?.unique_servers ?? lifetime_stats?.unique_servers_played ?? 0} icon={Server} />
        <StatCard title="Unique Maps" value={lifetime_stats?.unique_maps ?? lifetime_stats?.unique_maps_played ?? 0} icon={Map} />
      </div>

      {/* Personal Bests */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle as="h2">Personal Bests</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            icon={Zap}
          />
          <StatCard
            title="Best Kill Round ID"
            value={personal_bests?.best_kill_round_id ? `#${personal_bests.best_kill_round_id}` : 'N/A'}
            icon={Hash}
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

      {/* Team Preference, Maps, Servers Row */}
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
      </div>

      {/* Social & History Row (Battle Buddies, Recent Rounds, Rank History) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Battle Buddies */}
        <div className="h-full">
          {advancedProfile?.related_players ? (
            <BattleBuddiesList players={advancedProfile.related_players} />
          ) : (
            <Card className="border-border/60 h-full flex items-center justify-center p-6 bg-muted/20">
              <p className="text-muted-foreground text-sm">No battle buddies found.</p>
            </Card>
          )}
        </div>

        {/* Recent Rounds - Compact List */}
        <div className="h-full">
          {recent_rounds && recent_rounds.length > 0 ? (
            <RecentRoundsList rounds={recent_rounds} />
          ) : (
            <Card className="border-border/60 h-full flex items-center justify-center p-6 bg-muted/20">
              <p className="text-muted-foreground text-sm">No recent rounds.</p>
            </Card>
          )}
        </div>

        {/* Rank History Summary */}
        <div className="h-full">
          {rankHistory ? (
            <RankHistoryList history={rankHistory} playerName={player_info.last_known_name} />
          ) : (
            <Card className="border-border/60 h-full flex items-center justify-center p-6 bg-muted/20">
              <p className="text-muted-foreground text-sm">No rank history.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}