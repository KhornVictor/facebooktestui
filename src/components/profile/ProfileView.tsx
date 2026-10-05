'use client';

import React, { useState } from 'react';
import { User, Post } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { PostCard } from '@/components/posts/PostCard';
import { CreatePostCard } from '@/components/feed/CreatePostCard';
import { useAuthStore } from '@/stores/auth-store';
import { useFeedStore } from '@/stores/feed-store';
import { useMessengerStore } from '@/stores/messenger-store';
import { useFriendStore } from '@/stores/friend-store';
import { useUIStore } from '@/stores/ui-store';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Plus,
  Edit2,
  UserCheck,
  UserPlus,
  MessageCircle,
  Briefcase,
  GraduationCap,
  Home,
  MapPin,
  Heart,
  Clock,
  MoreHorizontal,
  Image as ImageIcon,
} from 'lucide-react';

interface ProfileViewProps {
  profileUser: User;
}

export function ProfileView({ profileUser }: ProfileViewProps) {
  const router = useRouter();
  const { user: currentUser, updateProfile } = useAuthStore();
  const { posts } = useFeedStore();
  const { getOrCreateConversationWithUser, setActiveConversation } = useMessengerStore();
  const { friends, friendRequests, sendFriendRequest, removeFriend } = useFriendStore();
  const { showToast, openMediaModal } = useUIStore();

  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends' | 'photos' | 'videos'>('posts');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(profileUser.bio || '');

  const isMe = currentUser.id === profileUser.id;
  const isFriend = friends.some((f) => f.id === profileUser.id);
  const hasSentRequest = false;

  // Filter posts by profile user
  const userPosts = posts.filter(
    (p) => p.author.id === profileUser.id || p.author.username === profileUser.username
  );

  const handleMessageUser = () => {
    const convId = getOrCreateConversationWithUser(profileUser);
    setActiveConversation(convId);
    router.push('/messenger');
  };

  const handleToggleFriend = () => {
    if (isFriend) {
      removeFriend(profileUser.id);
      showToast(`Removed ${profileUser.name} from friends`, 'info');
    } else {
      sendFriendRequest(profileUser.id);
      showToast(`Friend request sent to ${profileUser.name}`, 'success');
    }
  };

  const handleSaveBio = () => {
    updateProfile({ bio: bioText });
    setIsEditingBio(false);
    showToast('Bio updated', 'success');
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-12 select-none">
      {/* Cover & Avatar Header Container */}
      <div className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] shadow-xs">
        {/* Cover Photo */}
        <div className="relative w-full h-48 sm:h-72 md:h-84 bg-zinc-800 overflow-hidden">
          <img
            src={
              profileUser.coverImage ||
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'
            }
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {isMe && (
            <button
              onClick={() => showToast('Edit cover photo simulated!', 'info')}
              className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-black/80 hover:bg-white text-xs font-bold text-zinc-900 dark:text-white transition-all shadow-md"
            >
              <Camera className="w-4 h-4" />
              Edit cover photo
            </button>
          )}
        </div>

        {/* Profile Info Row */}
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between -mt-16 sm:-mt-20 md:-mt-12 gap-4">
            {/* Avatar & Names */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="relative">
                <Avatar
                  src={profileUser.avatar}
                  alt={profileUser.name}
                  size="2xl"
                  isOnline={profileUser.isOnline}
                  className="w-32 h-32 sm:w-40 sm:h-40 ring-4 ring-[var(--bg-surface)] shadow-lg"
                />
                {isMe && (
                  <button
                    onClick={() => showToast('Edit profile photo simulated!', 'info')}
                    className="absolute bottom-2 right-2 p-2 rounded-full bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] border border-[var(--border-subtle)] shadow-md"
                    title="Update profile picture"
                  >
                    <Camera className="w-4 h-4 text-[var(--text-primary)]" />
                  </button>
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                  {profileUser.name}
                </h1>
                <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
                  @{profileUser.username}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-1.5 text-xs text-[var(--text-secondary)] font-semibold">
                  <span>{profileUser.friendsCount?.toLocaleString() || 842} friends</span>
                  <span>•</span>
                  <span>{profileUser.followersCount?.toLocaleString() || 2400} followers</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isMe ? (
                <>
                  <button
                    onClick={() => showToast('Add to Story dialog simulated!', 'info')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    Add to story
                  </button>

                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] text-xs font-bold text-[var(--text-primary)] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit profile
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleToggleFriend}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-xs ${
                      isFriend
                        ? 'bg-[var(--bg-hover)] text-[var(--text-primary)] hover:bg-[var(--bg-active)]'
                        : 'bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] text-white'
                    }`}
                  >
                    {isFriend ? (
                      <>
                        <UserCheck className="w-4 h-4 text-[var(--fb-blue)]" />
                        Friends
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Add Friend
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleMessageUser}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bio text */}
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-center md:text-left">
            {isEditingBio ? (
              <div className="max-w-md space-y-2">
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] text-xs border border-[var(--border-subtle)] focus:outline-hidden"
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="px-3 py-1 rounded bg-[var(--bg-hover)] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBio}
                    className="px-3 py-1 rounded bg-[var(--fb-blue)] text-white text-xs font-bold"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--text-primary)] font-medium">
                {profileUser.bio || 'No bio yet.'}
              </p>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 overflow-x-auto mt-4 pt-1 border-t border-[var(--border-subtle)]">
            {(['posts', 'about', 'friends', 'photos', 'videos'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 rounded-lg text-sm font-semibold capitalize whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'text-[var(--fb-blue)] border-b-4 border-[var(--fb-blue)] rounded-b-none'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-4xl mx-auto px-4 mt-4">
        {/* POSTS TAB */}
        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Intro Card */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-[var(--bg-surface)] p-4 rounded-xl shadow-xs border border-[var(--border-subtle)] space-y-3">
                <h3 className="font-bold text-base text-[var(--text-primary)]">Intro</h3>
                <div className="space-y-2.5 text-xs text-[var(--text-primary)]">
                  {profileUser.workplace && (
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                      <span>{profileUser.workplace}</span>
                    </div>
                  )}
                  {profileUser.education && (
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                      <span>{profileUser.education}</span>
                    </div>
                  )}
                  {profileUser.location && (
                    <div className="flex items-center gap-2.5">
                      <Home className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                      <span>Lives in {profileUser.location}</span>
                    </div>
                  )}
                  {profileUser.relationshipStatus && (
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{profileUser.relationshipStatus}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                    <span>{profileUser.joinedDate || 'Joined May 2018'}</span>
                  </div>
                </div>
              </div>

              {/* Photos Preview Widget */}
              <div className="bg-[var(--bg-surface)] p-4 rounded-xl shadow-xs border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[var(--text-primary)]">Photos</h3>
                  <button
                    onClick={() => setActiveTab('photos')}
                    className="text-xs font-semibold text-[var(--fb-blue)] hover:underline"
                  >
                    See all photos
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5 rounded-lg overflow-hidden">
                  {[
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80',
                  ].map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Thumbnail"
                      onClick={() => openMediaModal(url)}
                      className="w-full h-20 object-cover cursor-pointer hover:opacity-85"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Feed Posts */}
            <div className="md:col-span-7 space-y-4">
              {isMe && <CreatePostCard />}

              {userPosts.length === 0 ? (
                <div className="bg-[var(--bg-surface)] p-8 rounded-xl shadow-xs border border-[var(--border-subtle)] text-center text-sm text-[var(--text-muted)]">
                  No posts yet from {profileUser.name}.
                </div>
              ) : (
                userPosts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="bg-[var(--bg-surface)] p-6 rounded-xl shadow-xs border border-[var(--border-subtle)] space-y-6">
            <h2 className="text-xl font-bold">About {profileUser.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  Work and Education
                </h4>
                <p className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  {profileUser.workplace || 'Senior Engineer at Horizon Tech'}
                </p>
                <p className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-emerald-500" />
                  {profileUser.education || 'Studied Computer Science'}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  Places Lived
                </h4>
                <p className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-purple-500" />
                  Lives in {profileUser.location || 'San Francisco, CA'}
                </p>
                <p className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  From Seattle, Washington
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FRIENDS TAB */}
        {activeTab === 'friends' && (
          <div className="bg-[var(--bg-surface)] p-6 rounded-xl shadow-xs border border-[var(--border-subtle)] space-y-4">
            <h2 className="text-xl font-bold">Friends ({friends.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {friends.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={f.avatar} alt={f.name} size="lg" isOnline={f.isOnline} />
                    <div>
                      <p className="font-bold text-sm">{f.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {f.mutualFriends || 12} mutual friends
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const convId = getOrCreateConversationWithUser(f);
                      setActiveConversation(convId);
                      router.push('/messenger');
                    }}
                    className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--fb-blue)]"
                    title="Message"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PHOTOS TAB */}
        {activeTab === 'photos' && (
          <div className="bg-[var(--bg-surface)] p-6 rounded-xl shadow-xs border border-[var(--border-subtle)] space-y-4">
            <h2 className="text-xl font-bold">Photos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {[
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
              ].map((url, i) => (
                <div
                  key={i}
                  onClick={() => openMediaModal(url)}
                  className="aspect-square rounded-lg overflow-hidden bg-black/5 cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img src={url} alt="Photo" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIDEOS TAB */}
        {activeTab === 'videos' && (
          <div className="bg-[var(--bg-surface)] p-8 rounded-xl shadow-xs border border-[var(--border-subtle)] text-center text-sm text-[var(--text-muted)] space-y-2">
            <ImageIcon className="w-12 h-12 mx-auto opacity-30" />
            <p className="font-bold text-base text-[var(--text-primary)]">No Videos Yet</p>
            <p className="text-xs">Videos posted by {profileUser.name} will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
