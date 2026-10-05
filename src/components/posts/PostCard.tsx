'use client';

import React, { useState, useRef } from 'react';
import { Post, ReactionType } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { ReactionPicker, reactionsConfig } from './ReactionPicker';
import { CommentSection } from '@/components/comments/CommentSection';
import { formatTimeAgo, formatNumber } from '@/lib/utils';
import { useFeedStore } from '@/stores/feed-store';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import {
  Globe,
  Users,
  Lock,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
  Edit2,
  Trash2,
  EyeOff,
  Copy,
  MapPin,
  Smile,
  Radio,
  Play,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuthStore();
  const { reactToPost, deletePost, editPost, toggleSavePost } = useFeedStore();
  const { openShareModal, openMediaModal, showToast, setLiveStreamModalOpen } = useUIStore();

  const [showComments, setShowComments] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.content);
  const [isHidden, setIsHidden] = useState(false);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isAuthor = user.id === post.author.id;

  if (isHidden) {
    return (
      <div className="bg-[var(--bg-surface)] p-4 rounded-xl shadow-xs border border-[var(--border-subtle)] text-center text-sm text-[var(--text-secondary)]">
        Post hidden from your feed.{' '}
        <button
          onClick={() => setIsHidden(false)}
          className="text-[var(--fb-blue)] font-semibold hover:underline ml-1"
        >
          Undo
        </button>
      </div>
    );
  }

  // Calculate total reactions
  const totalReactions = Object.values(post.reactions || {}).reduce(
    (acc, count) => acc + (count || 0),
    0
  );

  // Get active reactions list for badges
  const activeReactionEntries = Object.entries(post.reactions || {}).filter(
    ([_, count]) => (count || 0) > 0
  ) as [ReactionType, number][];

  const handleMouseEnterLike = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowReactionPicker(true);
    }, 280);
  };

  const handleMouseLeaveLike = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setShowReactionPicker(false);
  };

  const handleReactionSelect = (reaction: ReactionType) => {
    reactToPost(post.id, reaction);
    setShowReactionPicker(false);
  };

  const handleMainLikeClick = () => {
    if (post.userReaction) {
      reactToPost(post.id, post.userReaction); // toggles off
    } else {
      reactToPost(post.id, 'like');
    }
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      editPost(post.id, editText.trim());
      setIsEditing(false);
      showToast('Post updated', 'success');
    }
  };

  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/home#${post.id}`;
    navigator.clipboard.writeText(postUrl);
    showToast('Link copied to clipboard!', 'success');
    setShowMoreMenu(false);
  };

  const getPrivacyIcon = () => {
    switch (post.privacy) {
      case 'friends':
        return (
          <span title="Friends">
            <Users className="w-3 h-3 text-[var(--text-muted)]" />
          </span>
        );
      case 'only_me':
        return (
          <span title="Only me">
            <Lock className="w-3 h-3 text-[var(--text-muted)]" />
          </span>
        );
      case 'public':
      default:
        return (
          <span title="Public">
            <Globe className="w-3 h-3 text-[var(--text-muted)]" />
          </span>
        );
    }
  };

  return (
    <div
      id={post.id}
      className="bg-[var(--bg-surface)] rounded-xl shadow-xs border border-[var(--border-subtle)] overflow-hidden transition-shadow duration-200 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-3.5 pb-2">
        <div className="flex items-center gap-2.5">
          <Link href={`/profile/${post.author.username}`}>
            <Avatar
              src={post.author.avatar}
              alt={post.author.name}
              size="md"
              isOnline={post.author.isOnline}
            />
          </Link>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={`/profile/${post.author.username}`}
                className="font-bold text-sm text-[var(--text-primary)] hover:underline"
              >
                {post.author.name}
              </Link>

              {post.feeling && (
                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                  is feeling <span className="font-semibold">{post.feeling}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-0.5">
              <span>{formatTimeAgo(post.createdAt)}</span>
              <span>•</span>
              {getPrivacyIcon()}
              {post.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-xs text-[var(--text-secondary)]">
                    <MapPin className="w-3 h-3" /> {post.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* More Actions Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="w-8 h-8 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] flex items-center justify-center transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMoreMenu && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-[var(--bg-surface)] rounded-xl shadow-xl border border-[var(--border-subtle)] py-1.5 z-30 animate-pop-in text-sm font-medium">
              <button
                type="button"
                onClick={() => {
                  toggleSavePost(post.id);
                  setShowMoreMenu(false);
                  showToast(post.isSaved ? 'Removed from saved' : 'Post saved', 'success');
                }}
                className="w-full px-3.5 py-2 hover:bg-[var(--bg-hover)] flex items-center gap-2.5 text-left"
              >
                {post.isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-[var(--fb-blue)]" />
                    <span>Unsave post</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save post</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full px-3.5 py-2 hover:bg-[var(--bg-hover)] flex items-center gap-2.5 text-left"
              >
                <Copy className="w-4 h-4" />
                <span>Copy link</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsHidden(true);
                  setShowMoreMenu(false);
                }}
                className="w-full px-3.5 py-2 hover:bg-[var(--bg-hover)] flex items-center gap-2.5 text-left"
              >
                <EyeOff className="w-4 h-4" />
                <span>Hide post</span>
              </button>

              {isAuthor && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(true);
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-3.5 py-2 hover:bg-[var(--bg-hover)] flex items-center gap-2.5 text-left"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit post</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      deletePost(post.id);
                      setShowMoreMenu(false);
                      showToast('Post deleted', 'info');
                    }}
                    className="w-full px-3.5 py-2 hover:bg-[var(--bg-hover)] text-rose-500 flex items-center gap-2.5 text-left border-t border-[var(--border-subtle)] mt-1 pt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete post</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Text / Content */}
      <div className="px-3.5 py-1">
        {isEditing ? (
          <div className="space-y-2 pb-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full min-h-[90px] p-2.5 rounded-lg bg-[var(--bg-input)] text-sm border border-[var(--border-subtle)] focus:outline-hidden focus:ring-1 focus:ring-[var(--fb-blue)] resize-none"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-md hover:bg-[var(--bg-hover)] font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3.5 py-1.5 rounded-md bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] text-white font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>
        )}
      </div>

      {/* Shared Post Container if present */}
      {post.sharedPost && (
        <div className="mx-3.5 my-2 border border-[var(--border-subtle)] rounded-xl overflow-hidden bg-[var(--bg-main)]">
          <div className="p-3 flex items-center gap-2 border-b border-[var(--border-subtle)]">
            <Avatar
              src={post.sharedPost.author.avatar}
              alt={post.sharedPost.author.name}
              size="sm"
            />
            <div>
              <p className="text-xs font-bold">{post.sharedPost.author.name}</p>
              <p className="text-[10px] text-[var(--text-muted)]">
                {formatTimeAgo(post.sharedPost.createdAt)}
              </p>
            </div>
          </div>
          <p className="p-3 text-xs text-[var(--text-primary)]">
            {post.sharedPost.content}
          </p>
          {post.sharedPost.image && (
            <img
              src={post.sharedPost.image}
              alt="Shared content"
              className="w-full max-h-72 object-cover"
            />
          )}
        </div>
      )}

      {/* Post Image / Live Video Player */}
      {post.image && (
        <div
          onClick={() => {
            if (post.isLive) {
              setLiveStreamModalOpen(true);
            } else {
              openMediaModal(post.image!, post.content);
            }
          }}
          className="relative mt-2 w-full max-h-[500px] overflow-hidden bg-black/5 flex items-center justify-center cursor-pointer select-none group"
        >
          <img
            src={post.image}
            alt="Post media"
            className="w-full h-auto max-h-[500px] object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          />

          {post.isLive && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 flex flex-col justify-between p-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-black tracking-wider uppercase flex items-center gap-1.5 animate-pulse shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  LIVE
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  {(post.liveViewers || 840).toLocaleString()} watching
                </span>
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLiveStreamModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xl transition-all hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Join Live Stream
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-300">
                <span className="flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  Live Video Broadcast
                </span>
                <span>Click to enter live chat</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Counters Bar (Reactions & Comments/Shares) */}
      {(totalReactions > 0 || post.commentsCount > 0 || post.sharesCount > 0) && (
        <div className="flex items-center justify-between px-3.5 py-2 text-xs text-[var(--text-secondary)] border-b border-[var(--border-subtle)] mx-3.5">
          {/* Reaction icons stack */}
          <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
            {totalReactions > 0 && (
              <div className="flex items-center -space-x-1">
                {activeReactionEntries.slice(0, 3).map(([type]) => (
                  <span
                    key={type}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-xs ring-1 ring-[var(--bg-surface)]"
                  >
                    {reactionsConfig[type]?.emoji || '👍'}
                  </span>
                ))}
              </div>
            )}
            {totalReactions > 0 && <span>{formatNumber(totalReactions)}</span>}
          </div>

          <div className="flex items-center gap-3">
            {post.commentsCount > 0 && (
              <button
                onClick={() => setShowComments(!showComments)}
                className="hover:underline cursor-pointer"
              >
                {post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}
              </button>
            )}
            {post.sharesCount > 0 && (
              <span>
                {post.sharesCount} {post.sharesCount === 1 ? 'share' : 'shares'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons (Like, Comment, Share) */}
      <div className="grid grid-cols-3 gap-1 px-2 py-1 mx-2">
        {/* Like Button with Reaction Picker */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnterLike}
          onMouseLeave={handleMouseLeaveLike}
        >
          {showReactionPicker && (
            <ReactionPicker onSelect={handleReactionSelect} />
          )}

          <button
            type="button"
            onClick={handleMainLikeClick}
            className={`w-full py-1.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-xs transition-colors hover:bg-[var(--bg-hover)] ${
              post.userReaction
                ? reactionsConfig[post.userReaction]?.color || 'text-blue-600'
                : 'text-[var(--text-secondary)]'
            }`}
          >
            {post.userReaction ? (
              <span className="text-base leading-none">
                {reactionsConfig[post.userReaction]?.emoji}
              </span>
            ) : (
              <ThumbsUp className="w-4 h-4" />
            )}
            <span>
              {post.userReaction
                ? reactionsConfig[post.userReaction]?.label
                : 'Like'}
            </span>
          </button>
        </div>

        {/* Comment Button */}
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="w-full py-1.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={() => openShareModal(post)}
          className="w-full py-1.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-3.5 pb-3">
          <CommentSection postId={post.id} />
        </div>
      )}
    </div>
  );
}
