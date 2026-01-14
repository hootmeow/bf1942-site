"use client";

import { startTransition, useEffect, useState } from "react";
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
import { Loader2, AlertTriangle, User, Trophy, Target, Clock, BarChart, Skull, Star, Hash, Zap, TrendingUp, Wifi, Server, Map, Ghost, Share2, Shield, ShieldCheck } from "lucide-react";
import { PlayerPlaytimeChart, PlayerTopMapsChart, PlayerTopServersChart, PlayerTeamPreferenceChart, PlayerActivityLast7DaysChart } from "@/components/charts";
import { useToast } from "@/components/ui/toast-simple";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/stat-card";
import { EditProfileDialog } from "@/components/edit-profile-dialog";
import { submitClaimRequest } from "@/app/actions/claim-actions";
import { loginAction } from "@/app/actions/auth-actions";
import { PlayerFlag } from "@/components/player-flag";

// --- Interfaces ---
interface PlayerInfo {
  player_id: number;
  last_known_name: string;
  last_seen: string;
  is_verified?: boolean;
  iso_country_code?: string | null;
  bio?: string | null;
  custom_title?: string | null;
  display_discord_id?: boolean;
  linked_user_id?: string | null;
  discord_name?: string | null;
  discord_image?: string | null;
}

interface LinkedAlias {
  player_id: number;
  last_known_name: string;
  iso_country_code?: string | null;
}

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
  linked_aliases?: LinkedAlias[];
  lifetime_stats: LifetimeStats | null;
  personal_bests: PersonalBests | null;
  playstyle_habits: PlaystyleHabits | null;
  recent_rounds: RecentRound[] | null;
}

// --- New Advanced Stats Components ---
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

// function getFlagEmoji... removed

function ClaimProfileDialog({ playerId, playerName, isVerified, isLoggedIn }: { playerId: number, playerName: string, isVerified: boolean, isLoggedIn: boolean }) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onClaim() {
    setLoading(true)
    const res = await submitClaimRequest(playerId, playerName)
    setLoading(false)

    if (res.ok) {
      setOpen(false)
      toast({ title: "Request Sent", description: res.message, variant: "success" })
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" })
    }
  }

  if (isVerified) {
    return (
      <Button variant="ghost" size="sm" className="gap-2 text-green-500 hover:text-green-600 hover:bg-green-500/10 cursor-default">
        <ShieldCheck className="h-4 w-4" />
        Verified
      </Button>
    )
  }

  if (!isLoggedIn) {
    return (
      <form action={loginAction}>
        <Button variant="secondary" size="sm" className="gap-2">
          <Shield className="h-4 w-4" />
          Claim Profile
        </Button>
      </form>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="gap-2">
          <Shield className="h-4 w-4" />
          Claim Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Claim This Profile</DialogTitle>
          <DialogDescription>
            Are you the real <strong>{playerName}</strong>?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Claiming this profile will link it to your Discord account.
            This allows you to:
          </p>
          <ul className="text-sm list-disc list-inside space-y-1 ml-2">
            <li>Show a "Verified" badge on your stats.</li>
            <li>Prevent others from impersonating you.</li>
            <li>Join Clans and participate in events.</li>
          </ul>
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-md">
            <p className="text-xs text-yellow-500 font-medium">
              Note: An admin will manually verify this claim. You may be asked to confirm via Discord.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={onClaim} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Submit Claim
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// --- Main Page Component ---
export default function PlayerPageClient({ currentUser }: { currentUser?: any }) {
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

        let globalRankVal = undefined;
        try {
          const lbRes = await fetch('/api/v1/leaderboard');
          if (lbRes.ok) {
            const lbData = await lbRes.json();
            if (lbData.ok && Array.isArray(lbData.leaderboard)) {
              const foundStat = lbData.leaderboard.find((p: any) => p.name.toLowerCase() === playerName?.toLowerCase());
              if (foundStat) {
                globalRankVal = foundStat.rank;
              }
            }
          }
        } catch (lbErr) {
          console.error("Failed to fetch leaderboard for rank", lbErr);
        }

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

  // DESTRUCTURING HAPPENS HERE, SAFE AFTER CHECKS
  const { player_info, linked_aliases, lifetime_stats, personal_bests, playstyle_habits, recent_rounds } = profile;

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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-background/50 shrink-0 overflow-hidden border border-border/50">
            {player_info.iso_country_code ? (
              <PlayerFlag isoCode={player_info.iso_country_code} className="h-full w-full object-cover" />
            ) : (
              <div className="bg-primary/10 w-full h-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {player_info.last_known_name}
              </h1>

              {/* Custom Title Badge */}
              {player_info.custom_title && (
                <span className="inline-flex items-center rounded-md bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-500/20">
                  {player_info.custom_title}
                </span>
              )}

              {/* GLOBAL RANK BADGE */}
              {advancedProfile?.skill_rating?.global_rank && (
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                  Global #{advancedProfile.skill_rating.global_rank}
                </div>
              )}
            </div>

            {/* Bio / Status */}
            {player_info.bio && (
              <p className="mt-2 text-sm italic text-muted-foreground max-w-2xl">
                "{player_info.bio}"
              </p>
            )}

            {/* Metadata Row */}
            <div className="mt-2 flex flex-col gap-1">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Last seen: {new Date(player_info.last_seen).toLocaleString()}</span>

                {/* Discord Display */}
                {player_info.display_discord_id && player_info.discord_name && (
                  <span className="flex items-center gap-1 text-indigo-400">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 1-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.315-9.673-3.546-13.66a.07.07 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
                    {player_info.discord_name}
                  </span>
                )}
              </div>

              {/* Known Aliases */}
              {linked_aliases && linked_aliases.length > 0 && (
                <div className="flex items-center gap-2 text-xs mt-1">
                  <span className="text-muted-foreground">Known Aliases:</span>
                  <div className="flex flex-wrap gap-2">
                    {linked_aliases.map(alias => (
                      <a
                        key={alias.player_id}
                        href={`/player/${encodeURIComponent(alias.last_known_name)}`}
                        className="flex items-center gap-1 bg-secondary/50 hover:bg-secondary px-1.5 py-0.5 rounded transition-colors text-foreground decoration-0"
                      >
                        {alias.iso_country_code && <PlayerFlag isoCode={alias.iso_country_code} className="h-2.5" />}
                        {alias.last_known_name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Get Signature
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Forum Signature</DialogTitle>
                <DialogDescription>
                  Use this dynamic image on forums or Discord. It updates automatically as you play.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="rounded-md border p-1 bg-black/50 overflow-hidden flex justify-center">
                  <img
                    src={`/sig/${encodeURIComponent(player_info.last_known_name)}`}
                    alt="Signature Preview"
                    className="max-w-full h-auto"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Direct Link</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={`${window.location.origin}/sig/${encodeURIComponent(player_info.last_known_name)}`} />
                    <Button size="icon" variant="outline" onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/sig/${encodeURIComponent(player_info.last_known_name)}`);
                      toast({ title: "Copied!", variant: "success" });
                    }}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>BBCode (Forums)</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={`[img]${window.location.origin}/sig/${encodeURIComponent(player_info.last_known_name)}[/img]`} />
                    <Button size="icon" variant="outline" onClick={() => {
                      navigator.clipboard.writeText(`[img]${window.location.origin}/sig/${encodeURIComponent(player_info.last_known_name)}[/img]`);
                      toast({ title: "Copied!", variant: "success" });
                    }}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Profile
          </Button>

          <ClaimProfileDialog
            playerId={player_info.player_id}
            playerName={player_info.last_known_name}
            isVerified={player_info.is_verified ?? false}
            isLoggedIn={!!currentUser}
          />

          {/* Edit Profile Button (Only if owner) */}
          {currentUser?.id === player_info.linked_user_id && (
            <EditProfileDialog
              playerId={player_info.player_id}
              initialBio={player_info.bio}
              initialCountry={player_info.iso_country_code}
              initialTitle={player_info.custom_title}
              initialDiscordVisible={player_info.display_discord_id}
            />
          )}
        </div>
      </div>

      {/* Advanced Stats: Skill Rating */}
      {advancedProfile?.skill_rating && (
        <div className="mb-6">
          <SkillRatingCard rating={advancedProfile.skill_rating} />
        </div>
      )}

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
            <RecentRoundsList rounds={recent_rounds} playerName={player_info.last_known_name} />
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