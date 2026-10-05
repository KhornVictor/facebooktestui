'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMessengerStore } from '@/stores/messenger-store';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { ConversationItem } from './ConversationItem';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import { Avatar } from '@/components/ui/Avatar';
import { Message, User } from '@/types';
import {
  Search,
  Phone,
  Video,
  Info,
  ChevronLeft,
  X,
  MessageCircle,
} from 'lucide-react';

export function MessengerView() {
  const { user } = useAuthStore();
  const {
    conversations,
    messages,
    activeConversationId,
    setActiveConversation,
    sendMessage,
    typingConversations,
  } = useMessengerStore();
  const { showToast } = useUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'groups'>('all');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If active conversation set, on mobile switch to chat
  useEffect(() => {
    if (activeConversationId) {
      setMobileShowChat(true);
    }
  }, [activeConversationId]);

  // Find active conversation
  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  ) || conversations[0];

  const activePartner: User = activeConversation
    ? activeConversation.participants.find((p) => p.id !== user.id) ||
      activeConversation.participants[0]
    : user;

  const chatTitle = activeConversation?.isGroup
    ? activeConversation.groupName
    : activePartner.name;

  const chatAvatar = activeConversation?.isGroup
    ? activeConversation.groupAvatar
    : activePartner.avatar;

  const activeMessages = activeConversation
    ? messages.filter((m) => m.conversationId === activeConversation.id)
    : [];

  const isTyping = activeConversation
    ? typingConversations[activeConversation.id]
    : false;

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, isTyping]);

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    // Tab filter
    if (filterTab === 'unread' && conv.unreadCount === 0) return false;
    if (filterTab === 'groups' && !conv.isGroup) return false;

    // Search query filter: check participant names OR message content
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = conv.participants.some((p) =>
        p.name.toLowerCase().includes(q)
      );
      const matchGroupName = conv.groupName?.toLowerCase().includes(q);
      const matchMessages = messages.some(
        (m) => m.conversationId === conv.id && m.text.toLowerCase().includes(q)
      );
      return matchName || matchGroupName || matchMessages;
    }

    return true;
  });

  const handleSimulateCall = (type: 'audio' | 'video') => {
    showToast(
      `Starting ${type} call with ${chatTitle}... (Simulated)`,
      'info'
    );
  };

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] flex bg-[var(--bg-surface)] overflow-hidden">
      {/* Left Pane: Conversation List */}
      <div
        className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)] ${
          mobileShowChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header */}
        <div className="p-3.5 pb-2 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              Chats
            </h1>
          </div>

          {/* Search Box */}
          <div className="flex items-center bg-[var(--bg-input)] rounded-full px-3 py-1.5">
            <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
            <input
              type="text"
              placeholder="Search Messenger"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden ml-2 w-full"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5 text-xs font-semibold">
            {(['all', 'unread', 'groups'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1 rounded-full capitalize transition-colors ${
                  filterTab === tab
                    ? 'bg-[var(--fb-blue-light)] text-[var(--fb-blue)]'
                    : 'bg-[var(--bg-input)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List Scroll Area */}
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-[var(--text-muted)]">
              No conversations found.
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeConversation?.id}
                onClick={() => {
                  setActiveConversation(conv.id);
                  setMobileShowChat(true);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Right Pane: Chat Window */}
      <div
        className={`flex-1 flex flex-col h-full bg-[var(--bg-main)] min-w-0 ${
          !mobileShowChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0 select-none shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                {/* Back button on mobile */}
                <button
                  type="button"
                  onClick={() => setMobileShowChat(false)}
                  className="md:hidden p-1.5 -ml-1 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
                  title="Back to conversations"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <Avatar
                  src={chatAvatar}
                  alt={chatTitle || ''}
                  size="md"
                  isOnline={!activeConversation.isGroup && activePartner.isOnline}
                />

                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-[var(--text-primary)] truncate">
                    {chatTitle}
                  </h2>
                  <p className="text-[11px] text-[var(--text-muted)] truncate">
                    {activeConversation.isGroup
                      ? `${activeConversation.participants.length} members`
                      : activePartner.isOnline
                      ? 'Active now'
                      : activePartner.lastActive || 'Offline'}
                  </p>
                </div>
              </div>

              {/* Action buttons (Call, Video, Info) */}
              <div className="flex items-center gap-1 text-[var(--fb-blue)]">
                <button
                  type="button"
                  onClick={() => handleSimulateCall('audio')}
                  className="p-2 rounded-full hover:bg-[var(--bg-hover)] transition-colors"
                  title="Start audio call"
                >
                  <Phone className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateCall('video')}
                  className="p-2 rounded-full hover:bg-[var(--bg-hover)] transition-colors"
                  title="Start video call"
                >
                  <Video className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      `Chat with ${chatTitle} • ${activeMessages.length} messages`,
                      'info'
                    )
                  }
                  className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-muted)] transition-colors"
                  title="Conversation info"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {/* Chat intro header */}
              <div className="text-center py-6 space-y-2 border-b border-[var(--border-subtle)] mb-4">
                <Avatar
                  src={chatAvatar}
                  alt={chatTitle || ''}
                  size="2xl"
                  className="mx-auto"
                />
                <h3 className="font-bold text-lg text-[var(--text-primary)]">
                  {chatTitle}
                </h3>
                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                  {activeConversation.isGroup
                    ? 'Group conversation with your team.'
                    : `You're friends on Facebook • Lives in ${activePartner.location || 'San Francisco, CA'}`}
                </p>
              </div>

              {/* Messages list */}
              {activeMessages.map((msg) => {
                const sender =
                  activeConversation.participants.find(
                    (p) => p.id === msg.senderId
                  ) || user;

                return (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    sender={sender}
                    onReply={(m) => setReplyingTo(m)}
                  />
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-2 animate-pop-in">
                  <Avatar src={chatAvatar} alt={chatTitle || ''} size="xs" />
                  <div className="flex items-center gap-1 bg-[var(--bg-surface)] px-3 py-2 rounded-full border border-[var(--border-subtle)]">
                    <span className="text-[11px] font-semibold text-[var(--text-secondary)] mr-1">
                      {chatTitle} is typing
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 typing-dot-1" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 typing-dot-2" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 typing-dot-3" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <MessageComposer
              onSendMessage={(txt, atts, replyId, replyTxt) =>
                sendMessage(
                  activeConversation.id,
                  txt,
                  atts,
                  replyId,
                  replyTxt
                )
              }
              replyingTo={replyingTo}
              onCancelReply={() => setReplyingTo(null)}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[var(--text-muted)]">
            <MessageCircle className="w-16 h-16 mb-2 opacity-30" />
            <h3 className="font-bold text-lg text-[var(--text-primary)]">
              Select a chat or start a new conversation
            </h3>
            <p className="text-xs max-w-sm mt-1">
              Send messages, photos, emojis, and simulate live instant replies with friends.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
