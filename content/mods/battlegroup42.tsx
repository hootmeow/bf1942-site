import React from 'react';
import { ModData } from '@/lib/types';

const Battlegroup42Data: ModData = {
  name: 'BattleGroup42',
  version: '1.9', // You can update this to "Final RC4" or similar
  description: 'Extended global conflict with 150+ vehicles, naval warfare, and cooperative scenarios.',
  downloadLinks: [
    { name: "BattleGroup42 Final", url: "#" }, // <-- FIXED
  ],
  galleryImages: [
    // Add paths to your BG42 gallery images here
  ],
  content: (
    <div className="space-y-4">
      <p><b>BattleGroup42 (BG42)</b> is a comprehensive realism and historical accuracy modification for Battlefield 1942. While similar in goal to Forgotten Hope, BG42 is often described as a perfect balance between realism and the fun, accessible gameplay of the original. It massively expands the game's content, covering nearly every faction and theater of World War II, as well as several pre-war conflicts.</p>
      
      <h3>Background and Development</h3>
      <p>The focus of BattleGroup42 is to enhance the vanilla gameplay rather than replace it entirely. It improves balance, adds a huge amount of new content, and strongly emphasizes teamplay. The mod is known for its high-quality models, detailed textures, and extensive map library, with over 190 maps, the majority of which feature full Co-op bot support.</p>
      
      <h3>Key Features</h3>
      <p>BG42 extends the BF1942 experience with a staggering amount of historically-vetted content:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Massive Arsenal:</b> The mod adds hundreds of new vehicles and weapons. This includes new factions like the French and Italian armies.</li>
        <li><b>Expanded Theaters:</b> BG42 features maps from conflicts rarely seen in other games, such as the 1930s Sino-Japanese War and the Soviet-Japanese border conflicts.</li>
        <li><b>Co-op Support:</b> A major feature is its extensive support for Co-op (COOP) gameplay against bots. Most of its 190 maps are playable offline or on co-op servers.</li>
        <li><b>Refined Gameplay:</b> While not as "hardcore" as other realism mods, it features realistic weapon ballistics and vehicle performance. It's considered easy to pick up for players who enjoy the original BF1942 but want more depth and variety.</li>
        <li><b>Informative UI:</b> The in-game map menu is color-coded to indicate the theater of war for each map (e.g., Blue for Pacific, Red for Eastern Front, Green for Europe).</li>
      </ul>
      
      <h3>Impact and Legacy</h3>
      <p>BattleGroup42 is one of the most enduring and comprehensive mods ever created for BF1942. Its dedication to historical detail, combined with its focus on fun and co-op gameplay, has maintained a dedicated community for years. It is often recommended as the ideal "vanilla-plus" experience for players who want a richer, more diverse World War II battlefield.</p>
    </div>
  ),
  
  maps: [
    // Add any specific BG42 maps you want to feature here
  ]
};

export default Battlegroup42Data;