'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SavedView } from '@/components/saved/SavedView';

export default function SavedPage() {
  return (
    <MainLayout showSidebar={true} showRightSidebar={false}>
      <div className="w-full">
        <SavedView />
      </div>
    </MainLayout>
  );
}
