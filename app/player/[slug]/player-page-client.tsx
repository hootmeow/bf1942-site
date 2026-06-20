"use client";

import { startTransition, useEffect, useState, type ComponentProps } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { safeJsonLd } from "@/lib/utils";
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
import { Loader2, AlertTriangle, User, Users, Trophy, Target, Clock, CalendarDays, BarChart, Skull, Star, Hash, Zap, TrendingUp, Wifi, Server, Map, Ghost, Share2, Shield, ShieldCheck, UserPlus } from "lucide-react";
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
import { trackEvent } from "@/lib/analytics";
import { WarStoryCard } from "@/components/war-story-card";
import { PlayerMatchHistory } from "@/components/player-match-history";
import { SectionHeader } from "@/components/section-header";
import { BookOpen, Flame } from "lucide-react";
import { ImageIcon as GalleryIcon, MapPin } from "lucide-react";

// Sticky in-page navigation for the (very long) profile. Anchors smooth-scroll
// to each section; the row scrolls horizontally on small screens.
function ProfileSectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  if (sections.length === 0) return null;
  return (
    <nav className="sticky top-14 sm:top-16 z-20 rounded-xl border border-[#1e2a14] bg-[#060a04]/90 px-2 py-1.5 backdrop-blur">
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="whitespace-nowrap rounded-full border border-[#1e2a14] bg-[#0a0f06] px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

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
  top_servers: { server_id: number; current_server_name: string; server_play_count: number }[];
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

export interface PlayerProfileApiResponse {
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

// --- New Feature Interfaces ---
interface SessionSummary {
  total_sessions: number;
  avg_session_seconds: number;
  avg_rounds_per_session: number;
  longest_session_seconds: number;
  longest_session_rounds: number;
  longest_session_date: string;
}
interface CompletionRateData {
  total_rounds_with_data: number;
  avg_completion_pct: number;
  full_rounds: number;
  early_exits: number;
  label: string;
}
interface ScoreDeathData {
  lifetime_score_per_death: number;
  avg_score_per_death_per_round: number;
  best_single_round_spd: number;
  rounds_played: number;
}
interface ServerLoyaltyData {
  total_rounds: number;
  distinct_servers: number;
  loyalty_pct: number;
  nomad_score: number;
  loyalty_label: string;
  home_server: { server_id: number; server_name: string; rounds: number };
  servers: { server_id: number; server_name: string; rounds: number; share_pct: number }[];
}
interface ComebackData {
  total_absences: number;
  is_returning: boolean;
  absences: {
    gap_start: string;
    gap_end: string;
    gap_days: number;
    kdr_before: number | null;
    rounds_before: number;
    kdr_after: number | null;
    rounds_after: number;
  }[];
}

// --- New Advanced Stats Components ---
import { SkillRatingCard, SkillRating } from "@/components/skill-rating-card";
import { BattleBuddiesList, RelatedPlayer } from "@/components/battle-buddies-list";
import { RankHistoryList, RankHistoryItem } from "@/components/rank-history-list";
import { RecentRoundsList } from "@/components/recent-rounds-list";
import { TeammateGalaxy } from "@/components/teammate-galaxy";
import { PlayerDnaRadar } from "@/components/player-dna-radar";
import { PlayerRivals } from "@/components/player-rivals";
import { PlayerVelocityCard, VelocityBadge, type VelocityData } from "@/components/player-velocity";
import { PlayerPingSensitivity } from "@/components/player-ping-sensitivity";

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

// Per-metric colours for the Personal Bests tiles. Full literal class strings
// only — Tailwind's JIT never sees interpolated names.
const PB_COLORS = {
  amber:  { wrap: "border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent",   iconBg: "bg-amber-500/15",  icon: "text-amber-400",  value: "text-amber-400",  round: "text-amber-500/70" },
  red:    { wrap: "border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent",        iconBg: "bg-red-500/15",    icon: "text-red-400",    value: "text-red-400",    round: "text-red-500/70" },
  purple: { wrap: "border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent",  iconBg: "bg-purple-500/15", icon: "text-purple-400", value: "text-purple-400", round: "text-purple-500/70" },
};

// Global standing presented as an integrated "service ribbon" directly beneath
// the player's name (tier-coloured accent bar + large rank number) rather than a
// floating box, so it flows as a subtitle. It intentionally shows ONLY the global
// leaderboard position — the military rank label + RP live in the dedicated
// "Player Rank" card below, so repeating them here would be redundant. Players
// without a global rank get an explicit "Unranked" state (with a tooltip on how
// to qualify); flagged accounts read "Not Ranked" since their stats are excluded.
function RankRibbon({
  globalRank,
  isFlagged,
}: {
  globalRank?: number | null;
  isFlagged?: boolean;
}) {
  if (isFlagged) {
    return (
      <div className="mt-2 flex items-center gap-2.5">
        <span className="h-6 w-1 shrink-0 rounded-full bg-muted-foreground/25" />
        <Shield className="h-4 w-4 shrink-0 text-muted-foreground/70" />
        <span className="text-sm font-semibold text-muted-foreground">Not Ranked</span>
        <span className="hidden text-xs text-muted-foreground/70 sm:inline">· stats excluded from leaderboard</span>
      </div>
    );
  }

  if (!globalRank) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mt-2 flex w-fit cursor-help items-center gap-2.5">
              <span className="h-6 w-1 shrink-0 rounded-full bg-muted-foreground/20" />
              <Trophy className="h-4 w-4 shrink-0 text-muted-foreground/40" />
              <span className="text-sm font-bold text-muted-foreground">Unranked</span>
              <span className="hidden text-xs text-muted-foreground/70 sm:inline">· play 3+ ranked rounds to qualify</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[240px]">
            <p className="text-xs">Play <b>3 or more ranked rounds</b> and stay active within the last 60 days to earn a global rank.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const tier =
    globalRank <= 3 ? "gold" :
    globalRank <= 25 ? "elite" :
    globalRank <= 100 ? "high" : "ranked";
  const descriptor =
    globalRank <= 3 ? "Top 3" :
    globalRank <= 10 ? "Top 10" :
    globalRank <= 25 ? "Top 25" :
    globalRank <= 100 ? "Top 100" : null;

  // Full literal class strings only — Tailwind's JIT never sees interpolated names.
  const ACCENT: Record<string, { bar: string; icon: string; num: string; tag: string; tagBg: string }> = {
    gold:   { bar: "bg-amber-400",    icon: "text-amber-300",    num: "text-amber-200",  tag: "text-amber-300",    tagBg: "bg-amber-500/15" },
    elite:  { bar: "bg-amber-500/70", icon: "text-amber-300/90", num: "text-amber-100",  tag: "text-amber-300/90", tagBg: "bg-amber-500/10" },
    high:   { bar: "bg-primary",      icon: "text-primary",      num: "text-primary",    tag: "text-primary",      tagBg: "bg-primary/15" },
    ranked: { bar: "bg-primary/60",   icon: "text-primary/90",   num: "text-primary",    tag: "text-primary/90",   tagBg: "bg-primary/10" },
  };
  const a = ACCENT[tier];

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
      <span className={`h-6 w-1 shrink-0 rounded-full ${a.bar}`} />
      <Trophy className={`h-4 w-4 shrink-0 ${a.icon}`} />
      <span className={`text-xl font-extrabold leading-none tabular-nums ${a.num}`}>
        #{globalRank.toLocaleString()}
      </span>
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/70">Global Rank</span>
      {descriptor && (
        <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] ${a.tag} ${a.tagBg}`}>
          {descriptor}
        </span>
      )}
    </div>
  );
}

// Card with the subtle left gradient accent stripe used on the profile header,
// applied to content panels for a consistent visual language. Tunable in one place.
function AccentCard({ className, children, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card className={`relative overflow-hidden ${className ?? ""}`} {...props}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary/40 via-primary/10 to-transparent"
      />
      {children}
    </Card>
  );
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
      trackEvent("claim_player", { player_name: playerName })
      setOpen(false)
      toast({ title: "Request Sent", description: res.message, variant: "success" })
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" })
    }
  }

  if (isVerified) {
    return (
      <Button variant="ghost" size="icon" title="Verified profile" className="h-8 w-8 cursor-default text-green-500 hover:bg-green-500/10 hover:text-green-600">
        <ShieldCheck className="h-4 w-4" />
      </Button>
    )
  }

  if (!isLoggedIn) {
    return (
      <form action={loginAction}>
        <Button variant="ghost" size="icon" title="Claim this profile" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <UserPlus className="h-4 w-4" />
        </Button>
      </form>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Claim this profile" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <UserPlus className="h-4 w-4" />
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
export default function PlayerPageClient({
  currentUser,
  initialProfile,
}: {
  currentUser?: any;
  initialProfile?: PlayerProfileApiResponse | null;
}) {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  const playerName = slug ? decodeURIComponent(slug) : undefined;
  const { toast } = useToast();

  const [profile, setProfile] = useState<PlayerProfileApiResponse | null>(initialProfile ?? null);
  const [loading, setLoading] = useState(!initialProfile);
  const [error, setError] = useState<string | null>(null);

  const [advancedProfile, setAdvancedProfile] = useState<AdvancedProfileResponse | null>(null);
  const [rankHistory, setRankHistory] = useState<RankHistoryItem[] | null>(null);
  const [mapPerformance, setMapPerformance] = useState<MapPerformanceStat[] | null>(null);
  const [velocity, setVelocity] = useState<VelocityData | null>(null);
  const [streaks, setStreaks] = useState<{
    win_streak: { current: number; best: number; best_ended: string | null };
    kdr_streak: { current: number; best: number; best_ended: string | null };
  } | null>(null);

  // New features 4-8
  const [sessions, setSessions] = useState<SessionSummary | null>(null);
  const [completionRate, setCompletionRate] = useState<CompletionRateData | null>(null);
  const [scoreDeath, setScoreDeath] = useState<ScoreDeathData | null>(null);
  const [serverLoyalty, setServerLoyalty] = useState<ServerLoyaltyData | null>(null);
  const [comeback, setComeback] = useState<ComebackData | null>(null);

  // Single effect: fetch all player data in parallel
  useEffect(() => {
    if (!playerName) {
      setError("Invalid player name in URL.");
      setLoading(false);
      return;
    }

    async function fetchAll() {
      const encodedName = encodeURIComponent(playerName!);
      // Skip profile fetch when server already provided it as initialProfile
      const profilePromise = initialProfile
        ? Promise.resolve(initialProfile)
        : fetch(`/api/v1/players/search/profile?name=${encodedName}`).then(r => r.ok ? r.json() : null);

      const [profileRes, advancedRes, rankRes, mapRes, tsRes, streaksRes,
             sessionsRes, completionRes, spdRes, loyaltyRes, comebackRes] = await Promise.allSettled([
        profilePromise,
        fetch(`/api/v1/players/search/profile_advanced?name=${encodedName}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/v1/players/search/history_rank?name=${encodedName}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/v1/players/search/map_performance?name=${encodedName}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/v1/players/search/timeseries?name=${encodedName}&timespan=week`).then(r => r.ok ? r.json() : null),
        fetch(`/api/v1/players/search/streaks?name=${encodedName}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/v1/players/search/sessions?name=${encodedName}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/v1/players/search/completion-rate?name=${encodedName}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/v1/players/search/score-per-death?name=${encodedName}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/v1/players/search/server-loyalty?name=${encodedName}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/v1/players/search/comeback?name=${encodedName}`).then(r => r.ok ? r.json() : null),
      ]);

      // Profile (required)
      const profileData = profileRes.status === 'fulfilled' ? profileRes.value : null;
      if (profileData?.ok) {
        setProfile(profileData);
        trackEvent("player_view", { player_name: playerName! });
        // Fetch player_id-based endpoints now that we have the id
        const pid = profileData.player_info?.player_id;
        if (pid) {
          fetch(`/api/v1/players/${pid}/velocity`).then(r => r.ok ? r.json() : null)
            .then(d => { if (d?.ok) setVelocity(d); }).catch(() => {});
        }
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

      // Streaks (optional)
      const streaksData = streaksRes.status === 'fulfilled' ? streaksRes.value : null;
      if (streaksData?.ok) setStreaks(streaksData);

      // Sessions (feature 4)
      const sessData = sessionsRes.status === 'fulfilled' ? sessionsRes.value : null;
      if (sessData?.ok && sessData.summary) setSessions(sessData.summary);

      // Completion rate (feature 5)
      const compData = completionRes.status === 'fulfilled' ? completionRes.value : null;
      if (compData?.ok) setCompletionRate(compData);

      // Score per death (feature 6)
      const spdData = spdRes.status === 'fulfilled' ? spdRes.value : null;
      if (spdData?.ok) setScoreDeath(spdData);

      // Server loyalty (feature 7)
      const loyaltyData = loyaltyRes.status === 'fulfilled' ? loyaltyRes.value : null;
      if (loyaltyData?.ok && loyaltyData.loyalty_label) setServerLoyalty(loyaltyData);

      // Comeback (feature 8)
      const comebackData = comebackRes.status === 'fulfilled' ? comebackRes.value : null;
      if (comebackData?.ok) setComeback(comebackData);

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

  const hasBehaviour = !!(sessions || completionRate || scoreDeath || serverLoyalty || (comeback && comeback.total_absences > 0));
  const hasProfileContent = !!(profile.war_stories?.length || player_info.gallery_urls?.length || player_info.favorite_maps?.length);
  const navSections = [
    { id: "overview", label: "Overview" },
    { id: "activity", label: "Activity" },
    { id: "playstyle", label: "Playstyle" },
    ...(mapPerformance && mapPerformance.length > 0 ? [{ id: "maps", label: "Maps" }] : []),
    { id: "rankings", label: "Rankings" },
    { id: "social", label: "Social" },
    ...(hasBehaviour ? [{ id: "behaviour", label: "Behaviour" }] : []),
    ...(hasProfileContent ? [{ id: "profile-content", label: "Profile" }] : []),
  ];

  return (
    <div className={`space-y-6 ${themeClass}`}>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
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
      <div className="relative overflow-hidden rounded-xl border border-[#1e2a14]" style={{ background: "linear-gradient(135deg, #0d1208 0%, #070b05 60%, #060a04 100%)" }}>
        {/* tier accent stripe down the left edge */}
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary/50 via-primary/15 to-transparent" />
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className={`flex h-20 w-20 items-center justify-center rounded-lg bg-[#0a0f06] overflow-hidden border shadow-lg ${
              player_info.is_flagged
                ? "border-[#1e2a14]"
                : (advancedProfile?.skill_rating?.global_rank ?? Number.MAX_SAFE_INTEGER) <= 3
                  ? "border-amber-500/50 ring-1 ring-amber-500/30"
                  : (advancedProfile?.skill_rating?.global_rank ?? Number.MAX_SAFE_INTEGER) <= 100
                    ? "border-primary/40 ring-1 ring-primary/25"
                    : "border-[#1e2a14]"
            }`}>
              {player_info.iso_country_code ? (
                <PlayerFlag isoCode={player_info.iso_country_code} className="h-full w-full object-cover" />
              ) : (
                <div className="bg-primary/10 w-full h-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
              )}
            </div>
            {online_status?.is_online && (
              <span className="absolute bottom-0.5 right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-[#070b05]"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-white">
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
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded">
                  {player_info.custom_title}
                </span>
              )}

            </div>

            {/* RANK RIBBON — global standing as an integrated subtitle (military rank + RP live in the Player Rank card below) */}
            {(advancedProfile?.skill_rating || player_info.is_flagged) && (
              <RankRibbon
                globalRank={advancedProfile?.skill_rating?.global_rank}
                isFlagged={player_info.is_flagged}
              />
            )}

            {/* Bio / Status */}
            {player_info.bio && (
              <p className="mt-2 text-sm italic text-muted-foreground max-w-2xl">
                "{player_info.bio}"
              </p>
            )}

            {/* Metadata Row */}
            <div className="mt-2 flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                {player_info.first_seen && (
                  <>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                      Since {new Date(player_info.first_seen).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                    </span>
                    <div className="h-3 w-px bg-border/60 shrink-0" />
                  </>
                )}
                {online_status?.is_online ? (
                  <span className="flex items-center gap-1.5 font-semibold text-green-500">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    Online now
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                    Last seen {new Date(player_info.last_seen).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                )}

                {/* Discord Display */}
                {player_info.display_discord_id && player_info.discord_name && (
                  <>
                    <div className="h-3 w-px bg-border/60 shrink-0" />
                    <span className="flex items-center gap-1.5 text-indigo-400">
                      <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 1-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.315-9.673-3.546-13.66a.07.07 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
                      {player_info.discord_name}
                    </span>
                  </>
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

          {/* Compact action toolbar — small icon buttons in one row so it never
              stretches the header. Labels surface on hover (title); a divider
              separates export utilities from account actions. */}
          <div className="inline-flex items-center gap-0.5 self-start rounded-lg border border-[#1e2a14] bg-[#0a0f06]/50 p-1 sm:shrink-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" title="Forum signature" className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary">
                <ImageIcon className="h-4 w-4" />
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
                    <Input readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/sig/${encodeURIComponent(player_info.last_known_name)}.png`} />
                    <Button size="icon" variant="outline" onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/sig/${encodeURIComponent(player_info.last_known_name)}.png`);
                      toast({ title: "Copied!", variant: "success" });
                    }}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>BBCode (Forums)</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={`[img]${typeof window !== 'undefined' ? window.location.origin : ''}/sig/${encodeURIComponent(player_info.last_known_name)}.png[/img]`} />
                    <Button size="icon" variant="outline" onClick={() => {
                      navigator.clipboard.writeText(`[img]${window.location.origin}/sig/${encodeURIComponent(player_info.last_known_name)}.png[/img]`);
                      toast({ title: "Copied!", variant: "success" });
                    }}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" title="Dog tag" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Shield className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dog Tag</DialogTitle>
                <DialogDescription>
                  Your military dog tag — download it or share it anywhere.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="rounded-md border p-3 bg-zinc-950 overflow-hidden flex justify-center">
                  <img
                    src={`/dogtag/${encodeURIComponent(player_info.last_known_name)}`}
                    alt="Dog Tag Preview"
                    className="max-w-full h-auto rounded"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Direct Link</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/dogtag/${encodeURIComponent(player_info.last_known_name)}.png`} />
                    <Button size="icon" variant="outline" onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/dogtag/${encodeURIComponent(player_info.last_known_name)}.png`);
                      toast({ title: "Copied!", variant: "success" });
                    }}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2" asChild>
                  <a href={`/dogtag/${encodeURIComponent(player_info.last_known_name)}.png`} download={`${player_info.last_known_name}-dogtag.png`}>
                    <ImageIcon className="h-4 w-4" />
                    Download PNG
                  </a>
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="icon" title="Share profile" onClick={handleShare} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Share2 className="h-4 w-4" />
          </Button>

          <div className="mx-0.5 h-5 w-px bg-[#1e2a14]" />

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
        </div>
      </div>

      {/* Sticky in-page navigation */}
      <ProfileSectionNav sections={navSections} />

      {/* Advanced Stats: Skill Rating */}
      {advancedProfile?.skill_rating && (
        <SkillRatingCard rating={advancedProfile.skill_rating} />
      )}

      {/* Stats Side-by-Side Grid */}
      <div id="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-6 scroll-mt-32">
      {/* Lifetime Stats */}
      <AccentCard className="lg:col-span-2 border-border/60 overflow-hidden">
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
            <div className="p-4 text-center">
              <div className="text-3xl font-bold tabular-nums text-primary">
                {lifetime_stats?.overall_kdr?.toFixed(2) ?? '0.00'}
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1 flex items-center justify-center gap-1.5">
                K/D Ratio
                {velocity && <VelocityBadge data={velocity} />}
              </div>
            </div>
            <div className="p-4 text-center">
              <div className="text-3xl font-bold tabular-nums text-amber-500">
                {lifetime_stats?.win_rate?.toFixed(1) ?? '0'}<span className="text-xl">%</span>
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Win Rate</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-3xl font-bold tabular-nums text-foreground">
                {formatPlaytime(lifetime_stats?.total_playtime_seconds ?? 0)}
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Playtime</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-3xl font-bold tabular-nums text-emerald-500">
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
      </AccentCard>

      {/* Personal Bests */}
      <AccentCard className="flex flex-col border-border/60 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-500/10 via-transparent to-transparent border-b border-border/40">
          <CardTitle as="h2" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20">
              <Trophy className="h-4 w-4 text-amber-500" />
            </div>
            Personal Bests
          </CardTitle>
        </CardHeader>
        {/* flex-1 tiles stretch to fill the column so it stays level with the
            taller Lifetime Stats card instead of leaving a gap below. */}
        <CardContent className="flex flex-1 flex-col gap-3 p-4">
          {[
            { value: (personal_bests?.best_round_score ?? 0).toLocaleString(), label: "Best Score", roundId: personal_bests?.best_score_round_id, color: "amber" as const, Icon: Trophy },
            { value: (personal_bests?.best_round_kills ?? 0).toLocaleString(), label: "Best Kills", roundId: personal_bests?.best_kill_round_id, color: "red" as const, Icon: Target },
            { value: personal_bests?.best_round_kpm?.toFixed(2) ?? '0.00', label: "Best KPM", roundId: personal_bests?.best_kpm_round_id, color: "purple" as const, Icon: Zap },
          ].map((stat) => {
            const c = PB_COLORS[stat.color];
            const inner = (
              <>
                <div className={`shrink-0 rounded-lg p-2.5 ${c.iconBg}`}>
                  <stat.Icon className={`h-5 w-5 ${c.icon}`} />
                </div>
                <div className="min-w-0">
                  <div className={`text-2xl font-bold leading-none tabular-nums ${c.value}`}>{stat.value}</div>
                  <div className="mt-1.5 text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</div>
                </div>
                {stat.roundId && (
                  <span className={`ml-auto shrink-0 self-start font-mono text-[10px] ${c.round}`}>#{stat.roundId} →</span>
                )}
              </>
            );
            const cls = `flex flex-1 items-center gap-4 rounded-lg border p-4 ${c.wrap}`;
            return stat.roundId ? (
              <Link key={stat.label} href={`/stats/rounds/${stat.roundId}`} className={`${cls} transition-all hover:brightness-125`}>
                {inner}
              </Link>
            ) : (
              <div key={stat.label} className={cls}>{inner}</div>
            );
          })}
        </CardContent>
      </AccentCard>
      </div>

      {/* Achievements */}
      {profile.achievements && profile.achievements.length > 0 && (
        <AchievementsList achievements={profile.achievements} />
      )}

      {/* Velocity + Ping Sensitivity — below achievements */}
      {player_info.player_id && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {velocity && <PlayerVelocityCard playerId={player_info.player_id} />}
          <PlayerPingSensitivity playerId={player_info.player_id} />
        </div>
      )}

      {/* Activity Section Header */}
      <SectionHeader
        id="activity"
        accent="emerald"
        icon={TrendingUp}
        title="Activity Patterns"
        subtitle="When and how often you play"
      />

      {/* Activity Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 24h Activity Chart */}
        <AccentCard className="border-border/60">
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
        </AccentCard>

        {/* Activity Last 7 Days */}
        <AccentCard className="border-border/60">
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
        </AccentCard>
      </div>

      {/* Performance Over Time + Rivals & Allies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {timeseriesData.length > 0 ? (
          <AccentCard className="lg:col-span-2 border-border/60">
            <CardHeader className="pb-2 border-b border-border/40 bg-gradient-to-r from-purple-500/5 via-transparent to-transparent">
              <CardTitle as="h2" className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                Performance Over Time
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <PlayerTimeseriesChart
                data={timeseriesData}
                timespan={timeseriesSpan}
                onTimespanChange={setTimeseriesSpan}
                compact
              />
            </CardContent>
          </AccentCard>
        ) : (
          <AccentCard className="lg:col-span-2 border-border/60 flex items-center justify-center p-8 bg-muted/10">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Not enough history yet</p>
              <p className="text-xs mt-1">Performance trends appear after a few more rounds.</p>
            </div>
          </AccentCard>
        )}
        <PlayerRivals playerId={player_info.player_id} />
      </div>

      {/* Playstyle Section Header */}
      <SectionHeader
        id="playstyle"
        accent="purple"
        icon={Map}
        title="Playstyle"
        subtitle="Your preferred maps, servers, and teams"
      />

      {/* Team Preference, Gamemode, Maps, Servers Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Team Preference */}
        <AccentCard className="border-border/60">
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
        </AccentCard>

        {/* Gamemode Breakdown */}
        <AccentCard className="border-border/60">
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
        </AccentCard>

        {/* Top Maps */}
        <AccentCard className="border-border/60">
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
        </AccentCard>

        {/* Top Servers */}
        <AccentCard className="border-border/60">
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
        </AccentCard>
      </div>

      {/* Map Performance Section */}
      {mapPerformance && mapPerformance.length > 0 && (
        <>
          <SectionHeader
            id="maps"
            accent="primary"
            icon={Map}
            title="Map Performance"
            subtitle="Your stats breakdown across every map"
          />

          <PlayerMapPerformance stats={mapPerformance} />
        </>
      )}

      {/* Server Rankings Section */}
      <SectionHeader
        id="rankings"
        accent="amber"
        icon={Trophy}
        title="Server Rankings"
        subtitle="Your rank on each server you've played"
      />

      <PlayerServerRanks playerName={player_info.last_known_name} />

      {/* Social & History Section Header */}
      <SectionHeader
        id="social"
        accent="blue"
        icon={Users}
        title="Social & History"
        subtitle="Sessions, teammates, and recent matches"
      />

      {/* Social: Battle Buddies, Recent Rounds, Rank History */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="h-full">
          {advancedProfile?.related_players ? (
            <BattleBuddiesList players={advancedProfile.related_players} />
          ) : (
            <AccentCard className="border-border/60 h-full flex items-center justify-center p-6 bg-muted/20">
              <p className="text-muted-foreground text-sm">No battle buddies found.</p>
            </AccentCard>
          )}
        </div>
        <div className="h-full">
          {recent_rounds && recent_rounds.length > 0 ? (
            <RecentRoundsList rounds={recent_rounds} playerName={player_info.last_known_name} />
          ) : (
            <AccentCard className="border-border/60 h-full flex items-center justify-center p-6 bg-muted/20">
              <p className="text-muted-foreground text-sm">No recent rounds.</p>
            </AccentCard>
          )}
        </div>
        <div className="h-full">
          {rankHistory ? (
            <RankHistoryList history={rankHistory} playerName={player_info.last_known_name} />
          ) : (
            <AccentCard className="border-border/60 h-full flex items-center justify-center p-6 bg-muted/20">
              <p className="text-muted-foreground text-sm">No rank history.</p>
            </AccentCard>
          )}
        </div>
      </div>

      {/* Teammate Galaxy + Combat DNA side by side */}
      {(advancedProfile?.related_players?.length || (advancedProfile?.skill_rating?.breakdown && lifetime_stats)) && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
          {advancedProfile?.related_players && advancedProfile.related_players.length > 0 && (
            <TeammateGalaxy
              players={advancedProfile.related_players}
              playerName={player_info.last_known_name}
            />
          )}
          {advancedProfile?.skill_rating?.breakdown && lifetime_stats && (
            <PlayerDnaRadar
              breakdown={advancedProfile.skill_rating.breakdown}
              lifetimeStats={lifetime_stats}
              playerName={player_info.last_known_name}
            />
          )}
        </div>
      )}

      {/* Session Stats - Full Width */}
      <PlayerSessionStats playerName={player_info.last_known_name} />

      {/* Streaks */}
      {streaks && (streaks.win_streak.best > 0 || streaks.kdr_streak.best > 0) && (
        <TooltipProvider>
          <AccentCard className="border-border/60">
            <CardContent className="flex items-center gap-6 px-5 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-foreground">Streaks</span>
              </div>
              <div className="flex items-center gap-5 ml-auto">
                <Tooltip>
                  <TooltipTrigger className="text-center">
                    <div className="text-lg font-bold tabular-nums text-green-500 leading-tight">{streaks.win_streak.current}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Win</div>
                  </TooltipTrigger>
                  <TooltipContent>Consecutive rounds won (non-coop)</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger className="text-center">
                    <div className="text-lg font-bold tabular-nums text-green-500/60 leading-tight">{streaks.win_streak.best}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Best Win</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    All-time best win streak{streaks.win_streak.best_ended ? ` (${streaks.win_streak.best_ended})` : ""}
                  </TooltipContent>
                </Tooltip>
                <div className="w-px h-6 bg-border/60" />
                <Tooltip>
                  <TooltipTrigger className="text-center">
                    <div className="text-lg font-bold tabular-nums text-blue-500 leading-tight">{streaks.kdr_streak.current}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">KDR+</div>
                  </TooltipTrigger>
                  <TooltipContent>Consecutive rounds with more kills than deaths</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger className="text-center">
                    <div className="text-lg font-bold tabular-nums text-blue-500/60 leading-tight">{streaks.kdr_streak.best}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Best KDR+</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    All-time best positive KDR streak{streaks.kdr_streak.best_ended ? ` (${streaks.kdr_streak.best_ended})` : ""}
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </AccentCard>
        </TooltipProvider>
      )}

      {/* ── Features 4-8: New Stat Sections ── */}
      {(sessions || completionRate || scoreDeath || serverLoyalty || (comeback && comeback.total_absences > 0)) && (
        <>
          <SectionHeader
            id="behaviour"
            accent="cyan"
            icon={BarChart}
            title="Behaviour & Efficiency"
            subtitle="Session patterns, survival habits, and server loyalty"
          />

          {/* auto-fit so the cards always stretch to fill the row — 1 card spans
              full width, 2 split in half, 3 split in thirds — instead of leaving
              an empty cell (the "missing tile" look) when a player lacks one. */}
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(18rem,1fr))]">
            {/* Feature 4: Sessions */}
            {sessions && (
              <AccentCard className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    Play Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-2xl font-bold">{sessions.total_sessions.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Sessions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{sessions.avg_rounds_per_session.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">Avg Rounds / Session</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg session</span>
                      <span className="font-medium">{Math.floor(sessions.avg_session_seconds / 60)}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Longest session</span>
                      <span className="font-medium text-amber-400">{Math.floor(sessions.longest_session_seconds / 3600)}h {Math.floor((sessions.longest_session_seconds % 3600) / 60)}m ({sessions.longest_session_rounds} rounds)</span>
                    </div>
                  </div>
                </CardContent>
              </AccentCard>
            )}

            {/* Feature 5: Completion Rate + Feature 6: Score per Death */}
            {(completionRate || scoreDeath) && (
              <AccentCard className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    Efficiency Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {completionRate && (
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Round Completion</span>
                        <span className="font-semibold text-foreground">{completionRate.avg_completion_pct}% — {completionRate.label}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                          style={{ width: `${completionRate.avg_completion_pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                        <span>{completionRate.full_rounds} full rounds</span>
                        <span>{completionRate.early_exits} early exits</span>
                      </div>
                    </div>
                  )}
                  {scoreDeath && (
                    <div className="pt-1 space-y-1">
                      <p className="text-xs text-muted-foreground">Score / Death (Survival Efficiency)</p>
                      <div className="grid grid-cols-3 gap-1 text-center">
                        <div>
                          <p className="text-lg font-bold text-emerald-400">{scoreDeath.lifetime_score_per_death.toFixed(1)}</p>
                          <p className="text-[10px] text-muted-foreground">Lifetime</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{scoreDeath.avg_score_per_death_per_round.toFixed(1)}</p>
                          <p className="text-[10px] text-muted-foreground">Avg/Round</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-amber-400">{scoreDeath.best_single_round_spd.toFixed(1)}</p>
                          <p className="text-[10px] text-muted-foreground">Best Round</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </AccentCard>
            )}

            {/* Feature 7: Server Loyalty */}
            {serverLoyalty && (
              <AccentCard className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Server className="h-4 w-4 text-violet-400" />
                    Server Loyalty
                    <span className="ml-auto text-xs font-medium text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">{serverLoyalty.loyalty_label}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground truncate pr-2">Home server</span>
                      <span className="font-medium truncate text-right">{serverLoyalty.home_server.server_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Loyalty</span>
                      <span className="font-medium">{serverLoyalty.loyalty_pct}% of rounds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distinct servers</span>
                      <span className="font-medium">{serverLoyalty.distinct_servers}</span>
                    </div>
                  </div>
                  <div className="space-y-1 pt-1">
                    {serverLoyalty.servers.slice(0, 4).map((s) => (
                      <div key={s.server_id} className="flex items-center gap-2">
                        <div className="h-1.5 rounded-full bg-violet-500/70 shrink-0" style={{ width: `${s.share_pct}%`, maxWidth: "60%" }} />
                        <span className="text-[10px] text-muted-foreground truncate">{s.server_name}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto shrink-0">{s.share_pct}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </AccentCard>
            )}
          </div>

          {/* Feature 8: Comeback / Absence tracking */}
          {comeback && comeback.total_absences > 0 && (
            <AccentCard className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                  Return from Absence
                  {comeback.is_returning && (
                    <span className="ml-auto text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full animate-pulse">
                      Currently Returning
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {comeback.absences.slice(-3).reverse().map((ab, i) => {
                    const kdrChange = ab.kdr_before != null && ab.kdr_after != null ? ab.kdr_after - ab.kdr_before : null;
                    return (
                      <div key={i} className="flex items-start gap-4 text-sm border-b border-border/40 last:border-0 pb-3 last:pb-0">
                        <div className="text-center shrink-0 w-14">
                          <p className="text-lg font-bold text-amber-400">{ab.gap_days}d</p>
                          <p className="text-[10px] text-muted-foreground">away</p>
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <p className="text-xs text-muted-foreground">{new Date(ab.gap_start).toLocaleDateString()} → {new Date(ab.gap_end).toLocaleDateString()}</p>
                          <div className="flex gap-4 text-xs">
                            <span>Before: <span className="font-medium">{ab.kdr_before?.toFixed(2) ?? "—"} KDR</span> <span className="text-muted-foreground">({ab.rounds_before}r)</span></span>
                            <span>After: <span className="font-medium">{ab.kdr_after?.toFixed(2) ?? "—"} KDR</span> <span className="text-muted-foreground">({ab.rounds_after}r)</span></span>
                            {kdrChange != null && (
                              <span className={kdrChange >= 0 ? "text-emerald-400" : "text-red-400"}>
                                {kdrChange >= 0 ? "+" : ""}{kdrChange.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </AccentCard>
          )}
        </>
      )}

      {/* Full Match History */}
      <PlayerMatchHistory playerId={player_info.player_id} />

      {/* Profile Content */}
      {(profile.war_stories?.length || player_info.gallery_urls?.length || player_info.favorite_maps?.length) ? (
        <>
          <SectionHeader
            id="profile-content"
            accent="pink"
            icon={BookOpen}
            title="Player Profile"
            subtitle="Stories, screenshots, and personal touches"
          />

          {profile.war_stories && profile.war_stories.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {profile.war_stories.map((story) => (
                <WarStoryCard key={story.story_id} story={story} isOwner={isOwner} />
              ))}
            </div>
          )}

          {player_info.gallery_urls && player_info.gallery_urls.length > 0 && (
            <ProfileGallery urls={player_info.gallery_urls} />
          )}

          {player_info.favorite_maps && player_info.favorite_maps.length > 0 && (
            <AccentCard className="border-border/60">
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
            </AccentCard>
          )}
        </>
      ) : null}
    </div>
  );
}