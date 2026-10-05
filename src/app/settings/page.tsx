'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SettingsView } from '@/components/settings/SettingsView';

export default function SettingsPage() {
  return (
    <MainLayout showSidebar={true} showRightSidebar={false}>
      <div className="w-full">
        <SettingsView />
      </div>
    </MainLayout>
  );
}
