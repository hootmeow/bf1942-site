import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_battle_of_73_easting',
  name: 'Battle of 73 Easting',
  description: 'Night variant of the famous desert tank engagement with reduced visibility and intensified armor warfare.',

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Info</h3>
      <p><strong>Operational Context:</strong> Night variant based on the decisive armored engagement of February 26, 1991, during Operation Desert Storm.</p>
      <p><strong>Environment:</strong> Nighttime sandstorm conditions with severely reduced visibility.</p>
      <p><strong>Grid Topography:</strong> Rolling dunes with minimal vertical obstruction; sparse vegetation.</p>

      <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 my-4">
        <p className="font-semibold text-purple-400 mb-2">Night Variant Features</p>
        <p className="text-sm">This is the night version of 73 Easting, combining the sandstorm fog with darkness for extremely limited visibility. Muzzle flashes become the primary target indicator, and tanks often fire blindly at the source of tracers.</p>
      </div>

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

      <h3 className="text-xl font-semibold text-foreground">Night Combat Dynamics</h3>
      <p>In the night variant, visibility is reduced to near-zero. The primitive Night Vision Goggles implementation (a green filter overlay) becomes essential. Muzzle flashes become the primary target indicator—tanks engaging in the dark often fire blindly at the source of tracers.</p>

      <h4 className="text-lg font-medium text-foreground">Air Support Hazards</h4>
      <p>Air support in the night map is incredibly hazardous due to the inability to see terrain features, leading to high rates of pilot error and crashes. Only the most experienced pilots should attempt close air support runs.</p>

      <h4 className="text-lg font-medium text-foreground">The SCUD Threat Intensified</h4>
      <p>The SCUD launcher becomes even more dangerous at night—its launch signature is visible map-wide, but tracking it back to source in the darkness is nearly impossible without coordinated recon.</p>
    </div>
  )
};

export default mapData;
