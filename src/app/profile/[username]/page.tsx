'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProfileView } from '@/components/profile/ProfileView';
import { getUserByUsername, currentUser } from '@/data/users';

export default function ProfilePage() {
  const params = useParams();
  const username = typeof params?.username === 'string' ? params.username : '';

  const foundUser = getUserByUsername(username) || currentUser;

  return (
    <MainLayout showSidebar={false} showRightSidebar={false}>
      <div className="w-full">
        <ProfileView profileUser={foundUser} />
      </div>
    </MainLayout>
  );
}
