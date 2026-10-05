'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMessengerStore } from '@/stores/messenger-store';
import { useAuthStore } from '@/stores/auth-store';
import { mockUsers } from '@/data/users';
import { Avatar } from '@/components/ui/Avatar';
import { X, Minus, Send, Smile, Paperclip, Phone, Video, Maximize2 } from 'lucide-react';
import Link from 'next/link';

export function FloatingQuickChat() {
  const { user } = useAuthStore();
  const {
    activeFloatingChatUserId,
    setActiveFloatingChat,
    conversations,
    messages,
    sendMessage,
    typingConversations,
  } = useMessengerStore();

  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!activeFloatingChatUserId) return null;

  const targetUser = mockUsers.find((u) => u.id === activeFloatingChatUserId);
  if (!targetUser) return null;

  // Find conversation
  const conv = conversations.find(
    (c) =>
      !c.isGroup &&
      c.participants.some((p) => p.id === activeFloatingChatUserId)
  );

  const convId = conv ? conv.id : 'temp';
  const chatMessages = messages.filter((m) => m.conversationId === convId);
  const isTyping = typingConversations[convId];

  // Scroll to bottom on message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputText.trim() && conv) {
      sendMessage(conv.id, inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="hidden md:flex fixed bottom-0 right-20 z-50 flex-col w-80 rounded-t-2xl shadow-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden animate-pop-in">
      {/* Header */}
      <div className="flex items-center justify-between p-2.5 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] shadow-xs">
        <div className="flex items-center gap-2">
          <Avatar
            src={targetUser.avatar}
            alt={targetUser.name}
            size="sm"
            isOnline={targetUser.isOnline}
          />
          <div>
            <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">
              {targetUser.name}
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">
              {targetUser.isOnline ? 'Active now' : targetUser.lastActive || 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[var(--text-muted)]">
          <Link
            href="/messenger"
            className="p-1 rounded-full hover:bg-[var(--bg-hover)]"
            title="Open full Messenger"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded-full hover:bg-[var(--bg-hover)]"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveFloatingChat(null)}
            className="p-1 rounded-full hover:bg-[var(--bg-hover)] text-rose-500"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body & Messages */}
      {!isMinimized && (
        <>
          <div className="h-72 overflow-y-auto p-3 space-y-2.5 bg-[var(--bg-main)]">
            {chatMessages.length === 0 ? (
              <div className="text-center py-6 text-xs text-[var(--text-muted)]">
                Say hello to {targetUser.name}! 👋
              </div>
            ) : (
              chatMessages.map((msg) => {
                const isMe = msg.senderId === user.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-1.5 ${
                      isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!isMe && (
                      <Avatar
                        src={targetUser.avatar}
                        alt={targetUser.name}
                        size="xs"
                      />
                    )}
                    <div
                      className={`max-w-[75%] px-3 py-1.5 rounded-2xl text-xs ${
                        isMe
                          ? 'bg-[var(--fb-blue)] text-white rounded-br-xs'
                          : 'bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-bl-xs border border-[var(--border-subtle)]'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </div>
                );
              })
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <Avatar
                  src={targetUser.avatar}
                  alt={targetUser.name}
                  size="xs"
                />
                <div className="flex items-center gap-1 bg-[var(--bg-surface)] px-2.5 py-1 rounded-full border border-[var(--border-subtle)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 typing-dot-1" />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 typing-dot-2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 typing-dot-3" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-2 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] flex items-center gap-1.5"
          >
            <input
              type="text"
              placeholder="Aa"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[var(--bg-input)] rounded-full px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-hidden"
              autoFocus
            />
            {inputText.trim() ? (
              <button
                type="submit"
                className="p-1.5 rounded-full text-[var(--fb-blue)] hover:bg-[var(--bg-hover)]"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setInputText((prev) => prev + ' 👍')}
                className="p-1.5 rounded-full text-[var(--fb-blue)] hover:bg-[var(--bg-hover)] text-base leading-none"
              >
                👍
              </button>
            )}
          </form>
        </>
      )}
    </div>
  );
}
