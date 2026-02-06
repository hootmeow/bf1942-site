import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_no_fly_zone',
  name: 'No Fly Zone',
  description: 'Pure air superiority warfare focused on strategic infrastructure destruction and airfield dominance.',

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Info</h3>
      <p><strong>Setting:</strong> Mountainous terrain with heavily defended airfields and AA installations.</p>
      <p><strong>Primary Objective:</strong> Establish air superiority by destroying enemy air assets and AA infrastructure.</p>
      <p><strong>Scale:</strong> Large; Air-focused with ground support elements.</p>

      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 my-4">
        <p className="font-semibold text-blue-400 mb-2">Air Dominance Map</p>
        <p className="text-sm">No Fly Zone is the definitive air combat map in Desert Combat. Pilot skill and aircraft preservation are paramount—losing your jets means losing the match.</p>
      </div>

      <h3 className="text-xl font-semibold text-foreground">Tactical Considerations & Gameplay Flow</h3>

      <h4 className="text-lg font-medium text-foreground">Pure Air Superiority</h4>
      <p>This map is <strong>the definitive air combat experience</strong> in Desert Combat. The mountainous terrain provides natural cover for aircraft, creating dramatic canyon-running engagements and high-altitude dogfights.</p>

      <p>Ground forces serve primarily as support elements—manning AA positions, repairing aircraft, and defending airfields from enemy infiltration.</p>

      <h4 className="text-lg font-medium text-foreground">Strategic Infrastructure Destruction</h4>
      <p>Key objectives include <strong>destroying enemy hangars and runways</strong>. A successful bombing run that destroys enemy aircraft spawn infrastructure can cripple their air power for the remainder of the match.</p>

      <p>This creates a high-stakes opening phase where protecting your own airfield while striking the enemy's becomes the primary strategic objective.</p>

      <h4 className="text-lg font-medium text-foreground">Hangar Destruction Dynamics</h4>
      <p>When hangars are destroyed, aircraft spawn timers increase dramatically or cease entirely. Teams must balance between committing aircraft to offensive operations and holding reserves to defend against enemy strikes.</p>

      <h4 className="text-lg font-medium text-foreground">AA Network Importance</h4>
      <p>Ground-based AA creates <strong>no-fly zones</strong> around critical infrastructure. The ZSU-23-4 Shilka and static AA emplacements can deny entire sectors of airspace. Destroying these positions is a prerequisite for effective bombing runs.</p>

      <h4 className="text-lg font-medium text-foreground">The Capture Circle Mechanic</h4>
      <p>Airfields feature capture circles that must be held by ground forces. A team that loses their airfield to enemy infantry finds their aircraft stranded—able to take off but unable to rearm or repair. This creates a dual-layer battle where ground troops must defend the airfield while pilots fight for the skies above.</p>

      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mt-4">
        <p className="font-semibold text-green-400 mb-2">Key Tactics</p>
        <ul className="text-sm space-y-2">
          <li><strong>Airfield Defense:</strong> Ground troops must hold capture points to maintain aircraft services.</li>
          <li><strong>Infrastructure Strikes:</strong> Prioritize destroying enemy hangars to cripple their air power.</li>
          <li><strong>AA Suppression:</strong> Eliminate Shilkas before committing to bombing runs.</li>
          <li><strong>Canyon Running:</strong> Use terrain to break missile locks and evade pursuers.</li>
        </ul>
      </div>
    </div>
  )
};

export default mapData;
