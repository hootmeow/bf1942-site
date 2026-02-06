import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_basrahs_edge',
  name: "Basrah's Edge",
  description: 'Urban desert city warfare defined by river crossings, bridge chokepoints, and elevated highway combat.',

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Info</h3>
      <p><strong>Setting:</strong> The industrial outskirts of Basra, defined by river crossings and highway infrastructure.</p>
      <p><strong>Key Geography:</strong> A major waterway bisecting the map, connected by choke-point bridges.</p>
      <p><strong>Infrastructure:</strong> Elevated highways, warehouses, and residential blocks.</p>

      <h3 className="text-xl font-semibold text-foreground">Tactical Considerations & Gameplay Flow</h3>

      <h4 className="text-lg font-medium text-foreground">The Bridge Choke Points</h4>
      <p>The strategic fulcrum of Basrah's Edge is the <strong>bridge network</strong>. These structures create natural bottlenecks where armor columns inevitably clash. Destroyed vehicle hulks often physically block the bridges, necessitating the Engineer class not only for repair but for mine clearing and obstacle removal.</p>

      <p>The Iraqi team often utilizes the defensive advantage of the river bank to set up crossfire zones covering the bridge exits.</p>

      <h4 className="text-lg font-medium text-foreground">Elevated Highway Control</h4>
      <p>A unique tactical element is the <strong>elevated highway system</strong>. Controlling the overpass provides a decisive height advantage, allowing tanks to fire shells down onto the roofs of enemies on the lower surface roads.</p>

      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 my-4">
        <p className="font-semibold text-amber-400 mb-2">Highway Risk</p>
        <p className="text-sm">Vehicles on the overpass are silhouetted against the skybox, making them easy targets for attack helicopters and distant ATGMs. High reward, high risk positioning.</p>
      </div>

      <h4 className="text-lg font-medium text-foreground">Riverine Flanking Operations</h4>
      <p>While the main force is locked in attrition at the bridges, the "meta" play involves utilizing <strong>fast attack boats or amphibious vehicles</strong> to navigate the river. This allows squads to bypass the bridge choke points entirely and insert behind enemy lines.</p>

      <p>This "river rat" tactic forces the defending team to divert assets from the frontline to protect rear flags, relieving pressure on the main bridge crossing.</p>

      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mt-4">
        <p className="font-semibold text-green-400 mb-2">Key Tactics</p>
        <ul className="text-sm space-y-2">
          <li><strong>Bridge Control:</strong> Engineers are essential for clearing vehicle wrecks and mines blocking crossings.</li>
          <li><strong>Highway Dominance:</strong> Control the overpass for height advantage, but watch for helicopters.</li>
          <li><strong>River Flanking:</strong> Use boats to bypass bridges and capture rear objectives.</li>
          <li><strong>Crossfire Setup:</strong> Defenders should establish overlapping fire zones at bridge exits.</li>
        </ul>
      </div>
    </div>
  )
};

export default mapData;
