import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'bg42_shanghai',
  name: 'Shanghai',
  description: 'Urban warfare in 1937 Shanghai during the Second Sino-Japanese War.',

  galleryImages: [],

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Overview</h3>
      <p>Fight through the streets of Shanghai during the 1937 Battle of Shanghai, one of the largest and bloodiest battles of the Second Sino-Japanese War. Chinese National Revolutionary Army forces defend the city against the Imperial Japanese Army.</p>

      <h3 className="text-xl font-semibold text-foreground">Historical Context</h3>
      <p>The Battle of Shanghai (August-November 1937) was one of the first major engagements of the Second Sino-Japanese War. The three-month battle resulted in massive casualties on both sides and demonstrated China's determination to resist Japanese aggression.</p>

      <h3 className="text-xl font-semibold text-foreground">Gameplay Features</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Urban Combat:</strong> Street fighting through Shanghai's dense urban environment.</li>
        <li><strong>Chinese Forces:</strong> NRA troops with German-trained elite units.</li>
        <li><strong>Japanese Assault:</strong> Combined land, sea, and air attack on the city.</li>
        <li><strong>River Crossings:</strong> Suzhou Creek provides a natural defensive line.</li>
      </ul>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mt-6">
        <p className="text-sm text-muted-foreground italic">This is a placeholder page. Detailed map information coming soon.</p>
      </div>
    </div>
  )
};

export default mapData;
