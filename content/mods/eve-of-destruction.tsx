import React from 'react';
import { ModData } from '@/lib/types';

const EveofDestructionData: ModData = {
  name: 'Eve of Destruction',
  version: '2.51',
  description: 'Vietnam War total conversion introducing asymmetric gameplay and dense jungle combat.',
  downloadLinks: [
    { name: "Eve of Destruction 2.51", url: "#" }, // <-- FIXED
  ],
  galleryImages: [
    // Add paths to your EOD gallery images here
  ],
  content: (
    <div className="space-y-4">
      <p><b>Eve of Destruction (EoD)</b> is a total-conversion modification for Battlefield 1942 that transports players from World War II to the dense jungles and rice paddies of the Vietnam War. As one of the longest-running mods for the game, EoD provides a fast-paced, action-oriented experience similar in style to Desert Combat, but with the unique asymmetrical warfare of the Vietnam conflict.</p>
      
      <h3>Background and Gameplay</h3>
      <p>EoD captures the distinct feel of the Vietnam War by pitting the technologically superior, vehicle-heavy US forces against the guerrilla tactics of the North Vietnamese Army (NVA) and Viet Cong. The gameplay is defined by this asymmetry: US forces leverage helicopters and jets, while Vietnamese forces rely on traps, ambushes, and extensive tunnel networks.</p>
      <p>The mod has been in development for many years and is known for its vast amount of content, including a "stupidly large number of maps (100s)" and a massive arsenal of custom weapons and vehicles from the era.</p>
      
      <h3>Key Features</h3>
      <p>Eve of Destruction completely overhauls the base game with new factions, weapons, and gameplay mechanics:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Vietnam-Era Warfare:</b> Replaces all WWII assets with modern firearms (M16s, AK-47s, M60s), helicopters (like the Huey and Cobra), and jets (like the F-4 Phantom and MiG-21).</li>
        <li><b>Asymmetrical Combat:</b> Gameplay is not a mirror match. The US team relies on air mobility and firepower, while the Vietnamese team uses tunnel spawn points, booby traps, and superior camouflage.</li>
        <li><b>Massive Map Library:</b> Features hundreds of maps, from tight jungle firefights and river-based combat to urban battles in cities like Hue.</li>
        <li><b>Fast-Paced Action:</b> Unlike hardcore realism mods, EoD maintains a faster, "DC style" pace, focusing on action and visceral combat while still capturing the atmosphere of the war.</li>
      </ul>
      
      <h3>Impact and Legacy</h3>
      <p>EoD remains one of the most popular and actively played BF1942 mods. Its focus on fast-paced, helicopter-centric jungle warfare provided a completely different experience from other mods and served as a direct inspiration for the official *Battlefield: Vietnam* game released by DICE. The community is still active, with the latest major version being 2.51.</p>
    </div>
  ),
  
  maps: [
    // Add any specific EOD maps you want to feature here
  ]
};

export default EveofDestructionData;