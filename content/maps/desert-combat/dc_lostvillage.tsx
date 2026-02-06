import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_lostvillage',
  name: 'Lost Village',
  description: 'A compact, walled settlement featuring claustrophobic, high-intensity close-quarters combat.',

  galleryImages: [
    "/images/mods/desert-combat/dc-lost-village.jpg",
    "/images/mods/desert-combat/dc-lost-village-2.jpg",
  ],

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Info</h3>
      <p><strong>Setting:</strong> A compact, walled settlement in the deep desert.</p>
      <p><strong>Scale:</strong> Small/Medium; Infantry focused.</p>
      <p><strong>Atmosphere:</strong> Claustrophobic, high-intensity CQC.</p>

      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 my-4">
        <p className="font-semibold text-red-400 mb-2">Infantry Focus</p>
        <p className="text-sm">Lost Village minimizes the role of heavy armor. Bringing an M1A1 into the village center is typically suicidal due to restricted turret traversal and abundant cover for AT infantry.</p>
      </div>

      <h3 className="text-xl font-semibold text-foreground">Tactical Considerations & Gameplay Flow</h3>

      <h4 className="text-lg font-medium text-foreground">The DPV/Geometry Exploit</h4>
      <p>Lost Village is infamous in the competitive community for specific geometry exploits. A known tactic involves using the Desert Patrol Vehicle (DPV) to clip through walls of specific buildings, allowing entry to structures designed as solid blocks. This "glitch" became a recognized part of high-level play, forcing teams to check "unenterable" buildings for campers.</p>

      <h4 className="text-lg font-medium text-foreground">Infantry "Meat Grinder"</h4>
      <p>The map minimizes heavy armor's role. The tank's function is relegated to <strong>perimeter suppression</strong>—circling the village walls and firing high-explosive shells into courtyards to suppress enemy spawns.</p>

      <p>Inside the walls, gameplay is dominated by the <strong>Medic and Assault classes</strong>, with battles decided by grenade placement and corner-peeking reflexes.</p>

      <h4 className="text-lg font-medium text-foreground">Zone Rotation</h4>
      <p>The map naturally funnels players between the village zone and the open flank zone. Control of the flank (ridgelines, river crossings) often decides vehicle/air dominance, while the village interior remains an infantry grind.</p>

      <h4 className="text-lg font-medium text-foreground">Air & Helicopter Support</h4>
      <p>Helicopters (attack and transport) are useful here. The open side gives room for air-to-ground engagements; the village side provides hide-and-seek cover for transport deployment. Anti-air elements near the village (AA guns, portable launchers) often contest the skies.</p>

      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mt-4">
        <p className="font-semibold text-green-400 mb-2">Key Tactics</p>
        <ul className="text-sm space-y-2">
          <li><strong>Infantry-Centric:</strong> Supports, Snipers, and Spec Ops classes shine in the village interior.</li>
          <li><strong>Tank Perimeter:</strong> Use tanks outside the walls for suppression, not inside for capture.</li>
          <li><strong>Grenade Discipline:</strong> Corner-peeking and grenade placement decide indoor firefights.</li>
          <li><strong>Light Vehicles:</strong> Effective for quick rip-throughs or flanking across open terrain.</li>
        </ul>
      </div>
    </div>
  )
};

export default mapData;
