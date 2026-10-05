'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import {
  User,
  Shield,
  Bell,
  Palette,
  Eye,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';

type SectionType = 'account' | 'privacy' | 'notifications' | 'appearance' | 'accessibility';

export function SettingsView() {
  const { theme, setTheme, settings, updateSettings, showToast } = useUIStore();
  const { user, updateProfile } = useAuthStore();

  const [activeSection, setActiveSection] = useState<SectionType>('account');

  // Account form state
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email || '');
  const [location, setLocation] = useState(user.location || '');
  const [workplace, setWorkplace] = useState(user.workplace || '');

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, username, email, location, workplace });
    showToast('Account details updated!', 'success');
  };

  const navItems: Array<{ id: SectionType; label: string; icon: React.ElementType }> = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 select-none">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-4 space-y-2">
          <h1 className="text-2xl font-bold px-3 pb-2 text-[var(--text-primary)]">
            Settings
          </h1>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors text-left ${
                    isActive
                      ? 'bg-[var(--fb-blue-light)] text-[var(--fb-blue)]'
                      : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content Pane */}
        <div className="md:col-span-8 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 shadow-xs">
          {/* ACCOUNT SECTION */}
          {activeSection === 'account' && (
            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Account Information
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Update your personal profile information.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] text-xs text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-hidden focus:ring-1 focus:ring-[var(--fb-blue)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] text-xs text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-hidden focus:ring-1 focus:ring-[var(--fb-blue)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] text-xs text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-hidden focus:ring-1 focus:ring-[var(--fb-blue)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
                    Workplace
                  </label>
                  <input
                    type="text"
                    value={workplace}
                    onChange={(e) => setWorkplace(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] text-xs text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-hidden focus:ring-1 focus:ring-[var(--fb-blue)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] text-xs text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-hidden focus:ring-1 focus:ring-[var(--fb-blue)]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* PRIVACY SECTION */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Privacy Settings
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Manage who can see your content and interact with you.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[var(--bg-main)] rounded-xl">
                  <div>
                    <p className="text-xs font-bold">Who can see your future posts?</p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Default audience for posts you create.
                    </p>
                  </div>
                  <select
                    value={settings.privacyPosts}
                    onChange={(e) =>
                      updateSettings({ privacyPosts: e.target.value as 'public' | 'friends' | 'only_me' })
                    }
                    className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-xs border border-[var(--border-subtle)] font-medium"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends</option>
                    <option value="only_me">Only Me</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--bg-main)] rounded-xl">
                  <div>
                    <p className="text-xs font-bold">Who can send you friend requests?</p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Control who can add you as a friend.
                    </p>
                  </div>
                  <select
                    value={settings.privacyRequests}
                    onChange={(e) =>
                      updateSettings({ privacyRequests: e.target.value as 'everyone' | 'friends_of_friends' })
                    }
                    className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-xs border border-[var(--border-subtle)] font-medium"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="friends_of_friends">Friends of Friends</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--bg-main)] rounded-xl">
                  <div>
                    <p className="text-xs font-bold">Who can message you on Messenger?</p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Allow direct incoming chat requests.
                    </p>
                  </div>
                  <select
                    value={settings.privacyMessages}
                    onChange={(e) =>
                      updateSettings({ privacyMessages: e.target.value as 'everyone' | 'friends' })
                    }
                    className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-xs border border-[var(--border-subtle)] font-medium"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="friends">Friends Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS SECTION */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Notification Preferences
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Choose which notifications you want to receive.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[var(--bg-main)] rounded-xl">
                  <div>
                    <p className="text-xs font-bold">Push Notifications</p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Receive alerts on browser when someone reacts or comments.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notificationsPush}
                    onChange={(e) =>
                      updateSettings({ notificationsPush: e.target.checked })
                    }
                    className="w-4 h-4 accent-[var(--fb-blue)] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--bg-main)] rounded-xl">
                  <div>
                    <p className="text-xs font-bold">Messenger Sound & Alerts</p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Play chime when receiving chat messages.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notificationsMessenger}
                    onChange={(e) =>
                      updateSettings({ notificationsMessenger: e.target.checked })
                    }
                    className="w-4 h-4 accent-[var(--fb-blue)] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--bg-main)] rounded-xl">
                  <div>
                    <p className="text-xs font-bold">Email Digest</p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Receive weekly summary emails.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notificationsEmail}
                    onChange={(e) =>
                      updateSettings({ notificationsEmail: e.target.checked })
                    }
                    className="w-4 h-4 accent-[var(--fb-blue)] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* APPEARANCE SECTION */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Appearance
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Customize the look and feel of your Facebook experience.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {([
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'system', label: 'System', icon: Laptop },
                ] as const).map((item) => {
                  const Icon = item.icon;
                  const isSelected = theme === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTheme(item.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-[var(--fb-blue)] bg-[var(--fb-blue-light)] text-[var(--fb-blue)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-main)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACCESSIBILITY SECTION */}
          {activeSection === 'accessibility' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Accessibility
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Tailor fonts and animations to your viewing preferences.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[var(--bg-main)] rounded-xl">
                  <div>
                    <p className="text-xs font-bold">Font Size</p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Adjust display text scaling.
                    </p>
                  </div>
                  <select
                    value={settings.fontSize}
                    onChange={(e) =>
                      updateSettings({ fontSize: e.target.value as 'small' | 'medium' | 'large' })
                    }
                    className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-xs border border-[var(--border-subtle)] font-medium"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium (Default)</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--bg-main)] rounded-xl">
                  <div>
                    <p className="text-xs font-bold">Reduce Motion</p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Minimize floating animations and bounce effects.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) =>
                      updateSettings({ reducedMotion: e.target.checked })
                    }
                    className="w-4 h-4 accent-[var(--fb-blue)] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
