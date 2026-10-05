'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Eye,
  Send,
  Sparkles,
  Share2,
  Check,
  Settings,
  RotateCw,
  FlipHorizontal,
  AlertCircle,
  RefreshCw,
  Volume2,
  Camera,
  Sliders,
} from 'lucide-react';

interface LiveComment {
  id: string;
  user: (typeof mockUsers)[0];
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
  const [description, setDescription] = useState(
    'Interactive live stream demo with real-time comments, viewer counter, and camera feed.'
  );
  const [category, setCategory] = useState('Technology & Coding');
  const [setupTab, setSetupTab] = useState<'details' | 'camera'>('details');

  // Stream controls
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [hasWebcamAccess, setHasWebcamAccess] = useState(false);
  const [useSimulatedFeed, setUseSimulatedFeed] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Camera & Audio Devices
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  const [selectedAudioId, setSelectedAudioId] = useState<string>('');
  const [videoResolution, setVideoResolution] = useState<'1080p' | '720p' | '480p'>('1080p');
  const [micVolume, setMicVolume] = useState<number>(0);
  const [showQuickSettings, setShowQuickSettings] = useState(false);

  // Live metrics
  const [streamDuration, setStreamDuration] = useState(0);
  const [viewerCount, setViewerCount] = useState(340);
  const [liveComments, setLiveComments] = useState<LiveComment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [totalReactionsCount, setTotalReactionsCount] = useState(48);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Resolution constraint helper
  const getResolutionConstraints = useCallback((res: '1080p' | '720p' | '480p') => {
    switch (res) {
      case '1080p':
        return { width: { ideal: 1920 }, height: { ideal: 1080 } };
      case '720p':
        return { width: { ideal: 1280 }, height: { ideal: 720 } };
      case '480p':
        return { width: { ideal: 854 }, height: { ideal: 480 } };
      default:
        return { width: { ideal: 1280 }, height: { ideal: 720 } };
    }
  }, []);

  // Web Audio Visualizer for microphone test
  const cleanupAudioMeter = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setMicVolume(0);
  }, []);

  const setupAudioMeter = useCallback((stream: MediaStream) => {
    try {
      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) {
        setMicVolume(0);
        return;
      }

      if (typeof window === 'undefined') return;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const buffer = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
          sum += buffer[i];
        }
        const avg = sum / buffer.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setMicVolume(normalized);
        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (e) {
      console.warn('Audio meter setup warning:', e);
    }
  }, []);

  // Refresh hardware device enumeration
  const refreshDeviceList = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const vDevices = devices.filter((d) => d.kind === 'videoinput');
      const aDevices = devices.filter((d) => d.kind === 'audioinput');
      setVideoDevices(vDevices);
      setAudioDevices(aDevices);

      // Track active device ids
      if (mediaStreamRef.current) {
        const vTrack = mediaStreamRef.current.getVideoTracks()[0];
        if (vTrack) {
          const settings = vTrack.getSettings();
          if (settings.deviceId) {
            setSelectedVideoId(settings.deviceId);
          }
        }
        const aTrack = mediaStreamRef.current.getAudioTracks()[0];
        if (aTrack) {
          const settings = aTrack.getSettings();
          if (settings.deviceId) {
            setSelectedAudioId(settings.deviceId);
          }
        }
      }
    } catch (e) {
      console.warn('Device enumeration failed:', e);
    }
  }, []);

  // Initialize or re-initialize camera & microphone
  const initMedia = useCallback(
    async (targetVideoId?: string, targetAudioId?: string, forceSimulated = false) => {
      if (forceSimulated) {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
        cleanupAudioMeter();
        setHasWebcamAccess(false);
        setUseSimulatedFeed(true);
        setCameraError(null);
        return;
      }

      setIsLoadingMedia(true);
      setCameraError(null);

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Your browser does not support webcam access (navigator.mediaDevices is unavailable).');
        }

        // Clean up previous stream
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }
        cleanupAudioMeter();

        const videoConstraints: MediaTrackConstraints = {
          ...getResolutionConstraints(videoResolution),
          deviceId: targetVideoId ? { exact: targetVideoId } : undefined,
        };

        const audioConstraints: MediaTrackConstraints | boolean = targetAudioId
          ? { deviceId: { exact: targetAudioId } }
          : true;

        let stream: MediaStream;

        try {
          // Attempt acquiring both video and audio
          stream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
            audio: audioConstraints,
          });
        } catch (bothErr) {
          console.warn('Could not acquire both video and audio. Falling back to video-only...', bothErr);
          // Fallback to video only if microphone access was blocked or no mic is present
          stream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
            audio: false,
          });
          showToast('Microphone unavailable or blocked. Camera active without audio.', 'info');
        }

        mediaStreamRef.current = stream;
        setHasWebcamAccess(true);
        setUseSimulatedFeed(false);
        setCameraError(null);

        // Apply mute settings
        stream.getVideoTracks().forEach((t) => {
          t.enabled = !isCamOff;
        });
        stream.getAudioTracks().forEach((t) => {
          t.enabled = !isMicMuted;
        });

        // Attach stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }

        // Setup audio visualizer
        setupAudioMeter(stream);

        // Enumerate devices now that permission is granted
        await refreshDeviceList();
      } catch (err: unknown) {
        console.error('Webcam initialization error:', err);
        setHasWebcamAccess(false);
        cleanupAudioMeter();

        const error = err as Error;
        let userMsg = 'Unable to connect to camera.';

        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          userMsg =
            'Camera permission was blocked. Please click the camera or lock icon in your browser URL address bar to allow access, then click "Retry".';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          userMsg = 'No camera device found on your system. Please connect a webcam or switch to Simulated Feed.';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          userMsg =
            'Your camera is in use by another program (e.g. Zoom, Teams, or OBS). Please close other apps and click "Retry".';
        } else if (error.name === 'OverconstrainedError') {
          userMsg = 'Selected camera does not support this resolution. Reverting to standard settings...';
          // Fallback retry with basic constraints
          try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            mediaStreamRef.current = fallbackStream;
            setHasWebcamAccess(true);
            setUseSimulatedFeed(false);
            if (videoRef.current) {
              videoRef.current.srcObject = fallbackStream;
              videoRef.current.play().catch(() => {});
            }
            setupAudioMeter(fallbackStream);
            await refreshDeviceList();
            setIsLoadingMedia(false);
            return;
          } catch {
            userMsg = 'Camera constraints could not be met.';
          }
        } else if (error.message) {
          userMsg = error.message;
        }

        setCameraError(userMsg);
      } finally {
        setIsLoadingMedia(false);
      }
    },
    [
      getResolutionConstraints,
      videoResolution,
      isCamOff,
      isMicMuted,
      showToast,
      cleanupAudioMeter,
      setupAudioMeter,
      refreshDeviceList,
    ]
  );

  // Callback ref guarantees the <video> element gets the media stream immediately upon mounting
  const setVideoCallbackRef = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      if (node) {
        if (isScreenSharing && screenStreamRef.current) {
          node.srcObject = screenStreamRef.current;
        } else if (mediaStreamRef.current && !isCamOff && !useSimulatedFeed) {
          node.srcObject = mediaStreamRef.current;
        }
        node.play().catch(() => {});
      }
    },
    [isCamOff, isScreenSharing, useSimulatedFeed]
  );

  // Sync video source whenever stream or mode changes
  useEffect(() => {
    if (videoRef.current) {
      if (isScreenSharing && screenStreamRef.current) {
        videoRef.current.srcObject = screenStreamRef.current;
      } else if (mediaStreamRef.current && !isCamOff && !useSimulatedFeed) {
        videoRef.current.srcObject = mediaStreamRef.current;
      } else {
        videoRef.current.srcObject = null;
      }
      videoRef.current.play().catch(() => {});
    }
  }, [hasWebcamAccess, isCamOff, isScreenSharing, useSimulatedFeed, selectedVideoId]);

  // Request media when modal opens & cleanup when closed
  useEffect(() => {
    if (!liveStreamModalOpen) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      cleanupAudioMeter();
      setStreamState('setup');
      setStreamDuration(0);
      setLiveComments([]);
      setIsScreenSharing(false);
      setShowQuickSettings(false);
      return;
    }

    initMedia();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      cleanupAudioMeter();
    };
  }, [liveStreamModalOpen, initMedia, cleanupAudioMeter]);

  // Listen for device changes (plugging in / unplugging webcam or mic)
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.addEventListener) return;
    const handleDeviceChange = () => {
      refreshDeviceList();
    };
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [refreshDeviceList]);

  // Switch camera device
  const handleVideoDeviceChange = async (deviceId: string) => {
    if (deviceId === 'simulated') {
      await initMedia(undefined, undefined, true);
      showToast('Switched to Demo Simulated Studio Camera', 'info');
      return;
    }
    setSelectedVideoId(deviceId);
    await initMedia(deviceId, selectedAudioId);
    showToast('Camera switched', 'success');
  };

  // Switch audio device
  const handleAudioDeviceChange = async (deviceId: string) => {
    if (deviceId === 'none') {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getAudioTracks().forEach((t) => t.stop());
      }
      cleanupAudioMeter();
      setSelectedAudioId('none');
      setIsMicMuted(true);
      showToast('Microphone disabled', 'info');
      return;
    }
    setSelectedAudioId(deviceId);
    await initMedia(selectedVideoId, deviceId);
    setIsMicMuted(false);
    showToast('Microphone switched', 'success');
  };

  // Switch resolution
  const handleResolutionChange = async (res: '1080p' | '720p' | '480p') => {
    setVideoResolution(res);
    if (!useSimulatedFeed && hasWebcamAccess) {
      await initMedia(selectedVideoId, selectedAudioId);
      showToast(`Resolution set to ${res}`, 'info');
    }
  };

  // Quick cycle camera (switch between available cameras)
  const cycleCamera = async () => {
    if (videoDevices.length <= 1) {
      showToast('Only one camera device detected', 'info');
      return;
    }
    const currentIndex = videoDevices.findIndex((d) => d.deviceId === selectedVideoId);
    const nextIndex = (currentIndex + 1) % videoDevices.length;
    const nextDevice = videoDevices[nextIndex];
    if (nextDevice) {
      await handleVideoDeviceChange(nextDevice.deviceId);
    }
  };

  // Toggle mirror / flip
  const toggleMirror = () => {
    setIsMirrored((prev) => !prev);
    showToast(isMirrored ? 'Camera mirror turned OFF' : 'Camera mirror turned ON', 'info');
  };

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

    // Incoming simulated comments every 3.2 seconds
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
    const left = 60 + Math.random() * 30;
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
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    cleanupAudioMeter();
  };

  const handlePostReplay = () => {
    createPost({
      author: user,
      content: `🔴 [LIVE REPLAY] ${title}\n\nBroadcasted live for ${formatDuration(
        streamDuration
      )} with ${viewerCount.toLocaleString()} viewers! Thanks for tuning in everyone!`,
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
    const nextState = !isMicMuted;
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !nextState;
      });
    }
    setIsMicMuted(nextState);
    showToast(nextState ? 'Microphone muted' : 'Microphone unmuted', 'info');
  };

  const toggleCam = () => {
    const nextState = !isCamOff;
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !nextState;
      });
    }
    setIsCamOff(nextState);
    showToast(nextState ? 'Camera turned off' : 'Camera turned on', 'info');
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          screenStreamRef.current = screenStream;
          if (videoRef.current) {
            videoRef.current.srcObject = screenStream;
            videoRef.current.play().catch(() => {});
          }
          setIsScreenSharing(true);
          showToast('Screen sharing started!', 'success');

          const track = screenStream.getVideoTracks()[0];
          if (track) {
            track.onended = () => {
              setIsScreenSharing(false);
              screenStreamRef.current = null;
              if (videoRef.current && mediaStreamRef.current && !isCamOff && !useSimulatedFeed) {
                videoRef.current.srcObject = mediaStreamRef.current;
                videoRef.current.play().catch(() => {});
              }
              showToast('Screen sharing ended', 'info');
            };
          }
        } else {
          setIsScreenSharing(true);
          showToast('Simulated screen share active', 'info');
        }
      } catch {
        // User cancelled browser picker dialog
      }
    } else {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      if (mediaStreamRef.current && videoRef.current && !isCamOff && !useSimulatedFeed) {
        videoRef.current.srcObject = mediaStreamRef.current;
        videoRef.current.play().catch(() => {});
      }
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
                  ? 'Setup stream details & config camera'
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
              className="w-8 h-8 rounded-full bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title="Close Live Producer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Main Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Left Column: Video Broadcast Viewport */}
          <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
            {/* Top Quick Actions on Viewport */}
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
              {/* Quick Mirror Toggle */}
              {!isScreenSharing && (hasWebcamAccess || useSimulatedFeed) && (
                <button
                  type="button"
                  onClick={toggleMirror}
                  className={`p-2 rounded-full backdrop-blur-md border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
                    isMirrored
                      ? 'bg-blue-600/90 text-white border-blue-400'
                      : 'bg-black/60 text-white/90 border-white/20 hover:bg-black/80'
                  }`}
                  title={isMirrored ? 'Mirror mode active (click to flip normal)' : 'Normal mode (click to mirror)'}
                >
                  <FlipHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline text-[11px]">{isMirrored ? 'Mirrored' : 'Normal'}</span>
                </button>
              )}

              {/* Cycle Camera Button (if multiple cameras detected) */}
              {videoDevices.length > 1 && !isScreenSharing && (
                <button
                  type="button"
                  onClick={cycleCamera}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md shadow-md transition-all"
                  title="Switch camera"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              )}

              {/* Camera Settings Shortcut */}
              <button
                type="button"
                onClick={() => {
                  if (streamState === 'setup') {
                    setSetupTab('camera');
                  } else {
                    setShowQuickSettings(!showQuickSettings);
                  }
                }}
                className={`p-2 rounded-full backdrop-blur-md border shadow-md transition-all ${
                  setupTab === 'camera' && streamState === 'setup'
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-black/60 hover:bg-black/80 text-white border-white/20'
                }`}
                title="Camera & Audio Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Viewport Content */}
            {isLoadingMedia ? (
              <div className="flex flex-col items-center justify-center text-zinc-400 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-[var(--fb-blue)]" />
                <p className="text-xs font-semibold">Connecting to camera & microphone...</p>
              </div>
            ) : cameraError && !useSimulatedFeed ? (
              <div className="max-w-md mx-4 p-6 rounded-2xl bg-zinc-900/95 border border-rose-500/40 text-center space-y-4 shadow-2xl backdrop-blur-md">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-white">Camera Connection Issue</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">{cameraError}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => initMedia(selectedVideoId, selectedAudioId)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => initMedia(undefined, undefined, true)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Use Simulated Feed
                  </button>
                </div>
              </div>
            ) : isCamOff ? (
              <div className="flex flex-col items-center justify-center text-zinc-400 space-y-3">
                <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 border border-zinc-700">
                  <VideoOff className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">Camera is turned off</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Click the video icon below to turn it on</p>
                </div>
                <button
                  type="button"
                  onClick={toggleCam}
                  className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Turn Camera On
                </button>
              </div>
            ) : isScreenSharing ? (
              <div className="w-full h-full relative flex items-center justify-center bg-zinc-950 p-6">
                <video
                  ref={setVideoCallbackRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 left-4 bg-emerald-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                  <Monitor className="w-3.5 h-3.5" />
                  Screen Sharing Active
                </div>
              </div>
            ) : hasWebcamAccess && !useSimulatedFeed ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <video
                  ref={setVideoCallbackRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-transform duration-200 ${
                    isMirrored ? '-scale-x-100' : 'scale-x-100'
                  }`}
                />
                {/* Live Mic Meter Tag */}
                {!isMicMuted && (
                  <div className="absolute bottom-16 left-4 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1.5 border border-white/10">
                    <Volume2 className="w-3 h-3 text-emerald-400" />
                    <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-75"
                        style={{ width: `${micVolume}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80"
                  alt="Simulated stream broadcast"
                  className={`w-full h-full object-cover ${isMirrored ? '-scale-x-100' : 'scale-x-100'}`}
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Simulated Studio Camera (Demo)
                </div>
              </div>
            )}

            {/* Countdown Overlay */}
            {streamState === 'countdown' && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-40 animate-pop-in">
                <span className="text-8xl font-black text-rose-500 animate-ping">{countdown}</span>
                <p className="text-lg font-bold text-white mt-4">Going Live in a moment...</p>
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
              <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-xl">
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`p-2 rounded-full transition-colors ${
                    isMicMuted ? 'bg-rose-600 text-white' : 'hover:bg-white/20 text-white'
                  }`}
                  title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={toggleCam}
                  className={`p-2 rounded-full transition-colors ${
                    isCamOff ? 'bg-rose-600 text-white' : 'hover:bg-white/20 text-white'
                  }`}
                  title={isCamOff ? 'Turn on camera' : 'Turn off camera'}
                >
                  {isCamOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={toggleScreenShare}
                  className={`p-2 rounded-full transition-colors ${
                    isScreenSharing ? 'bg-emerald-600 text-white' : 'hover:bg-white/20 text-white'
                  }`}
                  title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
                >
                  <Monitor className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={toggleMirror}
                  className={`p-2 rounded-full transition-colors ${
                    isMirrored ? 'text-blue-400 hover:bg-white/20' : 'hover:bg-white/20 text-white'
                  }`}
                  title="Toggle mirror view"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (streamState === 'setup') {
                      setSetupTab(setupTab === 'camera' ? 'details' : 'camera');
                    } else {
                      setShowQuickSettings((prev) => !prev);
                    }
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    (setupTab === 'camera' && streamState === 'setup') || showQuickSettings
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-white/20 text-white'
                  }`}
                  title="Config Camera & Mic"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Reaction Bursts */}
              {streamState === 'live' && (
                <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-xl">
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

            {/* Quick Settings Floating Popover (for Live Mode or In-Video Config) */}
            {showQuickSettings && (
              <div className="absolute bottom-20 left-4 z-40 w-72 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 text-white rounded-2xl p-4 shadow-2xl space-y-3 animate-pop-in">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-blue-400" />
                    Quick Camera Config
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowQuickSettings(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Camera Selector */}
                <div>
                  <label className="block text-[11px] text-zinc-400 font-semibold mb-1">Camera Device</label>
                  <select
                    value={useSimulatedFeed ? 'simulated' : selectedVideoId}
                    onChange={(e) => handleVideoDeviceChange(e.target.value)}
                    className="w-full p-2 rounded-lg bg-zinc-800 text-white text-xs border border-zinc-700 font-medium"
                  >
                    {videoDevices.map((d, index) => (
                      <option key={d.deviceId || index} value={d.deviceId}>
                        {d.label || `Camera ${index + 1}`}
                      </option>
                    ))}
                    <option value="simulated">✨ Simulated Demo Camera</option>
                  </select>
                </div>

                {/* Mic Selector */}
                <div>
                  <label className="block text-[11px] text-zinc-400 font-semibold mb-1">Microphone</label>
                  <select
                    value={isMicMuted ? 'none' : selectedAudioId}
                    onChange={(e) => handleAudioDeviceChange(e.target.value)}
                    className="w-full p-2 rounded-lg bg-zinc-800 text-white text-xs border border-zinc-700 font-medium"
                  >
                    {audioDevices.map((d, index) => (
                      <option key={d.deviceId || index} value={d.deviceId}>
                        {d.label || `Microphone ${index + 1}`}
                      </option>
                    ))}
                    <option value="none">🔇 Disabled / Muted</option>
                  </select>
                </div>

                {/* Mirror Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-zinc-300">Mirror Preview</span>
                  <button
                    type="button"
                    onClick={toggleMirror}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      isMirrored ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {isMirrored ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Setup Panel OR Live Chat Stream OR Recap */}
          <div className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-[var(--border-subtle)] flex flex-col justify-between bg-[var(--bg-surface)]">
            {/* STAGE 1: SETUP MODE */}
            {streamState === 'setup' && (
              <div className="p-4 space-y-4 flex-1 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  {/* User info bar */}
                  <div className="flex items-center gap-3 pb-3 border-b border-[var(--border-subtle)]">
                    <Avatar src={user.avatar} alt={user.name} size="md" />
                    <div>
                      <p className="font-bold text-sm">{user.name}</p>
                      <span className="text-[11px] text-[var(--text-muted)] bg-[var(--bg-hover)] px-2 py-0.5 rounded-md">
                        Broadcasting to Public
                      </span>
                    </div>
                  </div>

                  {/* Navigation Tabs for Setup */}
                  <div className="grid grid-cols-2 p-1 bg-[var(--bg-main)] rounded-xl border border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={() => setSetupTab('details')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        setupTab === 'details'
                          ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      📝 Stream Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setSetupTab('camera')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        setupTab === 'camera'
                          ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5 text-blue-500" />
                      <span>Camera & Audio</span>
                      {cameraError && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                    </button>
                  </div>

                  {/* TAB 1: STREAM DETAILS */}
                  {setupTab === 'details' && (
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

                      {/* Quick Hardware Status card */}
                      <div className="p-3 bg-[var(--bg-main)] rounded-xl text-xs space-y-2 border border-[var(--border-subtle)]">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-[var(--text-primary)]">Hardware Status</p>
                          <button
                            type="button"
                            onClick={() => setSetupTab('camera')}
                            className="text-[11px] text-[var(--fb-blue)] hover:underline font-semibold"
                          >
                            Configure →
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-[var(--text-secondary)]">
                          <span>Camera:</span>
                          <span
                            className={`font-semibold ${
                              hasWebcamAccess
                                ? 'text-emerald-500'
                                : useSimulatedFeed
                                ? 'text-amber-500'
                                : 'text-rose-500'
                            }`}
                          >
                            {hasWebcamAccess
                              ? 'Active HD Webcam'
                              : useSimulatedFeed
                              ? 'Simulated Feed'
                              : 'Not Connected'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[var(--text-secondary)]">
                          <span>Microphone:</span>
                          <span
                            className={`font-semibold ${
                              isMicMuted ? 'text-zinc-400' : 'text-emerald-500'
                            }`}
                          >
                            {isMicMuted ? 'Muted' : 'Studio Microphone (48kHz)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CAMERA & AUDIO CONFIGURATION */}
                  {setupTab === 'camera' && (
                    <div className="space-y-3.5">
                      {/* Camera Selector */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-blue-500" />
                            Camera Device
                          </label>
                          <button
                            type="button"
                            onClick={() => initMedia(selectedVideoId, selectedAudioId)}
                            className="text-[11px] text-[var(--fb-blue)] hover:underline flex items-center gap-1"
                            title="Refresh camera devices"
                          >
                            <RefreshCw className={`w-3 h-3 ${isLoadingMedia ? 'animate-spin' : ''}`} />
                            Refresh
                          </button>
                        </div>

                        <select
                          value={useSimulatedFeed ? 'simulated' : selectedVideoId}
                          onChange={(e) => handleVideoDeviceChange(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] text-xs border border-[var(--border-subtle)] font-medium"
                        >
                          {videoDevices.length > 0 ? (
                            videoDevices.map((d, index) => (
                              <option key={d.deviceId || index} value={d.deviceId}>
                                📷 {d.label || `Camera ${index + 1}`}
                              </option>
                            ))
                          ) : (
                            <option value="">Default Web Camera</option>
                          )}
                          <option value="simulated">✨ Simulated Demo Camera (No webcam)</option>
                        </select>
                      </div>

                      {/* Microphone Selector */}
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1 flex items-center gap-1.5">
                          <Mic className="w-3.5 h-3.5 text-emerald-500" />
                          Microphone Device
                        </label>
                        <select
                          value={isMicMuted ? 'none' : selectedAudioId}
                          onChange={(e) => handleAudioDeviceChange(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-[var(--bg-input)] text-xs border border-[var(--border-subtle)] font-medium"
                        >
                          {audioDevices.length > 0 ? (
                            audioDevices.map((d, index) => (
                              <option key={d.deviceId || index} value={d.deviceId}>
                                🎙️ {d.label || `Microphone ${index + 1}`}
                              </option>
                            ))
                          ) : (
                            <option value="">Default Microphone</option>
                          )}
                          <option value="none">🔇 Disabled / No Microphone</option>
                        </select>
                      </div>

                      {/* Live Microphone Test Level Bar */}
                      <div className="p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-subtle)] space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                            <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                            Mic Input Level
                          </span>
                          <span className="text-[11px] text-[var(--text-muted)] font-mono">
                            {isMicMuted ? 'Muted' : `${micVolume}%`}
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-[var(--bg-surface)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                          <div
                            className={`h-full transition-all duration-75 ${
                              isMicMuted
                                ? 'w-0'
                                : micVolume > 80
                                ? 'bg-rose-500'
                                : micVolume > 50
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${isMicMuted ? 0 : micVolume}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          Speak into your mic to test audio level.
                        </p>
                      </div>

                      {/* Video Resolution */}
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
                          Video Quality & Resolution
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['1080p', '720p', '480p'] as const).map((res) => (
                            <button
                              key={res}
                              type="button"
                              onClick={() => handleResolutionChange(res)}
                              className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                                videoResolution === res
                                  ? 'bg-[var(--fb-blue)] text-white border-[var(--fb-blue)] shadow-xs'
                                  : 'bg-[var(--bg-input)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--bg-hover)]'
                              }`}
                            >
                              {res} {res === '1080p' ? 'FHD' : res === '720p' ? 'HD' : 'SD'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mirror Camera Switch */}
                      <div className="flex items-center justify-between p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-subtle)]">
                        <div>
                          <p className="text-xs font-bold text-[var(--text-primary)]">
                            Mirror Camera Preview
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)]">
                            Flip horizontally (recommended for selfie webcam)
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={toggleMirror}
                          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                            isMirrored ? 'bg-[var(--fb-blue)]' : 'bg-zinc-400'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transition-transform ${
                              isMirrored ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Camera Diagnostics / Error Card */}
                      {cameraError && (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs space-y-2">
                          <p className="font-bold flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            Camera Access Help
                          </p>
                          <p className="text-[11px] leading-relaxed">{cameraError}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => initMedia(selectedVideoId, selectedAudioId)}
                              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-[11px] shadow-sm"
                            >
                              Retry Access
                            </button>
                            <button
                              type="button"
                              onClick={() => initMedia(undefined, undefined, true)}
                              className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-bold text-[11px]"
                            >
                              Use Simulated Feed
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Reconnect / Test Button */}
                      <button
                        type="button"
                        onClick={() => initMedia(selectedVideoId, selectedAudioId)}
                        disabled={isLoadingMedia}
                        className="w-full py-2.5 rounded-xl bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] text-[var(--text-primary)] font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-[var(--border-subtle)]"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMedia ? 'animate-spin' : ''}`} />
                        {isLoadingMedia ? 'Testing Camera...' : 'Test / Reconnect Camera'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom Go Live Action Button */}
                <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2">
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
