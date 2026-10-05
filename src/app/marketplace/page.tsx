'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MarketplaceView } from '@/components/marketplace/MarketplaceView';

export default function MarketplacePage() {
  return (
    <MainLayout showSidebar={true} showRightSidebar={false}>
      <div className="w-full">
        <MarketplaceView />
      </div>
    </MainLayout>
  );
}
