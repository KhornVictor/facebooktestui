'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { GroupsView } from '@/components/groups/GroupsView';

export default function GroupDetailPage() {
  return (
    <MainLayout showSidebar={true} showRightSidebar={false}>
      <div className="w-full">
        <GroupsView />
      </div>
    </MainLayout>
  );
}
