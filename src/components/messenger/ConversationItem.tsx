'use client';

import React from 'react';
import { Conversation, User } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { formatTimeAgo } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  const { user } = useAuthStore();

  const partner =
    conversation.participants.find((p) => p.id !== user.id) ||
    conversation.participants[0];

  const title = conversation.isGroup ? conversation.groupName : partner.name;
  const avatar = conversation.isGroup ? conversation.groupAvatar : partner.avatar;
  const isOnline = !conversation.isGroup && partner.isOnline;

  const lastMsg = conversation.lastMessage;
  const isUnread = conversation.unreadCount > 0;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer select-none transition-colors ${
        isActive
          ? 'bg-[var(--fb-blue-light)]'
          : 'hover:bg-[var(--bg-hover)]'
      }`}
    >
      <Avatar src={avatar} alt={title || ''} size="md" isOnline={isOnline} />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between">
          <p
            className={`text-sm truncate ${
              isUnread || isActive
                ? 'font-bold text-[var(--text-primary)]'
                : 'font-medium text-[var(--text-primary)]'
            }`}
          >
            {title}
          </p>

          {lastMsg && (
            <span className="text-[11px] text-[var(--text-muted)] shrink-0 ml-1">
              {formatTimeAgo(lastMsg.createdAt)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-0.5">
          <p
            className={`text-xs truncate ${
              isUnread
                ? 'font-bold text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)]'
            }`}
          >
            {lastMsg ? (
              <>
                {lastMsg.senderId === user.id && 'You: '}
                {lastMsg.text || 'Sent an attachment'}
              </>
            ) : (
              'Started a conversation'
            )}
          </p>

          {isUnread && (
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--fb-blue)] shrink-0 ml-1.5" />
          )}
        </div>
      </div>
    </div>
  );
}
