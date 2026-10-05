'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { MessengerView } from '@/components/messenger/MessengerView';
import { useMessengerStore } from '@/stores/messenger-store';

export default function DirectConversationPage() {
  const params = useParams();
  const conversationId = typeof params?.conversationId === 'string' ? params.conversationId : '';
  const { setActiveConversation } = useMessengerStore();

  useEffect(() => {
    if (conversationId) {
      setActiveConversation(conversationId);
    }
  }, [conversationId, setActiveConversation]);

  return (
    <MainLayout showSidebar={false} showRightSidebar={false}>
      <div className="w-full h-full">
        <MessengerView />
      </div>
    </MainLayout>
  );
}
