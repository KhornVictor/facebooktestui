'use client';

import React, { useState } from 'react';
import { useNotificationStore } from '@/stores/notification-store';
import { Avatar } from '@/components/ui/Avatar';
import { formatTimeAgo } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  Check,
  Trash2,
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Users,
  Gift,
} from 'lucide-react';

export function NotificationsView() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) =>
    filter === 'unread' ? !n.isRead : true
  );

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'post_reaction':
        return <Heart className="w-3.5 h-3.5 text-white" />;
      case 'comment':
      case 'reply':
        return <MessageCircle className="w-3.5 h-3.5 text-white" />;
      case 'friend_request':
      case 'friend_accepted':
        return <UserPlus className="w-3.5 h-3.5 text-white" />;
      case 'group_activity':
        return <Users className="w-3.5 h-3.5 text-white" />;
      case 'birthday':
        return <Gift className="w-3.5 h-3.5 text-white" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-white" />;
    }
  };

  const getNotifIconBg = (type: string) => {
    switch (type) {
      case 'post_reaction':
        return 'bg-rose-500';
      case 'comment':
      case 'reply':
        return 'bg-emerald-500';
      case 'friend_request':
      case 'friend_accepted':
        return 'bg-[var(--fb-blue)]';
      case 'group_activity':
        return 'bg-purple-500';
      case 'birthday':
        return 'bg-amber-500';
      default:
        return 'bg-zinc-500';
    }
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markAsRead(notif.id);
    if (notif.targetType === 'profile') router.push(`/profile/${notif.actor.username}`);
    else if (notif.targetType === 'group') router.push('/groups');
    else if (notif.targetType === 'conversation') router.push('/messenger');
    else router.push('/home');
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Notifications
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {unreadCount > 0
              ? `You have ${unreadCount} unread ${unreadCount === 1 ? 'notification' : 'notifications'}`
              : 'All caught up!'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--fb-blue)] transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          )}

          <div className="flex bg-[var(--bg-input)] rounded-lg p-1 text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-[var(--bg-surface)] text-[var(--fb-blue)] shadow-xs'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'unread'
                  ? 'bg-[var(--bg-surface)] text-[var(--fb-blue)] shadow-xs'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-1 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden shadow-xs p-2">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-[var(--text-muted)] space-y-2">
            <Bell className="w-10 h-10 mx-auto opacity-30" />
            <p className="font-semibold text-base text-[var(--text-primary)]">
              No notifications to display
            </p>
            <p className="text-xs">When you get updates, they will appear here.</p>
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`group flex items-start justify-between gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                !notif.isRead
                  ? 'bg-[var(--fb-blue-light)]/40 hover:bg-[var(--bg-hover)]'
                  : 'hover:bg-[var(--bg-hover)]'
              }`}
            >
              {/* Avatar + Badge Icon */}
              <div className="relative shrink-0">
                <Avatar src={notif.actor.avatar} alt={notif.actor.name} size="lg" />
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-[var(--bg-surface)] ${getNotifIconBg(
                    notif.type
                  )}`}
                >
                  {getNotifIcon(notif.type)}
                </div>
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0 text-xs sm:text-sm">
                <p className="text-[var(--text-primary)] leading-snug">
                  <span className="font-bold">{notif.actor.name}</span> {notif.message}
                </p>
                <p className={`text-[11px] mt-1 ${!notif.isRead ? 'text-[var(--fb-blue)] font-bold' : 'text-[var(--text-muted)]'}`}>
                  {formatTimeAgo(notif.createdAt)}
                </p>
              </div>

              {/* Status indicator / delete */}
              <div className="flex items-center gap-2">
                {!notif.isRead && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--fb-blue)] shrink-0" />
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                  className="p-1.5 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
