'use client';

import React, { useState } from 'react';
import { Message, User } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/stores/auth-store';
import { useMessengerStore } from '@/stores/messenger-store';
import { useUIStore } from '@/stores/ui-store';
import { formatTimeAgo } from '@/lib/utils';
import {
  Smile,
  MoreVertical,
  Reply,
  Copy,
  Edit2,
  Trash2,
  Check,
  CheckCheck,
  CornerDownRight,
} from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  sender: User;
  onReply: (message: Message) => void;
}

const quickReactions = ['❤️', '👍', '😂', '😮', '😢', '😡'];

export function MessageBubble({ message, sender, onReply }: MessageBubbleProps) {
  const { user } = useAuthStore();
  const { reactToMessage, deleteMessage, editMessage } = useMessengerStore();
  const { showToast, openMediaModal } = useUIStore();

  const [showActions, setShowActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);

  const isMe = message.senderId === user.id;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    showToast('Message copied', 'info');
    setShowActions(false);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      editMessage(message.id, editText.trim());
      setIsEditing(false);
      showToast('Message updated', 'info');
    }
  };

  const handleReaction = (emoji: string) => {
    reactToMessage(message.id, emoji, user.id);
    setShowReactionPicker(false);
  };

  return (
    <div
      className={`group relative flex items-end gap-2 mb-2 select-none ${
        isMe ? 'flex-row-reverse' : 'flex-row'
      }`}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactionPicker(false);
      }}
    >
      {/* Sender Avatar for received messages */}
      {!isMe && (
        <Avatar src={sender.avatar} alt={sender.name} size="xs" className="mb-1" />
      )}

      {/* Bubble Container */}
      <div className={`relative max-w-[75%] sm:max-w-[65%] space-y-1`}>
        {/* Reply context quote */}
        {message.replyToText && (
          <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] italic px-2">
            <CornerDownRight className="w-3 h-3" />
            <span className="truncate">Replying: {message.replyToText}</span>
          </div>
        )}

        {/* Message Content */}
        <div
          className={`relative px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
            isMe
              ? 'bg-[var(--fb-blue)] text-white rounded-br-xs shadow-xs'
              : 'bg-[var(--bg-hover)] text-[var(--text-primary)] rounded-bl-xs'
          }`}
        >
          {isEditing ? (
            <div className="space-y-1.5">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                className="w-full bg-[var(--bg-surface)] text-[var(--text-primary)] px-2 py-1 rounded text-xs focus:outline-hidden"
                autoFocus
              />
              <div className="flex gap-2 text-[11px] text-white/90">
                <button onClick={handleSaveEdit} className="hover:underline font-bold">
                  Save
                </button>
                <button onClick={() => setIsEditing(false)} className="hover:underline">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.text}</p>
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {message.attachments.map((att, i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  {att.type === 'image' ? (
                    <img
                      src={att.url}
                      alt="Attachment"
                      onClick={() => openMediaModal(att.url, att.name)}
                      className="max-h-60 w-auto rounded-lg object-cover cursor-pointer hover:opacity-90"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-black/10 rounded-lg text-xs">
                      <span>📎</span>
                      <span className="truncate">{att.name || 'File attachment'}</span>
                      {att.size && <span className="opacity-70 text-[10px]">({att.size})</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Reactions bar under bubble */}
          {message.reactions && message.reactions.length > 0 && (
            <div
              className={`absolute -bottom-2.5 flex items-center gap-0.5 bg-[var(--bg-surface)] px-1.5 py-0.5 rounded-full shadow-xs border border-[var(--border-subtle)] text-xs ${
                isMe ? 'right-2' : 'left-2'
              }`}
            >
              {message.reactions.map((r, idx) => (
                <span key={idx} className="cursor-pointer hover:scale-125 transition-transform">
                  {r.emoji}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp & Read Receipt */}
        <div
          className={`flex items-center gap-1 text-[10px] text-[var(--text-muted)] px-1 ${
            isMe ? 'justify-end' : 'justify-start'
          }`}
        >
          <span>{formatTimeAgo(message.createdAt)}</span>
          {isMe && (
            <span title={message.status}>
              {message.status === 'read' ? (
                <CheckCheck className="w-3 h-3 text-[var(--fb-blue)]" />
              ) : message.status === 'delivered' ? (
                <CheckCheck className="w-3 h-3 text-[var(--text-muted)]" />
              ) : (
                <Check className="w-3 h-3 text-[var(--text-muted)]" />
              )}
            </span>
          )}
        </div>
      </div>

      {/* Hover Action Buttons */}
      <div
        className={`opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity ${
          isMe ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Quick Reaction Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="p-1 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            title="React"
          >
            <Smile className="w-4 h-4" />
          </button>

          {showReactionPicker && (
            <div className="absolute bottom-full mb-1 flex items-center gap-1 p-1 bg-[var(--bg-surface)] rounded-full shadow-lg border border-[var(--border-subtle)] z-20 animate-pop-in">
              {quickReactions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleReaction(emoji)}
                  className="p-1 text-base hover:scale-130 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reply Button */}
        <button
          type="button"
          onClick={() => onReply(message)}
          className="p-1 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          title="Reply"
        >
          <Reply className="w-4 h-4" />
        </button>

        {/* More Actions Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowActions(!showActions)}
            className="p-1 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            title="More"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showActions && (
            <div className="absolute bottom-full right-0 mb-1 w-32 bg-[var(--bg-surface)] rounded-xl shadow-xl border border-[var(--border-subtle)] py-1 z-30 animate-pop-in text-xs">
              <button
                type="button"
                onClick={handleCopy}
                className="w-full px-3 py-1.5 hover:bg-[var(--bg-hover)] flex items-center gap-2 text-left"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>

              {isMe && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(true);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-[var(--bg-hover)] flex items-center gap-2 text-left"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      deleteMessage(message.id);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-[var(--bg-hover)] text-rose-500 flex items-center gap-2 text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
