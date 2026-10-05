'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MessengerView } from '@/components/messenger/MessengerView';

export default function MessengerPage() {
  return (
    <MainLayout showSidebar={false} showRightSidebar={false}>
      <div className="w-full h-full">
        <MessengerView />
      </div>
    </MainLayout>
  );
}
