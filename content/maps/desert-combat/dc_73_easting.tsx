import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_73_easting',
  name: '73 Easting',
  description: 'Desert tank battle featuring armored warfare across open terrain, based on the decisive engagement of February 26, 1991.',

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Info</h3>
      <p><strong>Operational Context:</strong> Based on the decisive armored engagement of February 26, 1991, during Operation Desert Storm.</p>
      <p><strong>Environment:</strong> High-density particulate suspension (Sandstorm conditions).</p>
      <p><strong>Grid Topography:</strong> Rolling dunes with minimal vertical obstruction; sparse vegetation.</p>

      <div className="grid md:grid-cols-2 gap-4 my-4">
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="font-semibold text-blue-400 mb-2">Coalition Assets</p>
          <ul className="text-sm space-y-1">
            <li>M1A1 Abrams</li>
            <li>M2A2 Bradley</li>
            <li>A-10 Thunderbolt II</li>
            <li>AH-64 Apache</li>
          </ul>
        </div>
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="font-semibold text-red-400 mb-2">Opposition Assets</p>
          <ul className="text-sm space-y-1">
            <li>T-72M1</li>
            <li>BMP-1/2</li>
            <li>ZSU-23-4 Shilka</li>
            <li>Mobile SCUD Launcher</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-foreground">Tactical Features</h3>
      <table className="w-full text-sm border border-border/60 rounded-lg overflow-hidden">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 border-b border-border/60">Feature</th>
            <th className="text-left p-3 border-b border-border/60">Tactical Implication</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border-b border-border/40 font-medium">Sandstorm Fog</td>
            <td className="p-3 border-b border-border/40">Reduces visibility to &lt;400m; forces "knife-fight" range for MBTs; obscures A-10 runs until terminal phase.</td>
          </tr>
          <tr>
            <td className="p-3 border-b border-border/40 font-medium">Dune Geometry</td>
            <td className="p-3 border-b border-border/40">Facilitates "hull-down" positioning; T-72 low profile offers advantage; M1A1 gun depression allows ridge-line firing.</td>
          </tr>
          <tr>
            <td className="p-3 font-medium">Open Flanks</td>
            <td className="p-3">No natural choke points; mandates 360-degree security; vulnerable to high-speed DPV harassment.</td>
          </tr>
        </tbody>
      </table>

      <h3 className="text-xl font-semibold text-foreground">Tactical Considerations & Gameplay Flow</h3>

      <h4 className="text-lg font-medium text-foreground">The SCUD Asymmetric Threat</h4>
      <p>A defining characteristic of the 73 Easting meta-game is the Iraqi mobile SCUD launcher. Unlike standard artillery, the SCUD possesses map-wide lethality with a massive blast radius. Expert Iraqi commanders can memorize ballistic trajectories to bombard the Coalition main base from the safety of their own spawn. This capability fundamentally alters match flow—the Coalition force is often forced to abandon a methodical advance in favor of a desperate "SCUD Hunt," utilizing fast-attack vehicles or suicide A-10 runs to neutralize the launcher.</p>

      <h4 className="text-lg font-medium text-foreground">Armored Spearhead Dynamics</h4>
      <p>The central engagement zone serves as the primary friction point. The M1A1 Abrams enjoys a distinct advantage in frontal armor protection and sabot velocity. However, the T-72s, often spawning in greater numbers, can overwhelm the slower-firing Abrams if they coordinate a "swarm" tactic. The lack of urban cover means that once a tank is tracked or disabled, it is effectively destroyed—there is no retreating into an alleyway for repairs.</p>

      <h4 className="text-lg font-medium text-foreground">Air-to-Ground Coordination</h4>
      <p>The thick fog creates a unique hazard for aviation. Pilots of the A-10 Warthog and Su-25 Frogfoot must fly on instruments or rely on 3D spotting triangles. This forces aircraft dangerously low, within the effective envelope of the ZSU-23-4 Shilka and SA-7 Grail MANPADS. The tactical loop involves Coalition attempting to suppress Iraqi AA to allow A-10s to break the T-72 line, while Iraqi forces attempt to keep their AA umbrella intact to allow SCUDs to fire uninterrupted.</p>
    </div>
  )
};

export default mapData;
