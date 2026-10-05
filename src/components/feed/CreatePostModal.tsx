'use client';

import React, { useState, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/stores/auth-store';
import { useFeedStore } from '@/stores/feed-store';
import { useUIStore } from '@/stores/ui-store';
import {
  Globe,
  Users,
  Lock,
  Image as ImageIcon,
  Smile,
  MapPin,
  UserPlus,
  X,
  ChevronDown,
} from 'lucide-react';

const feelingsList = [
  { label: 'excited', emoji: '🤩' },
  { label: 'happy', emoji: '😊' },
  { label: 'blessed', emoji: '😇' },
  { label: 'energized', emoji: '⚡' },
  { label: 'creative', emoji: '🎨' },
  { label: 'hungry', emoji: '🍜' },
  { label: 'peaceful', emoji: '🌿' },
  { label: 'inspired', emoji: '💡' },
];

export function CreatePostModal() {
  const { user } = useAuthStore();
  const { createPost } = useFeedStore();
  const { createPostModalOpen, setCreatePostModalOpen, showToast } = useUIStore();

  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'only_me'>('public');
  const [feeling, setFeeling] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [showFeelingsPicker, setShowFeelingsPicker] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [locationText, setLocationText] = useState('');
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSampleImage = (url: string) => {
    setImagePreview(url);
  };

  const handlePost = () => {
    if (!content.trim() && !imagePreview) return;

    createPost({
      content: content.trim(),
      image: imagePreview || undefined,
      feeling: feeling || undefined,
      location: location || undefined,
      privacy,
      author: user,
    });

    showToast('Post published successfully!', 'success');
    handleClose();
  };

  const handleClose = () => {
    setContent('');
    setImagePreview(null);
    setFeeling(null);
    setLocation(null);
    setShowFeelingsPicker(false);
    setShowLocationInput(false);
    setCreatePostModalOpen(false);
  };

  return (
    <Modal
      isOpen={createPostModalOpen}
      onClose={handleClose}
      title="Create post"
      maxWidth="lg"
    >
      <div className="p-4 space-y-4">
        {/* User Info & Privacy selector */}
        <div className="flex items-center gap-3">
          <Avatar src={user.avatar} alt={user.name} size="md" />
          <div>
            <p className="font-bold text-sm text-[var(--text-primary)]">
              {user.name}
              {feeling && (
                <span className="font-normal text-xs text-[var(--text-secondary)] ml-1">
                  is feeling <span className="font-semibold">{feeling}</span>
                </span>
              )}
            </p>

            <div className="relative inline-block mt-0.5">
              <button
                type="button"
                onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg-hover)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-active)]"
              >
                {privacy === 'public' && <Globe className="w-3 h-3" />}
                {privacy === 'friends' && <Users className="w-3 h-3" />}
                {privacy === 'only_me' && <Lock className="w-3 h-3" />}
                <span className="capitalize">
                  {privacy === 'only_me' ? 'Only me' : privacy}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showPrivacyDropdown && (
                <div className="absolute left-0 top-full mt-1 w-36 bg-[var(--bg-surface)] rounded-lg shadow-xl border border-[var(--border-subtle)] py-1 z-20 text-xs">
                  <button
                    onClick={() => {
                      setPrivacy('public');
                      setShowPrivacyDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[var(--bg-hover)] flex items-center gap-2"
                  >
                    <Globe className="w-3 h-3" /> Public
                  </button>
                  <button
                    onClick={() => {
                      setPrivacy('friends');
                      setShowPrivacyDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[var(--bg-hover)] flex items-center gap-2"
                  >
                    <Users className="w-3 h-3" /> Friends
                  </button>
                  <button
                    onClick={() => {
                      setPrivacy('only_me');
                      setShowPrivacyDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[var(--bg-hover)] flex items-center gap-2"
                  >
                    <Lock className="w-3 h-3" /> Only me
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Text Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
          className="w-full min-h-[120px] bg-transparent text-sm md:text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none focus:outline-hidden"
          autoFocus
        />

        {/* Location Display / Input */}
        {showLocationInput && (
          <div className="flex items-center gap-2 p-2 bg-[var(--bg-input)] rounded-lg">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <input
              type="text"
              placeholder="Where are you? (e.g. San Francisco, CA)"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setLocation(locationText);
                  setShowLocationInput(false);
                }
              }}
              className="w-full bg-transparent text-xs focus:outline-hidden"
            />
            <button
              onClick={() => {
                setLocation(locationText);
                setShowLocationInput(false);
              }}
              className="text-xs font-semibold text-[var(--fb-blue)] px-2"
            >
              Add
            </button>
          </div>
        )}

        {location && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--bg-hover)] rounded-lg text-xs">
            <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
              <MapPin className="w-3.5 h-3.5 text-rose-500" /> At {location}
            </span>
            <button onClick={() => setLocation(null)}>
              <X className="w-3.5 h-3.5 text-[var(--text-muted)] hover:text-rose-500" />
            </button>
          </div>
        )}

        {/* Feelings Picker */}
        {showFeelingsPicker && (
          <div className="p-2 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-main)]">
            <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">
              How are you feeling?
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {feelingsList.map((f) => (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => {
                    setFeeling(f.label);
                    setShowFeelingsPicker(false);
                  }}
                  className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-xs capitalize text-left"
                >
                  <span>{f.emoji}</span>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Image Preview Box */}
        {imagePreview && (
          <div className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] max-h-64 bg-black/5">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover max-h-64"
            />
            <button
              type="button"
              onClick={() => setImagePreview(null)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Add to your post Toolbar */}
        <div className="flex items-center justify-between p-3 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-main)]">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            Add to your post
          </span>

          <div className="flex items-center gap-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-emerald-500 transition-colors"
              title="Photo/video"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setShowFeelingsPicker(!showFeelingsPicker)}
              className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-yellow-500 transition-colors"
              title="Feeling/activity"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setShowLocationInput(!showLocationInput)}
              className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-rose-500 transition-colors"
              title="Check in / Location"
            >
              <MapPin className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setContent((prev) => prev + ' @Alice Johnson');
              }}
              className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-blue-500 transition-colors"
              title="Tag friends"
            >
              <UserPlus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Sample Photos for easy testing */}
        {!imagePreview && (
          <div className="space-y-1.5">
            <span className="text-[11px] text-[var(--text-muted)] font-medium">
              Or quick select a sample photo:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
              ].map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="Sample"
                  onClick={() => handleSelectSampleImage(url)}
                  className="w-14 h-14 rounded-lg object-cover cursor-pointer hover:opacity-80 border border-[var(--border-subtle)] shrink-0"
                />
              ))}
            </div>
          </div>
        )}

        {/* Submit Post Button */}
        <button
          type="button"
          disabled={!content.trim() && !imagePreview}
          onClick={handlePost}
          className="w-full py-2.5 rounded-lg bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors shadow-xs"
        >
          Post
        </button>
      </div>
    </Modal>
  );
}
