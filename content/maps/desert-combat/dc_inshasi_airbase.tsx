import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_inshasi_airbase',
  name: 'Inshasi Airbase',
  description: 'Linear corridor warfare around a contested airfield featuring vertical enfilade positions and night operations.',

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Info</h3>
      <p><strong>Setting:</strong> A desert airbase situated in a valley, flanked by ridgelines on both sides.</p>
      <p><strong>Layout:</strong> Linear corridor design funneling combat along the runway axis.</p>
      <p><strong>Objective:</strong> Control of the airfield grants access to fixed-wing aircraft spawns.</p>

      <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 my-4">
        <p className="font-semibold text-purple-400 mb-2">Night Variant Available</p>
        <p className="text-sm">Inshasi Airbase has a night variant featuring severely reduced visibility. Night vision becomes essential, and muzzle flashes reveal positions instantly.</p>
      </div>

      <h3 className="text-xl font-semibold text-foreground">Tactical Considerations & Gameplay Flow</h3>

      <h4 className="text-lg font-medium text-foreground">Linear Corridor Warfare</h4>
      <p>The map's valley geography creates a <strong>natural corridor</strong> that funnels combat along the runway axis. Armor columns must advance through predictable lanes, making them vulnerable to prepared defenses.</p>

      <p>This linear design means that frontal assaults are costly—flanking via the ridgelines becomes essential for breaking defensive lines.</p>

      <h4 className="text-lg font-medium text-foreground">Vertical Enfilade Positions</h4>
      <p>The ridgelines flanking the airbase provide <strong>devastating enfilade positions</strong>. Infantry and light vehicles on the high ground can fire down into the valley, catching armor in crossfire from multiple elevations.</p>

      <p>Control of the ridgelines often determines control of the airfield below. Teams that neglect the high ground find their valley assets systematically destroyed by AT fire from above.</p>

      <h4 className="text-lg font-medium text-foreground">Airfield Capture Dynamics</h4>
      <p>The airfield capture points are exposed to fire from the ridgelines. Capturing the airbase requires either <strong>suppressing the heights</strong> or accepting significant casualties during the capture process.</p>

      <p>Once captured, the airfield provides access to jets, but these aircraft must take off under fire if the ridgelines remain contested.</p>

      <h4 className="text-lg font-medium text-foreground">Night Operations</h4>
      <p>The night variant transforms the battle. <strong>Night vision goggles</strong> become essential equipment, and tracer fire creates visible streams that reveal firing positions. The reduced visibility makes flanking maneuvers more viable but also more disorienting.</p>

      <p>Muzzle flashes become the primary target acquisition method in night operations—disciplined fire control becomes crucial.</p>

      <h4 className="text-lg font-medium text-foreground">Combined Arms Requirement</h4>
      <p>Success on Inshasi requires <strong>tight combined arms coordination</strong>. Armor in the valley needs infantry support on the ridges. Aircraft need AA suppression before takeoff runs. No single element can succeed in isolation.</p>

      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mt-4">
        <p className="font-semibold text-green-400 mb-2">Key Tactics</p>
        <ul className="text-sm space-y-2">
          <li><strong>Ridgeline Control:</strong> Prioritize the high ground—it dominates the valley below.</li>
          <li><strong>Enfilade Fire:</strong> Position AT assets on ridges to catch armor in crossfire.</li>
          <li><strong>Night Discipline:</strong> In night variant, control muzzle flash to avoid revealing position.</li>
          <li><strong>Runway Suppression:</strong> Target aircraft during takeoff when they're most vulnerable.</li>
        </ul>
      </div>
    </div>
  )
};

export default mapData;
