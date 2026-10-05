'use client';

import React, { useState, useRef } from 'react';
import { Message, MessageAttachment } from '@/types';
import {
  Image as ImageIcon,
  Smile,
  Mic,
  PlusCircle,
  Send,
  X,
  Paperclip,
  FileText,
  ThumbsUp,
} from 'lucide-react';

interface MessageComposerProps {
  onSendMessage: (
    text: string,
    attachments?: MessageAttachment[],
    replyToId?: string,
    replyToText?: string
  ) => void;
  replyingTo: Message | null;
  onCancelReply: () => void;
}

const emojiList = ['😊', '😂', '🔥', '❤️', '👍', '🎉', '🚀', '🙌', '✨', '☕', '💡', '🥳'];

export function MessageComposer({
  onSendMessage,
  replyingTo,
  onCancelReply,
}: MessageComposerProps) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() && attachments.length === 0) return;

    onSendMessage(
      text.trim(),
      attachments,
      replyingTo?.id,
      replyingTo?.text
    );

    setText('');
    setAttachments([]);
    setShowEmojiPicker(false);
    onCancelReply();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImg = file.type.startsWith('image/');
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachments((prev) => [
          ...prev,
          {
            type: isImg ? 'image' : 'file',
            url: reader.result as string,
            name: file.name,
            size: `${(file.size / 1024).toFixed(0)} KB`,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2.5 space-y-2 select-none">
      {/* Replying Banner */}
      {replyingTo && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--bg-hover)] rounded-lg text-xs animate-pop-in">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-bold text-[var(--fb-blue)]">Replying to:</span>
            <span className="truncate text-[var(--text-muted)] italic">
              {replyingTo.text}
            </span>
          </div>
          <button
            onClick={onCancelReply}
            className="text-[var(--text-muted)] hover:text-rose-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="flex gap-2 overflow-x-auto p-1">
          {attachments.map((att, i) => (
            <div
              key={i}
              className="relative rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-main)] max-h-20 shrink-0"
            >
              {att.type === 'image' ? (
                <img src={att.url} alt="preview" className="h-16 w-16 object-cover" />
              ) : (
                <div className="h-16 px-3 flex flex-col justify-center text-xs">
                  <FileText className="w-5 h-5 text-[var(--fb-blue)]" />
                  <span className="truncate max-w-[80px]">{att.name}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemoveAttachment(i)}
                className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center text-[10px]"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Recording Simulation Bar */}
      {isRecording && (
        <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold animate-pulse">
          <span>🔴 Recording voice message... (0:04)</span>
          <button
            onClick={() => {
              setIsRecording(false);
              onSendMessage('🎤 [Voice Message 0:08]');
            }}
            className="px-2.5 py-1 rounded bg-rose-500 text-white"
          >
            Send Audio
          </button>
        </div>
      )}

      {/* Composer Row */}
      <div className="flex items-center gap-1.5">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Plus / Attach */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 rounded-full hover:bg-[var(--bg-hover)] text-[var(--fb-blue)] transition-colors"
          title="Attach file"
        >
          <PlusCircle className="w-5 h-5" />
        </button>

        {/* Image Attachment */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 rounded-full hover:bg-[var(--bg-hover)] text-emerald-500 transition-colors"
          title="Send photo"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {/* Voice Note Simulation */}
        <button
          type="button"
          onClick={() => setIsRecording(!isRecording)}
          className={`p-1.5 rounded-full transition-colors ${
            isRecording
              ? 'text-rose-500 bg-rose-100'
              : 'hover:bg-[var(--bg-hover)] text-purple-500'
          }`}
          title="Voice message"
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Text Input Box */}
        <div className="flex-1 relative flex items-center bg-[var(--bg-input)] rounded-full px-3.5 py-2">
          <input
            type="text"
            placeholder="Aa"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden"
          />

          {/* Emoji button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-[var(--text-muted)] hover:text-amber-500 transition-colors ml-1"
            title="Emoji"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Floating Emoji Picker Popover */}
          {showEmojiPicker && (
            <div className="absolute right-0 bottom-full mb-2 p-2 bg-[var(--bg-surface)] rounded-xl shadow-xl border border-[var(--border-subtle)] grid grid-cols-6 gap-1 z-30 animate-pop-in">
              {emojiList.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setText((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="p-1.5 text-lg hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Send Button or Thumbs Up Shortcut */}
        {text.trim() || attachments.length > 0 ? (
          <button
            type="button"
            onClick={() => handleSend()}
            className="p-2 rounded-full text-white bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] transition-colors shadow-xs"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSendMessage('👍')}
            className="p-2 rounded-full text-[var(--fb-blue)] hover:bg-[var(--bg-hover)] transition-colors text-xl leading-none"
            title="Send Thumbs Up"
          >
            👍
          </button>
        )}
      </div>
    </div>
  );
}
