import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'fh_elalamein',
  name: 'El Alamein',
  description: 'The decisive North African battle that turned the tide against Rommel\'s Afrika Korps.',

  galleryImages: [],

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Overview</h3>
      <p>Fight in the decisive Second Battle of El Alamein (October-November 1942), where Montgomery's Eighth Army broke through Rommel's defenses and began the liberation of North Africa from Axis forces.</p>

      <h3 className="text-xl font-semibold text-foreground">Historical Context</h3>
      <p>El Alamein marked the turning point of the North African Campaign. Churchill famously said, "Before Alamein we never had a victory. After Alamein we never had a defeat." The battle featured massive artillery barrages and tank engagements across the desert.</p>

      <h3 className="text-xl font-semibold text-foreground">Gameplay Features</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Desert Warfare:</strong> Open terrain with scattered defensive positions.</li>
        <li><strong>Mine Fields:</strong> Extensive minefields channel armored advances.</li>
        <li><strong>Tank Battles:</strong> Shermans, Grants, and Crusaders vs Panzer IIIs and IVs.</li>
        <li><strong>Artillery Support:</strong> Massive barrages soften enemy positions.</li>
      </ul>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mt-6">
        <p className="text-sm text-muted-foreground italic">This is a placeholder page. Detailed map information coming soon.</p>
      </div>
    </div>
  )
};

export default mapData;
