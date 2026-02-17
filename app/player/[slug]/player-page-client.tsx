"use client";

import { startTransition, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, AlertTriangle, User, Users, Trophy, Target, Clock, BarChart, Skull, Star, Hash, Zap, TrendingUp, Wifi, Server, Map, Ghost, Share2, Shield, ShieldCheck } from "lucide-react";
import { PlayerPlaytimeChart, PlayerTopMapsChart, PlayerTopServersChart, PlayerTeamPreferenceChart, PlayerActivityLast7DaysChart, PlayerTimeseriesChart } from "@/components/charts";
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
import { AchievementsList, Achievement } from "@/components/achievements-list";
import { PlayerSessionStats } from "@/components/player-session-stats";
import { PlayerServerRanks } from "@/components/player-server-ranks";
import { PlayerMapPerformance, MapPerformanceStat } from "@/components/player-map-performance";
import { ProfileGallery } from "@/components/profile-gallery";
import { getThemeClasses } from "@/components/theme-picker";
import { WarStoryCard } from "@/components/war-story-card";
import { PlayerMatchHistory } from "@/components/player-match-history";
import { BookOpen } from "lucide-react";
import { ImageIcon as GalleryIcon, MapPin } from "lucide-react";

// --- Interfaces ---
interface PlayerInfo {
  player_id: number;
  last_known_name: string;
  first_seen?: string;
  last_seen: string;
  is_verified?: boolean;
  iso_country_code?: string | null;
  bio?: string | null;
  custom_title?: string | null;
  display_discord_id?: boolean;
  linked_user_id?: string | null;
  discord_name?: string | null;
  discord_image?: string | null;
  is_flagged?: boolean;
  flag_reason?: string | null;
  profile_theme?: string | null;
  favorite_maps?: string[] | null;
  gallery_urls?: string[] | null;
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
  best_score_round_id?: number;
  best_kill_round_id?: number;
  best_kpm_round_id?: number;
}

interface PlaystyleHabits {
  top_maps: { map_name: string; map_play_count: number }[];
  top_servers: { current_server_name: string; server_play_count: number }[];
  team_preference: { axis: number; allied: number };
  activity_last_7_days: { date: string; rounds: number }[];
  playtime_by_hour_utc: number[];
  gamemode_breakdown?: { gamemode: string; count: number }[];
}

interface RecentRound {
  round_id: number;
  server_name: string;
  map_name: string;
  end_time: string;
  final_score: number;
  final_kills: number;
  final_deaths: number;
  team?: number;
  winner_team?: number;
}

interface OnlineStatus {
  is_online: boolean;
  current_server: string | null;
  last_seen_timestamp: string | null;
  minutes_ago?: number | null;
}

interface WarStoryData {
  story_id: number;
  title: string;
  description?: string | null;
  screenshot_url?: string | null;
  round_id?: number | null;
  is_featured: boolean;
  created_at: string;
  round_map?: string | null;
  round_date?: string | null;
}

interface PlayerProfileApiResponse {
  ok: boolean;
  player_info: PlayerInfo;
  linked_aliases?: LinkedAlias[];
  achievements?: Achievement[];
  online_status?: OnlineStatus;
  lifetime_stats: LifetimeStats | null;
  personal_bests: PersonalBests | null;
  playstyle_habits: PlaystyleHabits | null;
  recent_rounds: RecentRound[] | null;
  war_stories?: WarStoryData[] | null;
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

  const [advancedProfile, setAdvancedProfile] = useState<AdvancedProfileResponse | null>(null);
  const [rankHistory, setRankHistory] = useState<RankHistoryItem[] | null>(null);
  const [mapPerformance, setMapPerformance] = useState<MapPerformanceStat[] | null>(null);

  // Single effect: fetch all player data in parallel
  useEffect(() => {
    if (!playerName) {
      setError("Invalid player name in URL.");
      setLoading(false);
      return;
    }

    async function fetchAll() {
      const encodedName = encodeURIComponent(playerName!);
      const [profileRes, advancedRes, rankRes, mapRes, tsRes] = await Promise.allSettled([
        fetch(`/api/v1/players/search/profile?name=${encodedName}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/v1/players/search/profile_advanced?name=${encodedName}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/v1/players/search/history_rank?name=${encodedName}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/v1/players/search/map_performance?name=${encodedName}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/v1/players/search/timeseries?name=${encodedName}&timespan=week`).then(r => r.ok ? r.json() : null),
      ]);

      // Profile (required)
      const profileData = profileRes.status === 'fulfilled' ? profileRes.value : null;
      if (profileData?.ok) {
        setProfile(profileData);
      } else {
        setError("Failed to load player profile.");
      }

      // Advanced (optional)
      const advData = advancedRes.status === 'fulfilled' ? advancedRes.value : null;
      if (advData?.ok) setAdvancedProfile(advData);

      // Rank history (optional)
      const rankData = rankRes.status === 'fulfilled' ? rankRes.value : null;
      if (rankData?.ok) setRankHistory(rankData.history);

      // Map performance (optional)
      const mapData = mapRes.status === 'fulfilled' ? mapRes.value : null;
      if (mapData?.ok) setMapPerformance(mapData.map_performance);

      // Timeseries (optional)
      const tsData = tsRes.status === 'fulfilled' ? tsRes.value : null;
      if (tsData?.ok) setTimeseriesData(tsData.timeseries_data || []);

      setLoading(false);
    }

    fetchAll();
  }, [playerName]);

  // Timeseries data (initial 'week' fetch done in main effect above)
  const [timeseriesData, setTimeseriesData] = useState<any[]>([]);
  const [timeseriesSpan, setTimeseriesSpan] = useState('week');
  const [tsInitialLoaded, setTsInitialLoaded] = useState(false);

  useEffect(() => {
    if (!playerName) return;
    // Skip first render — 'week' data was already loaded in the batch fetch
    if (!tsInitialLoaded) { setTsInitialLoaded(true); return; }

    async function fetchTimeseries() {
      try {
        const res = await fetch(`/api/v1/players/search/timeseries?name=${encodeURIComponent(playerName!)}&timespan=${timeseriesSpan}`);
        if (res.ok) {
          const data = await res.json();
          if (data.ok) {
            setTimeseriesData(data.timeseries_data || []);
          }
        }
      } catch (e) {
        console.error("Failed to fetch timeseries", e);
      }
    }

    fetchTimeseries();
  }, [playerName, timeseriesSpan]);

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
  const { player_info, linked_aliases, online_status, lifetime_stats, personal_bests, playstyle_habits, recent_rounds } = profile;

  const isOwner = currentUser?.id === player_info.linked_user_id;

  const themeClass = getThemeClasses(player_info.profile_theme || "default");

  return (
    <div className={`space-y-6 ${themeClass}`}>
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
      {player_info.is_flagged && (
        <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 text-red-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Account Flagged</AlertTitle>
          <AlertDescription>
            This player has been flagged for <strong>{player_info.flag_reason || "Stat Manipulation"}</strong>.
            Their stats do not contribute to the global leaderboard.
          </AlertDescription>
        </Alert>
      )}
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

              {/* Online Badge */}
              {online_status?.is_online && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-500 cursor-help">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                        </span>
                        Online
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-muted-foreground">Playing on {online_status.current_server}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* Custom Title Badge */}
              {player_info.custom_title && (
                <span className="inline-flex items-center rounded-md bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-500/20">
                  {player_info.custom_title}
                </span>
              )}

              {/* GLOBAL RANK BADGE */}
              {(advancedProfile?.skill_rating?.global_rank || player_info.is_flagged) && (
                <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${player_info.is_flagged ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:bg-primary/80"}`}>
                  Global #{player_info.is_flagged ? "N/A" : advancedProfile?.skill_rating?.global_rank}
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
                {player_info.first_seen && (
                  <span>Playing since {new Date(player_info.first_seen).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} · </span>
                )}
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
              initialTheme={player_info.profile_theme}
              initialFavoriteMaps={player_info.favorite_maps}
              initialGalleryUrls={player_info.gallery_urls}
            />
          )}
        </div>
      </div>

      {/* Advanced Stats: Skill Rating */}
      {advancedProfile?.skill_rating && (
        <SkillRatingCard rating={advancedProfile.skill_rating} />
      )}

      {/* Lifetime Stats Section */}
      <Card className="border-border/60 overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
          <CardTitle as="h2" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <BarChart className="h-4 w-4 text-primary" />
            </div>
            Lifetime Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Hero Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/40">
            <div className="p-6 text-center">
              <div className="text-4xl font-black tabular-nums text-primary">
                {lifetime_stats?.overall_kdr?.toFixed(2) ?? '0.00'}
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">K/D Ratio</div>
            </div>
            <div className="p-6 text-center">
              <div className="text-4xl font-black tabular-nums text-amber-500">
                {lifetime_stats?.win_rate?.toFixed(1) ?? '0'}<span className="text-2xl">%</span>
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Win Rate</div>
            </div>
            <div className="p-6 text-center">
              <div className="text-4xl font-black tabular-nums text-foreground">
                {formatPlaytime(lifetime_stats?.total_playtime_seconds ?? 0)}
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Playtime</div>
            </div>
            <div className="p-6 text-center">
              <div className="text-4xl font-black tabular-nums text-emerald-500">
                {(lifetime_stats?.total_score ?? 0).toLocaleString()}
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Total Score</div>
            </div>
          </div>

          {/* Kill/Death Visual Bar */}
          <div className="px-6 py-4 border-t border-border/40 bg-muted/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-green-500 font-semibold tabular-nums">{(lifetime_stats?.total_kills ?? 0).toLocaleString()} Kills</span>
              <span className="text-muted-foreground">{lifetime_stats?.total_rounds_played?.toLocaleString() ?? 0} Rounds</span>
              <span className="text-red-400 font-semibold tabular-nums">{(lifetime_stats?.total_deaths ?? 0).toLocaleString()} Deaths</span>
            </div>
            <div className="h-2.5 rounded-full bg-red-500/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-1000"
                style={{ width: `${Math.min(100, ((lifetime_stats?.total_kills ?? 0) / Math.max(1, (lifetime_stats?.total_kills ?? 0) + (lifetime_stats?.total_deaths ?? 0))) * 100)}%` }}
              />
            </div>
          </div>

          {/* Secondary Stats Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-y divide-border/30 border-t border-border/40">
            {[
              { label: "KPM", value: lifetime_stats?.overall_kpm?.toFixed(2) ?? '0' },
              { label: "Score/Min", value: lifetime_stats?.score_per_minute?.toFixed(2) ?? '0' },
              { label: "Kills/Round", value: lifetime_stats?.kills_per_round?.toFixed(1) ?? '0' },
              { label: "Deaths/Round", value: lifetime_stats?.deaths_per_round?.toFixed(1) ?? '0' },
              { label: "Avg Ping", value: `${Math.round(lifetime_stats?.average_ping ?? 0)}ms` },
              { label: "Avg Score", value: Math.round(lifetime_stats?.average_score_per_round ?? 0).toLocaleString() },
            ].map((stat) => (
              <div key={stat.label} className="px-4 py-3 text-center">
                <div className="text-lg font-bold tabular-nums text-foreground">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Discovery Stats */}
          <div className="grid grid-cols-2 divide-x divide-border/30 border-t border-border/40">
            <div className="px-4 py-3 flex items-center justify-center gap-3">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm"><strong className="tabular-nums">{lifetime_stats?.unique_servers ?? lifetime_stats?.unique_servers_played ?? 0}</strong> <span className="text-muted-foreground">servers played</span></span>
            </div>
            <div className="px-4 py-3 flex items-center justify-center gap-3">
              <Map className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm"><strong className="tabular-nums">{lifetime_stats?.unique_maps ?? lifetime_stats?.unique_maps_played ?? 0}</strong> <span className="text-muted-foreground">maps played</span></span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Bests Section */}
      <Card className="border-border/60 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-500/10 via-transparent to-transparent border-b border-border/40">
          <CardTitle as="h2" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20">
              <Trophy className="h-4 w-4 text-amber-500" />
            </div>
            Personal Bests
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-3 p-4">
          {[
            { value: personal_bests?.best_round_score ?? 0, label: "Best Score", roundId: personal_bests?.best_score_round_id, color: "amber" },
            { value: personal_bests?.best_round_kills ?? 0, label: "Best Kills", roundId: personal_bests?.best_kill_round_id, color: "red" },
            { value: personal_bests?.best_round_kpm?.toFixed(2) ?? '0.00', label: "Best KPM", roundId: personal_bests?.best_kpm_round_id, color: "purple" },
          ].map((stat) => {
            const inner = (
              <>
                <div className={`text-3xl font-bold tabular-nums ${stat.color === 'amber' ? 'text-amber-500' : stat.color === 'red' ? 'text-red-500' : 'text-purple-500'}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
                {stat.roundId && (
                  <div className={`text-[10px] mt-1.5 ${stat.color === 'amber' ? 'text-amber-500/60' : stat.color === 'red' ? 'text-red-500/60' : 'text-purple-500/60'}`}>
                    Round #{stat.roundId}
                  </div>
                )}
              </>
            );
            const cls = `text-center p-4 rounded-lg border ${
              stat.color === 'amber' ? 'bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20' :
              stat.color === 'red' ? 'bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20' :
              'bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20'
            }`;
            return stat.roundId ? (
              <Link key={stat.label} href={`/stats/rounds/${stat.roundId}`} className={`${cls} hover:brightness-125 transition-all`}>
                {inner}
              </Link>
            ) : (
              <div key={stat.label} className={cls}>{inner}</div>
            );
          })}
        </CardContent>
      </Card>

      {/* Achievements */}
      {profile.achievements && (
        <div className="mb-6">
          <AchievementsList achievements={profile.achievements} />
        </div>
      )}

      {/* Favorite Maps */}
      {player_info.favorite_maps && player_info.favorite_maps.length > 0 && (
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle as="h2" className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-500" />
              Favorite Maps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {player_info.favorite_maps.map((mapName, i) => (
                <span key={i} className="inline-flex items-center rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-500 ring-1 ring-inset ring-amber-500/20">
                  {mapName}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery */}
      {player_info.gallery_urls && player_info.gallery_urls.length > 0 && (
        <>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pink-500/10">
              <GalleryIcon className="h-5 w-5 text-pink-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Gallery</h2>
              <p className="text-sm text-muted-foreground">Screenshots and memories</p>
            </div>
          </div>
          <ProfileGallery urls={player_info.gallery_urls} />
        </>
      )}

      {/* War Stories */}
      {profile.war_stories && profile.war_stories.length > 0 && (
        <>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <BookOpen className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">War Stories</h2>
              <p className="text-sm text-muted-foreground">Memorable moments from the battlefield</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {profile.war_stories.map((story) => (
              <WarStoryCard key={story.story_id} story={story} isOwner={isOwner} />
            ))}
          </div>
        </>
      )}

      {/* Activity Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/10">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Activity Patterns</h2>
          <p className="text-sm text-muted-foreground">When and how often you play</p>
        </div>
      </div>

      {/* Activity Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 24h Activity Chart */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle as="h3" className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              24 Hour Activity
              <span className="text-xs font-normal text-muted-foreground">(UTC)</span>
            </CardTitle>
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
          <CardHeader className="pb-2">
            <CardTitle as="h3" className="text-base flex items-center gap-2">
              <BarChart className="h-4 w-4 text-emerald-500" />
              Weekly Activity
              <span className="text-xs font-normal text-muted-foreground">(Last 7 Days)</span>
            </CardTitle>
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

      {/* Performance Over Time */}
      {timeseriesData.length > 0 && (
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle as="h2" className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              Performance Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PlayerTimeseriesChart
              data={timeseriesData}
              timespan={timeseriesSpan}
              onTimespanChange={setTimeseriesSpan}
            />
          </CardContent>
        </Card>
      )}

      {/* Playstyle Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <Map className="h-5 w-5 text-purple-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Playstyle</h2>
          <p className="text-sm text-muted-foreground">Your preferred maps, servers, and teams</p>
        </div>
      </div>

      {/* Team Preference, Gamemode, Maps, Servers Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Team Preference */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle as="h3" className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              Team Preference
            </CardTitle>
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

        {/* Gamemode Breakdown */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle as="h3" className="text-base flex items-center gap-2">
              <Server className="h-4 w-4 text-cyan-500" />
              Game Modes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {playstyle_habits?.gamemode_breakdown && playstyle_habits.gamemode_breakdown.length > 0 ? (
              <div className="space-y-2">
                {playstyle_habits.gamemode_breakdown.map((gm) => {
                  const total = playstyle_habits.gamemode_breakdown!.reduce((s, g) => s + g.count, 0);
                  const pct = total > 0 ? Math.round((gm.count / total) * 100) : 0;
                  return (
                    <div key={gm.gamemode} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium capitalize">{gm.gamemode}</span>
                        <span className="text-muted-foreground tabular-nums">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                        <div className="h-full rounded-full bg-cyan-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No gamemode data available.</p>
            )}
          </CardContent>
        </Card>

        {/* Top Maps */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle as="h3" className="text-base flex items-center gap-2">
              <Map className="h-4 w-4 text-amber-500" />
              Favorite Maps
            </CardTitle>
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
          <CardHeader className="pb-2">
            <CardTitle as="h3" className="text-base flex items-center gap-2">
              <Server className="h-4 w-4 text-cyan-500" />
              Favorite Servers
            </CardTitle>
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

      {/* Map Performance Section */}
      {mapPerformance && mapPerformance.length > 0 && (
        <>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Map className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Map Performance</h2>
              <p className="text-sm text-muted-foreground">Your stats breakdown across every map</p>
            </div>
          </div>

          <PlayerMapPerformance stats={mapPerformance} />
        </>
      )}

      {/* Server Rankings Section */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10">
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Server Rankings</h2>
          <p className="text-sm text-muted-foreground">Your rank on each server you&apos;ve played</p>
        </div>
      </div>

      <PlayerServerRanks playerName={player_info.last_known_name} />

      {/* Social & History Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <Users className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Social & History</h2>
          <p className="text-sm text-muted-foreground">Sessions, teammates, and recent matches</p>
        </div>
      </div>

      {/* Social: Battle Buddies, Recent Rounds, Rank History */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="h-full">
          {advancedProfile?.related_players ? (
            <BattleBuddiesList players={advancedProfile.related_players} />
          ) : (
            <Card className="border-border/60 h-full flex items-center justify-center p-6 bg-muted/20">
              <p className="text-muted-foreground text-sm">No battle buddies found.</p>
            </Card>
          )}
        </div>
        <div className="h-full">
          {recent_rounds && recent_rounds.length > 0 ? (
            <RecentRoundsList rounds={recent_rounds} playerName={player_info.last_known_name} />
          ) : (
            <Card className="border-border/60 h-full flex items-center justify-center p-6 bg-muted/20">
              <p className="text-muted-foreground text-sm">No recent rounds.</p>
            </Card>
          )}
        </div>
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

      {/* Session Stats - Full Width */}
      <PlayerSessionStats playerName={player_info.last_known_name} />

      {/* Full Match History */}
      <PlayerMatchHistory playerId={player_info.player_id} />
    </div>
  );
}