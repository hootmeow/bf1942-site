import React from 'react';
import { ModData } from '@/lib/types';

const Battlegroup42Data: ModData = {
  name: 'BattleGroup42',
  version: '1.8 Final',
  description: 'The ultimate vanilla-plus WWII experience with 150+ vehicles, 190+ maps with full Co-op support, covering conflicts from 1936-1945.',
  downloadLinks: [
    { name: "BattleGroup42 1.8 Final (ModDB)", url: "https://www.moddb.com/mods/battlegroup42/downloads/battlegroup42-v18-final-full" },
  ],
  galleryImages: [],
  content: (
    <div className="space-y-4">
      <p><b>BattleGroup42 (BG42)</b> is a comprehensive modification for Battlefield 1942 that represents the perfect balance between historical realism and accessible, fun gameplay. While similar in goal to Forgotten Hope, BG42 takes a different approach - enhancing the vanilla BF1942 experience rather than completely replacing it, making it ideal for players who love the original game but want vastly more content and variety.</p>

      <h3>Development Philosophy</h3>
      <p>The BattleGroup42 team focused on three core principles:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Historical Accuracy:</b> All equipment is researched and modeled to be historically accurate.</li>
        <li><b>Playability:</b> Unlike hardcore realism mods, BG42 maintains the fun, accessible gameplay of vanilla BF1942.</li>
        <li><b>Comprehensive Co-op Support:</b> The majority of maps feature full bot support for single-player and co-op gameplay.</li>
      </ul>
      <p>Development spanned many years, with the final release (version 1.8) representing the culmination of extensive community feedback and refinement.</p>

      <h3>Content Scale</h3>
      <p>BattleGroup42 is one of the most content-rich mods ever created for BF1942:</p>

      <h4>Maps (190+)</h4>
      <p>The mod features an extraordinary library of over 190 maps, covering:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>European Theater:</b> Battle of France, Operation Barbarossa, Stalingrad, D-Day, Battle of the Bulge, Fall of Berlin</li>
        <li><b>North African Campaign:</b> Desert warfare from El Alamein to Tunisia</li>
        <li><b>Pacific Theater:</b> Pearl Harbor, Midway, Iwo Jima, Okinawa, Burma Campaign</li>
        <li><b>Pre-War Conflicts:</b> Spanish Civil War (1936-1939), Sino-Japanese War (1937-1945)</li>
        <li><b>Rare Theaters:</b> Soviet-Japanese border conflicts, Finnish Winter War, Italian Campaign</li>
      </ul>

      <h4>Factions</h4>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Axis Powers:</b> Germany, Japan, Italy, Finland, Hungary, Romania</li>
        <li><b>Allied Powers:</b> United States, United Kingdom, Soviet Union, France, Poland, China</li>
        <li><b>Additional Nations:</b> Canada, Australia, New Zealand, and various resistance forces</li>
      </ul>

      <h4>Vehicles (150+)</h4>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Ground Vehicles:</b> Tanks, armored cars, half-tracks, self-propelled guns, artillery</li>
        <li><b>Aircraft:</b> Fighters, bombers, dive bombers, reconnaissance planes, transport aircraft</li>
        <li><b>Naval Vessels:</b> Battleships, cruisers, destroyers, submarines, landing craft, PT boats</li>
        <li><b>Unique Vehicles:</b> Armored trains, river gunboats, midget submarines, captured/lend-lease equipment</li>
      </ul>

      <h3>Key Features</h3>

      <h4>Color-Coded Map Selection</h4>
      <p>The in-game map browser uses a color-coding system to help players quickly identify the theater of war:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Blue:</b> Pacific Theater</li>
        <li><b>Red:</b> Eastern Front</li>
        <li><b>Green:</b> Western Europe</li>
        <li><b>Yellow:</b> North Africa / Mediterranean</li>
        <li><b>Orange:</b> Pre-war conflicts and special scenarios</li>
      </ul>

      <h4>Extensive Co-op Support</h4>
      <p>One of BG42's greatest strengths is its comprehensive bot support. The vast majority of maps are fully playable in Co-op mode, with bots that utilize vehicles, aircraft, and naval vessels effectively. This makes the mod perfect for:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Solo practice and exploration</li>
        <li>LAN parties with mixed human/bot teams</li>
        <li>Learning map layouts before online play</li>
        <li>Enjoying the content without needing a populated server</li>
      </ul>

      <h4>Refined Gameplay Balance</h4>
      <p>BG42 features carefully tuned weapon ballistics and vehicle performance that feel realistic without being punishing:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Infantry Combat:</b> More lethal than vanilla but not one-shot kills. Encourages tactical play while remaining accessible.</li>
        <li><b>Vehicle Balance:</b> Historical accuracy in armor and firepower, but balanced for enjoyable gameplay. Every vehicle has a counter.</li>
        <li><b>Aircraft:</b> Improved flight models that are more realistic but still learnable for casual players.</li>
      </ul>

      <h3>Notable Maps</h3>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Operation Husky:</b> The Allied invasion of Sicily featuring amphibious landings and combined arms combat.</li>
        <li><b>Khalkin Gol:</b> The 1939 Soviet-Japanese border conflict - rarely depicted in WWII games.</li>
        <li><b>Eben Emael:</b> German glider assault on the Belgian fortress in 1940.</li>
        <li><b>Crete:</b> The German airborne invasion of Crete with paratroopers and gliders.</li>
        <li><b>Shanghai 1937:</b> Urban combat during the Second Sino-Japanese War.</li>
      </ul>

      <h3>Community and Legacy</h3>
      <p>BattleGroup42 has maintained a dedicated community for years, with players appreciating its balance of content, playability, and historical scope. The mod is often recommended as the ideal "vanilla-plus" experience for players who:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Enjoy the core BF1942 gameplay but want more variety</li>
        <li>Want to explore lesser-known battles and theaters of WWII</li>
        <li>Prefer playing Co-op or single-player</li>
        <li>Don't want the steep learning curve of hardcore realism mods</li>
      </ul>

      <h3>Installation Requirements</h3>
      <ul className="list-disc space-y-2 pl-5">
        <li>Battlefield 1942 patched to version 1.6 or higher</li>
        <li>Approximately 2 GB of free disk space (due to the massive map library)</li>
        <li>No previous versions required - 1.8 Final is a complete standalone installation</li>
      </ul>
    </div>
  ),

  maps: [
    {
      slug: 'bg42_khalkin_gol',
      name: 'Khalkin Gol',
      description: 'The 1939 Soviet-Japanese border conflict featuring armor clashes on the Mongolian steppe.',
    },
    {
      slug: 'bg42_crete',
      name: 'Crete',
      description: 'German airborne invasion with paratroopers and glider-borne troops assaulting the island.',
    },
    {
      slug: 'bg42_shanghai',
      name: 'Shanghai 1937',
      description: 'Urban combat during the Second Sino-Japanese War in the streets of Shanghai.',
    },
  ]
};

export default Battlegroup42Data;
