import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_weapon_storage',
  name: 'Weapon Storage',
  description: 'Underground bunker complex featuring brutal chokepoint combat and a stark disconnect between surface and subterranean warfare.',

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Info</h3>
      <p><strong>Setting:</strong> A fortified underground weapons storage facility with surface access points.</p>
      <p><strong>Layout:</strong> Multi-level bunker complex with narrow corridors and reinforced chambers.</p>
      <p><strong>Objective:</strong> Control of the weapons cache represents strategic denial operations.</p>

      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 my-4">
        <p className="font-semibold text-red-400 mb-2">Chokepoint Warning</p>
        <p className="text-sm">The bunker entrances are notorious meat grinders. Defenders can stack bodies at the tunnel mouths for extended periods. Coordinated smoke and flashbang usage is essential for breaching.</p>
      </div>

      <h3 className="text-xl font-semibold text-foreground">Tactical Considerations & Gameplay Flow</h3>

      <h4 className="text-lg font-medium text-foreground">The Chokepoint Grind</h4>
      <p>Weapon Storage is defined by its <strong>brutal chokepoints</strong>. The limited entry points into the bunker complex create natural defensive positions where a small number of defenders can hold off numerically superior attackers.</p>

      <p>Attackers must commit to overwhelming force at a single entry point or coordinate simultaneous breaches across multiple access tunnels to divide defensive attention.</p>

      <h4 className="text-lg font-medium text-foreground">Surface-to-Underground Disconnect</h4>
      <p>The map features a stark <strong>tactical disconnect</strong> between the surface battle and the underground fight. Armor and air assets dominate the surface, controlling access to bunker entrances, while the underground becomes pure infantry combat.</p>

      <p>Teams must maintain coordination between their surface vehicle crews and their underground assault squads. Losing surface control means losing the ability to reinforce the bunker assault.</p>

      <h4 className="text-lg font-medium text-foreground">Bunker Defense Tactics</h4>
      <p>Defenders should establish <strong>layered defense</strong> within the bunker—forward observers at the entrances, fallback positions at corridor junctions, and a final stand at the objective itself.</p>

      <p>Grenade spam is the attacker's primary tool. Defenders must stay mobile and avoid clustering, as a single well-placed grenade can wipe a defensive position.</p>

      <h4 className="text-lg font-medium text-foreground">Engineer Value</h4>
      <p>The Engineer class excels here. Mines placed at bunker entrances can devastate attacking infantry, while defensive turrets (if available) can cover chokepoints that would otherwise require dedicated players.</p>

      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mt-4">
        <p className="font-semibold text-green-400 mb-2">Key Tactics</p>
        <ul className="text-sm space-y-2">
          <li><strong>Coordinated Breach:</strong> Attack multiple entrances simultaneously to divide defenders.</li>
          <li><strong>Surface Control:</strong> Maintain vehicle dominance to protect bunker access points.</li>
          <li><strong>Layered Defense:</strong> Establish fallback positions throughout the bunker complex.</li>
          <li><strong>Grenade Discipline:</strong> Attackers should pre-nade corners; defenders should stay mobile.</li>
        </ul>
      </div>
    </div>
  )
};

export default mapData;
