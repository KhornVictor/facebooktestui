'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MemoriesView } from '@/components/memories/MemoriesView';

export default function MemoriesPage() {
  return (
    <MainLayout showSidebar={true} showRightSidebar={false}>
      <div className="w-full">
        <MemoriesView />
      </div>
    </MainLayout>
  );
}
