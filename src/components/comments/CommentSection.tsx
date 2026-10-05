'use client';

import React, { useState } from 'react';
import { useFeedStore } from '@/stores/feed-store';
import { useAuthStore } from '@/stores/auth-store';
import { CommentItem } from './CommentItem';
import { Avatar } from '@/components/ui/Avatar';
import { Send, Smile } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { comments, addComment } = useFeedStore();
  const { user } = useAuthStore();
  const [inputText, setInputText] = useState('');

  // Filter top-level comments for this post
  const postComments = comments.filter(
    (c) => c.postId === postId && (!c.parentId || c.parentId === null)
  );

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputText.trim()) {
      addComment(postId, inputText.trim(), null, user);
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="pt-3 border-t border-[var(--border-subtle)] space-y-3">
      {/* Comment Input Box */}
      <div className="flex items-center gap-2">
        <Avatar src={user.avatar} alt={user.name} size="sm" />
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex items-center bg-[var(--bg-input)] rounded-full px-3.5 py-1.5 focus-within:ring-1 focus-within:ring-[var(--fb-blue)]"
        >
          <input
            type="text"
            placeholder="Write a comment..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden"
          />

          <button
            type="button"
            onClick={() => setInputText((prev) => prev + ' 😊')}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            title="Insert emoji"
          >
            <Smile className="w-4 h-4" />
          </button>

          {inputText.trim() && (
            <button
              type="submit"
              className="p-1 text-[var(--fb-blue)] hover:text-[var(--fb-blue-hover)] transition-colors"
              title="Post comment"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Comments List */}
      {postComments.length > 0 && (
        <div className="space-y-3 pt-1">
          {postComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
}
