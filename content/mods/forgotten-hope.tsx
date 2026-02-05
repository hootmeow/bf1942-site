import React from 'react';
import { ModData } from '@/lib/types';

const forgottenHopeData: ModData = {
  name: 'Forgotten Hope',
  version: '0.7',
  description: 'The most comprehensive WWII realism mod, featuring over 250 historically accurate vehicles, weapons, and equipment across all major theaters of war.',
  downloadLinks: [
    { name: "Forgotten Hope 0.7 Full (ModDB)", url: "https://www.moddb.com/mods/forgotten-hope/downloads/forgotten-hope-07-full-win7" },
  ],
  galleryImages: [],
  content: (
    <div className="space-y-4">
      <p><b>Forgotten Hope (FH)</b> is a total-conversion modification for Battlefield 1942 that stands as one of the most ambitious and acclaimed mods ever created for the game. Unlike the arcade-style gameplay of vanilla BF1942, Forgotten Hope was built from the ground up to deliver the most historically accurate, realistic, and intense World War II experience possible.</p>

      <h3>Development History</h3>
      <p>Development began in late 2002, with the team's goal being to create a mod that respected historical accuracy while still being enjoyable to play. The project grew far beyond its initial scope, eventually including over 250 new pieces of authentic military equipment - more than any other BF1942 mod. The final version, 0.7, was released in 2007 after years of dedicated development.</p>
      <p>The mod's success led to the creation of <b>Forgotten Hope 2</b>, a standalone mod for Battlefield 2 that continues the legacy with even more content and improved graphics.</p>

      <h3>Realism Philosophy</h3>
      <p>Where the original BF1942 balanced authenticity with arcade-style gameplay, Forgotten Hope prioritized historical accuracy above all else. The development team meticulously researched historical data to model:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Authentic Ballistics:</b> Weapon damage, penetration values, and projectile physics are based on real-world data.</li>
        <li><b>Accurate Vehicle Armor:</b> Tank armor thickness varies by location (front, side, rear, turret), requiring tactical positioning and proper ammunition selection.</li>
        <li><b>Historical Equipment:</b> Every weapon and vehicle is modeled after real WWII equipment with correct specifications.</li>
        <li><b>Period-Accurate Loadouts:</b> Infantry kits reflect what soldiers actually carried during specific battles and time periods.</li>
      </ul>

      <h3>Content Overview</h3>
      <p>Forgotten Hope includes a staggering amount of content:</p>

      <h4>Factions</h4>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Major Powers:</b> Germany, United States, United Kingdom, Soviet Union, Japan</li>
        <li><b>Additional Nations:</b> France, Poland, Italy, Finland, Canada, Australia, and more</li>
      </ul>

      <h4>Vehicles (250+)</h4>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Tanks:</b> From light tanks like the Panzer II to heavy tanks like the IS-2, King Tiger, and Churchill</li>
        <li><b>Aircraft:</b> Fighters (Spitfire, Bf 109, P-51 Mustang), bombers (B-17, Lancaster), and attack aircraft (IL-2 Sturmovik, Stuka)</li>
        <li><b>Naval:</b> Destroyers, submarines, landing craft, PT boats</li>
        <li><b>Support:</b> Half-tracks, armored cars, self-propelled guns, towed artillery</li>
        <li><b>Unique Vehicles:</b> Fairey Swordfish biplane, Schwimmwagen amphibious car, Goliath tracked mine</li>
      </ul>

      <h4>Weapons</h4>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Rifles:</b> M1 Garand, Kar98k, Lee-Enfield, Mosin-Nagant, Arisaka</li>
        <li><b>SMGs:</b> Thompson, MP40, PPSh-41, Sten, Type 100</li>
        <li><b>Machine Guns:</b> BAR, MG42, Bren, DP-28</li>
        <li><b>Anti-Tank:</b> Panzerfaust, Bazooka, PIAT, Boys AT Rifle</li>
        <li><b>Sniper Rifles:</b> Available only as pickup kits at strategic locations</li>
      </ul>

      <h3>Key Gameplay Changes</h3>
      <p>Forgotten Hope fundamentally changes how Battlefield 1942 plays:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Advanced Armor System:</b> Tank combat is revolutionized with a complex penetration model. Shells must defeat actual armor thickness that varies by angle and location. Flanking maneuvers and using the correct anti-tank weapon are critical to success.</li>
        <li><b>Class Restrictions:</b> The Pilot class is the only class with a parachute. Sniper rifles are not standard equipment - they must be picked up from strategic "kit" locations on the map.</li>
        <li><b>Deployable Weapons:</b> Infantry can find and deploy heavy machine guns to create defensive strongpoints. Towed anti-tank and anti-aircraft guns can be moved by trucks and positioned for ambushes.</li>
        <li><b>Realistic Damage:</b> Infantry combat is deadly - a few well-placed shots can kill. This encourages tactical movement and use of cover.</li>
        <li><b>Supply System:</b> Some maps feature supply depots where vehicles can rearm and repair.</li>
      </ul>

      <h3>Map Library</h3>
      <p>The mod includes dozens of custom maps covering every major theater of World War II:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Western Front:</b> D-Day landings, Battle of the Bulge, Operation Market Garden, Liberation of France</li>
        <li><b>Eastern Front:</b> Operation Barbarossa, Stalingrad, Kursk, Battle of Berlin</li>
        <li><b>North Africa:</b> El Alamein, Tobruk, Tunisia Campaign</li>
        <li><b>Pacific Theater:</b> Iwo Jima, Guadalcanal, Philippines, Burma</li>
        <li><b>Early War:</b> 1940 Battle of France, Norway Campaign, Polish Campaign</li>
        <li><b>Naval Battles:</b> Atlantic convoy battles, Pacific carrier warfare</li>
      </ul>

      <h3>Sub-Mods and Expansions</h3>
      <p>Forgotten Hope's popularity spawned several community expansions:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Forgotten Hope: Secret Weapon (FHSW):</b> A massive unofficial expansion adding experimental and prototype weapons, including jet aircraft, guided missiles, and super-heavy tanks. Still actively developed and played today.</li>
        <li><b>Forgotten Hope 2:</b> The official sequel built on Battlefield 2's engine, featuring improved graphics and expanded content.</li>
      </ul>

      <h3>Legacy and Impact</h3>
      <p>Forgotten Hope is widely considered the gold standard for WWII realism in the Battlefield modding community. Its influence can be seen in many subsequent games and mods that attempted to balance historical accuracy with engaging gameplay. The mod demonstrated that there was a significant audience for more realistic military simulations, potentially influencing the development of later games in the genre.</p>
      <p>The mod remains playable today, with dedicated servers still running FH 0.7 and the FHSW expansion. For players seeking the most authentic WWII experience possible on the BF1942 engine, Forgotten Hope remains the definitive choice.</p>

      <h3>Installation Requirements</h3>
      <ul className="list-disc space-y-2 pl-5">
        <li>Battlefield 1942 patched to version 1.6 or higher</li>
        <li>Approximately 1.5 GB of free disk space</li>
        <li>The mod is a standalone download - no previous versions required</li>
      </ul>
    </div>
  ),

  maps: [
    {
      slug: 'fh_berlin',
      name: 'Berlin',
      description: 'The final battle for the German capital, featuring intense urban combat through the devastated streets.',
    },
    {
      slug: 'fh_elalamein',
      name: 'El Alamein (FH)',
      description: 'The decisive North African battle reimagined with historically accurate forces and equipment.',
    },
    {
      slug: 'fh_kursk',
      name: 'Kursk',
      description: 'The largest tank battle in history, featuring massive armored clashes on the Eastern Front.',
    },
  ]
};

export default forgottenHopeData;
