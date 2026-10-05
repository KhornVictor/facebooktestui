'use client';

import React from 'react';
import { ReactionType } from '@/types';
import { cn } from '@/lib/utils';

interface ReactionPickerProps {
  onSelect: (reaction: ReactionType) => void;
  className?: string;
}

export const reactionsConfig: Record<
  ReactionType,
  { label: string; emoji: string; color: string; bg: string }
> = {
  like: {
    label: 'Like',
    emoji: '👍',
    color: 'text-blue-600',
    bg: 'bg-blue-500',
  },
  love: {
    label: 'Love',
    emoji: '❤️',
    color: 'text-rose-600',
    bg: 'bg-rose-500',
  },
  care: {
    label: 'Care',
    emoji: '🥰',
    color: 'text-amber-500',
    bg: 'bg-amber-400',
  },
  haha: {
    label: 'Haha',
    emoji: '😆',
    color: 'text-yellow-500',
    bg: 'bg-yellow-400',
  },
  wow: {
    label: 'Wow',
    emoji: '😮',
    color: 'text-yellow-500',
    bg: 'bg-yellow-400',
  },
  sad: {
    label: 'Sad',
    emoji: '😢',
    color: 'text-yellow-500',
    bg: 'bg-yellow-400',
  },
  angry: {
    label: 'Angry',
    emoji: '😡',
    color: 'text-orange-600',
    bg: 'bg-orange-500',
  },
};

const reactionKeys: ReactionType[] = ['like', 'love', 'care', 'haha', 'wow', 'sad', 'angry'];

export function ReactionPicker({ onSelect, className }: ReactionPickerProps) {
  return (
    <div
      className={cn(
        'absolute bottom-full left-0 mb-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl z-30 animate-pop-in select-none',
        className
      )}
    >
      {reactionKeys.map((type) => {
        const item = reactionsConfig[type];
        return (
          <button
            key={type}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(type);
            }}
            className="group relative p-1.5 rounded-full hover:bg-[var(--bg-hover)] transition-transform duration-200 hover:scale-130 active:scale-95"
            title={item.label}
          >
            <span className="text-2xl leading-none transition-transform inline-block group-hover:-translate-y-1">
              {item.emoji}
            </span>
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/80 text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
