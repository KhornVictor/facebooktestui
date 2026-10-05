'use client';

import React, { useState } from 'react';
import { useFriendStore } from '@/stores/friend-store';
import { useMessengerStore } from '@/stores/messenger-store';
import { useUIStore } from '@/stores/ui-store';
import { Avatar } from '@/components/ui/Avatar';
import { useRouter } from 'next/navigation';
import { UserCheck, UserPlus, UserX, MessageCircle, Gift } from 'lucide-react';
import Link from 'next/link';

export function FriendsView() {
  const router = useRouter();
  const {
    friends,
    friendRequests,
    friendSuggestions,
    acceptRequest,
    declineRequest,
    sendFriendRequest,
    removeFriend,
  } = useFriendStore();
  const { getOrCreateConversationWithUser, setActiveConversation } = useMessengerStore();
  const { showToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'requests' | 'suggestions' | 'all' | 'birthdays'>('requests');

  const handleMessage = (u: any) => {
    const convId = getOrCreateConversationWithUser(u);
    setActiveConversation(convId);
    router.push('/messenger');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6 select-none">
      {/* Page Title & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Friends</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Manage your friendships, requests, and connections
          </p>
        </div>

        <div className="flex gap-1.5 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'requests', label: `Requests (${friendRequests.length})` },
            { id: 'suggestions', label: 'People You May Know' },
            { id: 'all', label: `All Friends (${friends.length})` },
            { id: 'birthdays', label: 'Birthdays' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[var(--fb-blue)] text-white'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-subtle)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* FRIEND REQUESTS TAB */}
      {(activeTab === 'requests' || friendRequests.length > 0) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Friend Requests ({friendRequests.length})
            </h2>
          </div>

          {friendRequests.length === 0 ? (
            <div className="bg-[var(--bg-surface)] p-8 rounded-xl border border-[var(--border-subtle)] text-center text-sm text-[var(--text-muted)]">
              No pending friend requests.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {friendRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-[var(--bg-surface)] rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-xs flex flex-col justify-between"
                >
                  <Link href={`/profile/${req.user.username}`}>
                    <img
                      src={req.user.avatar}
                      alt={req.user.name}
                      className="w-full h-40 object-cover hover:opacity-90 transition-opacity"
                    />
                  </Link>
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/profile/${req.user.username}`}
                        className="font-bold text-sm text-[var(--text-primary)] hover:underline truncate block"
                      >
                        {req.user.name}
                      </Link>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {req.mutualFriends} mutual friends
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          acceptRequest(req.id);
                          showToast(`Confirmed friend request from ${req.user.name}!`, 'success');
                        }}
                        className="w-full py-1.5 rounded-lg bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] text-white text-xs font-bold transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          declineRequest(req.id);
                          showToast(`Request from ${req.user.name} removed`, 'info');
                        }}
                        className="w-full py-1.5 rounded-lg bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] text-xs font-bold text-[var(--text-secondary)] transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUGGESTIONS TAB */}
      {(activeTab === 'suggestions' || activeTab === 'requests') && (
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            People You May Know
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {friendSuggestions.map((sug) => (
              <div
                key={sug.id}
                className="bg-[var(--bg-surface)] rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-xs flex flex-col justify-between"
              >
                <Link href={`/profile/${sug.username}`}>
                  <img
                    src={sug.avatar}
                    alt={sug.name}
                    className="w-full h-40 object-cover hover:opacity-90 transition-opacity"
                  />
                </Link>
                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/profile/${sug.username}`}
                      className="font-bold text-sm text-[var(--text-primary)] hover:underline truncate block"
                    >
                      {sug.name}
                    </Link>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {sug.mutualFriends || 8} mutual friends
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        sendFriendRequest(sug.id);
                        showToast(`Friend request sent to ${sug.name}!`, 'success');
                      }}
                      className="w-full py-1.5 rounded-lg bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Add Friend
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALL FRIENDS TAB */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            All Friends ({friends.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs"
              >
                <Link
                  href={`/profile/${friend.username}`}
                  className="flex items-center gap-3 min-w-0"
                >
                  <Avatar
                    src={friend.avatar}
                    alt={friend.name}
                    size="lg"
                    isOnline={friend.isOnline}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate hover:underline">
                      {friend.name}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">
                      @{friend.username}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMessage(friend)}
                    className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--fb-blue)]"
                    title="Send message"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      removeFriend(friend.id);
                      showToast(`Removed ${friend.name} from friends`, 'info');
                    }}
                    className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-rose-500"
                    title="Unfriend"
                  >
                    <UserX className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BIRTHDAYS TAB */}
      {activeTab === 'birthdays' && (
        <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border-subtle)] space-y-4 max-w-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-500 flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Upcoming Birthdays</h2>
              <p className="text-xs text-[var(--text-muted)]">Celebrate milestones with your friends</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-main)]">
              <div className="flex items-center gap-3">
                <Avatar src={friends[3]?.avatar} alt="Diana" size="md" />
                <div>
                  <p className="font-bold text-sm">Diana Prince</p>
                  <p className="text-xs text-rose-500 font-semibold">Today! 🎂</p>
                </div>
              </div>
              <button
                onClick={() => showToast('Birthday wish sent to Diana! 🎉', 'success')}
                className="px-3 py-1.5 rounded-lg bg-[var(--fb-blue)] text-white text-xs font-bold"
              >
                Wish Happy Birthday
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-main)]">
              <div className="flex items-center gap-3">
                <Avatar src={friends[1]?.avatar} alt="Bob" size="md" />
                <div>
                  <p className="font-bold text-sm">Bob Martinez</p>
                  <p className="text-xs text-[var(--text-muted)]">Tomorrow</p>
                </div>
              </div>
              <button
                onClick={() => showToast('Birthday reminder scheduled!', 'info')}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-hover)] text-xs font-semibold"
              >
                Remind Me
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
