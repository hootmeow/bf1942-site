import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_weapon_storage',
  name: 'Weapon Storage',
  description: 'Bunker and interior focused combat.',

  content: (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6 text-center">
        <p className="text-lg font-medium text-foreground">Content Coming Soon</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Detailed map information, tactical analysis, and screenshots for Weapon Storage are currently being prepared.
        </p>
      </div>
    </div>
  )
};

export default mapData;
