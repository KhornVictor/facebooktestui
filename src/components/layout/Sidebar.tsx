'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Avatar } from '@/components/ui/Avatar';
import {
  Users,
  Store,
  Calendar,
  Clock,
  Bookmark,
  Settings,
  Users2,
  Tv,
  Video,
  ChevronDown,
} from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { setLiveStreamModalOpen } = useUIStore();

  const links = [
    { label: user.name, href: `/profile/${user.username}`, avatar: user.avatar },
    { label: 'Friends', href: '/friends', icon: Users, color: 'text-sky-500' },
    { label: 'Groups', href: '/groups', icon: Users2, color: 'text-blue-600' },
    { label: 'Marketplace', href: '/marketplace', icon: Store, color: 'text-emerald-500' },
    { label: 'Saved', href: '/saved', icon: Bookmark, color: 'text-purple-500' },
    { label: 'Memories', href: '/memories', icon: Clock, color: 'text-amber-500' },
    { label: 'Events', href: '/events', icon: Calendar, color: 'text-rose-500' },
    { label: 'Settings', href: '/settings', icon: Settings, color: 'text-zinc-500' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-[calc(100vh-3.5rem)] sticky top-14 py-3 px-2 overflow-y-auto select-none shrink-0 border-r border-transparent">
      {/* Navigation Links */}
      <div className="space-y-0.5">
        {links.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-[var(--bg-hover)] text-[var(--fb-blue)]'
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {item.avatar ? (
                <Avatar src={item.avatar} alt={item.label} size="sm" />
              ) : item.icon ? (
                <item.icon className={`w-6 h-6 ${item.color}`} />
              ) : null}
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        {/* Live Video Studio Button */}
        <button
          type="button"
          onClick={() => setLiveStreamModalOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-[var(--text-primary)] hover:bg-[var(--bg-hover)] text-left cursor-pointer"
        >
          <div className="w-6 h-6 flex items-center justify-center text-rose-500">
            <Video className="w-5 h-5" />
          </div>
          <span className="flex-1 truncate">Live Video</span>
          <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black tracking-wider animate-pulse">
            LIVE
          </span>
        </button>
      </div>

      <div className="h-[1px] bg-[var(--border-subtle)] my-3 mx-2" />

      {/* Your Shortcuts */}
      <div className="px-3">
        <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
          Your Shortcuts
        </h4>
        <div className="space-y-1">
          <Link
            href="/groups"
            className="flex items-center gap-3 py-2 px-1 rounded-lg hover:bg-[var(--bg-hover)] text-xs font-medium transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold text-xs">
              FA
            </div>
            <span className="truncate">Frontend Architecture Guild</span>
          </Link>
          <Link
            href="/events"
            className="flex items-center gap-3 py-2 px-1 rounded-lg hover:bg-[var(--bg-hover)] text-xs font-medium transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center font-bold text-xs">
              NW
            </div>
            <span className="truncate">Next.js Web Summit 2026</span>
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto px-3 pt-4 text-[11px] text-[var(--text-muted)] space-y-1">
        <p>Privacy • Terms • Advertising • Cookies • Meta © 2026</p>
      </div>
    </aside>
  );
}
