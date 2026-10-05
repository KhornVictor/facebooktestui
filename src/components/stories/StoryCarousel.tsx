'use client';

import React, { useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { mockStories } from '@/data/stories';
import { Avatar } from '@/components/ui/Avatar';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export function StoryCarousel() {
  const { user } = useAuthStore();
  const { openStoryViewer, showToast } = useUIStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCreateStory = () => {
    showToast('Add to your story feature simulated! Opening story viewer...', 'info');
    openStoryViewer(0);
  };

  return (
    <div className="relative group/carousel">
      {/* Scroll Left Button */}
      <button
        type="button"
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-lg border border-[var(--border-subtle)] flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:scale-105"
        title="Previous stories"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Stories Scrollable Row */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none select-none px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Create Story Card */}
        <div
          onClick={handleCreateStory}
          className="relative shrink-0 w-28 sm:w-32 h-48 sm:h-52 rounded-xl overflow-hidden bg-[var(--bg-surface)] shadow-xs border border-[var(--border-subtle)] cursor-pointer group flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="w-full h-[70%] overflow-hidden bg-zinc-200">
            <img
              src={user.avatar}
              alt="Your avatar"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="relative w-full h-[30%] bg-[var(--bg-surface)] flex flex-col items-center justify-end pb-2 pt-4 px-1">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[var(--fb-blue)] text-white flex items-center justify-center border-4 border-[var(--bg-surface)] shadow-xs">
              <Plus className="w-4 h-4 font-bold" />
            </div>
            <span className="text-xs font-bold text-center text-[var(--text-primary)] leading-tight">
              Create story
            </span>
          </div>
        </div>

        {/* Stories Cards */}
        {mockStories.map((story, index) => (
          <div
            key={story.id}
            onClick={() => openStoryViewer(index)}
            className="relative shrink-0 w-28 sm:w-32 h-48 sm:h-52 rounded-xl overflow-hidden shadow-xs cursor-pointer group transition-transform duration-200 hover:scale-[1.02] border border-[var(--border-subtle)]"
          >
            {/* Background Story Image */}
            <img
              src={story.mediaUrl}
              alt={story.author.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

            {/* Author Avatar on Top-Left */}
            <div className="absolute top-2.5 left-2.5 z-10">
              <Avatar
                src={story.author.avatar}
                alt={story.author.name}
                size="sm"
                className={`ring-4 ${
                  story.isViewed ? 'ring-zinc-400' : 'ring-[var(--fb-blue)]'
                }`}
              />
            </div>

            {/* Author Name at Bottom */}
            <div className="absolute bottom-2.5 inset-x-2.5 z-10">
              <span className="text-xs font-bold text-white drop-shadow-md line-clamp-2 leading-tight">
                {story.author.id === user.id ? 'Your story' : story.author.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Right Button */}
      <button
        type="button"
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-lg border border-[var(--border-subtle)] flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:scale-105"
        title="Next stories"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
