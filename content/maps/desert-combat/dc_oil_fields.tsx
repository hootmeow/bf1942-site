import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_oil_fields',
  name: 'Oil Fields',
  description: 'Strategic warfare around burning oil derricks and pipelines with dynamic smoke concealment and vehicle mobility lanes.',

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Info</h3>
      <p><strong>Setting:</strong> A sprawling oil extraction field featuring pipelines, derricks, and refinery infrastructure.</p>
      <p><strong>Strategic Value:</strong> Control of oil infrastructure represents economic warfare objectives.</p>
      <p><strong>Atmosphere:</strong> Burning wells create dynamic smoke and visual chaos.</p>

      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 my-4">
        <p className="font-semibold text-amber-400 mb-2">Oil Fire Dynamics</p>
        <p className="text-sm">Burning oil wells create persistent smoke columns that can be used for concealment. Smart players use these as visual cover for flanking maneuvers, though the smoke also obscures friendly fire solutions.</p>
      </div>

      <h3 className="text-xl font-semibold text-foreground">Tactical Considerations & Gameplay Flow</h3>

      <h4 className="text-lg font-medium text-foreground">Pipeline Mobility</h4>
      <p>The raised pipeline network creates natural mobility corridors for vehicles. Tanks can use the pipeline structures as hull-down positions, exposing only their turrets while their vulnerable hulls remain protected.</p>

      <p>Infantry can also use the pipelines as cover when crossing open ground, moving parallel to the structures to avoid exposure to distant armor.</p>

      <h4 className="text-lg font-medium text-foreground">Smoke as Concealment</h4>
      <p>The burning oil wells create <strong>persistent smoke columns</strong> that serve as dynamic concealment. Experienced players use these smoke screens to mask armor advances or to cover infantry pushes across open terrain.</p>

      <p>However, the smoke is a double-edged sword—it can also mask enemy movements and make target acquisition difficult for both sides.</p>

      <h4 className="text-lg font-medium text-foreground">Refinery Verticality</h4>
      <p>The refinery structures provide <strong>elevated positions</strong> for snipers and anti-tank soldiers. Climbing the refinery catwalks grants overwatch over large portions of the map, making these positions highly contested.</p>

      <p>Defenders should establish crossfire positions between refinery structures, while attackers need to neutralize these elevated threats before committing armor.</p>

      <h4 className="text-lg font-medium text-foreground">Vehicle Dominance Zones</h4>
      <p>The open terrain between oil derricks favors armored warfare. Tank columns can engage at long range, making infantry movement across open ground suicidal without vehicle support or smoke cover.</p>

      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mt-4">
        <p className="font-semibold text-green-400 mb-2">Key Tactics</p>
        <ul className="text-sm space-y-2">
          <li><strong>Smoke Exploitation:</strong> Use burning oil wells as concealment for flanking maneuvers.</li>
          <li><strong>Pipeline Cover:</strong> Move infantry along pipeline structures to avoid exposure.</li>
          <li><strong>Refinery Control:</strong> Secure elevated refinery positions for overwatch and AT fire.</li>
          <li><strong>Hull-Down Positions:</strong> Use infrastructure as hull-down cover for armor.</li>
        </ul>
      </div>
    </div>
  )
};

export default mapData;
