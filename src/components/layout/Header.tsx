'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationStore } from '@/stores/notification-store';
import { useMessengerStore } from '@/stores/messenger-store';
import { useFriendStore } from '@/stores/friend-store';
import { useUIStore } from '@/stores/ui-store';
import { Avatar } from '@/components/ui/Avatar';
import { mockUsers } from '@/data/users';
import { mockGroups } from '@/data/groups';
import { mockMarketplaceItems } from '@/data/marketplace';
import { formatTimeAgo } from '@/lib/utils';
import {
  Search,
  Home,
  Users,
  Store,
  MessageCircle,
  Bell,
  Menu,
  Moon,
  Sun,
  LogOut,
  Settings as SettingsIcon,
  Bookmark,
  Calendar,
  Clock,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout, isAuthenticated } = useAuthStore();
  const { notifications, unreadCount: unreadNotifs, markAsRead, markAllAsRead } = useNotificationStore();
  const { conversations, markConversationAsRead, setActiveConversation } = useMessengerStore();
  const { friendRequests } = useFriendStore();
  const { theme, setTheme, setMobileMenuOpen } = useUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'profile' | 'notifications' | 'messenger' | 'menu' | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate unread messenger count
  const unreadMessagesCount = conversations.reduce(
    (acc, c) => acc + (c.unreadCount || 0),
    0
  );

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results
  const filteredUsers = searchQuery.trim()
    ? mockUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.username.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const filteredGroups = searchQuery.trim()
    ? mockGroups.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const filteredMarket = searchQuery.trim()
    ? mockMarketplaceItems.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    { label: 'Home', href: '/home', icon: Home },
    { label: 'Friends', href: '/friends', icon: Users, badge: friendRequests.length },
    { label: 'Messenger', href: '/messenger', icon: MessageCircle, badge: unreadMessagesCount },
    { label: 'Marketplace', href: '/marketplace', icon: Store },
    { label: 'Groups', href: '/groups', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 h-14 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-4 flex items-center justify-between select-none shadow-xs">
      {/* Left: Logo & Search */}
      <div className="flex items-center gap-2">
        <Link href="/home" className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[var(--fb-blue)] text-white font-black text-2xl flex items-center justify-center hover:opacity-95 transition-opacity">
            f
          </div>
        </Link>

        {/* Search bar with dropdown */}
        <div ref={searchRef} className="relative">
          <div className="flex items-center bg-[var(--bg-input)] hover:bg-[var(--bg-hover)] rounded-full px-3 py-2 transition-colors w-10 sm:w-60 md:w-64">
            <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
            <input
              type="text"
              placeholder="Search Facebook"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="bg-transparent text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden ml-2 w-full hidden sm:block"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearchOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 bg-[var(--bg-surface)] rounded-xl shadow-2xl border border-[var(--border-subtle)] p-2 z-50 animate-pop-in max-h-96 overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div className="p-3 text-xs text-[var(--text-muted)]">
                  <p className="font-semibold text-[var(--text-secondary)] mb-2">Recent Searches</p>
                  <div className="space-y-1">
                    <p
                      onClick={() => setSearchQuery('Alice')}
                      className="cursor-pointer hover:bg-[var(--bg-hover)] p-1.5 rounded"
                    >
                      🔍 Alice Johnson
                    </p>
                    <p
                      onClick={() => setSearchQuery('Frontend')}
                      className="cursor-pointer hover:bg-[var(--bg-hover)] p-1.5 rounded"
                    >
                      🔍 Frontend Architecture Guild
                    </p>
                    <p
                      onClick={() => setSearchQuery('MacBook')}
                      className="cursor-pointer hover:bg-[var(--bg-hover)] p-1.5 rounded"
                    >
                      🔍 Apple MacBook Pro
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* People */}
                  {filteredUsers.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider px-2 mb-1">
                        People
                      </p>
                      {filteredUsers.map((u) => (
                        <Link
                          key={u.id}
                          href={`/profile/${u.username}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                        >
                          <Avatar src={u.avatar} alt={u.name} size="sm" isOnline={u.isOnline} />
                          <div className="overflow-hidden">
                            <p className="text-xs font-semibold truncate">{u.name}</p>
                            <p className="text-[10px] text-[var(--text-muted)]">@{u.username}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Groups */}
                  {filteredGroups.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider px-2 mb-1">
                        Groups
                      </p>
                      {filteredGroups.map((g) => (
                        <Link
                          key={g.id}
                          href="/groups"
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                        >
                          <Avatar src={g.avatar} alt={g.name} size="sm" />
                          <div className="overflow-hidden">
                            <p className="text-xs font-semibold truncate">{g.name}</p>
                            <p className="text-[10px] text-[var(--text-muted)]">
                              {g.memberCount.toLocaleString()} members
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Marketplace */}
                  {filteredMarket.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider px-2 mb-1">
                        Marketplace
                      </p>
                      {filteredMarket.map((m) => (
                        <Link
                          key={m.id}
                          href="/marketplace"
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                        >
                          <img
                            src={m.image}
                            alt={m.title}
                            className="w-8 h-8 rounded-md object-cover"
                          />
                          <div className="overflow-hidden">
                            <p className="text-xs font-semibold truncate">{m.title}</p>
                            <p className="text-[10px] font-bold text-[var(--fb-blue)]">
                              ${m.price}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {filteredUsers.length === 0 &&
                    filteredGroups.length === 0 &&
                    filteredMarket.length === 0 && (
                      <p className="p-4 text-center text-xs text-[var(--text-muted)]">
                        No results found for &quot;{searchQuery}&quot;
                      </p>
                    )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center: Main Navigation Icons (Desktop/Tablet) */}
      <nav className="hidden md:flex items-center justify-center flex-1 max-w-xl h-full px-4 gap-1">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex-1 h-full flex items-center justify-center rounded-lg transition-colors group ${
                isActive
                  ? 'text-[var(--fb-blue)] border-b-4 border-[var(--fb-blue)] rounded-b-none'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
              title={item.label}
            >
              <div className="relative">
                <Icon className={`w-7 h-7 ${isActive ? 'stroke-[2.5]' : ''}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-[var(--bg-surface)]">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                ) : null}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Right: Actions, Notifications, Profile, Theme */}
      <div ref={dropdownRef} className="flex items-center gap-2">
        {/* Menu Shortcuts */}
        <button
          type="button"
          onClick={() =>
            setActiveDropdown(activeDropdown === 'menu' ? null : 'menu')
          }
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            activeDropdown === 'menu'
              ? 'bg-[var(--fb-blue-light)] text-[var(--fb-blue)]'
              : 'bg-[var(--bg-hover)] text-[var(--text-primary)] hover:bg-[var(--bg-active)]'
          }`}
          title="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Messenger Icon + Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setActiveDropdown(activeDropdown === 'messenger' ? null : 'messenger')
            }
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              activeDropdown === 'messenger'
                ? 'bg-[var(--fb-blue-light)] text-[var(--fb-blue)]'
                : 'bg-[var(--bg-hover)] text-[var(--text-primary)] hover:bg-[var(--bg-active)]'
            }`}
            title="Messenger"
          >
            <MessageCircle className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
              </span>
            )}
          </button>

          {activeDropdown === 'messenger' && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[var(--bg-surface)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] p-3 z-50 animate-pop-in">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <h3 className="font-bold text-lg text-[var(--text-primary)]">Chats</h3>
                <Link
                  href="/messenger"
                  onClick={() => setActiveDropdown(null)}
                  className="text-xs font-semibold text-[var(--fb-blue)] hover:underline"
                >
                  See all in Messenger
                </Link>
              </div>

              <div className="max-h-80 overflow-y-auto mt-2 space-y-1">
                {conversations.slice(0, 6).map((conv) => {
                  const partner =
                    conv.participants.find((p) => p.id !== user.id) ||
                    conv.participants[0];
                  const title = conv.isGroup ? conv.groupName : partner.name;
                  const avatar = conv.isGroup ? conv.groupAvatar : partner.avatar;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        markConversationAsRead(conv.id);
                        setActiveConversation(conv.id);
                        setActiveDropdown(null);
                        router.push(`/messenger`);
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-hover)] cursor-pointer transition-colors"
                    >
                      <Avatar
                        src={avatar}
                        alt={title || ''}
                        size="md"
                        isOnline={!conv.isGroup && partner.isOnline}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="text-sm font-semibold truncate text-[var(--text-primary)]">
                            {title}
                          </p>
                          {conv.lastMessage && (
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {formatTimeAgo(conv.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                          {conv.lastMessage?.text || 'Sent an attachment'}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--fb-blue)] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon + Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setActiveDropdown(activeDropdown === 'notifications' ? null : 'notifications')
            }
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              activeDropdown === 'notifications'
                ? 'bg-[var(--fb-blue-light)] text-[var(--fb-blue)]'
                : 'bg-[var(--bg-hover)] text-[var(--text-primary)] hover:bg-[var(--bg-active)]'
            }`}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {unreadNotifs > 9 ? '9+' : unreadNotifs}
              </span>
            )}
          </button>

          {activeDropdown === 'notifications' && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[var(--bg-surface)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] p-3 z-50 animate-pop-in">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <h3 className="font-bold text-lg text-[var(--text-primary)]">Notifications</h3>
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-[var(--fb-blue)] hover:underline flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto mt-2 space-y-1">
                {notifications.slice(0, 6).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markAsRead(notif.id);
                      setActiveDropdown(null);
                      if (notif.targetType === 'profile') router.push(`/profile/${notif.actor.username}`);
                      else if (notif.targetType === 'group') router.push('/groups');
                      else if (notif.targetType === 'conversation') router.push('/messenger');
                      else router.push('/home');
                    }}
                    className={`flex items-start gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                      !notif.isRead ? 'bg-[var(--fb-blue-light)]/40 hover:bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <Avatar src={notif.actor.avatar} alt={notif.actor.name} size="md" />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="text-[var(--text-primary)] leading-snug">
                        <span className="font-bold">{notif.actor.name}</span> {notif.message}
                      </p>
                      <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                        {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-[var(--fb-blue)] shrink-0 mt-2" />
                    )}
                  </div>
                ))}
              </div>

              <Link
                href="/notifications"
                onClick={() => setActiveDropdown(null)}
                className="block text-center text-xs font-bold text-[var(--fb-blue)] mt-2 pt-2 border-t border-[var(--border-subtle)] hover:underline"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        {/* Profile Avatar + Menu Dropdown */}
        <div className="relative">
          <div
            onClick={() =>
              setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')
            }
            className="cursor-pointer"
          >
            <Avatar src={user.avatar} alt={user.name} size="md" className="ring-2 ring-transparent hover:ring-[var(--fb-blue)]" />
          </div>

          {activeDropdown === 'profile' && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--bg-surface)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] p-3 z-50 animate-pop-in space-y-2">
              {/* Profile Card */}
              <Link
                href={`/profile/${user.username}`}
                onClick={() => setActiveDropdown(null)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-colors border border-[var(--border-subtle)] shadow-xs"
              >
                <Avatar src={user.avatar} alt={user.name} size="lg" />
                <div className="overflow-hidden">
                  <p className="font-bold text-sm text-[var(--text-primary)] truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">See your profile</p>
                </div>
              </Link>

              {/* Theme Switcher */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-main)]">
                <span className="text-xs font-bold flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  Theme
                </span>
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="px-2.5 py-1 rounded-full bg-[var(--bg-hover)] text-xs font-bold transition-colors hover:bg-[var(--bg-active)]"
                >
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </button>
              </div>

              {/* Settings Link */}
              <Link
                href="/settings"
                onClick={() => setActiveDropdown(null)}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-hover)] text-xs font-semibold text-[var(--text-primary)] transition-colors"
              >
                <SettingsIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                Settings & Privacy
              </Link>

              {/* Saved Link */}
              <Link
                href="/saved"
                onClick={() => setActiveDropdown(null)}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-hover)] text-xs font-semibold text-[var(--text-primary)] transition-colors"
              >
                <Bookmark className="w-4 h-4 text-[var(--text-secondary)]" />
                Saved Items
              </Link>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          )}
        </div>

        {/* Menu Grid Dropdown */}
        {activeDropdown === 'menu' && (
          <div className="absolute right-4 top-14 mt-2 w-80 bg-[var(--bg-surface)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] p-4 z-50 animate-pop-in space-y-3">
            <h3 className="font-bold text-base">Menu & Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/events"
                onClick={() => setActiveDropdown(null)}
                className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-[var(--bg-hover)] font-semibold transition-colors"
              >
                <Calendar className="w-5 h-5 text-rose-500" />
                Events
              </Link>
              <Link
                href="/memories"
                onClick={() => setActiveDropdown(null)}
                className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-[var(--bg-hover)] font-semibold transition-colors"
              >
                <Clock className="w-5 h-5 text-blue-500" />
                Memories
              </Link>
              <Link
                href="/saved"
                onClick={() => setActiveDropdown(null)}
                className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-[var(--bg-hover)] font-semibold transition-colors"
              >
                <Bookmark className="w-5 h-5 text-purple-500" />
                Saved
              </Link>
              <Link
                href="/settings"
                onClick={() => setActiveDropdown(null)}
                className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-[var(--bg-hover)] font-semibold transition-colors"
              >
                <SettingsIcon className="w-5 h-5 text-zinc-500" />
                Settings
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
