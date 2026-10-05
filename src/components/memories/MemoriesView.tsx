'use client';

import React from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useFeedStore } from '@/stores/feed-store';
import { useUIStore } from '@/stores/ui-store';
import { Avatar } from '@/components/ui/Avatar';
import { Clock, Share2, Sparkles } from 'lucide-react';

export function MemoriesView() {
  const { user } = useAuthStore();
  const { sharePost } = useFeedStore();
  const { showToast } = useUIStore();

  const sampleMemories = [
    {
      id: 'mem_1',
      yearsAgo: 2,
      dateFormatted: 'October 5, 2024',
      content:
        'Finally finished our cross-country road trip! 3,800 miles, 12 national parks, and unforgettable memories with the crew. 🚗🌲',
      image:
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'mem_2',
      yearsAgo: 4,
      dateFormatted: 'October 5, 2022',
      content:
        'First day at the new software engineering role! Super excited for this chapter and the challenges ahead. 🚀💻',
      image:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const handleShareMemory = (mem: typeof sampleMemories[0]) => {
    sharePost(
      {
        id: `shared_mem_${mem.id}`,
        author: user,
        content: mem.content,
        image: mem.image,
        privacy: 'public',
        createdAt: new Date().toISOString(),
        reactions: {},
        commentsCount: 0,
        sharesCount: 0,
      },
      `Looking back on this day ${mem.yearsAgo} years ago! ✨`
    );
    showToast('Memory shared to your feed!', 'success');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6 select-none">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg space-y-2">
        <div className="flex items-center gap-2 text-blue-200">
          <Clock className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Memories</span>
        </div>
        <h1 className="text-2xl font-black">On This Day</h1>
        <p className="text-xs text-blue-100 max-w-md">
          We hope you enjoy looking back and sharing your memories on Facebook, from the most recent to the ones from long ago.
        </p>
      </div>

      {/* Memories Cards */}
      <div className="space-y-6">
        {sampleMemories.map((mem) => (
          <div
            key={mem.id}
            className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] shadow-xs overflow-hidden"
          >
            {/* Memory Header */}
            <div className="p-4 bg-[var(--bg-main)] border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[var(--fb-blue-light)] text-[var(--fb-blue)] flex items-center justify-center font-black text-sm">
                  {mem.yearsAgo}y
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    {mem.yearsAgo} Years Ago Today
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">{mem.dateFormatted}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleShareMemory(mem)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share Memory
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar src={user.avatar} alt={user.name} size="md" />
                <div>
                  <p className="font-bold text-sm text-[var(--text-primary)]">{user.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{mem.dateFormatted}</p>
                </div>
              </div>

              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {mem.content}
              </p>

              {mem.image && (
                <div className="rounded-xl overflow-hidden border border-[var(--border-subtle)]">
                  <img
                    src={mem.image}
                    alt="Memory"
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
