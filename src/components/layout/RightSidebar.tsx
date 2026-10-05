'use client';

import React from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useMessengerStore } from '@/stores/messenger-store';
import { mockUsers } from '@/data/users';
import { Avatar } from '@/components/ui/Avatar';
import { Gift, Video, Search, MoreHorizontal, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function RightSidebar() {
  const { user } = useAuthStore();
  const { setActiveFloatingChat, getOrCreateConversationWithUser } = useMessengerStore();

  // Contacts: all users except logged in user
  const contacts = mockUsers.filter((u) => u.id !== user.id);

  const handleContactClick = (contactUser: typeof contacts[0]) => {
    getOrCreateConversationWithUser(contactUser);
    setActiveFloatingChat(contactUser.id);
  };

  return (
    <aside className="hidden xl:flex flex-col w-72 2xl:w-80 h-[calc(100vh-3.5rem)] sticky top-14 py-3 px-3 overflow-y-auto select-none shrink-0 border-l border-transparent">
      {/* Sponsored Section */}
      <div className="space-y-3 pb-3 border-b border-[var(--border-subtle)]">
        <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Sponsored
        </h4>

        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-colors group"
        >
          <img
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80"
            alt="Next.js"
            className="w-24 h-24 rounded-lg object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-[var(--text-primary)] group-hover:underline line-clamp-2">
              Next.js 16 Enterprise Architecture
            </p>
            <p className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
              nextjs.org <ExternalLink className="w-2.5 h-2.5" />
            </p>
          </div>
        </a>

        <a
          href="https://tailwindcss.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-colors group"
        >
          <img
            src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=150&auto=format&fit=crop&q=80"
            alt="Tailwind CSS"
            className="w-24 h-24 rounded-lg object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-[var(--text-primary)] group-hover:underline line-clamp-2">
              Modern Styling with Tailwind v4
            </p>
            <p className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-1">
              tailwindcss.com <ExternalLink className="w-2.5 h-2.5" />
            </p>
          </div>
        </a>
      </div>

      {/* Birthdays Section */}
      <div className="py-3 border-b border-[var(--border-subtle)]">
        <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
          Birthdays
        </h4>
        <Link
          href="/friends"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-500 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <p className="text-xs text-[var(--text-primary)] leading-tight">
            <span className="font-bold">Diana Prince</span> and <span className="font-bold">1 other</span> have birthdays today.
          </p>
        </Link>
      </div>

      {/* Contacts List */}
      <div className="pt-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-1 px-2">
          <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Contacts ({contacts.filter((c) => c.isOnline).length} online)
          </h4>
          <div className="flex items-center gap-1 text-[var(--text-muted)]">
            <button className="p-1 rounded-full hover:bg-[var(--bg-hover)]">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-1 rounded-full hover:bg-[var(--bg-hover)]">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-0.5 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleContactClick(contact)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-hover)] cursor-pointer transition-colors"
            >
              <Avatar
                src={contact.avatar}
                alt={contact.name}
                size="sm"
                isOnline={contact.isOnline}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                  {contact.name}
                </p>
                {!contact.isOnline && contact.lastActive && (
                  <p className="text-[10px] text-[var(--text-muted)]">{contact.lastActive}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
