'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { useFeedStore } from '@/stores/feed-store';
import { Avatar } from '@/components/ui/Avatar';
import { mockUsers } from '@/data/users';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  X,
  Radio,
  Users,
  Eye,
  Heart,
  ThumbsUp,
  Smile,
  Send,
  Sparkles,
  Share2,
  Check,
  Settings,
  Flame,
} from 'lucide-react';

interface LiveComment {
  id: string;
  user: typeof mockUsers[0];
  text: string;
  time: string;
}

interface FloatingEmoji {
  id: number;
  emoji: string;
  left: number;
}

const mockLiveCommentsPool = [
  'Awesome stream Victor! 👋',
  'The video quality is incredible! 1080p looks super crisp.',
  'Hello from San Francisco! 🌉',
  'Loving this live demo! ❤️',
  'Can you show the Messenger component next?',
  'Super clean animations on that modal! 🔥',
  'What camera and lens are you using?',
  'React 19 with Next.js 16 is so fast!',
  'Greetings from Seattle! ☕🌲',
  'Shared this live video to our tech group! 🚀',
  'Look at those sub-pixel borders! ✨',
  'Keep up the great work! 👏',
];

export function LiveStreamModal() {
  const { liveStreamModalOpen, setLiveStreamModalOpen, showToast } = useUIStore();
  const { user } = useAuthStore();
  const { createPost } = useFeedStore();

  const [streamState, setStreamState] = useState<'setup' | 'countdown' | 'live' | 'ended'>('setup');
  const [countdown, setCountdown] = useState(3);
  const [title, setTitle] = useState('Building Next.js Facebook Live Studio! 🚀');
  const [description, setDescription] = useState('Interactive live stream demo with real-time comments, viewer counter, and camera feed.');
  const [category, setCategory] = useState('Technology & Coding');

  // Stream controls
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [hasWebcamAccess, setHasWebcamAccess] = useState(false);

  // Live metrics
  const [streamDuration, setStreamDuration] = useState(0);
  const [viewerCount, setViewerCount] = useState(340);
  const [liveComments, setLiveComments] = useState<LiveComment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [totalReactionsCount, setTotalReactionsCount] = useState(48);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Request camera / video setup
  useEffect(() => {
    if (!liveStreamModalOpen) {
      // Clean up stream when closing
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      setStreamState('setup');
      setStreamDuration(0);
      setLiveComments([]);
      return;
    }

    async function initMedia() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasWebcamAccess(true);
        }
      } catch (err) {
        console.warn('Webcam permission not granted or unavailable, using simulated video stream.', err);
        setHasWebcamAccess(false);
      }
    }

    initMedia();
  }, [liveStreamModalOpen]);

  // Handle countdown
  useEffect(() => {
    if (streamState === 'countdown') {
      if (countdown > 1) {
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setStreamState('live');
          setStreamDuration(0);
          setViewerCount(380);
          showToast('🔴 You are now LIVE!', 'success');
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [streamState, countdown, showToast]);

  // Live timer & simulated viewers & chat generator
  useEffect(() => {
    if (streamState !== 'live') return;

    // Timer every second
    const timerInterval = setInterval(() => {
      setStreamDuration((prev) => prev + 1);
    }, 1000);

    // Viewers fluctuation every 3 seconds
    const viewerInterval = setInterval(() => {
      setViewerCount((prev) => {
        const delta = Math.floor(Math.random() * 25) - 8;
        return Math.max(120, prev + delta);
      });
    }, 3000);

    // Incoming simulated comments every 2.5 - 4 seconds
    const commentInterval = setInterval(() => {
      const randomUser = mockUsers[Math.floor(Math.random() * (mockUsers.length - 1)) + 1];
      const randomText = mockLiveCommentsPool[Math.floor(Math.random() * mockLiveCommentsPool.length)];
      const newComment: LiveComment = {
        id: `lc_${Date.now()}_${Math.random()}`,
        user: randomUser,
        text: randomText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setLiveComments((prev) => [...prev.slice(-25), newComment]);

      // Automatically spawn flying reaction
      const emojis = ['❤️', '👍', '🔥', '👏', '😮'];
      const pickEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      triggerFloatingReaction(pickEmoji);
    }, 3200);

    return () => {
      clearInterval(timerInterval);
      clearInterval(viewerInterval);
      clearInterval(commentInterval);
    };
  }, [streamState]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveComments.length]);

  const triggerFloatingReaction = (emoji: string) => {
    setTotalReactionsCount((c) => c + 1);
    const id = Date.now() + Math.random();
    const left = 60 + Math.random() * 30; // random percentage from right edge
    setFloatingEmojis((prev) => [...prev, { id, emoji, left }]);

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 2400);
  };

  const handleStartCountdown = () => {
    setCountdown(3);
    setStreamState('countdown');
  };

  const handleEndStream = () => {
    setStreamState('ended');
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const handlePostReplay = () => {
    createPost({
      author: user,
      content: `🔴 [LIVE REPLAY] ${title}\n\nBroadcasted live for ${formatDuration(streamDuration)} with ${viewerCount.toLocaleString()} viewers! Thanks for tuning in everyone!`,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      privacy: 'public',
      feeling: 'accomplished',
    });
    showToast('Live stream replay published to your feed!', 'success');
    setLiveStreamModalOpen(false);
  };

  const handleSendLiveComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const myComment: LiveComment = {
      id: `lc_${Date.now()}`,
      user: user,
      text: commentInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setLiveComments((prev) => [...prev, myComment]);
    setCommentInput('');
  };

  const toggleMic = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMicMuted;
      });
    }
    setIsMicMuted(!isMicMuted);
    showToast(isMicMuted ? 'Microphone enabled' : 'Microphone muted', 'info');
  };

  const toggleCam = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = isCamOff;
      });
    }
    setIsCamOff(!isCamOff);
    showToast(isCamOff ? 'Camera enabled' : 'Camera turned off', 'info');
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = screenStream;
          }
          setIsScreenSharing(true);
          showToast('Screen sharing started!', 'success');
        } else {
          setIsScreenSharing(true);
          showToast('Simulated screen share active', 'info');
        }
      } catch {
        setIsScreenSharing(true);
        showToast('Simulated screen share activated', 'info');
      }
    } else {
      if (mediaStreamRef.current && videoRef.current) {
        videoRef.current.srcObject = mediaStreamRef.current;
      }
      setIsScreenSharing(false);
      showToast('Switched back to camera', 'info');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!liveStreamModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden flex flex-col">
        {/* Top Studio Bar */}
        <div className="h-14 px-4 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0 bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                Facebook Live Producer
                {streamState === 'live' && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black tracking-wider uppercase animate-pulse">
                    LIVE
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                {streamState === 'setup'
                  ? 'Setup stream details & test camera'
                  : streamState === 'live'
                  ? `Broadcasting for ${formatDuration(streamDuration)}`
                  : 'Broadcast ended'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {streamState === 'live' && (
              <div className="flex items-center gap-3 bg-[var(--bg-main)] px-3 py-1.5 rounded-full border border-[var(--border-subtle)] text-xs font-bold">
                <span className="flex items-center gap-1.5 text-rose-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping inline-block" />
                  {formatDuration(streamDuration)}
                </span>
                <span className="text-[var(--text-muted)]">•</span>
                <span className="flex items-center gap-1.5 text-[var(--text-primary)]">
                  <Eye className="w-4 h-4 text-emerald-500" />
                  {viewerCount.toLocaleString()}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setLiveStreamModalOpen(false)}
              className="w-8 h-8 rounded-full bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Main Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Left Column: Video Broadcast Viewport */}
          <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
            {/* Real Webcam or Simulated Fallback Video */}
            {hasWebcamAccess && !isCamOff && !isScreenSharing ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : isCamOff ? (
              <div className="flex flex-col items-center justify-center text-zinc-500 space-y-2">
                <VideoOff className="w-16 h-16" />
                <p className="text-sm font-semibold">Camera is turned off</p>
              </div>
            ) : isScreenSharing ? (
              <div className="w-full h-full relative flex items-center justify-center bg-zinc-900 p-8">
                <div className="w-full max-w-xl p-6 rounded-xl border border-zinc-700 bg-zinc-800 text-left space-y-3 shadow-2xl">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-emerald-400" />
                      Screen Share: Workspace Terminal
                    </span>
                    <span>1080p 60FPS</span>
                  </div>
                  <div className="p-3 bg-black/60 rounded-lg font-mono text-xs text-emerald-400 space-y-1">
                    <p>$ npm run dev</p>
                    <p>▲ Next.js 16.3.8 (Turbopack)</p>
                    <p>✓ Ready in 650ms on http://localhost:3000</p>
                    <p>● Live Stream WebSocket simulation: Connected</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80"
                  alt="Simulated stream broadcast"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-2xs" />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Simulated Studio Camera (Webcam optional)
                </div>
              </div>
            )}

            {/* Countdown Overlay */}
            {streamState === 'countdown' && (
              <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center z-30 animate-pop-in">
                <span className="text-8xl font-black text-rose-500 animate-ping">
                  {countdown}
                </span>
                <p className="text-lg font-bold text-white mt-4">
                  Going Live in a moment...
                </p>
              </div>
            )}

            {/* LIVE Badges Overlay */}
            {streamState === 'live' && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black tracking-wider uppercase shadow-lg flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  LIVE
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  {viewerCount.toLocaleString()}
                </span>
              </div>
            )}

            {/* Floating Emojis Animation Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
              {floatingEmojis.map((item) => (
                <div
                  key={item.id}
                  className="absolute bottom-16 text-3xl transition-all duration-2000 ease-out"
                  style={{
                    right: `${item.left}%`,
                    animation: 'floatUp 2.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
                  }}
                >
                  {item.emoji}
                </div>
              ))}
            </div>

            {/* Stream Control Overlay at Bottom of Video */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md p-1.5 rounded-full border border-white/20">
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`p-2 rounded-full transition-colors ${
                    isMicMuted
                      ? 'bg-rose-600 text-white'
                      : 'hover:bg-white/20 text-white'
                  }`}
                  title={isMicMuted ? 'Unmute' : 'Mute'}
                >
                  {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={toggleCam}
                  className={`p-2 rounded-full transition-colors ${
                    isCamOff
                      ? 'bg-rose-600 text-white'
                      : 'hover:bg-white/20 text-white'
                  }`}
                  title={isCamOff ? 'Turn on camera' : 'Turn off camera'}
                >
                  {isCamOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={toggleScreenShare}
                  className={`p-2 rounded-full transition-colors ${
                    isScreenSharing
                      ? 'bg-emerald-600 text-white'
                      : 'hover:bg-white/20 text-white'
                  }`}
                  title="Share Screen"
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Reaction Bursts */}
              {streamState === 'live' && (
                <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md p-1.5 rounded-full border border-white/20">
                  {['❤️', '👍', '🔥', '😮', '👏'].map((emo) => (
                    <button
                      key={emo}
                      type="button"
                      onClick={() => triggerFloatingReaction(emo)}
                      className="text-lg p-1 hover:scale-130 active:scale-95 transition-transform"
                      title="Send reaction"
                    >
                      {emo}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Setup Panel OR Live Chat Stream OR Recap */}
          <div className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-[var(--border-subtle)] flex flex-col justify-between bg-[var(--bg-surface)]">
            {/* STAGE 1: SETUP MODE */}
            {streamState === 'setup' && (
              <div className="p-4 space-y-4 flex-1 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-[var(--border-subtle)]">
                    <Avatar src={user.avatar} alt={user.name} size="md" />
                    <div>
                      <p className="font-bold text-sm">{user.name}</p>
                      <span className="text-[11px] text-[var(--text-muted)] bg-[var(--bg-hover)] px-2 py-0.5 rounded-md">
                        Broadcasting to Public
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
                        Stream Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What are you streaming about?"
                        className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] text-xs border border-[var(--border-subtle)] font-medium focus:outline-hidden focus:ring-1 focus:ring-[var(--fb-blue)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] text-xs border border-[var(--border-subtle)] font-medium"
                      >
                        <option value="Technology & Coding">Technology & Coding</option>
                        <option value="Gaming">Gaming & Esports</option>
                        <option value="Just Chatting">Just Chatting & AMA</option>
                        <option value="Music & Audio">Music & Creative</option>
                        <option value="Fitness & Health">Fitness & Workouts</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] text-xs border border-[var(--border-subtle)] resize-none focus:outline-hidden"
                      />
                    </div>

                    {/* Hardware Test Status */}
                    <div className="p-3 bg-[var(--bg-main)] rounded-xl text-xs space-y-1.5">
                      <p className="font-bold text-[var(--text-primary)]">Stream Diagnostics</p>
                      <div className="flex items-center justify-between text-[var(--text-secondary)]">
                        <span>Video Source:</span>
                        <span className="font-semibold text-emerald-500">
                          {hasWebcamAccess ? 'HD Web Camera' : 'Simulated 1080p Stream'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[var(--text-secondary)]">
                        <span>Audio Source:</span>
                        <span className="font-semibold text-emerald-500">
                          {isMicMuted ? 'Muted' : 'Studio Microphone (48kHz)'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[var(--text-secondary)]">
                        <span>Bitrate:</span>
                        <span className="font-semibold text-emerald-500">6,000 Kbps (Stable)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={handleStartCountdown}
                    className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02]"
                  >
                    <Radio className="w-5 h-5 animate-pulse" />
                    Go Live Now
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 2: LIVE BROADCAST MODE (Live Chat & End Button) */}
            {streamState === 'live' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                {/* Live Chat Header */}
                <div className="p-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    Live Stream Chat
                  </h3>
                  <span className="text-xs text-[var(--text-muted)]">
                    {liveComments.length} messages
                  </span>
                </div>

                {/* Live Chat Messages Feed */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  <div className="text-center py-2 text-[11px] text-[var(--text-muted)] bg-[var(--bg-main)] rounded-lg p-2">
                    Welcome to the live chat! Remember to be respectful to the broadcaster and fellow viewers.
                  </div>

                  {liveComments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2 text-xs leading-snug animate-pop-in">
                      <Avatar src={comment.user.avatar} alt={comment.user.name} size="xs" />
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-[var(--text-primary)] mr-1.5 hover:underline cursor-pointer">
                          {comment.user.name}:
                        </span>
                        <span className="text-[var(--text-primary)]">{comment.text}</span>
                        <span className="text-[10px] text-[var(--text-muted)] ml-1.5">
                          {comment.time}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={chatScrollRef} />
                </div>

                {/* Bottom Bar: Post chat comment & End Stream */}
                <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2.5">
                  <form onSubmit={handleSendLiveComment} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Comment as broadcaster..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="flex-1 bg-[var(--bg-input)] rounded-full px-3.5 py-1.5 text-xs focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className="p-1.5 rounded-full text-white bg-[var(--fb-blue)] disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={handleEndStream}
                    className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    End Live Video
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: STREAM ENDED RECAP */}
            {streamState === 'ended' && (
              <div className="p-6 space-y-6 flex-1 flex flex-col justify-between text-center">
                <div className="space-y-4 pt-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[var(--text-primary)]">
                      Live Video Ended
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Great broadcast! Here is your stream performance recap.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 bg-[var(--bg-main)] rounded-2xl text-left">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
                        Stream Duration
                      </p>
                      <p className="text-lg font-black text-[var(--text-primary)]">
                        {formatDuration(streamDuration)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
                        Peak Viewers
                      </p>
                      <p className="text-lg font-black text-emerald-500">
                        {viewerCount.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
                        Total Reactions
                      </p>
                      <p className="text-lg font-black text-rose-500">
                        {totalReactionsCount}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
                        Chat Messages
                      </p>
                      <p className="text-lg font-black text-[var(--fb-blue)]">
                        {liveComments.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <button
                    type="button"
                    onClick={handlePostReplay}
                    className="w-full py-3 rounded-xl bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    Post Video Replay to Timeline
                  </button>

                  <button
                    type="button"
                    onClick={() => setLiveStreamModalOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] text-xs font-semibold"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translateY(-280px) scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
