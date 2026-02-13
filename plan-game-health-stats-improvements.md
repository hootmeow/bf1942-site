# Game Health & Stats Enhancement Plan

## Current State Analysis

### Existing Metrics (Game Health Dashboard)
✅ **Population Trends** - Daily unique players, peak concurrent (30 days)
✅ **Server Trends** - Active servers per day (30 days)  
✅ **Rounds Played** - Daily rounds count (30 days)
✅ **Game Mode Breakdown** - Rounds by mode over last 7 days
✅ **Map Popularity** - Total rounds per map with trend % (30 days)
✅ **Player Retention** - New vs returning players (30 days)
✅ **Ping Trends** - Avg/median/P95 ping (30 days)
✅ **Peak Times Heatmap** - Global concurrency patterns

### Existing Player Stats
✅ Lifetime stats (rounds, score, K/D, KDR, KPM, win rate, playtime)
✅ Personal bests (best round, max kills, etc.)
✅ Top maps/servers played
✅ Team preference (Axis vs Allied)
✅ Skill rating
✅ Battle buddies
✅ Rank history
✅ Map performance (per-map win rates)
✅ Recent rounds history

---

## Problem: Map Popularity Shows Empty Rounds

### Issue
The Map Popularity metric currently displays `total_rounds` which **includes empty server rotations**. This makes the data misleading - a map might show 500 rounds but most were empty rotations with 0-2 players.

### Root Cause
The backend API endpoint `/api/v1/metrics/global/health` returns:
```typescript
map_trends: [
  {
    map_name: "Battle of the Bulge",
    total_rounds: 487,
    recent_7d: 245,
    prev_7d: 242,
    trend_pct: 1
  }
]
```

This data doesn't filter by minimum player count.

### Solution

**Backend API Change Required:**
Update the API to return only rounds with meaningful player activity.

```sql
-- Current query (inferred)
SELECT 
  map_name,
  COUNT(*) as total_rounds,
  COUNT(*) FILTER (WHERE end_time >= NOW() - INTERVAL '7 days') as recent_7d,
  COUNT(*) FILTER (WHERE end_time >= NOW() - INTERVAL '14 days' 
                   AND end_time < NOW() - INTERVAL '7 days') as prev_7d
FROM rounds
WHERE end_time >= NOW() - INTERVAL '30 days'
GROUP BY map_name;

-- Proposed query - Add minimum player threshold
SELECT 
  map_name,
  COUNT(*) as total_rounds,
  COUNT(*) FILTER (WHERE end_time >= NOW() - INTERVAL '7 days') as recent_7d,
  COUNT(*) FILTER (WHERE end_time >= NOW() - INTERVAL '14 days' 
                   AND end_time < NOW() - INTERVAL '7 days') as prev_7d,
  AVG(player_count)::int as avg_players,  -- NEW: Show average player count
  SUM(player_count) as total_players      -- NEW: Total player-rounds
FROM rounds
WHERE end_time >= NOW() - INTERVAL '30 days'
  AND player_count >= 8  -- FILTER: Only count rounds with 8+ players
GROUP BY map_name
ORDER BY total_rounds DESC;
```

**Frontend Schema Update:**
Update `MapTrendEntry` interface in [components/game-health-dashboard.tsx](components/game-health-dashboard.tsx#L56-L62):

```typescript
interface MapTrendEntry {
  map_name: string;
  total_rounds: number;      // Now filtered to active rounds only
  recent_7d: number;
  prev_7d: number;
  trend_pct: number;
  avg_players?: number;      // NEW: Average players per round
  total_players?: number;    // NEW: Total player participation
}
```

**UI Enhancement:**
Display additional context in the Map Popularity card:

```tsx
<span className="text-xs text-muted-foreground tabular-nums">
  {item.total_rounds.toLocaleString()} rounds
  {item.avg_players && (
    <span className="ml-1 text-muted-foreground/60">
      (avg {item.avg_players} players)
    </span>
  )}
</span>
```

**Optional:** Add a filter toggle to let users switch between "All Rounds" and "Active Rounds (8+ players)" views.

---

## New Metrics to Add (Game Health Page Focus)

### 1. **Active Map Popularity** (FIXED VERSION)
**Priority:** 🔴 Critical - Fixes the misleading data issue

**What:** Map popularity showing only rounds with meaningful player counts (8+ players)

**Implementation:**
- Backend API change (see solution above)
- Frontend schema update
- UI shows "avg players per round" as additional context

**Location:** Game Health page

---

### 2. **Server Fill Rate Over Time**
**Priority:** 🟡 High Value

**What:** Trend showing average server capacity utilization over 30 days

**Why:** Helps understand if the community is consolidating on fewer servers or spreading out

**Data Source:** 
```sql
SELECT 
  DATE_TRUNC('day', snapshot_time) as day,
  AVG(current_player_count::float / NULLIF(current_max_players, 0) * 100) as avg_fill_rate
FROM server_snapshots  -- or equivalent table
WHERE snapshot_time >= NOW() - INTERVAL '30 days'
  AND current_state = 'ACTIVE'
GROUP BY day
ORDER BY day;
```

**Frontend Component:**
- New line chart in Game Health dashboard
- Shows percentage (0-100%) over time
- Helps identify if servers are becoming ghost towns or thriving

**Location:** Game Health page

---

### 3. **Combat Intensity Trends**
**Priority:** 🟡 High Value

**What:** Average kills/deaths per round over time

**Why:** Shows if matches are becoming more/less intense, longer/shorter

**Data Source:**
```sql
SELECT 
  DATE_TRUNC('day', r.end_time) as day,
  AVG(ps.final_kills) as avg_kills_per_player,
  AVG(ps.final_deaths) as avg_deaths_per_player,
  AVG(ps.final_score) as avg_score_per_player,
  AVG(r.duration_minutes) as avg_round_duration
FROM rounds r
JOIN player_stats ps ON r.round_id = ps.round_id
WHERE r.end_time >= NOW() - INTERVAL '30 days'
  AND r.player_count >= 8
GROUP BY day
ORDER BY day;
```

**Frontend Component:**
- Multi-line chart showing avg K/D/Score trends
- Helps identify meta changes or balance shifts

**Location:** Game Health page

---

### 4. **Player Acquisition & Churn**
**Priority:** 🟡 High Value

**What:** 
- New players joining per day
- Players who haven't returned in 7+ days (churned)
- Retention rate

**Why:** Critical for understanding community health growth/decline

**Data Source:**
```sql
-- New player acquisition
SELECT 
  DATE_TRUNC('day', first_seen) as day,
  COUNT(*) as new_players
FROM players
WHERE first_seen >= NOW() - INTERVAL '30 days'
GROUP BY day;

-- Churn tracking
SELECT 
  DATE_TRUNC('day', date) as day,
  COUNT(DISTINCT player_id) as active_players,
  COUNT(DISTINCT CASE WHEN last_seen < NOW() - INTERVAL '7 days' THEN player_id END) as churned_count
FROM player_activity_log
WHERE date >= NOW() - INTERVAL '30 days'
GROUP BY day;
```

**Frontend Component:**
- Stacked area chart: Active + Churned
- Or: Line chart with acquisition rate overlaid

**Location:** Game Health page

---

### 5. **Game Mode Trends Over Time**
**Priority:** 🟢 Medium Value

**What:** Line chart showing how game mode popularity changes over 30 days

**Why:** Currently only shows a 7-day breakdown. Trending would show shifts (e.g., "CTF is dying" or "Conquest is gaining")

**Data Source:**
```sql
SELECT 
  DATE_TRUNC('day', end_time) as day,
  gamemode,
  COUNT(*) as rounds_played
FROM rounds
WHERE end_time >= NOW() - INTERVAL '30 days'
  AND player_count >= 8
GROUP BY day, gamemode
ORDER BY day, gamemode;
```

**Frontend Component:**
- Multi-line chart with each game mode as a separate line
- Or: Stacked area chart showing proportion over time

**Location:** Game Health page

---

### 6. **Map Win Rate Balance**
**Priority:** 🟢 Medium Value

**What:** For each map, show Axis vs Allied win rates

**Why:** Identifies unbalanced maps that need attention

**Note:** This component already exists at [components/map-balance-table.tsx](components/map-balance-table.tsx) but is not visible in Game Health dashboard. Consider adding it.

**Location:** Game Health page

---

### 7. **Round Duration Trends**
**Priority:** 🟢 Medium Value

**What:** Average match length trending over 30 days

**Why:** Shows if rounds are getting longer/shorter, indicates map balance or spawn camping issues

**Data Source:**
```sql
SELECT 
  DATE_TRUNC('day', end_time) as day,
  AVG(duration_minutes) as avg_duration,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration_minutes) as median_duration
FROM rounds
WHERE end_time >= NOW() - INTERVAL '30 days'
  AND player_count >= 8
GROUP BY day
ORDER BY day;
```

**Frontend Component:**
- Line chart showing avg and median round duration

**Location:** Game Health page

---

### 8. **Team Size Distribution**
**Priority:** 🟢 Medium Value

**What:** Histogram showing common player counts (e.g., 8v8, 16v16, 32v32)

**Why:** Shows what team sizes are most popular in the community

**Data Source:**
```sql
SELECT 
  CASE 
    WHEN player_count < 16 THEN '8v8 or less'
    WHEN player_count < 24 THEN '16v16'
    WHEN player_count < 40 THEN '32v32'
    ELSE '32v32+'
  END as team_size_category,
  COUNT(*) as rounds_count
FROM rounds
WHERE end_time >= NOW() - INTERVAL '30 days'
  AND player_count >= 8
GROUP BY team_size_category;
```

**Frontend Component:**
- Bar chart or pie chart showing distribution

**Location:** Game Health page

---

### 9. **Server Activity Hours Heatmap**
**Priority:** 🟢 Medium Value

**What:** Heatmap showing how many servers are active by hour and day of week

**Why:** Complements the existing peak times player heatmap - shows server availability

**Data Source:**
```sql
SELECT 
  EXTRACT(HOUR FROM poll_time AT TIME ZONE 'UTC') as hour_utc,
  EXTRACT(DOW FROM poll_time) as day_of_week,
  AVG(active_servers) as avg_active_servers
FROM (
  SELECT 
    poll_time,
    COUNT(DISTINCT server_id) as active_servers
  FROM server_poll_history
  WHERE poll_time >= NOW() - INTERVAL '7 days'
    AND state = 'ACTIVE'
  GROUP BY poll_time
) sub
GROUP BY hour_utc, day_of_week;
```

**Frontend Component:**
- Heatmap similar to GlobalPeakTimes

**Location:** Game Health page

---

### 10. **Map Rotation Diversity Score**
**Priority:** 🟢 Low-Medium Value

**What:** Single metric showing how diverse map selections are

**Why:** Identifies if rotations are stale (same 5 maps over and over)

**Data Source:**
```sql
-- Calculate entropy or Gini coefficient
WITH map_distribution AS (
  SELECT 
    map_name,
    COUNT(*)::float / (SELECT COUNT(*) FROM rounds WHERE end_time >= NOW() - INTERVAL '7 days' AND player_count >= 8) as proportion
  FROM rounds
  WHERE end_time >= NOW() - INTERVAL '7 days'
    AND player_count >= 8
  GROUP BY map_name
)
SELECT 
  -SUM(proportion * LN(proportion)) as diversity_score  -- Shannon entropy
FROM map_distribution;
```

**Frontend Component:**
- Stat card with single number (0-10 scale)
- Higher = more diverse

**Location:** Game Health page

---

## Implementation Roadmap

### Phase 1: Critical Fix (Week 1) ✅
1. **Fix Map Popularity Metric**
   - Backend: Update `/api/v1/metrics/global/health` to filter rounds by `player_count >= 8`
   - Backend: Add `avg_players` and `total_players` fields to map_trends
   - Frontend: Update `MapTrendEntry` interface
   - Frontend: Display avg players per round in UI
   - Testing: Verify data accuracy
   - **Location:** Game Health page

---

### Phase 2: High-Value Additions for Game Health Page (Week 2-3)

#### ✅ Fits Game Health Page
2. **Server Fill Rate Tracking**
   - Backend: Add `server_fill_rate` to `/api/v1/metrics/global/health`
   - Frontend: Add new line chart to game health dashboard
   - Shows: Average server capacity utilization over 30 days
   - **Location:** Game Health page

3. **Combat Intensity Trends**
   - Backend: Add `combat_trends` to `/api/v1/metrics/global/health`
   - Frontend: Add multi-line chart
   - Shows: Avg kills/deaths/score per round trending over 30 days
   - **Location:** Game Health page

4. **Player Acquisition & Churn**
   - Backend: Add `player_churn_trend` to `/api/v1/metrics/global/health`
   - Frontend: Add stacked area chart
   - Shows: New players joining vs players going inactive
   - **Location:** Game Health page

#### ❌ Does NOT Fit Game Health Page
- **Skill Rating History** → Goes on individual player profiles
- **Session Duration Distribution** → Goes on individual player profiles
- **Server Uptime Tracking** → Goes on server directory page

---

### Phase 3: Nice-to-Have Enhancements for Game Health Page

5. **Game Mode Trends Over Time**
   - Currently shows 7-day snapshot; add 30-day trending line chart
   - Shows: How mode popularity shifts over time
   - **Location:** Game Health page

6. **Map Balance Win Rates**
   - Integrate existing map-balance-table component
   - Shows: Axis vs Allied win rates per map
   - **Location:** Game Health page

7. **Round Duration Trends**
   - Average match length over 30 days
   - Shows: Are rounds getting longer or shorter?
   - **Location:** Game Health page

8. **Team Size Distribution**
   - Histogram showing common player counts (8v8, 16v16, 32v32, etc.)
   - Shows: What team sizes are most popular
   - **Location:** Game Health page

9. **Server Activity Hours Heatmap**
   - Already have global peak times; add server count heatmap
   - Shows: How many servers are active by hour/day
   - **Location:** Game Health page

10. **Map Rotation Diversity Score**
   - Metric showing how diverse map rotations are
   - Shows: Are all maps being played equally or is it stale?
   - **Location:** Game Health page

---

### Additional Nice-to-Have Metrics for Game Health Page

11. **Active Player Growth Rate**
   - Week-over-week and month-over-month % change in active players
   - Shows: Is the community growing or shrinking?
   - **Location:** Game Health page

12. **Average Round Completion Rate**
   - % of rounds that finish vs abandoned/crashed
   - Shows: Server stability and match quality
   - **Location:** Game Health page

13. **Peak Concurrent Players Timeline**
   - Line chart showing daily peak concurrent over 30 days
   - Shows: Maximum simultaneous players reached each day
   - Already tracked in population_trend as `peak_concurrent`
   - Just needs prominence in UI
   - **Location:** Game Health page

14. **New vs Seasoned Player Ratio**
   - % of players with <10 rounds vs 100+ rounds in recent activity
   - Shows: Community composition (newbie-friendly vs veteran-heavy)
   - **Location:** Game Health page

15. **Server Geographic Distribution**
   - Map/chart showing where active servers are located
   - Shows: Regional health (NA, EU, Asia, etc.)
   - **Location:** Game Health page

16. **Prime Time Activity Windows**
   - Identify and display the "golden hours" for each region
   - Shows: Best times to find full servers
   - **Location:** Game Health page

17. **Weekend vs Weekday Activity**
   - Compare player counts and round counts: weekdays vs weekends
   - Shows: When the community is most active
   - **Location:** Game Health page

18. **Game Mode Diversity Index**
   - Single number metric: How evenly distributed are modes?
   - Shows: Is it all Conquest or are modes balanced?
   - **Location:** Game Health page (as a stat card)

19. **Faction Balance (Axis vs Allied Preferences)**
   - Global stats on which faction players choose
   - Shows: Is there a faction preference imbalance?
   - **Location:** Game Health page

20. **Average Session Gap**
   - How many days between player sessions (returning users)
   - Shows: How often players come back
   - **Location:** Game Health page

---

### 11. **Active Player Growth Rate**
**Priority:** 🟢 Medium Value

**What:** Week-over-week and month-over-month % change in active player counts

**Why:** Clear indicator of community health - growing or shrinking

**Data Source:**
```sql
WITH weekly_active AS (
  SELECT 
    DATE_TRUNC('week', activity_date) as week,
    COUNT(DISTINCT player_id) as active_players
  FROM player_activity
  WHERE activity_date >= NOW() - INTERVAL '60 days'
  GROUP BY week
)
SELECT 
  week,
  active_players,
  LAG(active_players) OVER (ORDER BY week) as prev_week,
  ROUND(((active_players - LAG(active_players) OVER (ORDER BY week))::float / 
    LAG(active_players) OVER (ORDER BY week)) * 100, 1) as growth_pct
FROM weekly_active
ORDER BY week;
```

**Frontend Component:**
- Stat cards showing "Week-over-Week: +5.3%" and "Month-over-Month: +12.7%"
- Color-coded (green for positive, red for negative)

**Location:** Game Health page

---

### 12. **Round Completion Rate**
**Priority:** 🟢 Medium Value

**What:** Percentage of rounds that finish normally vs crash/abandon

**Why:** Server stability indicator - low completion rate suggests technical issues

**Data Source:**
```sql
SELECT 
  DATE_TRUNC('day', end_time) as day,
  COUNT(*) FILTER (WHERE completion_status = 'COMPLETED') * 100.0 / COUNT(*) as completion_rate,
  COUNT(*) FILTER (WHERE completion_status = 'CRASHED') as crashed_rounds,
  COUNT(*) FILTER (WHERE completion_status = 'ABANDONED') as abandoned_rounds
FROM rounds
WHERE end_time >= NOW() - INTERVAL '30 days'
  AND player_count >= 8
GROUP BY day
ORDER BY day;
```

**Frontend Component:**
- Line chart showing completion % over time
- Alert if completion rate drops below threshold (e.g., 85%)

**Location:** Game Health page

---

### 13. **Peak Concurrent Players Timeline**
**Priority:** 🟢 Medium Value

**What:** Daily maximum simultaneous players over 30 days

**Why:** Shows absolute peak capacity - important for understanding infrastructure needs

**Note:** Already tracked in `population_trend.peak_concurrent`, just needs more prominence

**Frontend Component:**
- Line chart or area chart showing daily peaks
- Highlight all-time record peak

**Location:** Game Health page

---

### 14. **New vs Seasoned Player Ratio**
**Priority:** 🟢 Medium Value

**What:** Percentage of active players who are newbies (<10 rounds) vs veterans (100+ rounds)

**Why:** Shows community composition - helps understand if it's newbie-friendly or veteran-heavy

**Data Source:**
```sql
WITH player_categories AS (
  SELECT 
    player_id,
    COUNT(*) as total_rounds,
    CASE 
      WHEN COUNT(*) < 10 THEN 'New'
      WHEN COUNT(*) < 100 THEN 'Intermediate'
      ELSE 'Veteran'
    END as category
  FROM player_stats
  GROUP BY player_id
)
SELECT 
  DATE_TRUNC('day', activity_date) as day,
  COUNT(*) FILTER (WHERE category = 'New') * 100.0 / COUNT(*) as new_pct,
  COUNT(*) FILTER (WHERE category = 'Intermediate') * 100.0 / COUNT(*) as intermediate_pct,
  COUNT(*) FILTER (WHERE category = 'Veteran') * 100.0 / COUNT(*) as veteran_pct
FROM recent_activity ra
JOIN player_categories pc ON ra.player_id = pc.player_id
WHERE activity_date >= NOW() - INTERVAL '30 days'
GROUP BY day
ORDER BY day;
```

**Frontend Component:**
- Stacked area chart showing three categories over time
- Or: Pie chart showing current composition

**Location:** Game Health page

---

### 15. **Server Geographic Distribution**
**Priority:** 🟢 Medium Value

**What:** Map/chart showing where active servers are located (regions: NA, EU, Asia, etc.)

**Why:** Helps understand regional health and player accessibility

**Data Source:**
```sql
SELECT 
  COALESCE(geo_region, 'Unknown') as region,
  COUNT(DISTINCT server_id) as active_servers,
  SUM(current_player_count) as total_players
FROM servers
WHERE current_state = 'ACTIVE'
GROUP BY region
ORDER BY active_servers DESC;
```

**Frontend Component:**
- World map with markers/heatmap
- Or: Bar chart showing server count by region

**Location:** Game Health page

---

### 16. **Prime Time Activity Windows**
**Priority:** 🟢 Medium-Low Value

**What:** Identify and display the "golden hours" for each major region

**Why:** Helps players know the best time to find full servers in their region

**Data Source:**
```sql
WITH hourly_activity AS (
  SELECT 
    geo_region,
    EXTRACT(HOUR FROM activity_time AT TIME ZONE region_timezone) as local_hour,
    AVG(active_players) as avg_players
  FROM regional_activity_snapshots
  WHERE activity_time >= NOW() - INTERVAL '7 days'
  GROUP BY geo_region, local_hour
)
SELECT 
  geo_region,
  local_hour,
  avg_players,
  RANK() OVER (PARTITION BY geo_region ORDER BY avg_players DESC) as activity_rank
FROM hourly_activity
WHERE activity_rank <= 3;  -- Top 3 hours per region
```

**Frontend Component:**
- Table showing "NA: 7pm-10pm EST", "EU: 8pm-11pm CET", etc.
- Or: Timeline graph showing global activity by region

**Location:** Game Health page

---

### 17. **Weekend vs Weekday Activity**
**Priority:** 🟢 Medium-Low Value

**What:** Compare player counts and round counts between weekdays and weekends

**Why:** Shows when the community is most active - helps plan events

**Data Source:**
```sql
SELECT 
  CASE 
    WHEN EXTRACT(DOW FROM day) IN (0, 6) THEN 'Weekend'
    ELSE 'Weekday'
  END as day_type,
  AVG(unique_players) as avg_players,
  AVG(rounds_played) as avg_rounds
FROM daily_stats
WHERE day >= NOW() - INTERVAL '30 days'
GROUP BY day_type;
```

**Frontend Component:**
- Side-by-side comparison bars
- Or: Line chart with weekday vs weekend averages overlaid

**Location:** Game Health page

---

### 18. **Game Mode Diversity Index**
**Priority:** 🟢 Low-Medium Value

**What:** Single number metric showing how evenly distributed game modes are (0-100 score)

**Why:** Quick snapshot: Is it all Conquest or are modes balanced?

**Data Source:**
```sql
-- Shannon entropy normalized to 0-100 scale
WITH mode_distribution AS (
  SELECT 
    gamemode,
    COUNT(*)::float / (SELECT COUNT(*) FROM rounds WHERE end_time >= NOW() - INTERVAL '7 days' AND player_count >= 8) as proportion
  FROM rounds
  WHERE end_time >= NOW() - INTERVAL '7 days'
    AND player_count >= 8
  GROUP BY gamemode
),
entropy AS (
  SELECT -SUM(proportion * LN(proportion)) as raw_entropy
  FROM mode_distribution
),
max_entropy AS (
  SELECT LN((SELECT COUNT(DISTINCT gamemode) FROM mode_distribution)) as max_possible
)
SELECT 
  ROUND((raw_entropy / max_possible) * 100) as diversity_score
FROM entropy, max_entropy;
```

**Frontend Component:**
- Single stat card with score 0-100
- Higher score = more diverse gameplay
- Color-coded: 80+ = excellent, 60-80 = good, <60 = needs improvement

**Location:** Game Health page

---

### 19. **Faction Balance (Axis vs Allied Preferences)**
**Priority:** 🟢 Low-Medium Value

**What:** Global statistics on which faction players choose

**Why:** Shows if there's a preference imbalance (e.g., everyone wants to play Allies)

**Data Source:**
```sql
SELECT 
  team,
  COUNT(*) as total_picks,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as pick_rate_pct
FROM player_stats
WHERE round_end_time >= NOW() - INTERVAL '30 days'
  AND team IN ('Axis', 'Allied')
GROUP BY team;
```

**Frontend Component:**
- Pie chart or double bar chart
- Shows % split (ideally 50/50, but might be skewed)

**Location:** Game Health page

---

### 20. **Average Session Gap**
**Priority:** 🟢 Low Value

**What:** Average number of days between player sessions (for returning players)

**Why:** Shows player loyalty - low gap = highly engaged, high gap = casual

**Data Source:**
```sql
WITH session_gaps AS (
  SELECT 
    player_id,
    session_start,
    LAG(session_start) OVER (PARTITION BY player_id ORDER BY session_start) as prev_session,
    EXTRACT(EPOCH FROM (session_start - LAG(session_start) OVER (PARTITION BY player_id ORDER BY session_start))) / 86400 as gap_days
  FROM sessions
  WHERE session_start >= NOW() - INTERVAL '30 days'
)
SELECT 
  DATE_TRUNC('day', session_start) as day,
  AVG(gap_days) as avg_gap_days,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY gap_days) as median_gap_days
FROM session_gaps
WHERE gap_days IS NOT NULL
GROUP BY day
ORDER BY day;
```

**Frontend Component:**
- Line chart showing average gap trending over time
- Lower trend = more engaged community

**Location:** Game Health page

---

## API Changes Required

### Primary Endpoint: `/api/v1/metrics/global/health`

This endpoint should be expanded to include all game health metrics in a single response.

**Current Response:**
```json
{
  "ok": true,
  "population_trend": [...],
  "server_trend": [...],
  "rounds_trend": [...],
  "gamemode_breakdown": [...],
  "map_trends": [
    {
      "map_name": "Battle of the Bulge",
      "total_rounds": 487,
      "recent_7d": 245,
      "prev_7d": 242,
      "trend_pct": 1
    }
  ],
  "player_retention": [...],
  "ping_trends": [...]
}
```

**Proposed Enhanced Response:**
```json
{
  "ok": true,
  
  // EXISTING METRICS (with updates)
  "population_trend": [
    {
      "day": "2026-01-15",
      "unique_players": 1234,
      "peak_concurrent": 456
    }
  ],
  "server_trend": [...],
  "rounds_trend": [...],
  "gamemode_breakdown": [...],
  
  // UPDATED: Map trends now filtered to active rounds only
  "map_trends": [
    {
      "map_name": "Battle of the Bulge",
      "total_rounds": 245,           // FILTERED: player_count >= 8
      "recent_7d": 130,
      "prev_7d": 115,
      "trend_pct": 13,
      "avg_players": 24,              // NEW
      "total_players": 5880           // NEW
    }
  ],
  
  "player_retention": [...],
  "ping_trends": [...],
  
  // NEW PHASE 2 METRICS
  "server_fill_rate": [
    {
      "day": "2026-01-15",
      "avg_fill_rate": 67.3           // Percentage (0-100)
    }
  ],
  
  "combat_trends": [
    {
      "day": "2026-01-15",
      "avg_kills_per_player": 15.3,
      "avg_deaths_per_player": 14.8,
      "avg_score_per_player": 487,
      "avg_round_duration": 23.5
    }
  ],
  
  "player_churn": [
    {
      "day": "2026-01-15",
      "new_players": 45,
      "returning_players": 234,
      "churned_players": 12
    }
  ],
  
  // NEW PHASE 3 METRICS (Optional - add as available)
  "gamemode_trends": [
    {
      "day": "2026-01-15",
      "gamemode": "Conquest",
      "rounds_played": 123
    }
  ],
  
  "map_balance": [
    {
      "map_name": "Wake Island",
      "axis_wins": 234,
      "allied_wins": 267,
      "axis_win_rate": 46.7
    }
  ],
  
  "round_duration_trends": [
    {
      "day": "2026-01-15",
      "avg_duration": 23.5,
      "median_duration": 21.2
    }
  ],
  
  "team_size_distribution": [
    {
      "size_category": "8v8 or less",
      "rounds_count": 45
    },
    {
      "size_category": "16v16",
      "rounds_count": 123
    }
  ],
  
  "server_activity_heatmap": [
    {
      "hour_utc": 18,
      "day_of_week": 5,
      "avg_active_servers": 12.3
    }
  ],
  
  // SUMMARY STATS (Single values)
  "summary_stats": {
    "map_diversity_score": 73.5,
    "completion_rate": 94.2,
    "weekly_growth_pct": 5.3,
    "monthly_growth_pct": 12.7,
    "new_player_pct": 15.2,
    "veteran_player_pct": 48.6,
    "axis_pick_rate": 48.3,
    "allied_pick_rate": 51.7,
    "avg_session_gap_days": 2.8
  },
  
  "regional_stats": [
    {
      "region": "North America",
      "active_servers": 18,
      "total_players": 234,
      "prime_hours": [19, 20, 21]
    }
  ],
  
  "activity_comparison": {
    "weekday_avg_players": 1234,
    "weekend_avg_players": 1876,
    "weekend_boost_pct": 52.0
  }
}
```

### Implementation Strategy

**Phase 1 (Critical Fix):**
- Update `map_trends` to filter by `player_count >= 8`
- Add `avg_players` and `total_players` fields

**Phase 2 (High-Value Additions):**
- Add `server_fill_rate` array
- Add `combat_trends` array
- Add `player_churn` array

**Phase 3 (Nice-to-Haves):**
- Add remaining optional fields as backend data becomes available
- Each field should be optional (nullable) so frontend can gracefully handle missing data

**Alternative Approach:**
If response size becomes too large, consider creating sub-endpoints:
- `/api/v1/metrics/global/health/combat` - Combat intensity metrics
- `/api/v1/metrics/global/health/regional` - Regional distribution
- `/api/v1/metrics/global/health/summary` - Summary stats only

However, **prefer single endpoint** for simplicity and reduced network requests.

---

## Frontend Component Changes

### File: `components/game-health-dashboard.tsx`

**1. Update MapTrendEntry interface:**
```typescript
interface MapTrendEntry {
  map_name: string;
  total_rounds: number;
  recent_7d: number;
  prev_7d: number;
  trend_pct: number;
  avg_players?: number;      // NEW
  total_players?: number;    // NEW
}
```

**2. Update Map Popularity display:**
```tsx
<span className="text-xs text-muted-foreground tabular-nums">
  {item.total_rounds.toLocaleString()} active rounds
  {item.avg_players && (
    <>
      <span className="mx-1">·</span>
      <span className="text-muted-foreground/60">
        {item.avg_players} avg players
      </span>
    </>
  )}
</span>
```

**3. Add new charts for Phase 2 and 3 metrics:**
- Follow the pattern of existing charts (Population Trend, Ping Trends, etc.)
- Use `ComposedChart` or `AreaChart` from recharts
- Add to the dashboard grid in logical groupings
- See detailed component examples in the expanded Frontend Component Changes section above

---

## Testing Checklist

### Phase 1: Critical Fix
- [ ] Map popularity no longer counts empty rounds (player_count < 8)
- [ ] Map popularity displays average players per round
- [ ] Map popularity shows total player participation count
- [ ] UI clearly indicates these are "active rounds" not all rounds
- [ ] Tooltip or info icon explains the filtering logic

### Phase 2: High-Value Additions
- [ ] Server fill rate chart renders correctly with 30 days of data
- [ ] Server fill rate displays as percentage (0-100%)
- [ ] Combat trends chart shows kills, deaths, and score metrics
- [ ] Combat trends uses appropriate colors (red=kills, amber=deaths, blue=score)
- [ ] Player churn chart displays new, returning, and churned players
- [ ] Churn chart uses stacked areas for new/returning and line for churned

### Phase 3: Nice-to-Have Metrics
- [ ] Game mode trends over time chart renders if data available
- [ ] Map balance table integrates properly (if added)
- [ ] Round duration trends chart displays correctly
- [ ] Team size distribution shows as bar chart or pie chart
- [ ] Server activity heatmap renders similar to global peak times
- [ ] Summary stat cards display when summary_stats is present
- [ ] All Phase 3 metrics gracefully handle missing data (optional fields)

### General UI/UX
- [ ] All new metrics have fallback UI when data is unavailable
- [ ] Charts are responsive on mobile devices (stacks properly)
- [ ] Loading states work correctly for slow API responses
- [ ] Error states display helpful messages
- [ ] Tooltips provide context for each metric
- [ ] Color schemes are consistent with existing dashboard
- [ ] Charts use consistent date formatting (formatDay helper)
- [ ] Legends are clear and positioned correctly
- [ ] No horizontal scrolling on mobile
- [ ] Dark mode works correctly for all new components

### Performance
- [ ] API response time is acceptable (<2 seconds)
- [ ] Dashboard doesn't re-render unnecessarily
- [ ] Charts render smoothly without lag
- [ ] Memory usage is reasonable with all charts loaded

### Accessibility
- [ ] Charts have proper ARIA labels
- [ ] Color choices work for colorblind users
- [ ] Keyboard navigation works for interactive elements
- [ ] Screen readers can interpret the data

---

## Notes

- **Backend API is External:** This repository contains the frontend only. Backend changes require coordination with the API team.
- **Database Access:** The frontend uses the external API; direct database queries shown above are for backend implementation reference.
- **Player Count Threshold:** The "8 players minimum" is configurable. Consider making it a setting (e.g., 4, 8, 12, 16 options).
- **Data Retention:** Ensure backend stores historical snapshots for trending metrics (don't just aggregate on-demand).

---

## Summary: Game Health Page Enhancements

### Phase 1: Critical Fix ✅
**Map Popularity Filtering** - Exclude empty rounds to show true map popularity with avg player counts

### Phase 2: High-Value Additions for Game Health Page
1. **Server Fill Rate Trends** - Server capacity utilization over 30 days
2. **Combat Intensity Trends** - Avg kills/deaths/score trending
3. **Player Acquisition & Churn** - New players vs inactive players

### Phase 3: Nice-to-Have Metrics for Game Health Page
4. **Game Mode Trends Over Time** - 30-day mode popularity shifts
5. **Map Balance Win Rates** - Axis vs Allied balance per map
6. **Round Duration Trends** - Match length trending
7. **Team Size Distribution** - Popular player count ranges
8. **Server Activity Hours Heatmap** - Server count by hour/day
9. **Map Rotation Diversity** - How varied are map selections
10. **Active Player Growth Rate** - Week/month-over-week % changes
11. **Round Completion Rate** - % of rounds that finish vs crash
12. **Peak Concurrent Timeline** - Daily max simultaneous players (already tracked)
13. **New vs Seasoned Ratio** - Community composition (newbies vs veterans)
14. **Server Geographic Distribution** - Regional server health
15. **Prime Time Windows** - Best hours to find full servers
16. **Weekend vs Weekday Activity** - When community is most active
17. **Game Mode Diversity Index** - How balanced are mode selections
18. **Faction Balance** - Axis vs Allied player preferences
19. **Average Session Gap** - Days between player returns

**Total: 20 metric enhancements for Game Health page**

This plan prioritizes **fixing misleading data first** (Phase 1), then adds **actionable health metrics** (Phase 2), followed by **detailed insights** that help understand community trends and engagement patterns (Phase 3).
