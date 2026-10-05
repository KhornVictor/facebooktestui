'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { NotificationsView } from '@/components/notifications/NotificationsView';

export default function NotificationsPage() {
  return (
    <MainLayout showSidebar={true} showRightSidebar={false}>
      <div className="w-full">
        <NotificationsView />
      </div>
    </MainLayout>
  );
}
