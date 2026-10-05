'use client';

import React, { useState } from 'react';
import { Comment, User } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { formatTimeAgo } from '@/lib/utils';
import { useFeedStore } from '@/stores/feed-store';
import { useAuthStore } from '@/stores/auth-store';
import { Heart, ThumbsUp, MoreHorizontal, Edit2, Trash2, CornerDownRight } from 'lucide-react';
import Link from 'next/navigation';

interface CommentItemProps {
  comment: Comment;
  postId: string;
}

export function CommentItem({ comment, postId }: CommentItemProps) {
  const { user } = useAuthStore();
  const { reactToComment, deleteComment, editComment, addComment } = useFeedStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const isAuthor = user.id === comment.author.id;
  const isLiked = comment.userReaction === 'like' || comment.userReaction === 'love';

  const totalReactions = Object.values(comment.reactions || {}).reduce(
    (acc, count) => acc + (count || 0),
    0
  );

  const handleSaveEdit = () => {
    if (editText.trim()) {
      editComment(comment.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      addComment(postId, replyText.trim(), comment.id, user);
      setReplyText('');
      setIsReplying(false);
    }
  };

  return (
    <div className="flex gap-2 group/item">
      <Avatar
        src={comment.author.avatar}
        alt={comment.author.name}
        size="sm"
        className="mt-0.5"
      />

      <div className="flex-1 space-y-1">
        {/* Comment Bubble */}
        <div className="relative inline-block max-w-full">
          <div className="bg-[var(--bg-hover)] px-3.5 py-2 rounded-2xl text-[13px] inline-block">
            <span className="font-semibold block hover:underline cursor-pointer">
              {comment.author.name}
            </span>

            {isEditing ? (
              <div className="mt-1 space-y-1">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') setIsEditing(false);
                  }}
                  className="w-full bg-[var(--bg-surface)] px-2 py-1 rounded text-xs border border-[var(--border-subtle)] focus:outline-hidden"
                  autoFocus
                />
                <div className="flex gap-2 text-[11px] text-[var(--fb-blue)]">
                  <button onClick={handleSaveEdit} className="hover:underline">
                    Save
                  </button>
                  <button onClick={() => setIsEditing(false)} className="hover:underline">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[var(--text-primary)] break-words whitespace-pre-wrap">
                {comment.content}
              </p>
            )}
          </div>

          {/* Reaction count bubble */}
          {totalReactions > 0 && (
            <div className="absolute -bottom-2 right-1 flex items-center gap-0.5 bg-[var(--bg-surface)] px-1.5 py-0.5 rounded-full shadow-xs border border-[var(--border-subtle)] text-[11px]">
              <span className="text-xs">❤️</span>
              <span className="text-[var(--text-secondary)] font-medium">
                {totalReactions}
              </span>
            </div>
          )}

          {/* Comment actions menu button */}
          {isAuthor && !isEditing && (
            <div className="relative inline-block ml-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              {showMenu && (
                <div className="absolute left-full top-0 ml-1 z-20 w-24 bg-[var(--bg-surface)] rounded-lg shadow-lg border border-[var(--border-subtle)] py-1 text-xs">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--bg-hover)] flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--bg-hover)] text-rose-500 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comment Action Links (Like, Reply, Timestamp) */}
        <div className="flex items-center gap-3 text-xs font-semibold text-[var(--text-secondary)] px-2">
          <button
            type="button"
            onClick={() => reactToComment(comment.id, isLiked ? 'like' : 'love')}
            className={`hover:underline ${
              isLiked ? 'text-rose-600 font-bold' : ''
            }`}
          >
            {isLiked ? 'Loved' : 'Like'}
          </button>

          <button
            type="button"
            onClick={() => setIsReplying(!isReplying)}
            className="hover:underline"
          >
            Reply
          </button>

          <span className="text-[11px] font-normal text-[var(--text-muted)]">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>

        {/* Reply Input Box */}
        {isReplying && (
          <div className="flex items-center gap-2 mt-2 pt-1 pl-2 animate-pop-in">
            <CornerDownRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
            <Avatar src={user.avatar} alt={user.name} size="xs" />
            <div className="flex-1 flex items-center bg-[var(--bg-input)] rounded-full px-3 py-1">
              <input
                type="text"
                placeholder={`Reply to ${comment.author.name}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendReply();
                  if (e.key === 'Escape') setIsReplying(false);
                }}
                className="w-full bg-transparent text-xs focus:outline-hidden"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="pl-4 border-l-2 border-[var(--border-subtle)] space-y-2 mt-2">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} postId={postId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
