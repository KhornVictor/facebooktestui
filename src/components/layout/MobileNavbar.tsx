'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMessengerStore } from '@/stores/messenger-store';
import { useNotificationStore } from '@/stores/notification-store';
import { useFriendStore } from '@/stores/friend-store';
import { Home, Users, MessageCircle, Bell, Store, Menu } from 'lucide-react';

export function MobileNavbar() {
  const pathname = usePathname();
  const { conversations } = useMessengerStore();
  const { unreadCount: notifUnread } = useNotificationStore();
  const { friendRequests } = useFriendStore();

  const unreadMessagesCount = conversations.reduce(
    (acc, c) => acc + (c.unreadCount || 0),
    0
  );

  const mobileNavItems = [
    { label: 'Home', href: '/home', icon: Home },
    { label: 'Friends', href: '/friends', icon: Users, badge: friendRequests.length },
    { label: 'Messenger', href: '/messenger', icon: MessageCircle, badge: unreadMessagesCount },
    { label: 'Notifications', href: '/notifications', icon: Bell, badge: notifUnread },
    { label: 'Market', href: '/marketplace', icon: Store },
    { label: 'Menu', href: '/settings', icon: Menu },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] h-14 flex items-center justify-around px-2 select-none shadow-lg">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
              isActive
                ? 'text-[var(--fb-blue)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-bold px-1 py-0.2 rounded-full min-w-3.5 text-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
