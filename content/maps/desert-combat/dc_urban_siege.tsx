import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_urban_siege',
  name: 'Urban Siege',
  description: 'Dense city combat featuring amphibious assault transitioning to intense urban warfare in a metropolitan center.',

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Info</h3>
      <p><strong>Setting:</strong> A dense metropolitan center (proxy for Baghdad), featuring high-rise architecture, wide boulevards, and tight alleyways.</p>
      <p><strong>Start Conditions:</strong> US forces deploy from an offshore Carrier Battle Group; Iraqi forces hold the city.</p>
      <p><strong>Conflict Type:</strong> Amphibious Assault transitioning to City Fighting.</p>

      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 my-4">
        <p className="font-semibold text-red-400 mb-2">Urban Combat Warning</p>
        <p className="text-sm">This map inverts the vehicle-dominance of desert maps. Tanks become liabilities in the narrow streets—prioritize infantry squad tactics, verticality, and reflex shooting.</p>
      </div>

      <h3 className="text-xl font-semibold text-foreground">Tactical Considerations & Gameplay Flow</h3>

      <h4 className="text-lg font-medium text-foreground">Vertical Envelopment</h4>
      <p>The defining feature of Urban Siege is <strong>verticality</strong>. The engine allows for helicopter landings on skyscraper rooftops. US tactics heavily favor "Air Mobile" doctrine: utilizing Black Hawks and Little Birds to drop snipers and anti-tank soldiers onto the tallest structures. From these perches, US forces can exert map control over the streets below, firing RPGs into the thin top armor of Iraqi tanks.</p>

      <h4 className="text-lg font-medium text-foreground">The "Black Hawk Down" Scenario</h4>
      <p>For Iraqi forces, defense relies on the "urban canyon" effect. Streets are death traps for hovering aircraft due to the density of windows and rooftops from which RPG fire can originate. Ground-based AA (Shilka) is less effective here due to buildings blocking lines of sight; instead, heavy machine gun emplacements and shoulder-fired missiles are the primary air deterrents.</p>

      <p>Iraqi armor must strictly adhere to infantry support doctrines—<strong>a tank moving without infantry screening will be destroyed by C4 charges</strong> placed by Spec Ops soldiers emerging from the labyrinthine alleys.</p>

      <h4 className="text-lg font-medium text-foreground">Street Fighting Dynamics</h4>
      <p>The ground war is characterized by "lane control." Wide boulevards allow for long-range sniper duels and tank fire, while connecting alleys result in chaotic, short-range firefights favoring the MP5 and AK-47. Control points are often located in courtyards or lobbies, forcing vehicles to expose themselves to capture territory.</p>

      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mt-4">
        <p className="font-semibold text-green-400 mb-2">Key Tactics</p>
        <ul className="text-sm space-y-2">
          <li><strong>Rooftop Control:</strong> US teams should prioritize helicopter insertion onto tall buildings for overwatch.</li>
          <li><strong>Infantry Screening:</strong> Iraqi tanks must always have infantry support to prevent C4 ambushes.</li>
          <li><strong>RPG Positioning:</strong> Fire down into tank top armor from elevated positions for maximum damage.</li>
          <li><strong>AA Placement:</strong> Use shoulder-fired missiles from windows rather than relying on Shilka in tight streets.</li>
        </ul>
      </div>
    </div>
  )
};

export default mapData;
