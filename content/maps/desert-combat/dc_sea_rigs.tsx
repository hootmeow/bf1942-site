import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_sea_rigs',
  name: 'Sea Rigs',
  description: 'Offshore oil platform combat featuring rotary-wing skill challenges, naval blockades, and isolated infantry firefights.',

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Info</h3>
      <p><strong>Setting:</strong> A network of offshore oil platforms connected by catwalks and serviced by helicopters.</p>
      <p><strong>Environment:</strong> Open ocean with no terrain cover; platforms are isolated islands of combat.</p>
      <p><strong>Access:</strong> Helicopters and boats are the only means of inter-platform transport.</p>

      <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 my-4">
        <p className="font-semibold text-cyan-400 mb-2">Pilot Skill Check</p>
        <p className="text-sm">Sea Rigs is notorious for punishing poor helicopter pilots. Landing on the narrow platform helipads requires precision, and crashing means a long swim back to base.</p>
      </div>

      <h3 className="text-xl font-semibold text-foreground">Tactical Considerations & Gameplay Flow</h3>

      <h4 className="text-lg font-medium text-foreground">Rotary-Wing Skill Check</h4>
      <p>Sea Rigs is the <strong>ultimate helicopter pilot test</strong>. Landing on the narrow oil platform helipads requires precision flying, and the open ocean provides zero terrain cover for evasive maneuvers.</p>

      <p>Transport helicopter pilots must thread the needle between enemy AA fire and the platform structures themselves. A crashed helicopter strands an entire squad in the water.</p>

      <h4 className="text-lg font-medium text-foreground">MANPADS Infantry</h4>
      <p>The open skies make <strong>shoulder-fired AA missiles devastatingly effective</strong>. Infantry equipped with Stingers or Iglas can engage aircraft with clear sightlines from any platform. Smart defenders distribute AA infantry across multiple rigs to create overlapping engagement zones.</p>

      <p>This turns every oil rig into a potential AA battery, making helicopter insertion extremely hazardous.</p>

      <h4 className="text-lg font-medium text-foreground">Naval Blockade Operations</h4>
      <p>The naval dimension adds strategic depth. Patrol boats can establish <strong>blockades around platforms</strong>, interdicting enemy boat traffic and providing fire support for infantry on the rigs.</p>

      <p>Naval dominance often determines which team can reinforce contested platforms, as helicopters may be too risky in heavy AA environments.</p>

      <h4 className="text-lg font-medium text-foreground">Isolated Infantry Combat</h4>
      <p>Once on a platform, infantry combat becomes <strong>intensely claustrophobic</strong>. The narrow catwalks, industrial machinery, and multi-level structure create close-quarters firefights where shotguns and SMGs excel.</p>

      <p>Defenders can fortify a single platform for extended periods if they eliminate enemy transport capabilities.</p>

      <h4 className="text-lg font-medium text-foreground">The Swim of Shame</h4>
      <p>Players who fall off platforms or whose helicopters crash face the infamous "swim of shame"—a long, vulnerable swim back to a friendly vessel or platform. Many matches are decided by transport attrition rather than direct combat.</p>

      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mt-4">
        <p className="font-semibold text-green-400 mb-2">Key Tactics</p>
        <ul className="text-sm space-y-2">
          <li><strong>AA Distribution:</strong> Spread Stinger/Igla infantry across platforms for overlapping coverage.</li>
          <li><strong>Naval Control:</strong> Use patrol boats to interdict enemy reinforcements.</li>
          <li><strong>Precision Landing:</strong> Practice helipad landings—crashes strand squads.</li>
          <li><strong>Platform Fortification:</strong> Defenders should eliminate enemy transport to isolate attackers.</li>
        </ul>
      </div>
    </div>
  )
};

export default mapData;
