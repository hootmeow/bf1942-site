import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_battle_of_73_easting',
  name: 'Battle of 73 Easting',
  description: 'Night variant of the famous desert tank engagement.',

  content: (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6 text-center">
        <p className="text-lg font-medium text-foreground">Content Coming Soon</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Detailed map information, tactical analysis, and screenshots for Battle of 73 Easting are currently being prepared.
        </p>
      </div>
    </div>
  )
};

export default mapData;
