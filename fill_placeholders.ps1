$src = "public\images\achievements\elite_warrior_bronze.png"
$placeholder = "public\images\achievements\placeholder.png"
Copy-Item $src $placeholder

$missing = @(
    "elite_warrior_gold.png",
    "elite_warrior_legend.png",
    "map_specialist.png",
    "map_dominator.png",
    "map_legend.png",
    "consistent_killer.png",
    "comeback_king.png",
    "rock_solid.png",
    "total_kills_100.png",
    "total_kills_500.png",
    "total_kills_1000.png",
    "total_kills_2500.png",
    "total_kills_5000.png",
    "total_kills_10000.png",
    "total_kills_25000.png",
    "total_kills_50000.png",
    "total_score_10000.png",
    "total_score_50000.png",
    "total_score_100000.png",
    "total_score_500000.png",
    "total_score_1000000.png",
    "milestone_playtime_10h.png",
    "milestone_playtime_50h.png",
    "milestone_playtime_100h.png",
    "milestone_playtime_500h.png",
    "milestone_playtime_1000h.png",
    "server_regular.png",
    "night_owl.png",
    "early_bird.png",
    "marathon_warrior.png"
)

foreach ($file in $missing) {
    Copy-Item $placeholder "public\images\achievements\$file"
}
