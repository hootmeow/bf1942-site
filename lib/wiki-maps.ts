// Map data for the BF1942 Wiki
// Each map has overview info, control points, and strategies

export interface ControlPoint {
    name: string;
    gridRef?: string;
    initialControl: 'Allies' | 'Axis' | 'Neutral' | 'American' | 'German' | 'Soviet' | 'Japanese' | 'British';
    vehicles?: string[];
    defenses?: string[];
    supplies?: string[];
    analysis: string;
    image?: string; // placeholder path
}

export interface MapStrategy {
    faction: string;
    factionType: 'allies' | 'axis';
    steps: string[];
}

export interface KeyTactic {
    title: string;
    description: string;
}

export interface MapData {
    slug: string;
    name: string;
    theater: 'Pacific' | 'Eastern Front' | 'North Africa' | 'Western Front';
    mapType: 'Assault' | 'Head-On' | 'Conquest';
    factions: {
        allies: string;
        axis: string;
    };
    overview: string;
    historicalContext: string;
    controlPoints: ControlPoint[];
    alliedStrategy: MapStrategy;
    axisStrategy: MapStrategy;
    keyTactics: KeyTactic[];
    // Image placeholders
    heroImage: string;
    galleryImages: string[];
}

// Theater colors for UI
export const theaterColors: Record<string, { bg: string; text: string; border: string }> = {
    'Pacific': { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30' },
    'Eastern Front': { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' },
    'North Africa': { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' },
    'Western Front': { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30' },
};

// Map type badges
export const mapTypeColors: Record<string, { bg: string; text: string }> = {
    'Assault': { bg: 'bg-red-500/20', text: 'text-red-400' },
    'Head-On': { bg: 'bg-orange-500/20', text: 'text-orange-400' },
    'Conquest': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
};

export const wikiMaps: MapData[] = [
    // === PACIFIC THEATER ===
    {
        slug: 'wake-island',
        name: 'Wake Island',
        theater: 'Pacific',
        mapType: 'Assault',
        factions: { allies: 'American', axis: 'Japanese' },
        overview: 'This is an assault map where the attacking Japanese naval forces must land on the island and capture all five American-held control points to secure victory. The American ticket count will not drain until the Japanese control every single point.',
        historicalContext: 'On December 8, 1941, Japanese forces began their assault on Wake Island, a small but strategic U.S. airbase in the Pacific. Expecting a quick victory, they were met with fierce resistance from U.S. troops that lasted for two weeks and inflicted heavy casualties on the invading fleet.',
        controlPoints: [
            {
                name: 'IJN Fleet (Japanese Base)',
                gridRef: 'B3 & C3',
                initialControl: 'Japanese',
                vehicles: ['1 IJN Shokaku Class (Aircraft Carrier)', '1 IJN Akizuki Class (Destroyer)', '4 Dai-Hatsu 14M (Landing Craft)'],
                defenses: ['4 AA Guns (Carrier)', '2 Machine Guns (Destroyer)', 'Depth Charges'],
                supplies: ['2 Ammo Boxes'],
                analysis: 'The sole starting spawn for the Japanese. The destroyer\'s guns are essential for bombarding the island\'s coastal defenses before a landing, while the carrier\'s aircraft provide air cover and can be used to transport paratroopers.',
            },
            {
                name: 'Village',
                gridRef: 'E4',
                initialControl: 'American',
                vehicles: ['1 M4 Sherman', '1 Willys Overland Jeep'],
                supplies: ['1 Ammo Box', '1 First Aid Cabinet'],
                analysis: 'This is the control point closest to the Japanese fleet\'s starting position and will be the focus of the initial amphibious assault. A nearby coastal artillery battery must be destroyed by the Japanese or utilized by the Americans.',
            },
            {
                name: 'North Base',
                gridRef: 'F4',
                initialControl: 'American',
                vehicles: ['1 Willys Jeep', '1 M3 Half-Track'],
                defenses: ['2 AA Guns', '1 Coastal Artillery Battery'],
                supplies: ['1 Ammo Box', '1 First Aid Cabinet'],
                analysis: 'A vital defensive point for controlling the north side of the island. Its steep cliffs make it difficult to assault directly from the sea.',
            },
            {
                name: 'The Airfield',
                gridRef: 'F6',
                initialControl: 'American',
                vehicles: ['2 Willys Jeeps', '1 M4 Sherman', '1 F4U Corsair', '2 SBD-6 Dauntless'],
                defenses: ['2 AA Guns', '3 Machine Guns', '2 Coastal Artillery Batteries'],
                supplies: ['3 Ammo Boxes', '1 First Aid Cabinet'],
                analysis: 'The heart of the American defense. Its three aircraft spawns are a major threat to the Japanese fleet. Its large size, however, makes it difficult to defend from a determined, multi-pronged attack.',
            },
            {
                name: 'Landing Beach',
                gridRef: 'E6',
                initialControl: 'American',
                defenses: ['1 AA Gun', '1 Coastal Artillery Battery'],
                supplies: ['1 Ammo Box'],
                analysis: 'While not a primary landing zone for the initial Japanese assault, it is a key strategic point that can be attacked from both the sea and from the cliffs above.',
            },
            {
                name: 'South Base',
                gridRef: 'D5',
                initialControl: 'American',
                vehicles: ['1 Willys Jeep', '1 M3 Half-Track', '1 M4 Sherman'],
                defenses: ['1 AA Gun'],
                supplies: ['1 Ammo Box', '1 First Aid Cabinet'],
                analysis: 'Guards the southern fork of the island and has a coastal artillery battery that can engage the Japanese fleet.',
            },
        ],
        alliedStrategy: {
            faction: 'American',
            factionType: 'allies',
            steps: [
                'Sink the Japanese Fleet: The primary objective is to destroy the enemy\'s ships, which serve as their only spawn points. Immediately get the three aircraft from the Airfield airborne. Use torpedo bombers to target the Japanese destroyer first.',
                'Man the Coastal Guns: Send troops from the Village and South Base to man the two coastal artillery batteries on the island\'s western edge.',
                'Repel Amphibious Landings: While air and coastal artillery focus on sinking the fleet, use tanks and infantry to defend the island against Japanese landing craft.',
                'Mop Up: Once the Japanese fleet is sunk, they will have no way to respawn. Hunt down any remaining Japanese soldiers on the island.',
            ],
        },
        axisStrategy: {
            faction: 'Japanese',
            factionType: 'axis',
            steps: [
                'Coordinated Amphibious Assault: Launch a well-coordinated sea and air attack. Use the destroyer\'s main guns to bombard the Village\'s defenses.',
                'Simultaneous Landings: Send separate landing craft to assault both the Village and the South Base at the same time, splitting the American defenses.',
                'Island Hopping: Once the Village is secure, move the destroyer north to bombard the North Base.',
                'Final Push on the Airfield: Concentrate all naval and ground forces for the final assault on the Airfield.',
            ],
        },
        keyTactics: [
            { title: 'Naval Spotting', description: 'A scout in a landing craft can circle the island, staying offshore to provide targeting coordinates for naval bombardment.' },
            { title: 'Cross-Island Sniping', description: 'The island\'s boomerang shape allows for extremely long-range engagements between the Landing Beach and North Base.' },
            { title: 'Flak Avoidance', description: 'Aircraft should approach carriers from bow or stern, as side-mounted AA guns have significant blind spots.' },
            { title: 'The Gunboat Tactic', description: 'Landing craft can be used as patrol boats - their forward machine guns can sink other landing craft from behind.' },
        ],
        heroImage: '/images/wiki/maps/wake-island/hero.jpg',
        galleryImages: [
            '/images/wiki/maps/wake-island/gallery-1.jpg',
            '/images/wiki/maps/wake-island/gallery-2.jpg',
            '/images/wiki/maps/wake-island/gallery-3.jpg',
            '/images/wiki/maps/wake-island/gallery-4.jpg',
        ],
    },
    {
        slug: 'guadalcanal',
        name: 'Guadalcanal',
        theater: 'Pacific',
        mapType: 'Assault',
        factions: { allies: 'American', axis: 'Japanese' },
        overview: 'An assault map featuring jungle warfare where American forces must capture Japanese-held positions on the island.',
        historicalContext: 'The Guadalcanal campaign (August 1942 - February 1943) was the first major Allied offensive against the Empire of Japan, marking a turning point in the Pacific Theater.',
        controlPoints: [],
        alliedStrategy: { faction: 'American', factionType: 'allies', steps: [] },
        axisStrategy: { faction: 'Japanese', factionType: 'axis', steps: [] },
        keyTactics: [],
        heroImage: '/images/wiki/maps/guadalcanal/hero.jpg',
        galleryImages: [
            '/images/wiki/maps/guadalcanal/gallery-1.jpg',
            '/images/wiki/maps/guadalcanal/gallery-2.jpg',
            '/images/wiki/maps/guadalcanal/gallery-3.jpg',
            '/images/wiki/maps/guadalcanal/gallery-4.jpg',
        ],
    },
    {
        slug: 'iwo-jima',
        name: 'Iwo Jima',
        theater: 'Pacific',
        mapType: 'Assault',
        factions: { allies: 'American', axis: 'Japanese' },
        overview: 'An assault map where U.S. forces must launch an amphibious invasion against the fortified island dominated by Mt. Suribachi.',
        historicalContext: 'The 1945 invasion of Iwo Jima was one of the most brutal battles in the Pacific theater. The Allied plan for a four-day raid turned into a month-long bloodbath against heavily entrenched Japanese defenders.',
        controlPoints: [
            {
                name: 'USN Fleet',
                gridRef: 'B4-B5',
                initialControl: 'American',
                vehicles: ['1 Battleship', '1 Aircraft Carrier', '4 Higgins Boats'],
                defenses: ['6 AA Guns'],
                supplies: ['2 Ammo Boxes'],
                analysis: 'The sole starting point for the Americans. The battleship\'s guns are essential for shore bombardment.',
            },
            {
                name: 'Japanese Airfield',
                gridRef: 'E5',
                initialControl: 'Japanese',
                vehicles: ['2 Light Tanks', '2 Cars', '1 Fighter', '1 Dive Bomber'],
                defenses: ['5 AA Guns', '5 Machine Guns', '3 Coastal Guns'],
                analysis: 'A large, sprawling complex that is a primary objective for the American assault.',
            },
            {
                name: 'Mt. Suribachi',
                gridRef: 'C3',
                initialControl: 'Japanese',
                vehicles: ['1 Light Tank'],
                defenses: ['2 AA Guns', '5 Machine Guns', '1 Coastal Gun'],
                supplies: ['2 Ammo Boxes', '1 First Aid Cabinet'],
                analysis: 'The key to the entire island. A formidable mountain fortress accessible only by a single, steep road.',
            },
            {
                name: 'Landing Beach',
                gridRef: 'D4',
                initialControl: 'Neutral',
                analysis: 'The main landing zone. Capturing it provides a foothold but does not stop ticket drain.',
            },
            {
                name: 'North Japanese Bunkers',
                gridRef: 'D4',
                initialControl: 'Japanese',
                defenses: ['4 Machine Guns', '1 Coastal Gun'],
                supplies: ['1 Ammo Box', '1 First Aid Cabinet'],
                analysis: 'Key defensive position overlooking the Landing Beach.',
            },
        ],
        alliedStrategy: {
            faction: 'American',
            factionType: 'allies',
            steps: [
                'Divide and Conquer: Do not focus all forces on the main Landing Beach. Use a split assault.',
                'Paratrooper Assault on Mt. Suribachi: Drop paratroopers directly onto the mountain to capture it early.',
                'Naval and Air Bombardment: Use the battleship\'s guns to bombard Japanese bunkers.',
                'Encirclement: Once key points are captured, trap remaining Japanese forces.',
            ],
        },
        axisStrategy: {
            faction: 'Japanese',
            factionType: 'axis',
            steps: [
                'Defend the Key Points: Prioritize defense of the Airfield and Mt. Suribachi.',
                'Sink the Carrier: Focus aircraft attacks on the American carrier to eliminate their air threat.',
                'Make the Beach a Kill Zone: Man every defensive position overlooking the Landing Beach.',
                'Use the Terrain: Take advantage of cliffs and bunkers for natural defense.',
            ],
        },
        keyTactics: [
            { title: 'The Power of Artillery', description: 'Naval guns and coastal artillery can dominate the island if used effectively with scout spotting.' },
            { title: 'Dual-Purpose AA Guns', description: 'AA guns can be aimed horizontally to engage ground targets on the narrow mountain road.' },
            { title: 'Naval Positioning', description: 'The American battleship is most effective from the northeast side of the island.' },
        ],
        heroImage: '/images/wiki/maps/iwo-jima/hero.jpg',
        galleryImages: [
            '/images/wiki/maps/iwo-jima/gallery-1.jpg',
            '/images/wiki/maps/iwo-jima/gallery-2.jpg',
            '/images/wiki/maps/iwo-jima/gallery-3.jpg',
            '/images/wiki/maps/iwo-jima/gallery-4.jpg',
        ],
    },
    {
        slug: 'coral-sea',
        name: 'Coral Sea',
        theater: 'Pacific',
        mapType: 'Head-On',
        factions: { allies: 'American', axis: 'Japanese' },
        overview: 'A unique naval/air combat map featuring carrier-based warfare with no ground objectives.',
        historicalContext: 'The Battle of the Coral Sea (May 1942) was the first naval battle in history where the opposing ships never directly sighted each other - all attacks were carried out by aircraft.',
        controlPoints: [],
        alliedStrategy: { faction: 'American', factionType: 'allies', steps: [] },
        axisStrategy: { faction: 'Japanese', factionType: 'axis', steps: [] },
        keyTactics: [],
        heroImage: '/images/wiki/maps/coral-sea/hero.jpg',
        galleryImages: [
            '/images/wiki/maps/coral-sea/gallery-1.jpg',
            '/images/wiki/maps/coral-sea/gallery-2.jpg',
            '/images/wiki/maps/coral-sea/gallery-3.jpg',
            '/images/wiki/maps/coral-sea/gallery-4.jpg',
        ],
    },

    // === EASTERN FRONT ===
    {
        slug: 'stalingrad',
        name: 'Stalingrad',
        theater: 'Eastern Front',
        mapType: 'Head-On',
        factions: { allies: 'Soviet', axis: 'German' },
        overview: 'An infantry-focused battle fought within the rubble-filled streets of a ruined city. While a few vehicles are available, their movement is severely restricted by debris.',
        historicalContext: 'The Battle of Stalingrad (August 1942 - February 1943) was a brutal turning point on the Eastern Front, characterized by intense close-quarters urban combat.',
        controlPoints: [
            {
                name: 'Soviet HQ: Bombed Out Port',
                gridRef: 'E6',
                initialControl: 'Soviet',
                vehicles: ['2 T-34/85', '1 Willys Jeep'],
                defenses: ['2 Machine Guns'],
                supplies: ['3 Ammo Boxes', '1 First Aid Cabinet'],
                analysis: 'A highly vulnerable starting point located in a low-lying area. Troops spawn in a narrow street and must disperse quickly.',
            },
            {
                name: 'German HQ: Eastern Train Station',
                gridRef: 'H2',
                initialControl: 'German',
                vehicles: ['2 PzKfW Mk.IV Panzer', '1 Kübelwagen'],
                defenses: ['1 Machine Gun'],
                supplies: ['1 Ammo Box', '1 First Aid Cabinet'],
                analysis: 'A relatively secure base compared to the Soviet HQ. Its main defensive machine gun covers the western approach.',
            },
            {
                name: 'German City HQ',
                gridRef: 'E2',
                initialControl: 'Neutral',
                supplies: ['4 Ammo Boxes', '1 First Aid Cabinet'],
                analysis: 'A four-story building with the control point flag on the top floor. A defensible fortress with excellent sniper positions.',
            },
            {
                name: 'Railroads',
                gridRef: 'E3',
                initialControl: 'Neutral',
                supplies: ['1 Ammo Box'],
                analysis: 'Dead center of the map and the most fiercely contested area. Almost no cover besides sandbags and train cars.',
            },
            {
                name: 'Soviet City HQ',
                gridRef: 'D4',
                initialControl: 'Neutral',
                supplies: ['5 Ammo Boxes', '1 First Aid Cabinet'],
                analysis: 'A mirror image of the German City HQ, providing a southern sniper vantage over the Railroads point.',
            },
        ],
        alliedStrategy: {
            faction: 'Soviet',
            factionType: 'allies',
            steps: [
                'Rush the Center: Immediately push for the central Railroads control point.',
                'Secure the Southern HQ: Use tanks to capture and hold the Soviet City HQ building.',
                'Establish Sniper Overwatch: Place scouts in upper floors to suppress German forces.',
                'Hold Two of Three: Once two points are secured, shift to defense.',
            ],
        },
        axisStrategy: {
            faction: 'German',
            factionType: 'axis',
            steps: [
                'Secure the North and Center: Capture Railroads and German City HQ.',
                'Create a Pincer: Position tanks on the eastern side to create crossfire.',
                'Counter-Sniping: Use scouts in elevated positions to find Soviet snipers.',
            ],
        },
        keyTactics: [
            { title: 'Vertical Combat', description: 'Use multi-story buildings for superior cover and firing angles. Never stay on street level.' },
            { title: 'Assault vs. Medic Choice', description: 'Medics have larger magazines and self-healing ability, crucial for sustained firefights.' },
            { title: 'Attacking HQ Buildings', description: 'Use tanks to suppress windows, then storm from multiple entrances simultaneously.' },
        ],
        heroImage: '/images/wiki/maps/stalingrad/hero.jpg',
        galleryImages: [
            '/images/wiki/maps/stalingrad/gallery-1.jpg',
            '/images/wiki/maps/stalingrad/gallery-2.jpg',
            '/images/wiki/maps/stalingrad/gallery-3.jpg',
            '/images/wiki/maps/stalingrad/gallery-4.jpg',
        ],
    },
    {
        slug: 'kursk',
        name: 'Kursk',
        theater: 'Eastern Front',
        mapType: 'Head-On',
        factions: { allies: 'Soviet', axis: 'German' },
        overview: 'A massive tank battle map featuring wide open terrain ideal for armored warfare.',
        historicalContext: 'The Battle of Kursk (July-August 1943) was the largest tank battle in history, involving over 6,000 tanks and 2 million troops.',
        controlPoints: [],
        alliedStrategy: { faction: 'Soviet', factionType: 'allies', steps: [] },
        axisStrategy: { faction: 'German', factionType: 'axis', steps: [] },
        keyTactics: [],
        heroImage: '/images/wiki/maps/kursk/hero.jpg',
        galleryImages: [
            '/images/wiki/maps/kursk/gallery-1.jpg',
            '/images/wiki/maps/kursk/gallery-2.jpg',
            '/images/wiki/maps/kursk/gallery-3.jpg',
            '/images/wiki/maps/kursk/gallery-4.jpg',
        ],
    },
    {
        slug: 'kharkov',
        name: 'Kharkov',
        theater: 'Eastern Front',
        mapType: 'Head-On',
        factions: { allies: 'Soviet', axis: 'German' },
        overview: 'Urban combat in the streets of Kharkov, featuring a mix of infantry and armor.',
        historicalContext: 'Kharkov changed hands multiple times during the war. This map represents one of the fierce urban battles for control of the city.',
        controlPoints: [],
        alliedStrategy: { faction: 'Soviet', factionType: 'allies', steps: [] },
        axisStrategy: { faction: 'German', factionType: 'axis', steps: [] },
        keyTactics: [],
        heroImage: '/images/wiki/maps/kharkov/hero.jpg',
        galleryImages: [
            '/images/wiki/maps/kharkov/gallery-1.jpg',
            '/images/wiki/maps/kharkov/gallery-2.jpg',
            '/images/wiki/maps/kharkov/gallery-3.jpg',
            '/images/wiki/maps/kharkov/gallery-4.jpg',
        ],
    },
    {
        slug: 'berlin',
        name: 'Berlin',
        theater: 'Eastern Front',
        mapType: 'Assault',
        factions: { allies: 'Soviet', axis: 'German' },
        overview: 'An assault map recreating the desperate final battle for Berlin. The attacking Soviets must capture all three German-held control points in chaotic urban combat.',
        historicalContext: 'By 1945, Berlin was a city in ruins. The final battle for the city began as the Soviet Red Army pushed into its streets, marking the end of the war in Europe.',
        controlPoints: [
            {
                name: 'Soviet HQ',
                gridRef: 'E2',
                initialControl: 'Soviet',
                vehicles: ['1 T-34/85', '1 T-34/76'],
                defenses: ['2 Machine Guns'],
                supplies: ['1 Ammo Box'],
                analysis: 'Extremely vulnerable starting spawn in a narrow, exposed street. Troops must disperse immediately.',
            },
            {
                name: 'Brunnen Strasse HQ',
                gridRef: 'E3',
                initialControl: 'German',
                supplies: ['2 Ammo Boxes'],
                analysis: 'The closest point to Soviet HQ and first point of contact. A small, hard-to-defend courtyard.',
            },
            {
                name: 'Bernauer Strasse HQ',
                gridRef: 'C5',
                initialControl: 'German',
                vehicles: ['1 PzKfW Mk.IV Panzer'],
                supplies: ['2 Ammo Boxes'],
                analysis: 'Critical point containing the Germans\' only tank spawn. Losing it severely hampers German armor capability.',
            },
            {
                name: 'German Mitte HQ',
                gridRef: 'E4',
                initialControl: 'German',
                vehicles: ['1 Hanomag Sdkfz.251 (APC)'],
                defenses: ['3 Machine Guns'],
                supplies: ['5 Ammo Boxes', '2 First Aid Crates'],
                analysis: 'The most heavily fortified German position with multiple building entrances and machine gun nests.',
            },
        ],
        alliedStrategy: {
            faction: 'Soviet',
            factionType: 'allies',
            steps: [
                'Flank and Bypass: Do not attack the nearest point first. Send infantry to flank toward Bernauer Strasse HQ.',
                'Capture the Armor: Take the German tank spawn point early to cripple their armored capability.',
                'Create a Diversion: Launch a loud assault on eastern points to draw German attention.',
                'Pincer Attack: With three tanks to zero, attack remaining positions from multiple directions.',
            ],
        },
        axisStrategy: {
            faction: 'German',
            factionType: 'axis',
            steps: [
                'Aggressive Forward Defense: Push vehicles out immediately to create a defensive line.',
                'Fortify the Mitte HQ: Garrison the three-story building with anti-tank infantry.',
                'Urban Ambush: Use alleys and ruins to ambush Soviet tanks at close range.',
                'Win by Attrition: Make the Soviet assault as costly as possible.',
            ],
        },
        keyTactics: [
            { title: 'Urban Movement', description: 'Never run down the middle of roads. Move through buildings and use alleys for concealment.' },
            { title: 'Mobile Machine Gun', description: 'The half-track is more valuable as a weapon platform than transport, creating deadly kill zones.' },
            { title: 'Defending from Above', description: 'Defend courtyards from upper floors for better cover and firing angles.' },
            { title: 'Engineer\'s Revenge', description: 'Engineers can throw explosive packs from windows onto tanks below.' },
        ],
        heroImage: '/images/wiki/maps/berlin/hero.jpg',
        galleryImages: [
            '/images/wiki/maps/berlin/gallery-1.jpg',
            '/images/wiki/maps/berlin/gallery-2.jpg',
            '/images/wiki/maps/berlin/gallery-3.jpg',
            '/images/wiki/maps/berlin/gallery-4.jpg',
        ],
    },

    // === NORTH AFRICA ===
    {
        slug: 'el-alamein',
        name: 'El Alamein',
        theater: 'North Africa',
        mapType: 'Conquest',
        factions: { allies: 'British', axis: 'German' },
        overview: 'A vast, open desert landscape where vehicle combat is essential. A mountainous ridge divides the map with only two narrow passes for ground vehicles.',
        historicalContext: 'The Battle of El Alamein marked a decisive turning point in the North African campaign, where General Montgomery\'s British Eighth Army halted the advance of Rommel\'s Afrika Korps.',
        controlPoints: [
            {
                name: 'British Base',
                gridRef: 'G5',
                initialControl: 'British',
                vehicles: ['3 M4 Sherman', '1 M10 Wolverine', '1 M7 Priest', '1 M3 Half-Track', '3 Willys Jeeps', '3 Spitfire Mk VBs', '1 B-17 Flying Fortress'],
                defenses: ['2 AA Guns', '3 Machine Guns'],
                supplies: ['1 Repair Platform', '1 Repair Hangar', '4 Ammo Boxes', '2 First Aid Cabinets'],
                analysis: 'A large base with a main facility on a plateau and an airfield on a lower plain. The B-17 bomber is a major asset.',
            },
            {
                name: 'German Base',
                gridRef: 'B4',
                initialControl: 'German',
                vehicles: ['3 PzKfW Mk.IV Panzer', '1 PzKfW Mk.VI Tiger', '1 SdKfz.124 Wespe', '1 Hanomag Sdkfz.251', '3 Kübelwagens', '3 Bf-109e', '1 Ju-87B Stuka'],
                defenses: ['1 AA Gun', '2 Machine Guns'],
                supplies: ['1 Repair Platform', '1 Repair Hangar', '4 Ammo Boxes', '2 First Aid Cabinets'],
                analysis: 'A compact base on the western side of the ridge. The Stuka provides potent ground-attack capability.',
            },
            {
                name: 'North Outpost',
                gridRef: 'D1',
                initialControl: 'Neutral',
                vehicles: ['1 Light Tank', '1 Car'],
                defenses: ['1 AA Gun', '1 Machine Gun'],
                supplies: ['1 Ammo Box', '1 First Aid Cabinet'],
                analysis: 'Located at the eastern base of the central ridge on a small plateau, making it defensible.',
            },
            {
                name: 'East Outpost',
                gridRef: 'F3',
                initialControl: 'Neutral',
                vehicles: ['1 Light Tank', '1 Artillery'],
                defenses: ['1 AA Gun', '1 Machine Gun'],
                supplies: ['1 Ammo Box', '1 First Aid Cabinet'],
                analysis: 'Due to proximity to British Base, almost always captured by British first. Strong defensive position.',
            },
            {
                name: 'South Outpost',
                gridRef: 'D6',
                initialControl: 'Neutral',
                vehicles: ['1 Light Tank', '1 Car'],
                defenses: ['1 AA Gun', '1 Machine Gun'],
                supplies: ['1 Ammo Box', '1 First Aid Cabinet'],
                analysis: 'Sits atop the central ridge, difficult to reach but easy to defend. Ideal for paratrooper drops.',
            },
        ],
        alliedStrategy: {
            faction: 'British',
            factionType: 'allies',
            steps: [
                'Exploit the Advantage: Send a fast Jeep with engineers to capture and mine the North Outpost.',
                'Reinforce the North: Send spawned tanks from East Outpost to reinforce the North.',
                'Distraction at South Outpost: Use B-17 to drop paratroopers onto South Outpost.',
                'Hold Two Points: Focus on defending North and East Outposts for victory.',
            ],
        },
        axisStrategy: {
            faction: 'German',
            factionType: 'axis',
            steps: [
                'Overcome the Disadvantage: Move with extreme speed. Focus on North and South Outposts.',
                'Paratrooper Tactic: Use Stuka rear seat to drop a paratrooper onto South Outpost.',
                'Concentrated Armor Assault: Move Tiger and armor through northern pass.',
                'Air and Artillery Support: Use scouts and Wespe to bombard North Outpost defenders.',
            ],
        },
        keyTactics: [
            { title: 'Aircraft Dominance', description: 'Open terrain makes bombing and strafing highly effective. The Stuka is the most potent ground-attack aircraft.' },
            { title: 'Flying Grease Monkey', description: 'Engineer pilots can land and repair their plane in the desert faster than returning to base.' },
            { title: 'Mining the Passes', description: 'The ridge passes are critical chokepoints. Mining them early can halt enemy armor.' },
            { title: 'Rearming on the Fly', description: 'Aircraft automatically rearm bombs when flying low over friendly airstrips.' },
        ],
        heroImage: '/images/wiki/maps/el-alamein/hero.jpg',
        galleryImages: [
            '/images/wiki/maps/el-alamein/gallery-1.jpg',
            '/images/wiki/maps/el-alamein/gallery-2.jpg',
            '/images/wiki/maps/el-alamein/gallery-3.jpg',
            '/images/wiki/maps/el-alamein/gallery-4.jpg',
        ],
    },
    {
        slug: 'gazala',
        name: 'Gazala',
        theater: 'North Africa',
        mapType: 'Conquest',
        factions: { allies: 'British', axis: 'German' },
        overview: 'A desert warfare map featuring armored combat across dunes and outposts.',
        historicalContext: 'The Battle of Gazala (May-June 1942) was a major engagement between Axis and Allied forces in the Western Desert of Libya.',
        controlPoints: [],
        alliedStrategy: { faction: 'British', factionType: 'allies', steps: [] },
        axisStrategy: { faction: 'German', factionType: 'axis', steps: [] },
        keyTactics: [],
        heroImage: '/images/wiki/maps/gazala/hero.jpg',
        galleryImages: [
            '/images/wiki/maps/gazala/gallery-1.jpg',
            '/images/wiki/maps/gazala/gallery-2.jpg',
            '/images/wiki/maps/gazala/gallery-3.jpg',
            '/images/wiki/maps/gazala/gallery-4.jpg',
        ],
    },
    {
        slug: 'tobruk',
        name: 'Tobruk',
        theater: 'North Africa',
        mapType: 'Assault',
        factions: { allies: 'British', axis: 'German' },
        overview: 'An assault on the strategic port city of Tobruk.',
        historicalContext: 'The Siege of Tobruk was a prolonged confrontation between Axis and Allied forces in North Africa during 1941.',
        controlPoints: [],
        alliedStrategy: { faction: 'British', factionType: 'allies', steps: [] },
        axisStrategy: { faction: 'German', factionType: 'axis', steps: [] },
        keyTactics: [],
        heroImage: '/images/wiki/maps/tobruk/hero.jpg',
        galleryImages: [
            '/images/wiki/maps/tobruk/gallery-1.jpg',
            '/images/wiki/maps/tobruk/gallery-2.jpg',
            '/images/wiki/maps/tobruk/gallery-3.jpg',
            '/images/wiki/maps/tobruk/gallery-4.jpg',
        ],
    },
    {
        slug: 'operation-battleaxe',
        name: 'Operation Battleaxe',
        theater: 'North Africa',
        mapType: 'Assault',
        factions: { allies: 'British', axis: 'German' },
        overview: 'A failed British offensive to relieve the siege of Tobruk.',
        historicalContext: 'Operation Battleaxe (June 1941) was a British Army offensive to relieve the siege of Tobruk and recapture eastern Cyrenaica.',
        controlPoints: [],
        alliedStrategy: { faction: 'British', factionType: 'allies', steps: [] },
        axisStrategy: { faction: 'German', factionType: 'axis', steps: [] },
        keyTactics: [],
        heroImage: '/images/wiki/maps/operation-battleaxe/hero.jpg',
        galleryImages: [
            '/images/wiki/maps/operation-battleaxe/gallery-1.jpg',
            '/images/wiki/maps/operation-battleaxe/gallery-2.jpg',
            '/images/wiki/maps/operation-battleaxe/gallery-3.jpg',
            '/images/wiki/maps/operation-battleaxe/gallery-4.jpg',
        ],
    },

    // === WESTERN FRONT ===
    {
        slug: 'omaha-beach',
        name: 'Omaha Beach',
        theater: 'Western Front',
        mapType: 'Assault',
        factions: { allies: 'American', axis: 'German' },
        overview: 'An assault map placing players in the role of attacking American forces storming heavily fortified German beach defenses. American tickets drain continuously until they capture the bunker complex.',
        historicalContext: 'The Allied landing at Omaha Beach on June 6, 1944 was one of the most violent and costly amphibious assaults in history.',
        controlPoints: [
            {
                name: 'Allied Close Support Fleet',
                gridRef: 'D6',
                initialControl: 'American',
                vehicles: ['1 USN Fletcher Class Destroyer', '2 LCVP Higgins Boats'],
                defenses: ['2 Machine Guns'],
                supplies: ['1 Ammo Box'],
                analysis: 'The sole starting spawn for Americans. The destroyer is essential for shore bombardment but requires scouts for targeting.',
            },
            {
                name: 'Omaha Beach',
                gridRef: 'D5',
                initialControl: 'Neutral',
                vehicles: ['1 M4 Sherman', '1 Willys Jeep'],
                supplies: ['2 Ammo Boxes'],
                analysis: 'The initial landing zone. Capturing it provides a foothold but does NOT stop ticket drain. A wide-open kill zone.',
            },
            {
                name: 'German Fortified Positions',
                gridRef: 'D3',
                initialControl: 'German',
                vehicles: ['1 PzKfW Mk.IV Panzer'],
                defenses: ['4 Machine Guns'],
                supplies: ['2 Ammo Boxes', '1 First Aid Cabinet'],
                analysis: 'The first major objective - concrete bunkers and maze-like trenches. Capturing this is the ONLY way to stop American ticket bleed.',
            },
            {
                name: 'German Garrison',
                gridRef: 'D2',
                initialControl: 'German',
                vehicles: ['1 PzKfW Mk.VI Tiger', '1 Hanomag Sdkfz.251'],
                defenses: ['6 Machine Guns', '2 Coastal Artillery Batteries'],
                supplies: ['4 Ammo Boxes', '1 First Aid Cabinet'],
                analysis: 'The final German line of defense. A heavily fortified town with coastal batteries threatening the Allied destroyer.',
            },
        ],
        alliedStrategy: {
            faction: 'American',
            factionType: 'allies',
            steps: [
                'Survive the Landing: Use landing craft and immediately run for cover (obstacles or wreckage).',
                'Establish a Beachhead and Spot: Capture Omaha Beach and have scouts provide coordinates for destroyer bombardment.',
                'Destroy Shore Defenses: Use destroyer guns to eliminate bunker machine guns and coastal batteries.',
                'Ascend the Cliffs: Use the western path for more cover when advancing to the Fortified Positions.',
                'Final Coordinated Assault: Consolidate all forces for the push on the Garrison.',
            ],
        },
        axisStrategy: {
            faction: 'German',
            factionType: 'axis',
            steps: [
                'Hold the Beach: Man every machine gun and sniper position in the bunkers to accelerate American ticket loss.',
                'Sink the Destroyer: Have scouts target the Allied destroyer for the coastal guns. This is the most critical objective.',
                'Mine the Ascents: Use engineers to mine the paths leading up the cliffs.',
                'Fall Back and Fortify: If the Fortified Positions are lost, conduct fighting withdrawal to the Garrison.',
                'Final Stand: Use the Tiger tank and narrow streets to make the American advance as costly as possible.',
            ],
        },
        keyTactics: [
            { title: 'The Importance of Grenades', description: 'Germans rain grenades on clustered troops; Americans need them to clear bunkers.' },
            { title: 'Bypassing the "Street of Death"', description: 'Follow the wooden fence behind eastern bunkers to flank the Garrison from a less-defended direction.' },
            { title: 'Infiltrating the Garrison', description: 'Jump over crates in an alleyway to bypass main defenses and capture the point.' },
            { title: 'Naval Bombardment is Key', description: 'Victory often depends on effective destroyer use with precise scout coordination.' },
        ],
        heroImage: '/images/wiki/maps/omaha-beach/hero.jpg',
        galleryImages: [
            '/images/wiki/maps/omaha-beach/gallery-1.jpg',
            '/images/wiki/maps/omaha-beach/gallery-2.jpg',
            '/images/wiki/maps/omaha-beach/gallery-3.jpg',
            '/images/wiki/maps/omaha-beach/gallery-4.jpg',
        ],
    },
    {
        slug: 'bocage',
        name: 'Bocage',
        theater: 'Western Front',
        mapType: 'Conquest',
        factions: { allies: 'American', axis: 'German' },
        overview: 'Combat in the hedgerow country of Normandy, featuring close-quarters infantry and armor battles.',
        historicalContext: 'The bocage region of Normandy, with its dense hedgerows and sunken lanes, proved deadly for Allied forces after D-Day.',
        controlPoints: [],
        alliedStrategy: { faction: 'American', factionType: 'allies', steps: [] },
        axisStrategy: { faction: 'German', factionType: 'axis', steps: [] },
        keyTactics: [],
        heroImage: '/images/wiki/maps/bocage/hero.jpg',
        galleryImages: [
            '/images/wiki/maps/bocage/gallery-1.jpg',
            '/images/wiki/maps/bocage/gallery-2.jpg',
            '/images/wiki/maps/bocage/gallery-3.jpg',
            '/images/wiki/maps/bocage/gallery-4.jpg',
        ],
    },
    {
        slug: 'operation-market-garden',
        name: 'Operation Market Garden',
        theater: 'Western Front',
        mapType: 'Assault',
        factions: { allies: 'British', axis: 'German' },
        overview: 'An airborne assault map featuring paratrooper drops and bridge capture objectives.',
        historicalContext: 'Operation Market Garden (September 1944) was one of the largest airborne operations in history, attempting to secure a series of bridges in the Netherlands.',
        controlPoints: [],
        alliedStrategy: { faction: 'British', factionType: 'allies', steps: [] },
        axisStrategy: { faction: 'German', factionType: 'axis', steps: [] },
        keyTactics: [],
        heroImage: '/images/wiki/maps/operation-market-garden/hero.jpg',
        galleryImages: [
            '/images/wiki/maps/operation-market-garden/gallery-1.jpg',
            '/images/wiki/maps/operation-market-garden/gallery-2.jpg',
            '/images/wiki/maps/operation-market-garden/gallery-3.jpg',
            '/images/wiki/maps/operation-market-garden/gallery-4.jpg',
        ],
    },
    {
        slug: 'battle-of-the-bulge',
        name: 'Battle of the Bulge',
        theater: 'Western Front',
        mapType: 'Assault',
        factions: { allies: 'American', axis: 'German' },
        overview: 'Winter warfare in the Ardennes forest featuring the German counter-offensive.',
        historicalContext: 'The Battle of the Bulge (December 1944 - January 1945) was Germany\'s last major offensive on the Western Front.',
        controlPoints: [],
        alliedStrategy: { faction: 'American', factionType: 'allies', steps: [] },
        axisStrategy: { faction: 'German', factionType: 'axis', steps: [] },
        keyTactics: [],
        heroImage: '/images/wiki/maps/battle-of-the-bulge/hero.jpg',
        galleryImages: [
            '/images/wiki/maps/battle-of-the-bulge/gallery-1.jpg',
            '/images/wiki/maps/battle-of-the-bulge/gallery-2.jpg',
            '/images/wiki/maps/battle-of-the-bulge/gallery-3.jpg',
            '/images/wiki/maps/battle-of-the-bulge/gallery-4.jpg',
        ],
    },
];

// Helper to get a map by slug
export function getMapBySlug(slug: string): MapData | undefined {
    return wikiMaps.find(m => m.slug === slug);
}

// Get maps grouped by theater
export function getMapsByTheater(): Record<string, MapData[]> {
    const grouped: Record<string, MapData[]> = {};
    for (const map of wikiMaps) {
        if (!grouped[map.theater]) {
            grouped[map.theater] = [];
        }
        grouped[map.theater].push(map);
    }
    return grouped;
}
