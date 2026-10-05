'use client';

import React, { useEffect } from 'react';
import { useFeedStore } from '@/stores/feed-store';
import { ArrowUp, Sparkles } from 'lucide-react';

export function LiveFeedBanner() {
  const { newPostsQueue, applyNewPostsQueue, simulateIncomingPost } = useFeedStore();

  // Periodically generate simulated posts (e.g. every 45-60 seconds)
  useEffect(() => {
    // Generate one simulated post after 15 seconds to demonstrate the feature early
    const initialTimer = setTimeout(() => {
      simulateIncomingPost();
    }, 15000);

    const interval = setInterval(() => {
      simulateIncomingPost();
    }, 55000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [simulateIncomingPost]);

  if (newPostsQueue.length === 0) return null;

  return (
    <div className="sticky top-16 z-20 flex justify-center py-2 animate-pop-in">
      <button
        type="button"
        onClick={() => {
          applyNewPostsQueue();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] text-white shadow-lg text-xs md:text-sm font-bold transition-all hover:scale-105 active:scale-95"
      >
        <ArrowUp className="w-4 h-4 animate-bounce" />
        <span>
          ↑ {newPostsQueue.length} new {newPostsQueue.length === 1 ? 'post' : 'posts'} available • Click to view
        </span>
        <Sparkles className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
