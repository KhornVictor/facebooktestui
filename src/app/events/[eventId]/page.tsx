'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { EventsView } from '@/components/events/EventsView';

export default function EventDetailPage() {
  return (
    <MainLayout showSidebar={true} showRightSidebar={false}>
      <div className="w-full">
        <EventsView />
      </div>
    </MainLayout>
  );
}
