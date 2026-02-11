// Gameplay data for the BF1942 Wiki
// Covers basic training, kits, weapons, vehicles, and tactics

// === SOLDIER KITS ===
export interface SoldierKit {
    id: string;
    name: string;
    icon: string; // lucide icon name
    role: string;
    description: string;
    pros: string[];
    cons: string[];
    primaryWeapon: string;
    sidearm: string;
    gadgets: string[];
    grenades: number;
    tactics: string[];
    color: string;
    bgColor: string;
}

export const soldierKits: SoldierKit[] = [
    {
        id: 'scout',
        name: 'Scout',
        icon: 'Crosshair',
        role: 'Long-Range Specialist',
        description: 'The Scout is a long-range specialist, designed to operate far from the front lines. Their primary roles are eliminating high-value infantry targets with their sniper rifle and designating targets for friendly artillery using their binoculars.',
        pros: [
            'Unmatched long-range accuracy and killing power against infantry',
            'Ability to call in devastating artillery strikes with binoculars',
            'Can eliminate key targets like machine gunners and anti-tank soldiers',
        ],
        cons: [
            'Extremely vulnerable in close-quarters combat',
            'Slow-firing primary weapon',
            'Requires patience and good positioning',
        ],
        primaryWeapon: 'No. 4 Sniper / K98 Sniper Rifle (5-round magazine)',
        sidearm: 'Colt Pistol / Walther P38',
        gadgets: ['Binoculars'],
        grenades: 3,
        tactics: [
            'Concealment is Survival: Use rocks, bushes, and shadows. Never position on hilltops where you\'ll be silhouetted.',
            'Sniping Technique: Account for bullet drop and lead moving targets. Crouch or go prone for accuracy. Headshots are instant kills.',
            'Effective Artillery Spotting: Use binoculars and click once to designate. Don\'t repeatedly click - each click resets the artillery gunner\'s aim.',
        ],
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
    },
    {
        id: 'assault',
        name: 'Assault',
        icon: 'Swords',
        role: 'Frontline Infantry',
        description: 'The Assault kit is the backbone of any infantry charge. A versatile, well-rounded class designed for direct, frontline combat against other soldiers at nearly all ranges.',
        pros: [
            'Powerful assault rifle with high rate of fire',
            'Effective at most ranges',
            'Best all-purpose anti-infantry kit',
        ],
        cons: [
            'Lacks specialization',
            'Heavy recoil makes sustained automatic fire inaccurate',
            'Very limited effectiveness against armored vehicles',
        ],
        primaryWeapon: 'BAR 1918 / StG44 / DP-28 / Type 99 LMG / Johnson M1941',
        sidearm: 'Colt Pistol / Walther P38',
        gadgets: [],
        grenades: 3,
        tactics: [
            'Fire Discipline: Fire in short 2-3 round bursts to manage recoil. This dramatically increases accuracy at medium to long range.',
            'Engaging Armor: Your rifle is useless against tanks. Use grenades - throw them underneath for maximum effect.',
        ],
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
    },
    {
        id: 'anti-tank',
        name: 'Anti-Tank',
        icon: 'Target',
        role: 'Vehicle Hunter',
        description: 'A highly specialized but indispensable soldier. The Anti-Tank class is the infantry\'s primary solution for destroying enemy armor.',
        pros: [
            'Only infantry weapon capable of reliably destroying heavy tanks',
            'Can one-shot light tanks with a rear hit',
            'Essential for controlling enemy vehicle advances',
        ],
        cons: [
            'Rocket launcher is slow to reload',
            'Highly ineffective against infantry',
            'Extremely vulnerable during reload',
        ],
        primaryWeapon: 'Bazooka / Panzerschreck (1 rocket loaded, 6 total)',
        sidearm: 'Colt Pistol / Walther P38',
        gadgets: [],
        grenades: 3,
        tactics: [
            'Exploit Weak Armor: Never fire at the front of a tank. Side and rear armor are much weaker.',
            'Perpendicular Hits: Rockets are most effective when hitting armor at a 90-degree angle.',
            'Shoot and Scoot: Fire from concealment, then immediately retreat to reload in safety.',
        ],
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
    },
    {
        id: 'medic',
        name: 'Medic',
        icon: 'Heart',
        role: 'Combat Support',
        description: 'The Medic is a frontline combat support class, blending the offensive capabilities of a submachine gun with the crucial ability to heal himself and teammates.',
        pros: [
            'Ability to heal keeps the fighting force effective longer',
            'SMG has high rate of fire and low recoil',
            'Excellent for close-quarters combat',
            'Can self-heal for incredible durability',
        ],
        cons: [
            'SMG lacks power and effective range compared to assault rifles',
            'Must stay close to teammates to be effective as support',
        ],
        primaryWeapon: 'Thompson / MP40 / MP18 / Sten SMG',
        sidearm: 'Colt Pistol / Walther P38',
        gadgets: ['First Aid Kit'],
        grenades: 3,
        tactics: [
            'Triage and Healing: Use First Aid Kit on teammates with less than 100% health. Healing is governed by a regenerating power meter.',
            '"Medic Commando" Raids: A small squad of medics can operate behind enemy lines for extended periods due to self-healing ability.',
        ],
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
    },
    {
        id: 'engineer',
        name: 'Engineer',
        icon: 'Wrench',
        role: 'Defensive Specialist',
        description: 'The Engineer is a vital defensive and support class, specializing in repairing vehicles, laying explosive traps, and disarming enemy explosives.',
        pros: [
            'Only class that can repair vehicles and stationary guns',
            'Explosives are perfect for defending chokepoints',
            'Can disarm enemy mines and C4',
            'Land mines can destroy vehicles without risk',
        ],
        cons: [
            'Single-shot rifle has very slow rate of fire',
            'At major disadvantage in direct infantry combat',
            'Requires positioning and planning to be effective',
        ],
        primaryWeapon: 'No. 4 / K98 Bolt-Action Rifle',
        sidearm: 'Colt Pistol / Walther P38',
        gadgets: ['Wrench', 'Explosive Pack (x4)', 'Land Mine (x4)'],
        grenades: 0,
        tactics: [
            'Vehicle Repair: Use wrench on any damaged friendly vehicle or gun. Repair ability has a regenerating power meter.',
            'Land Mines: Only detonate for vehicles, not friendlies. Place up to 9 at a time on roads and chokepoints.',
            'Explosive Packs (C4): Thrown and detonated remotely. Ideal for ambushes or destroying structures.',
            'Disarming: Use wrench on enemy explosives to safely remove them and add to your inventory.',
        ],
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
    },
];

// === WEAPONS ===
export interface Weapon {
    name: string;
    affiliation: 'Allies' | 'Axis' | 'Both';
    kit: string;
    nationality: string;
    magCapacity: number;
    ammoCount: number;
    effectiveRange: 'Melee' | 'Short' | 'Short-Intermediate' | 'Intermediate-Long' | 'Long';
    type: 'Melee' | 'Pistol' | 'Rifle' | 'Sniper' | 'SMG' | 'Assault Rifle' | 'Rocket Launcher';
}

export const weapons: Weapon[] = [
    // Melee
    { name: 'Combat Knife', affiliation: 'Both', kit: 'All', nationality: 'All', magCapacity: 0, ammoCount: 0, effectiveRange: 'Melee', type: 'Melee' },
    // Pistols
    { name: 'Colt M1911', affiliation: 'Allies', kit: 'All', nationality: 'All Allies', magCapacity: 8, ammoCount: 32, effectiveRange: 'Short', type: 'Pistol' },
    { name: 'Walther P38', affiliation: 'Axis', kit: 'All', nationality: 'All Axis', magCapacity: 8, ammoCount: 32, effectiveRange: 'Short', type: 'Pistol' },
    // Rifles
    { name: 'No 4 Rifle', affiliation: 'Allies', kit: 'Engineer', nationality: 'UK & US', magCapacity: 5, ammoCount: 20, effectiveRange: 'Intermediate-Long', type: 'Rifle' },
    { name: 'K98 Rifle', affiliation: 'Axis', kit: 'Engineer', nationality: 'All Axis', magCapacity: 5, ammoCount: 20, effectiveRange: 'Intermediate-Long', type: 'Rifle' },
    // Snipers
    { name: 'No 4 Sniper', affiliation: 'Allies', kit: 'Scout', nationality: 'All Allies', magCapacity: 5, ammoCount: 15, effectiveRange: 'Long', type: 'Sniper' },
    { name: 'K98 Sniper', affiliation: 'Axis', kit: 'Scout', nationality: 'All Axis', magCapacity: 5, ammoCount: 15, effectiveRange: 'Long', type: 'Sniper' },
    // SMGs
    { name: 'Thompson', affiliation: 'Allies', kit: 'Medic', nationality: 'UK & US', magCapacity: 30, ammoCount: 150, effectiveRange: 'Short-Intermediate', type: 'SMG' },
    { name: 'MP18', affiliation: 'Both', kit: 'Medic', nationality: 'Japan & USSR', magCapacity: 32, ammoCount: 160, effectiveRange: 'Short-Intermediate', type: 'SMG' },
    { name: 'Sten', affiliation: 'Allies', kit: 'Medic', nationality: 'Free French', magCapacity: 32, ammoCount: 160, effectiveRange: 'Short-Intermediate', type: 'SMG' },
    { name: 'MP40', affiliation: 'Axis', kit: 'Medic', nationality: 'German & Italian', magCapacity: 32, ammoCount: 160, effectiveRange: 'Short-Intermediate', type: 'SMG' },
    // Assault Rifles / LMGs
    { name: 'BAR 1918', affiliation: 'Allies', kit: 'Assault', nationality: 'US & UK', magCapacity: 20, ammoCount: 100, effectiveRange: 'Short-Intermediate', type: 'Assault Rifle' },
    { name: 'DP-28', affiliation: 'Allies', kit: 'Assault', nationality: 'USSR', magCapacity: 47, ammoCount: 141, effectiveRange: 'Short-Intermediate', type: 'Assault Rifle' },
    { name: 'Johnson M1941', affiliation: 'Allies', kit: 'Assault', nationality: 'Canada', magCapacity: 20, ammoCount: 100, effectiveRange: 'Short-Intermediate', type: 'Assault Rifle' },
    { name: 'StG44', affiliation: 'Axis', kit: 'Assault', nationality: 'German', magCapacity: 30, ammoCount: 150, effectiveRange: 'Short-Intermediate', type: 'Assault Rifle' },
    { name: 'Type 99 LMG', affiliation: 'Axis', kit: 'Assault', nationality: 'Japan', magCapacity: 30, ammoCount: 150, effectiveRange: 'Short-Intermediate', type: 'Assault Rifle' },
    // Rocket Launchers
    { name: 'Bazooka', affiliation: 'Allies', kit: 'Anti-Tank', nationality: 'All Allies', magCapacity: 1, ammoCount: 6, effectiveRange: 'Intermediate-Long', type: 'Rocket Launcher' },
    { name: 'Panzerschreck', affiliation: 'Axis', kit: 'Anti-Tank', nationality: 'All Axis', magCapacity: 1, ammoCount: 6, effectiveRange: 'Intermediate-Long', type: 'Rocket Launcher' },
];

// === EMPLACEMENTS ===
export interface Emplacement {
    name: string;
    description: string;
    effectiveAgainst: string[];
    tactics: string[];
    vulnerability: string;
}

export const emplacements: Emplacement[] = [
    {
        name: 'Machine Gun',
        description: 'Rapid-fire weapons highly effective against infantry and light-skinned vehicles. Both Allied Browning and Axis MG42 perform identically.',
        effectiveAgainst: ['Infantry', 'Jeeps', 'APCs', 'Aircraft'],
        tactics: [
            'Fire in controlled 3-5 second bursts to prevent overheating',
            'Disengage and move away periodically to avoid return fire',
        ],
        vulnerability: 'Gunner is completely exposed and priority target for snipers',
    },
    {
        name: 'AA Gun',
        description: 'Anti-aircraft guns that fire flak shells to shoot down enemy aircraft. Allied version offers superior field of view.',
        effectiveAgainst: ['Aircraft', 'All ground vehicles including heavy tanks'],
        tactics: [
            'Lead enemy planes by firing ahead of their flight path',
            'Use against tanks - high rate of fire can destroy even Tigers in seconds',
        ],
        vulnerability: 'Gunner is completely exposed to sniper fire and infantry',
    },
    {
        name: 'Coastal Artillery',
        description: 'Massive bunker-housed guns for defending coastlines against naval vessels. Can also bombard inland targets.',
        effectiveAgainst: ['Ships', 'Ground targets with Scout spotting'],
        tactics: [
            'Use indirect fire with Scout targeting coordinates (right-click)',
            'Has 500 shells that cannot be resupplied',
        ],
        vulnerability: 'Can be destroyed by infantry throwing explosives through rear entrance',
    },
    {
        name: 'AT Gun',
        description: 'Powerful stationary anti-tank cannons (German PaK40 and British 25 pdr). Functions as a fixed tank turret.',
        effectiveAgainst: ['Tanks', 'All vehicles'],
        tactics: [
            'Position to cover expected enemy vehicle routes',
            'Frontal armor plate shields gunner from small arms',
        ],
        vulnerability: 'Cannot rotate 360 degrees - vulnerable to flanking',
    },
];

// === VEHICLES ===
export interface Vehicle {
    name: string;
    affiliation: 'Allies' | 'Axis';
    nationality: string;
    type: 'Car' | 'APC' | 'Light Tank' | 'Heavy Tank' | 'Tank Destroyer' | 'Artillery' | 'Fighter' | 'Dive Bomber' | 'Fighter-Bomber' | 'Heavy Bomber' | 'Destroyer' | 'Submarine' | 'Battleship' | 'Carrier' | 'Landing Craft';
    category: 'Land' | 'Air' | 'Naval';
    capacity: number;
    description: string;
    weapons?: string[];
    specialFeatures?: string[];
}

export const vehicles: Vehicle[] = [
    // LAND - Cars
    { name: 'Willys Overland Jeep MB', affiliation: 'Allies', nationality: 'US', type: 'Car', category: 'Land', capacity: 2, description: 'Versatile 4-wheel-drive vehicle with excellent off-road capability. Completely open design offers no protection.' },
    { name: 'VW Type 82 Kübelwagen', affiliation: 'Axis', nationality: 'German', type: 'Car', category: 'Land', capacity: 2, description: 'Lightweight 2-wheel-drive vehicle, less capable off-road than the Jeep. Side doors provide minor concealment.' },

    // LAND - APCs
    { name: 'M3 Half-Track', affiliation: 'Allies', nationality: 'US', type: 'APC', category: 'Land', capacity: 6, description: 'American APC that can be top-heavy. Provides mobile resupply for health and ammo to nearby units.', specialFeatures: ['Mobile Supply Station'] },
    { name: 'Hanomag Sdkfz.251', affiliation: 'Axis', nationality: 'German', type: 'APC', category: 'Land', capacity: 6, description: 'Faster than M3 with superior off-road capabilities. Provides mobile resupply to nearby units.', specialFeatures: ['Mobile Supply Station'] },

    // LAND - Light Tanks
    { name: 'M4 Sherman', affiliation: 'Allies', nationality: 'US', type: 'Light Tank', category: 'Land', capacity: 2, description: 'Reliable all-around tank. The workhorse of Allied armored forces.', weapons: ['75mm cannon', 'Machine gun'] },
    { name: 'T-34/85', affiliation: 'Allies', nationality: 'Soviet', type: 'Light Tank', category: 'Land', capacity: 2, description: 'Light tank variant with weaker armor than the heavy T-34/76.', weapons: ['85mm cannon', 'Machine gun'] },
    { name: 'Chi Ha 97', affiliation: 'Axis', nationality: 'Japan', type: 'Light Tank', category: 'Land', capacity: 2, description: 'Fast Japanese tank that performs similarly to the Sherman.', weapons: ['57mm cannon', 'Machine gun'] },
    { name: 'PzKfW Mk.IV Panzer', affiliation: 'Axis', nationality: 'German', type: 'Light Tank', category: 'Land', capacity: 2, description: 'Mainstay of German armored forces, very similar to the Sherman.', weapons: ['75mm cannon', 'Machine gun'] },

    // LAND - Heavy Tanks
    { name: 'M10 Wolverine', affiliation: 'Allies', nationality: 'US', type: 'Heavy Tank', category: 'Land', capacity: 2, description: 'Tank destroyer that functions as heavy tank with fully rotating turret and powerful main gun.', weapons: ['76mm cannon'] },
    { name: 'T-34/76', affiliation: 'Allies', nationality: 'Soviet', type: 'Heavy Tank', category: 'Land', capacity: 2, description: 'Considered by many to be the best overall tank. Excellent balance of armor, firepower, and handling.', weapons: ['76mm cannon', 'Machine gun'] },
    { name: 'PzKfW Mk.VI Tiger', affiliation: 'Axis', nationality: 'German', type: 'Heavy Tank', category: 'Land', capacity: 2, description: 'Most heavily armored tank in the game. Can lurch forward when stopping or firing, making precise aiming difficult.', weapons: ['88mm cannon', 'Machine gun'] },

    // LAND - Artillery
    { name: 'M7 Priest', affiliation: 'Allies', nationality: 'US', type: 'Artillery', category: 'Land', capacity: 2, description: 'Self-propelled artillery for long-range indirect fire support.', weapons: ['105mm howitzer'] },
    { name: 'BM-13N Katyusha', affiliation: 'Allies', nationality: 'Soviet', type: 'Artillery', category: 'Land', capacity: 1, description: 'Fires salvo of six rockets in rapid succession with long reload time. No crosshairs for direct aiming.', weapons: ['Rocket salvo'] },
    { name: 'SdKfz.124 Wespe', affiliation: 'Axis', nationality: 'German', type: 'Artillery', category: 'Land', capacity: 2, description: 'German self-propelled artillery for indirect fire support.', weapons: ['105mm howitzer'] },

    // AIR - Fighters
    { name: 'F4U Corsair', affiliation: 'Allies', nationality: 'US Pacific', type: 'Fighter', category: 'Air', capacity: 1, description: 'One of the fastest fighters. Can be prone to spinning at low speeds.', weapons: ['Machine guns', '1 bomb'] },
    { name: 'P-51 Mustang', affiliation: 'Allies', nationality: 'US Europe', type: 'Fighter', category: 'Air', capacity: 1, description: 'Great all-around fighter with excellent speed, range, and maneuverability.', weapons: ['Machine guns', '1 bomb'] },
    { name: 'Spitfire Mk VB', affiliation: 'Allies', nationality: 'UK', type: 'Fighter', category: 'Air', capacity: 1, description: 'Renowned for sleek design and maneuverability. Can stall during steep dives.', weapons: ['Machine guns', '1 bomb'] },
    { name: 'Yak-9', affiliation: 'Allies', nationality: 'Soviet', type: 'Fighter', category: 'Air', capacity: 1, description: 'Extremely fast and agile. Low stall speed makes it suitable for ground attack runs.', weapons: ['Machine guns', '1 bomb'] },
    { name: 'A6M Zero', affiliation: 'Axis', nationality: 'Japan', type: 'Fighter', category: 'Air', capacity: 1, description: 'Carrier-based fighter with unmatched speed and agility in the Pacific.', weapons: ['Machine guns', '1 bomb'] },
    { name: 'Messerschmitt Bf-109e', affiliation: 'Axis', nationality: 'German', type: 'Fighter', category: 'Air', capacity: 1, description: 'Workhorse of the Luftwaffe. Excellent for close air support due to low stall speed.', weapons: ['Machine guns', '1 bomb'] },

    // AIR - Dive Bombers
    { name: 'SBD-6 Dauntless', affiliation: 'Allies', nationality: 'US', type: 'Dive Bomber', category: 'Air', capacity: 2, description: 'Steady and reliable carrier-based bomber. Good for novice pilots.', weapons: ['Machine guns', '2 bombs or 1 torpedo'] },
    { name: 'Aichi D3A1 Val', affiliation: 'Axis', nationality: 'Japan', type: 'Dive Bomber', category: 'Air', capacity: 2, description: 'Faster than Dauntless and can hold its own in a dogfight.', weapons: ['Machine guns', '2 bombs or 1 torpedo'] },
    { name: 'Junkers Ju-87B Stuka', affiliation: 'Axis', nationality: 'German', type: 'Dive Bomber', category: 'Air', capacity: 2, description: 'Iconic dive-bomber with distinctive sound. Stable in steep dives but sluggish in level flight.', weapons: ['Machine guns', '2 bombs'] },

    // AIR - Heavy Bomber
    { name: 'B-17 Flying Fortress', affiliation: 'Allies', nationality: 'US', type: 'Heavy Bomber', category: 'Air', capacity: 3, description: 'Heaviest aircraft in the game. A flying fortress when fully crewed.', weapons: ['2 turret machine guns', '8 bombs'], specialFeatures: ['Carpet bombing', 'Paratrooper transport'] },

    // NAVAL
    { name: 'USN Fletcher Class', affiliation: 'Allies', nationality: 'US', type: 'Destroyer', category: 'Naval', capacity: 2, description: 'Fast, versatile warship for engaging ships, submarines, and shore bombardment.', weapons: ['2 deck guns', '2 AA guns', 'Depth charges'] },
    { name: 'IJN Akizuki Class', affiliation: 'Axis', nationality: 'Japan', type: 'Destroyer', category: 'Naval', capacity: 2, description: 'Japanese destroyer with same capabilities as the Fletcher.', weapons: ['2 deck guns', '2 AA guns', 'Depth charges'] },
    { name: 'USN Gato Class', affiliation: 'Allies', nationality: 'US', type: 'Submarine', category: 'Naval', capacity: 1, description: 'Stealth weapon for ambushing and sinking large enemy ships.', weapons: ['Torpedoes'] },
    { name: 'U-Boat Type VII C', affiliation: 'Axis', nationality: 'German', type: 'Submarine', category: 'Naval', capacity: 1, description: 'German submarine for stealth torpedo attacks.', weapons: ['Torpedoes'] },
    { name: 'HMS Prince of Wales', affiliation: 'Allies', nationality: 'UK', type: 'Battleship', category: 'Naval', capacity: 4, description: 'Powerful British battleship with massive gun batteries.', weapons: ['2 main gun batteries', '2 AA batteries'] },
    { name: 'IJN Yamato', affiliation: 'Axis', nationality: 'Japan', type: 'Battleship', category: 'Naval', capacity: 4, description: 'Largest ship in WWII. Recoil can cause drift requiring re-aim.', weapons: ['2 main gun batteries', '2 AA batteries'] },
    { name: 'USS Enterprise', affiliation: 'Allies', nationality: 'US', type: 'Carrier', category: 'Naval', capacity: 5, description: 'Floating airfield and mobile spawn point for carrier-based aircraft.', weapons: ['4 AA guns'] },
    { name: 'IJN Shokaku Class', affiliation: 'Axis', nationality: 'Japan', type: 'Carrier', category: 'Naval', capacity: 5, description: 'Japanese aircraft carrier.', weapons: ['4 AA guns'] },
    { name: 'LCVP Higgins Boat', affiliation: 'Allies', nationality: 'US', type: 'Landing Craft', category: 'Naval', capacity: 6, description: 'Ferry infantry from ships to shore for amphibious assaults.', weapons: ['Machine gun'] },
    { name: 'Dai-Hatsu 14M', affiliation: 'Axis', nationality: 'Japan', type: 'Landing Craft', category: 'Naval', capacity: 6, description: 'Japanese landing craft for beach landings.', weapons: ['Machine gun'] },
];

// === BASIC TRAINING TOPICS ===
export interface TrainingTopic {
    id: string;
    title: string;
    icon: string;
    content: string[];
    tips?: string[];
}

export const basicTraining: TrainingTopic[] = [
    {
        id: 'movement',
        title: 'Movement & Maneuvers',
        icon: 'Footprints',
        content: [
            'WASD for movement, mouse controls aiming direction',
            'Left Shift to walk (slower, no tactical advantage)',
            'Left Control to crouch - improves weapon accuracy',
            'Z to go prone - greatest concealment and accuracy bonus',
            'Spacebar to jump over low obstacles (not barbed wire)',
        ],
        tips: [
            'Strafing (A/D while aiming forward) is crucial for dodging fire',
            'Circle-strafing only works in 1v1 infantry fights',
            'You can jump onto friendly vehicles to ride as unofficial passenger',
        ],
    },
    {
        id: 'swimming',
        title: 'Swimming',
        icon: 'Waves',
        content: [
            'Limited to forward/backward movement only',
            'Cannot dive or use any weapons while swimming',
            'Health drains after a short distance (stamina limit)',
        ],
        tips: [
            'If stranded far from shore, use Enter > Suicide to respawn faster',
        ],
    },
    {
        id: 'navigation',
        title: 'Maps & Navigation',
        icon: 'Map',
        content: [
            'Mini-map in upper right shows your position (arrow) and facing direction',
            'Friendly troops shown as blue (Allies) or red (Axis) arrows',
            'Press M for full-screen map showing all friendly units and vehicles',
            'Fog of war is in effect - enemy units are not shown on map',
        ],
    },
    {
        id: 'combat',
        title: 'Weapons & Combat',
        icon: 'Crosshair',
        content: [
            'Crosshair size indicates accuracy - widens when moving, shrinks when still',
            'Crouching or prone provides significant accuracy bonus',
            'Right-click to zoom/use sights for precise aiming',
            'Knife is lethal from behind on stationary targets',
        ],
    },
    {
        id: 'grenades',
        title: 'Grenades',
        icon: 'Bomb',
        content: [
            'Left-click for maximum-force throw',
            'Right-click and hold for variable-force throw with power meter',
        ],
        tips: [
            'Throw grenades UNDERNEATH vehicles - prevents bounce-back and focuses blast on weak underbelly',
        ],
    },
    {
        id: 'tickets',
        title: 'The Ticket System',
        icon: 'Users',
        content: [
            'Tickets = your team\'s reinforcements',
            'Every death (any cause) subtracts one ticket',
            'Win by reducing enemy tickets to zero',
            'Ticket Bleed: Holding majority of control points drains enemy tickets over time',
        ],
        tips: [
            'On Assault maps, attacker tickets drain from the start until they capture a point',
            'On Head-On maps, you need more than half of all points for ticket drain',
        ],
    },
    {
        id: 'capture',
        title: 'Capturing Control Points',
        icon: 'Flag',
        content: [
            'Control points provide spawn points and vehicle/asset access',
            'To capture: Be inside the capture radius (white flag icon appears)',
            'Cannot capture if ANY enemy is also in the radius (contested)',
            'Most maps have an uncapturable main base as fallback spawn, but some maps do not. Check the map layout for details.',
        ],
    },
    {
        id: 'communication',
        title: 'Communication',
        icon: 'MessageSquare',
        content: [
            'K = All chat (everyone)',
            'L = Team chat (your team only)',
            'F1-F8 = Radio commands menu (voice + text callouts)',
        ],
        tips: [
            'Radio commands are fastest in combat - "Medic!", "Armor spotted!", etc.',
            'Spotting enemies does NOT mark them on the mini map; it only sends a radio message.',
        ],
    },
];

// === TACTICS ===
export interface Tactic {
    id: string;
    title: string;
    icon: string;
    description: string;
    points: string[];
}

export const advancedTactics: Tactic[] = [
    {
        id: 'chokepoints',
        title: 'Chokepoint Defense',
        icon: 'ShieldAlert',
        description: 'Chokepoints are natural bottlenecks (bridges, canyons, gaps) that force enemy units to converge. They are the most important locations to control.',
        points: [
            'Engineers are masters of chokepoint defense with mines and C4',
            'Place mines at crests of inclines or just around corners to hide them',
            'Use explosive packs when you need to let friendlies pass but stop enemies',
            'Anti-tank soldiers should ambush from riverbanks next to bridges',
            'Chokepoints are #1 priority for artillery and B-17 carpet bombing',
        ],
    },
    {
        id: 'amphibious',
        title: 'Amphibious Assaults',
        icon: 'Anchor',
        description: 'Use landing craft to bypass frontline defenses and attack from unexpected directions.',
        points: [
            'Keep front landing ramp raised during approach for machine gun protection',
            'Land on undefended coastline sections for rear attacks',
            'LCVPs can patrol coastlines and destroy other landing craft',
            'Mounted machine gun is effective against infantry and light vehicles',
        ],
    },
    {
        id: 'airborne',
        title: 'Airborne Assaults',
        icon: 'Plane',
        description: 'Use paratroopers to capture critical, lightly defended control points at match start.',
        points: [
            'Use rear gunner seat of two-seaters (Stuka, Dauntless, BF-110) for drops',
            'B-17 with two gunner seats is best for dropping small squads',
            'Soldiers can shoot while parachuting, but are vulnerable to ground fire.',
            'Touch-and-go pickups allow rapid ferrying without full landing',
        ],
    },
    {
        id: 'siege',
        title: 'Siege Warfare',
        icon: 'Castle',
        description: 'Trap enemies in their base rather than costly final assaults.',
        points: [
            'Establish defensive line just outside enemy main base',
            'Use artillery and tanks to bombard spawn points',
            '"A Bridge Too Far" tactic: Let enemy hold nearest point to separate infantry from vehicles',
        ],
    },
    {
        id: 'artillery',
        title: 'Artillery Principles',
        icon: 'Target',
        description: 'Mobile artillery must stay far from front lines and requires Scout coordination.',
        points: [
            'Keep artillery in concealed areas near your main base',
            'Scouts with binoculars are essential for effective indirect fire',
            'Target areas not individuals: control points, chokepoints, spawn areas',
            'Do not waste shells on single moving targets',
        ],
    },
    {
        id: 'support',
        title: 'Support Roles',
        icon: 'Users',
        description: 'Engineers and Medics are force multipliers that enable sustained operations.',
        points: [
            'Engineers: Mine chokepoints, repair tanks, use C4 for ambushes',
            'A tank with an engineer repairing it survives much longer',
            'Medics enable squads to survive firefights that would otherwise wipe them out',
            'Self-healing makes Medics best for solo infiltration missions',
        ],
    },
];

// Helper functions
export function getKitById(id: string): SoldierKit | undefined {
    return soldierKits.find(k => k.id === id);
}

export function getVehiclesByCategory(category: 'Land' | 'Air' | 'Naval'): Vehicle[] {
    return vehicles.filter(v => v.category === category);
}

export function getVehiclesByType(type: string): Vehicle[] {
    return vehicles.filter(v => v.type === type);
}

export function getWeaponsByAffiliation(affiliation: 'Allies' | 'Axis'): Weapon[] {
    return weapons.filter(w => w.affiliation === affiliation || w.affiliation === 'Both');
}

// === ADVANCED BALLISTICS & ENGINE MECHANICS ===
export interface BallisticMechanic {
    id: string;
    title: string;
    icon: string;
    description: string;
    details: string[];
}

export const ballisticMechanics: BallisticMechanic[] = [
    {
        id: 'projectile-physics',
        title: 'Projectile Physics',
        icon: 'Zap',
        description: 'Unlike hitscan shooters, BF1942 uses the Refractor 2 engine where bullets exist as physical objects with mass, velocity, and trajectory affected by gravity.',
        details: [
            'Muzzle Velocity: Each weapon has distinct velocity. Bolt-action rifles have highest velocity, requiring minimal lead. Rockets have low velocity with significant drop.',
            'Bullet Drop: Projectiles follow parabolic arcs based on gravity constants. Most noticeable with Bazooka/Panzerschreck at long range.',
            'Cone of Fire: Accuracy is simulated via "deviation" - the cone expands when moving/jumping and contracts when still, crouching, or prone.',
            'Settle Time: The milliseconds required for accuracy to reset after movement stops. Critical for precision shooting.',
        ],
    },
    {
        id: 'damage-formula',
        title: 'Damage Calculation',
        icon: 'Calculator',
        description: 'Damage in BF1942 is deterministic, not random. Understanding the formula allows prediction of engagement outcomes.',
        details: [
            'Formula: Damage = MaterialDamage × DamageMod × AngleFalloff × DistanceMod',
            'MaterialDamage: Base damage value of the projectile type (BAR/Type 99 have high base damage vs SMGs).',
            'DamageMod: Multiplier based on hit zone (Head, Torso, Legs, or vehicle armor zones).',
            'AngleFalloff: Perpendicular hits (90°) deal 100% damage. Acute angles reduce damage by the cosine of impact angle.',
            'DistanceMod: Some weapons lose damage over distance. The BAR uniquely has NO distance falloff.',
        ],
    },
    {
        id: 'distance-dropoff',
        title: 'Distance Drop-off by Weapon',
        icon: 'TrendingDown',
        description: 'Not all weapons suffer from distance-based damage reduction. This creates distinct tiers of long-range viability.',
        details: [
            'No Drop-off: BAR 1918, DP-28, Johnson M1941, all Sniper Rifles, all Bolt-Action Rifles. These deal full damage at any range.',
            'Type 99 LMG: Suffers from DistanceMod - damage decays starting at 50m, reduced by ~50% at 100m. Axis support gunners must close distance.',
            'SMGs (Thompson, MP40, Sten, MP18): Severe drop-off. Beyond 50-60m they become "pea shooters" requiring 8+ hits to kill.',
            'Pistols: Moderate drop-off. Effective only at close range for finishing wounded targets.',
        ],
    },
];

// === HITBOX SYSTEM ===
export interface HitboxZone {
    zone: string;
    multiplier: string;
    tacticalNote: string;
}

export const hitboxZones: HitboxZone[] = [
    {
        zone: 'Head',
        multiplier: '2.5x - 3.0x',
        tacticalNote: 'Critical aim point. Single headshot from sniper rifle is lethal. Automatic weapons achieve near-instant TTK with headshots.',
    },
    {
        zone: 'Torso',
        multiplier: '1.0x - 1.6x',
        tacticalNote: 'Standard center-of-mass target. Most engagement calculations assume torso hits. Requires sustained fire from SMGs.',
    },
    {
        zone: 'Legs',
        multiplier: '0.5x - 1.0x',
        tacticalNote: 'Sub-optimal. Damage frequently halved. Aiming low is severely penalized - even high-caliber weapons become survivable.',
    },
];

// === TANK DAMAGE ZONES ===
export interface TankDamageZone {
    zone: string;
    effectiveness: string;
    analysis: string;
}

export const tankDamageZones: TankDamageZone[] = [
    {
        zone: 'Rear Armor',
        effectiveness: 'Critical',
        analysis: 'The "Golden Rule" - a 90° hit to the rear engine block deals 50-100% of tank health. Always prioritize rear shots.',
    },
    {
        zone: 'Side Armor',
        effectiveness: 'Moderate',
        analysis: 'Requires 2-3 rocket hits. Better than frontal but still requires multiple engagements.',
    },
    {
        zone: 'Front Armor',
        effectiveness: 'Poor',
        analysis: 'High deflection chance. Rockets may ricochet. Only engage frontally as last resort - aim for flat surfaces.',
    },
    {
        zone: 'Tracks/Suspension',
        effectiveness: 'Specific',
        analysis: 'Tiger Tank Weakness: The Tiger has a specific vulnerability in its tracks that takes ~30 extra damage. Aim low on Tigers.',
    },
    {
        zone: 'Turret Ring',
        effectiveness: 'Consistent',
        analysis: 'The "neck" between turret and hull offers a flat surface, avoiding sloped armor of turret cheeks or hull glacis.',
    },
];

// === COMPETITIVE TECHNIQUES ===
export interface CompetitiveTechnique {
    id: string;
    name: string;
    difficulty: 'Basic' | 'Intermediate' | 'Advanced';
    description: string;
    execution: string[];
    benefit: string;
}

export const competitiveTechniques: CompetitiveTechnique[] = [
    {
        id: 'circle-strafing',
        name: 'Circle Strafing',
        difficulty: 'Basic',
        description: 'Standard 1v1 infantry dueling technique to maximize your angular velocity while keeping target centered.',
        execution: [
            'In a 1v1 duel, never move in a straight line.',
            'Hold a strafe key (A or D) while tracking the enemy with mouse.',
            'Move in a circle around your target.',
        ],
        benefit: 'Forces enemy to make large mouse adjustments while your target remains relatively centered on screen.',
    },
    {
        id: 'finisher-combo',
        name: 'The Finisher Combo',
        difficulty: 'Intermediate',
        description: 'Scout technique for faster kills than cycling the bolt twice.',
        execution: [
            'Land one body shot with sniper rifle (leaves enemy at ~33% HP).',
            'Immediately switch to pistol.',
            'Finish with 1-2 pistol shots.',
        ],
        benefit: 'Faster than cycling bolt for second rifle shot. Essential for aggressive Scout play.',
    },
    {
        id: 'no-scoping',
        name: 'No-Scoping',
        difficulty: 'Advanced',
        description: 'Using bolt-action rifles without the scope at close range.',
        execution: [
            'The center of screen is perfectly accurate when standing still or crouching.',
            'At close range (<10m), crouch-tap (crouch → fire instantly) for reliable defense.',
            'Practice centering targets without relying on the scope.',
        ],
        benefit: 'Reliable defense against rushing SMG users. Faster than scoping at close range.',
    },
    {
        id: 'hip-fire-doctrine',
        name: 'SMG Hip-Fire Doctrine',
        difficulty: 'Basic',
        description: 'Medic combat technique prioritizing movement over precision.',
        execution: [
            'In CQB, hip-fire instead of aiming down sights (ADS slows movement).',
            'Maintain maximum strafe speed while firing.',
            'Aim at upper chest and let recoil walk crosshair into headbox.',
        ],
        benefit: 'Makes you harder to hit while maintaining high damage output. Essential for Medic duels.',
    },
    {
        id: 'engine-targeting',
        name: 'Aircraft Engine Targeting',
        difficulty: 'Advanced',
        description: 'Small arms can destroy aircraft by targeting engines rather than fuselage.',
        execution: [
            'When strafed by aircraft, do not hide - return fire.',
            'Aim specifically at the propeller hub or engine nacelles.',
            'Concentrated fire from assault rifles (~150 rounds from StG44) can destroy even a B-17.',
        ],
        benefit: 'Infantry can defend against air attacks. Engine hitbox is vulnerable while fuselage has armor threshold.',
    },
];

// === WEAPON BALLISTIC PROFILES ===
export interface WeaponBallisticProfile {
    weapon: string;
    class: string;
    rateOfFire: string;
    headDamage: string;
    torsoDamage: string;
    hasDistanceDropoff: boolean;
    dropoffNote?: string;
    reloadTime: string;
    tacticalNotes: string[];
}

export const weaponBallisticProfiles: WeaponBallisticProfile[] = [
    // Melee
    {
        weapon: 'Combat Knife',
        class: 'Melee (All Kits)',
        rateOfFire: 'Slow',
        headDamage: '~50%',
        torsoDamage: '~50%',
        hasDistanceDropoff: false,
        dropoffNote: 'N/A - Melee weapon.',
        reloadTime: 'N/A',
        tacticalNotes: [
            'Backstab deals 100% damage for instant kill.',
            'Frontal attacks require 2 hits to kill.',
            'Silent - does not reveal position on minimap.',
            'Use for stealth kills on unaware enemies (snipers, MG gunners).',
        ],
    },
    // Pistols
    {
        weapon: 'Colt M1911 / Walther P38',
        class: 'Pistol',
        rateOfFire: 'Low',
        headDamage: '~58%',
        torsoDamage: '~34%',
        hasDistanceDropoff: true,
        reloadTime: '~2.5s',
        tacticalNotes: [
            'Primary use is finishing wounded targets or emergency defense during rocket launcher reload.',
            'P38 has 1 extra round (8 vs 7) - can be decisive in pistol duels.',
        ],
    },
    // SMGs
    {
        weapon: 'Thompson M1A1',
        class: 'SMG (Medic)',
        rateOfFire: 'High (~550 RPM)',
        headDamage: '~50%',
        torsoDamage: '~30%',
        hasDistanceDropoff: true,
        dropoffNote: 'Severe. Beyond 50m, may require 8+ hits to kill.',
        reloadTime: '~4.5s',
        tacticalNotes: [
            'High ROF ideal for hip-firing while circle-strafing.',
            'Best Allied CQB weapon. Dominates capture circles.',
        ],
    },
    {
        weapon: 'MP40',
        class: 'SMG (Medic)',
        rateOfFire: 'Medium (~500 RPM)',
        headDamage: '~50%',
        torsoDamage: '~30%',
        hasDistanceDropoff: true,
        dropoffNote: 'Severe. Beyond 50m, may require 8+ hits to kill.',
        reloadTime: '~4.5s',
        tacticalNotes: [
            'Slightly slower ROF than Thompson = better controllability at range.',
            'More accurate at the edge of SMG effective range.',
        ],
    },
    {
        weapon: 'Sten',
        class: 'SMG (Medic)',
        rateOfFire: 'Medium (~500 RPM)',
        headDamage: '~50%',
        torsoDamage: '~30%',
        hasDistanceDropoff: true,
        dropoffNote: 'Severe. Beyond 50m, may require 8+ hits to kill.',
        reloadTime: '~4.5s',
        tacticalNotes: [
            'Side-mounted magazine blocks portion of left screen.',
            'Visual recoil can be disorienting - practice tracking leftward-moving targets.',
        ],
    },
    {
        weapon: 'MP18',
        class: 'SMG (Medic)',
        rateOfFire: 'Medium (~500 RPM)',
        headDamage: '~50%',
        torsoDamage: '~30%',
        hasDistanceDropoff: true,
        dropoffNote: 'Severe. Beyond 50m, may require 8+ hits to kill.',
        reloadTime: '~4.5s',
        tacticalNotes: [
            'Side-mounted stick magazine partially obscures view.',
            'Functionally identical to MP40 in damage and handling.',
        ],
    },
    // Assault Rifles / LMGs
    {
        weapon: 'BAR 1918',
        class: 'LMG (Assault)',
        rateOfFire: 'Medium (~450 RPM)',
        headDamage: '~75%',
        torsoDamage: '~48%',
        hasDistanceDropoff: false,
        dropoffNote: 'UNIQUE: No distance drop-off. Full damage at any range.',
        reloadTime: '~4.0s',
        tacticalNotes: [
            'Arguably the best all-around weapon in the game due to no damage falloff.',
            'Can counter Snipers at long range with tap-firing (1-2 shots at a time).',
            'Slow ROF is liability in CQB vs SMGs - pre-fire corners.',
            '20-round magazine depletes in under 3 seconds of continuous fire.',
        ],
    },
    {
        weapon: 'DP-28',
        class: 'LMG (Assault)',
        rateOfFire: 'Medium (~450 RPM)',
        headDamage: '~56%',
        torsoDamage: '~33%',
        hasDistanceDropoff: false,
        reloadTime: '~3.6s',
        tacticalNotes: [
            'Pan magazine on top obstructs lower peripheral vision.',
            'Slightly more erratic horizontal recoil than BAR.',
            '47-round magazine allows true suppressive fire - more than double BAR capacity.',
            'Excels in mid-range street fighting (Stalingrad).',
        ],
    },
    {
        weapon: 'Johnson M1941',
        class: 'LMG (Assault)',
        rateOfFire: 'High (~600 RPM)',
        headDamage: '~75%',
        torsoDamage: '~48%',
        hasDistanceDropoff: false,
        dropoffNote: 'No distance drop-off. Full damage at any range like the BAR.',
        reloadTime: '~3.8s',
        tacticalNotes: [
            'Faster ROF than BAR makes it more forgiving and better in CQB.',
            'Same 20-round magazine as BAR - depletes quickly at high ROF.',
            'Side-mounted magazine offers cleaner sight picture than top-fed LMGs.',
            'Canadian exclusive on Liberation of Caen map.',
        ],
    },
    {
        weapon: 'StG 44',
        class: 'Assault Rifle',
        rateOfFire: 'Medium-High (~500 RPM)',
        headDamage: '~63%',
        torsoDamage: '~37%',
        hasDistanceDropoff: false,
        reloadTime: '~3.8s',
        tacticalNotes: [
            'The world\'s first true assault rifle.',
            'Lower per-bullet damage than BAR but higher rate of fire.',
            'Cleanest iron sights in the game (open hood design).',
            'Smooth, predictable recoil - easiest to control in full-auto.',
            'Dominates the 10-40m bracket due to handling and volume of fire.',
        ],
    },
    {
        weapon: 'Type 99 LMG',
        class: 'LMG (Assault)',
        rateOfFire: 'Medium (~450 RPM)',
        headDamage: '~75%',
        torsoDamage: '~48%',
        hasDistanceDropoff: true,
        dropoffNote: 'Damage decays starting at 50m, ~50% reduction at 100m.',
        reloadTime: '~4.0s',
        tacticalNotes: [
            'Top-mounted magazine creates significant blind spot in center of screen.',
            'Despite visual obstruction, highly accurate and powerful within effective range.',
            'Japanese Assault players MUST close distance to compete with Allied BAR users.',
            'Use jungle foliage for flanking on Pacific maps to get within 50m.',
        ],
    },
    // Bolt-Action Rifles
    {
        weapon: 'K98k / No.4 Rifle',
        class: 'Bolt-Action (Engineer)',
        rateOfFire: 'Bolt-Action',
        headDamage: '~100%+ (Kill)',
        torsoDamage: '~67%',
        hasDistanceDropoff: false,
        reloadTime: '~3.0s',
        tacticalNotes: [
            'Same damage as sniper variants but without scope.',
            'Skilled Engineers can out-shoot Assault players at long range.',
            'Bayonet is 1-hit kill - useful for trench clearing.',
        ],
    },
    {
        weapon: 'K98k / No.4 Sniper',
        class: 'Sniper Rifle (Scout)',
        rateOfFire: 'Bolt-Action',
        headDamage: '~100%+ (Kill)',
        torsoDamage: '~67%',
        hasDistanceDropoff: false,
        reloadTime: '~3.0s',
        tacticalNotes: [
            'Highest velocity projectiles - minimal lead time required.',
            'Headshots are always instant kills.',
            'Use "Finisher Combo" for faster kills: body shot → switch to pistol → finish.',
        ],
    },
    // Rocket Launchers
    {
        weapon: 'Bazooka / Panzerschreck',
        class: 'Rocket Launcher (Anti-Tank)',
        rateOfFire: '1 Shot',
        headDamage: 'Kill (Direct)',
        torsoDamage: 'Kill (Direct)',
        hasDistanceDropoff: false,
        dropoffNote: 'Affected by gravity (arc trajectory), not distance damage.',
        reloadTime: 'Slow (~4-5s)',
        tacticalNotes: [
            'Low velocity with significant arc - practice elevation adjustment.',
            'Splash damage unreliable against infantry - direct hits required.',
            'Panzerschreck has slightly flatter trajectory than Bazooka.',
            'Always switch to pistol after firing - vulnerable during reload.',
        ],
    },
];

// === MAP STRATEGY PROFILES ===
export interface MapStrategyProfile {
    mapType: string;
    terrain: string;
    engagementRange: string;
    optimalClasses: string[];
    weaponNotes: string[];
    tactics: string[];
}

export const mapStrategyProfiles: MapStrategyProfile[] = [
    {
        mapType: 'Desert Maps',
        terrain: 'Open rolling dunes, visibility > 200m',
        engagementRange: 'Long (100-300m)',
        optimalClasses: ['Scout', 'Engineer (for vehicle repair)', 'Assault (BAR only)'],
        weaponNotes: [
            'Allied BAR is superior due to no damage drop-off.',
            'Axis StG44 is viable but weaker at extreme range.',
            'Type 99 LMG is functionally useless for cross-dune combat - damage too degraded.',
            'SMGs are emergency weapons only.',
        ],
        tactics: [
            'Infantry must move valley-to-valley. Cresting dunes silhouettes you against the sky.',
            'Scouts are essential for spotting and long-range elimination.',
            'Armor dominates - infantry should support vehicles, not operate independently.',
        ],
    },
    {
        mapType: 'Urban Maps',
        terrain: 'Dense rubble, multi-story buildings, chokepoints < 50m',
        engagementRange: 'Short (0-50m)',
        optimalClasses: ['Medic', 'Assault', 'Engineer (for explosives)'],
        weaponNotes: [
            'SMGs are king. High ROF and hip-fire mobility clears rooms.',
            'StG44 and DP-28 excel in street-level suppression.',
            'Expacks are vital for trapping buildings and destroying tanks in alleys.',
        ],
        tactics: [
            '"Grenade Spam" is standard opener - throw grenade before entering any building.',
            'Use medpack aggressively - retreat, heal to 100%, re-engage.',
            'Control rooftops for overwatch positions.',
        ],
    },
    {
        mapType: 'Pacific Maps',
        terrain: 'Mix of open beaches and dense jungle foliage',
        engagementRange: 'Variable (depends on zone)',
        optimalClasses: ['Assault', 'Anti-Tank', 'Engineer'],
        weaponNotes: [
            'Allied BAR gunners can suppress beach landings at 80m+ with full lethality.',
            'Japanese Type 99 users MUST use jungle to close within 50m to compete.',
            'Control of AA guns is critical for air defense.',
        ],
        tactics: [
            'Use foliage for concealment during flanking maneuvers.',
            'Beach zones favor defenders heavily - coordinate with armor.',
            'Airfield control often decides the match.',
        ],
    },
];
