'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FriendsView } from '@/components/friends/FriendsView';

export default function FriendsPage() {
  return (
    <MainLayout showSidebar={true} showRightSidebar={false}>
      <div className="w-full">
        <FriendsView />
      </div>
    </MainLayout>
  );
}
