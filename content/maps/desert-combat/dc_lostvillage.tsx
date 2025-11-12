import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_lostvillage', 
  name: 'DC Lost Village', 
  description: 'Lost Village is a small, infantry-focused Desert Combat map set around a riverside Middle Eastern town, where Coalition forces attack from open desert terrain against entrenched defenders',
  
  galleryImages: [
    "/images/mods/desert-combat/dc-lost-village.jpg",
    "/images/mods/desert-combat/dc-lost-village-2.jpg",
  ],
  
  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Info</h3>
      <p>Set in a remote Middle Eastern riverside settlement, the map features a compact village on one side of a shallow river and open desert terrain on the other. Coalition forces typically launch air and vehicle assaults from the desert hills, while the opposing team defends the village’s narrow streets and rooftops. The layout encourages close-quarters firefights, ambushes, and coordinated air-to-ground strikes, making it one of Desert Combat’s most iconic and balanced infantry-focused battlefields.</p>
      
      <h3 className="text-xl font-semibold text-foreground">Tactical Considerations & Gameplay Flow</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><b>Infantry-centric</b>: Because of the constrained village area and close-quarters nature, infantry combat is intense. Supports, Snipers, Special Ops classes shine here.</li>
        <li><b>Rotating between zones</b>: The map naturally funnels players between the village zone and the open flank zone. Control of the flank (ridgelines, river crossings) often decides vehicle/air dominance.</li>
        <li><b>Air/Helicopter</b>: Helicopters (attack and transport) are very useful. The open side gives room for air-to-ground engagements; the village side provides hide-and-seek cover for transport deployment. Anti-air elements near the village (e.g., AA guns, portable launchers) often contest the skies.</li>
        <li><b>Light Vehicles</b>: These are effective for quick rip-throughs of the village or to flank across the open terrain, given that heavy tanks are less effective in tight spaces.</li>
      </ul>
    </div>
  )
};

export default mapData;