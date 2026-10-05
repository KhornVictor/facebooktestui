'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useUIStore } from '@/stores/ui-store';
import { useFeedStore } from '@/stores/feed-store';
import { useMessengerStore } from '@/stores/messenger-store';
import { useAuthStore } from '@/stores/auth-store';
import { Avatar } from '@/components/ui/Avatar';
import { Share2, MessageCircle, Copy, Check, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ShareModal() {
  const router = useRouter();
  const { shareModalState, closeShareModal, showToast } = useUIStore();
  const { sharePost } = useFeedStore();
  const { conversations, sendMessage, setActiveConversation } = useMessengerStore();
  const { user } = useAuthStore();

  const [shareText, setShareText] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'messenger'>('feed');
  const [selectedConvId, setSelectedConvId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [copied, setCopied] = useState(false);

  const post = shareModalState.post;
  if (!post) return null;

  const handleShareToFeed = () => {
    sharePost(post, shareText, user);
    showToast('Shared to your feed!', 'success');
    closeShareModal();
    setShareText('');
  };

  const handleSendInMessenger = () => {
    if (!selectedConvId) return;
    const shareMessage = `Check out this post by ${post.author.name}: "${post.content.slice(0, 100)}..."`;
    sendMessage(selectedConvId, shareMessage);
    setActiveConversation(selectedConvId);
    showToast('Sent in Messenger!', 'success');
    closeShareModal();
    router.push('/messenger');
  };

  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/home#${post.id}`;
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    showToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={shareModalState.isOpen}
      onClose={closeShareModal}
      title="Share Post"
      maxWidth="md"
    >
      <div className="p-4 space-y-4">
        {/* Share Mode Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--bg-main)] rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('feed')}
            className={`flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-colors ${
              activeTab === 'feed'
                ? 'bg-[var(--bg-surface)] text-[var(--fb-blue)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Share2 className="w-4 h-4" />
            Share to Feed
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('messenger')}
            className={`flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-colors ${
              activeTab === 'messenger'
                ? 'bg-[var(--bg-surface)] text-[var(--fb-blue)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Send in Messenger
          </button>
        </div>

        {activeTab === 'feed' ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Avatar src={user.avatar} alt={user.name} size="md" />
              <div>
                <p className="text-sm font-semibold">{user.name}</p>
                <span className="text-xs text-[var(--text-secondary)] bg-[var(--bg-hover)] px-2 py-0.5 rounded-md">
                  Public
                </span>
              </div>
            </div>

            <textarea
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              placeholder="Say something about this..."
              className="w-full h-20 p-2.5 rounded-lg bg-[var(--bg-input)] text-sm resize-none focus:outline-hidden focus:ring-1 focus:ring-[var(--fb-blue)]"
            />

            {/* Embedded Post Preview */}
            <div className="p-3 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-main)] space-y-2">
              <div className="flex items-center gap-2">
                <Avatar src={post.author.avatar} alt={post.author.name} size="xs" />
                <span className="text-xs font-semibold">{post.author.name}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-3">
                {post.content}
              </p>
            </div>

            <button
              type="button"
              onClick={handleShareToFeed}
              className="w-full py-2.5 rounded-lg bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              Share Now
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Choose Conversation
            </label>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {conversations.map((conv) => {
                const partner =
                  conv.participants.find((p) => p.id !== user.id) ||
                  conv.participants[0];
                const displayName = conv.isGroup
                  ? conv.groupName
                  : partner.name;
                const displayAvatar = conv.isGroup
                  ? conv.groupAvatar
                  : partner.avatar;

                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${
                      selectedConvId === conv.id
                        ? 'bg-[var(--fb-blue-light)] text-[var(--fb-blue)]'
                        : 'hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar src={displayAvatar} alt={displayName || ''} size="sm" />
                      <span className="text-sm font-medium">{displayName}</span>
                    </div>
                    {selectedConvId === conv.id && (
                      <Check className="w-4 h-4 text-[var(--fb-blue)]" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleSendInMessenger}
              className="w-full py-2.5 rounded-lg bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send to Chat
            </button>
          </div>
        )}

        {/* Copy Link Option */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <span className="text-xs text-[var(--text-secondary)]">
            Or share link directly:
          </span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] text-xs font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
