'use client';

import React, { useState } from 'react';
import { useGroupStore } from '@/stores/group-store';
import { useUIStore } from '@/stores/ui-store';
import { Group } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { Search, Users, Plus, Check, Globe, Lock, Share2 } from 'lucide-react';

export function GroupsView() {
  const { groups, toggleJoinGroup } = useGroupStore();
  const { showToast } = useUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'joined'>('all');

  const filteredGroups = groups.filter((g) => {
    if (activeTab === 'joined' && !g.isMember) return false;
    if (searchQuery.trim()) {
      return (
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const handleToggleJoin = (groupId: string, name: string, isMember: boolean) => {
    toggleJoinGroup(groupId);
    showToast(
      isMember ? `Left ${name}` : `Joined ${name}! Welcome to the group 🎉`,
      isMember ? 'info' : 'success'
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Groups</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Discover communities of people who share your passions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="flex items-center bg-[var(--bg-input)] rounded-full px-3 py-1.5 w-60">
            <Search className="w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-[var(--text-primary)] focus:outline-hidden ml-2 w-full"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex bg-[var(--bg-input)] rounded-lg p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'all'
                  ? 'bg-[var(--bg-surface)] text-[var(--fb-blue)] shadow-xs'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              All Groups
            </button>
            <button
              onClick={() => setActiveTab('joined')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'joined'
                  ? 'bg-[var(--bg-surface)] text-[var(--fb-blue)] shadow-xs'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              Your Groups ({groups.filter((g) => g.isMember).length})
            </button>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-[var(--bg-surface)] rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            {/* Cover & Avatar Header */}
            <div>
              <div
                className="relative h-36 bg-zinc-800 cursor-pointer overflow-hidden"
                onClick={() => setSelectedGroup(group)}
              >
                <img
                  src={group.coverImage}
                  alt={group.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold">
                  {group.category}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedGroup(group)}
                >
                  <h3 className="font-bold text-base text-[var(--text-primary)] hover:underline line-clamp-1">
                    {group.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-1">
                    <span className="flex items-center gap-1">
                      {group.privacy === 'public' ? (
                        <Globe className="w-3.5 h-3.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                      <span className="capitalize">{group.privacy} Group</span>
                    </span>
                    <span>•</span>
                    <span>{group.memberCount.toLocaleString()} members</span>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {group.description}
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 pt-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleToggleJoin(group.id, group.name, group.isMember)
                }
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  group.isMember
                    ? 'bg-[var(--bg-hover)] text-[var(--text-primary)] hover:bg-[var(--bg-active)]'
                    : 'bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] text-white shadow-xs'
                }`}
              >
                {group.isMember ? (
                  <>
                    <Check className="w-4 h-4 text-[var(--fb-blue)]" />
                    Joined
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Join Group
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedGroup(group)}
                className="px-3.5 py-2 rounded-xl bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] text-xs font-semibold text-[var(--text-primary)] transition-colors"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Group Detail Modal */}
      {selectedGroup && (
        <Modal
          isOpen={!!selectedGroup}
          onClose={() => setSelectedGroup(null)}
          title={selectedGroup.name}
          maxWidth="xl"
        >
          <div className="space-y-4">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={selectedGroup.coverImage}
                alt={selectedGroup.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 pt-0 space-y-4">
              <div>
                <h2 className="text-xl font-bold">{selectedGroup.name}</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {selectedGroup.category} • {selectedGroup.memberCount.toLocaleString()} members • {selectedGroup.postsCount} posts
                </p>
              </div>

              <div className="p-3 bg-[var(--bg-main)] rounded-xl text-xs text-[var(--text-secondary)] leading-relaxed">
                <h4 className="font-bold text-[var(--text-primary)] mb-1">About this group</h4>
                <p>{selectedGroup.description}</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleToggleJoin(
                      selectedGroup.id,
                      selectedGroup.name,
                      selectedGroup.isMember
                    )
                  }
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    selectedGroup.isMember
                      ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]'
                      : 'bg-[var(--fb-blue)] text-white hover:bg-[var(--fb-blue-hover)]'
                  }`}
                >
                  {selectedGroup.isMember ? 'Leave Group' : 'Join Group'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('Group link copied to clipboard!', 'success');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] text-xs font-semibold flex items-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
