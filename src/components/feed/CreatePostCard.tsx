'use client';

import React from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { Video, Image as ImageIcon, Smile } from 'lucide-react';

export function CreatePostCard() {
  const { user } = useAuthStore();
  const { setCreatePostModalOpen, setLiveStreamModalOpen } = useUIStore();

  return (
    <div className="bg-[var(--bg-surface)] rounded-xl shadow-xs border border-[var(--border-subtle)] p-3.5 space-y-3">
      {/* Top row: Avatar & Input Trigger */}
      <div className="flex items-center gap-2.5">
        <Avatar src={user.avatar} alt={user.name} size="md" />
        <button
          type="button"
          onClick={() => setCreatePostModalOpen(true)}
          className="flex-1 text-left px-4 py-2.5 rounded-full bg-[var(--bg-input)] hover:bg-[var(--bg-hover)] text-sm text-[var(--text-muted)] cursor-pointer transition-colors"
        >
          What&apos;s on your mind, {user.name.split(' ')[0]}?
        </button>
      </div>

      <div className="h-[1px] bg-[var(--border-subtle)]" />

      {/* Action shortcuts: Live Video, Photo/Video, Feeling/Activity */}
      <div className="grid grid-cols-3 gap-1">
        <button
          type="button"
          onClick={() => setLiveStreamModalOpen(true)}
          className="flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-xs font-semibold text-[var(--text-secondary)] transition-colors"
        >
          <Video className="w-5 h-5 text-rose-500" />
          <span>Live video</span>
        </button>

        <button
          type="button"
          onClick={() => setCreatePostModalOpen(true)}
          className="flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-xs font-semibold text-[var(--text-secondary)] transition-colors"
        >
          <ImageIcon className="w-5 h-5 text-emerald-500" />
          <span>Photo/video</span>
        </button>

        <button
          type="button"
          onClick={() => setCreatePostModalOpen(true)}
          className="flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-xs font-semibold text-[var(--text-secondary)] transition-colors"
        >
          <Smile className="w-5 h-5 text-yellow-500" />
          <span>Feeling/activity</span>
        </button>
      </div>
    </div>
  );
}
