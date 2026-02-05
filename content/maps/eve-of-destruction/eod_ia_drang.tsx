import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'eod_ia_drang',
  name: 'Ia Drang Valley',
  description: 'The first major battle between US and NVA forces, featuring intense helicopter air assault operations.',

  galleryImages: [],

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Overview</h3>
      <p>Ia Drang Valley recreates the historic November 1965 battle that marked the first major engagement between US Army forces and the North Vietnamese Army. This map captures the intensity of helicopter-based air assault operations in the Central Highlands of Vietnam.</p>

      <h3 className="text-xl font-semibold text-foreground">Historical Context</h3>
      <p>The Battle of Ia Drang was a turning point in the Vietnam War, demonstrating both the effectiveness of air mobility tactics and the determination of NVA regular forces. The battle took place in the Ia Drang Valley near the Cambodian border.</p>

      <h3 className="text-xl font-semibold text-foreground">Gameplay Features</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Air Assault:</strong> US forces rely heavily on UH-1 Huey helicopters for troop insertion and extraction.</li>
        <li><strong>Dense Jungle:</strong> Heavy vegetation provides cover for NVA ambush tactics.</li>
        <li><strong>Landing Zones:</strong> Control of LZs is critical for US reinforcement and resupply.</li>
        <li><strong>Combined Arms:</strong> Artillery support and close air support play key roles in the battle.</li>
      </ul>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mt-6">
        <p className="text-sm text-muted-foreground italic">This is a placeholder page. Detailed map information coming soon.</p>
      </div>
    </div>
  )
};

export default mapData;
