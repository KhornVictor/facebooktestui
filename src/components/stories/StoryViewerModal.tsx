'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { mockStories } from '@/data/stories';
import { Avatar } from '@/components/ui/Avatar';
import { formatTimeAgo } from '@/lib/utils';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

export function StoryViewerModal() {
  const { storyViewerState, closeStoryViewer } = useUIStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (storyViewerState.isOpen) {
      setCurrentIndex(storyViewerState.activeIndex);
      setProgress(0);
      setIsPaused(false);
    }
  }, [storyViewerState.isOpen, storyViewerState.activeIndex]);

  const activeStory = mockStories[currentIndex];

  // Auto progression timer
  useEffect(() => {
    if (!storyViewerState.isOpen || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalTime = 50; // update progress every 50ms (total 5s = 100 steps)
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next story if available
          if (currentIndex < mockStories.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            closeStoryViewer();
            return 100;
          }
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [storyViewerState.isOpen, isPaused, currentIndex, closeStoryViewer]);

  if (!storyViewerState.isOpen || !activeStory) return null;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < mockStories.length - 1) {
      setCurrentIndex((c) => c + 1);
      setProgress(0);
    } else {
      closeStoryViewer();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center select-none">
      {/* Top Left Close Button */}
      <button
        type="button"
        onClick={closeStoryViewer}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
        title="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentIndex < mockStories.length - 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Story Card Container */}
      <div
        className="relative w-full max-w-sm sm:max-w-md h-[85vh] max-h-[750px] rounded-2xl overflow-hidden shadow-2xl bg-zinc-900 border border-white/10 flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bar Container */}
        <div className="absolute top-0 inset-x-0 p-3 z-30 flex items-center gap-1.5">
          {mockStories.map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Author Header */}
        <div className="absolute top-5 inset-x-0 px-4 pt-2 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar
              src={activeStory.author.avatar}
              alt={activeStory.author.name}
              size="sm"
              className="ring-2 ring-[var(--fb-blue)]"
            />
            <div>
              <p className="text-sm font-bold text-white drop-shadow-md">
                {activeStory.author.name}
              </p>
              <p className="text-[11px] text-white/80 drop-shadow-md">
                {formatTimeAgo(activeStory.createdAt)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused(!isPaused);
            }}
            className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>

        {/* Story Media Background */}
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <img
            src={activeStory.mediaUrl}
            alt="Story content"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
        </div>

        {/* Text overlay caption if exists */}
        {activeStory.textOverlay && (
          <div className="absolute bottom-6 inset-x-0 px-6 z-30 text-center">
            <p className="text-white text-base font-semibold drop-shadow-lg bg-black/40 backdrop-blur-xs py-2 px-4 rounded-xl inline-block">
              {activeStory.textOverlay}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
