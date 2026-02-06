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
        primaryWeapon: 'BAR 1918 / StG44 / Breda Assault Rifle',
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
    effectiveRange: 'Short' | 'Short-Intermediate' | 'Intermediate-Long' | 'Long';
    type: 'Pistol' | 'Rifle' | 'Sniper' | 'SMG' | 'Assault Rifle' | 'Rocket Launcher';
}

export const weapons: Weapon[] = [
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
    // Assault Rifles
    { name: 'BAR 1918', affiliation: 'Allies', kit: 'Assault', nationality: 'All Allies', magCapacity: 20, ammoCount: 100, effectiveRange: 'Short-Intermediate', type: 'Assault Rifle' },
    { name: 'StG44', affiliation: 'Axis', kit: 'Assault', nationality: 'German & Japan', magCapacity: 30, ammoCount: 150, effectiveRange: 'Short-Intermediate', type: 'Assault Rifle' },
    { name: 'Breda', affiliation: 'Axis', kit: 'Assault', nationality: 'Italian', magCapacity: 20, ammoCount: 100, effectiveRange: 'Short-Intermediate', type: 'Assault Rifle' },
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
            'Each team has an uncapturable main base as fallback spawn',
        ],
    },
    {
        id: 'communication',
        title: 'Communication',
        icon: 'MessageSquare',
        content: [
            'J = Global chat (all players)',
            'K = Team chat',
            'F1-F8 = Radio commands menu (voice + text callouts)',
        ],
        tips: [
            'Radio commands are fastest in combat - "Medic!", "Armor spotted!", etc.',
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
            'Soldiers are completely defenseless while parachuting',
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
