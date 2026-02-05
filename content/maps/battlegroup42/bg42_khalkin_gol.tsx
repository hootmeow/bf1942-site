import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'bg42_khalkin_gol',
  name: 'Khalkin Gol',
  description: 'The 1939 Soviet-Japanese border conflict featuring early war tanks and aircraft on the Mongolian steppe.',

  galleryImages: [],

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Overview</h3>
      <p>Khalkin Gol recreates the 1939 border war between the Soviet Union and Imperial Japan on the Mongolian-Manchurian frontier. This often-overlooked conflict featured massive tank battles and fierce aerial combat.</p>

      <h3 className="text-xl font-semibold text-foreground">Historical Context</h3>
      <p>The Battles of Khalkin Gol (May-September 1939) were decisive engagements that influenced Japan's decision to strike south toward the Pacific rather than north against the Soviet Union. Soviet forces under Georgy Zhukov delivered a crushing defeat to the Japanese Kwantung Army.</p>

      <h3 className="text-xl font-semibold text-foreground">Gameplay Features</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Open Steppe:</strong> Wide-open terrain favors armor and mobile warfare.</li>
        <li><strong>Early War Tanks:</strong> BT-7s and Type 95 Ha-Go light tanks clash on the plains.</li>
        <li><strong>Air Superiority:</strong> I-16 fighters battle Ki-27s for control of the skies.</li>
        <li><strong>Combined Arms:</strong> Infantry, armor, and aircraft must work together.</li>
      </ul>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mt-6">
        <p className="text-sm text-muted-foreground italic">This is a placeholder page. Detailed map information coming soon.</p>
      </div>
    </div>
  )
};

export default mapData;
