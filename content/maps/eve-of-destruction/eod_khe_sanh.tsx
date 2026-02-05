import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'eod_khe_sanh',
  name: 'Khe Sanh',
  description: 'The famous 77-day siege of the remote Marine combat base near the DMZ.',

  galleryImages: [],

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Overview</h3>
      <p>Khe Sanh recreates the legendary 77-day siege of the isolated US Marine combat base near the Demilitarized Zone. Defend or assault one of the most heavily fortified positions in Vietnam War history.</p>

      <h3 className="text-xl font-semibold text-foreground">Historical Context</h3>
      <p>The Siege of Khe Sanh (January-July 1968) saw approximately 6,000 Marines and South Vietnamese Rangers hold off an estimated 20,000+ NVA troops. The base was resupplied entirely by air during the siege.</p>

      <h3 className="text-xl font-semibold text-foreground">Gameplay Features</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Siege Warfare:</strong> Defensive positions and bunkers are critical for the US/ARVN forces.</li>
        <li><strong>Air Resupply:</strong> Helicopters and cargo planes provide vital reinforcement.</li>
        <li><strong>Artillery Duels:</strong> Both sides employ heavy artillery bombardment.</li>
        <li><strong>Hill Battles:</strong> Surrounding hills provide strategic observation and fire positions.</li>
      </ul>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mt-6">
        <p className="text-sm text-muted-foreground italic">This is a placeholder page. Detailed map information coming soon.</p>
      </div>
    </div>
  )
};

export default mapData;
