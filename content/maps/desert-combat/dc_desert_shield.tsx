import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_desert_shield',
  name: 'Desert Shield',
  description: 'Massive scale air/ground combat at an airbase, representing the preparatory buildup phase of the Gulf War.',

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Info</h3>
      <p><strong>Operational Context:</strong> The preparatory buildup phase of the Gulf War.</p>
      <p><strong>Environment:</strong> Massive scale, clear skies with high visibility and extreme engagement distances.</p>
      <p><strong>Layout:</strong> Dispersed Forward Operating Bases (FOBs) separated by kilometers of barren desert.</p>

      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 my-4">
        <p className="font-semibold text-amber-400 mb-2">Scale Warning</p>
        <p className="text-sm">Desert Shield is arguably the largest map in the standard rotation, designed to test the limits of the engine's coordinate system. An infantryman stranded without a vehicle is combat-ineffective, facing a 5-to-10-minute sprint to the nearest objective.</p>
      </div>

      <h3 className="text-xl font-semibold text-foreground">Tactical Considerations & Gameplay Flow</h3>

      <h4 className="text-lg font-medium text-foreground">Logistical Attrition</h4>
      <p>The primary tactical consideration is transport logistics. The loss of transport helicopters (Black Hawk / Mi-8) or APCs is catastrophic. Teams that fail to ferry troops to the forward capture points quickly find themselves spawn-trapped at their main base, unable to project force across the open sands.</p>

      <h4 className="text-lg font-medium text-foreground">The A-10 Warthog Dominance</h4>
      <p>Unlike 73 Easting, Desert Shield features clear weather. This visibility allows the A-10 Warthog to utilize its GAU-8 Avenger cannon and missiles at maximum range. The A-10 becomes the apex predator of the map—a single skilled pilot can halt an entire armored column.</p>

      <p>The counter-strategy for the Iraqi team necessitates constant deployment of mobile AA assets and MiG interceptors. The map dictates a strict combined-arms doctrine: <strong>tanks cannot move without AA support, and infantry cannot move without mechanized transport.</strong></p>

      <h4 className="text-lg font-medium text-foreground">Base Capture & Ticket Bleed</h4>
      <p>Due to immense travel times, "back-capping" (sending a fast unit to capture enemy rear flags) is highly effective. A single DPV (Desert Patrol Vehicle) slipping past the frontline can capture an undefended rear base, forcing the enemy main force to turn around or respawn miles away from the front. This tactic disrupts momentum and stretches defensive lines until they break.</p>

      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mt-4">
        <p className="font-semibold text-green-400 mb-2">Key Tactics</p>
        <ul className="text-sm space-y-2">
          <li><strong>Protect Transports:</strong> Black Hawks and APCs are more valuable than tanks on this map.</li>
          <li><strong>Combined Arms:</strong> Never move armor without AA escort—A-10s will devastate unsupported columns.</li>
          <li><strong>Back-Cap Strategy:</strong> Use DPVs to capture rear flags and disrupt enemy spawns.</li>
          <li><strong>Air Superiority:</strong> MiG pilots must prioritize A-10 interdiction over ground attack.</li>
        </ul>
      </div>
    </div>
  )
};

export default mapData;
