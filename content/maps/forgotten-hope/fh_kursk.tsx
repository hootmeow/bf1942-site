import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'fh_kursk',
  name: 'Kursk',
  description: 'The largest tank battle in history on the Eastern Front in summer 1943.',

  galleryImages: [],

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Overview</h3>
      <p>Experience the Battle of Kursk (July-August 1943), the largest tank battle in military history. German forces attempt to eliminate the Kursk salient while Soviet defenders prepare massive fortifications and armored reserves.</p>

      <h3 className="text-xl font-semibold text-foreground">Historical Context</h3>
      <p>Operation Citadel was Germany's last major offensive on the Eastern Front. Despite deploying new Tiger and Panther tanks, the Wehrmacht failed to break through Soviet defenses in depth. The resulting Soviet counteroffensive began the liberation of Ukraine.</p>

      <h3 className="text-xl font-semibold text-foreground">Gameplay Features</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Massive Armor:</strong> Tigers, Panthers, and Ferdinand tank destroyers vs T-34s and KV-1s.</li>
        <li><strong>Defense in Depth:</strong> Multiple Soviet defensive lines with anti-tank positions.</li>
        <li><strong>Air Battles:</strong> IL-2 Sturmoviks vs Fw 190s in the skies above.</li>
        <li><strong>Open Steppe:</strong> Rolling terrain perfect for large-scale tank engagements.</li>
      </ul>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mt-6">
        <p className="text-sm text-muted-foreground italic">This is a placeholder page. Detailed map information coming soon.</p>
      </div>
    </div>
  )
};

export default mapData;
