import { create } from 'zustand';
import { Post, SettingsState } from '@/types';
import { storage } from '@/lib/storage';

interface ToastItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface UIState {
  theme: 'light' | 'dark' | 'system';
  settings: SettingsState;
  
  createPostModalOpen: boolean;
  storyViewerState: { isOpen: boolean; activeIndex: number };
  shareModalState: { isOpen: boolean; post: Post | null };
  mediaModalState: { isOpen: boolean; url: string; alt?: string };
  liveStreamModalOpen: boolean;
  mobileMenuOpen: boolean;
  toasts: ToastItem[];
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  updateSettings: (updates: Partial<SettingsState>) => void;
  
  setCreatePostModalOpen: (open: boolean) => void;
  setLiveStreamModalOpen: (open: boolean) => void;
  openStoryViewer: (index: number) => void;
  closeStoryViewer: () => void;
  openShareModal: (post: Post) => void;
  closeShareModal: () => void;
  openMediaModal: (url: string, alt?: string) => void;
  closeMediaModal: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  
  showToast: (message: string, type?: 'info' | 'success' | 'error') => void;
  removeToast: (id: string) => void;
}

const THEME_STORAGE_KEY = 'fb_theme';
const SETTINGS_STORAGE_KEY = 'fb_settings';

const defaultSettings: SettingsState = {
  theme: 'light',
  fontSize: 'medium',
  reducedMotion: false,
  privacyPosts: 'public',
  privacyRequests: 'everyone',
  privacyMessages: 'everyone',
  notificationsPush: true,
  notificationsEmail: false,
  notificationsMessenger: true,
};

export const useUIStore = create<UIState>((set, get) => {
  const initialTheme = storage.get<'light' | 'dark' | 'system'>(THEME_STORAGE_KEY, 'light');
  const initialSettings = storage.get<SettingsState>(SETTINGS_STORAGE_KEY, defaultSettings);

  return {
    theme: initialTheme,
    settings: initialSettings,
    
    createPostModalOpen: false,
    storyViewerState: { isOpen: false, activeIndex: 0 },
    shareModalState: { isOpen: false, post: null },
    mediaModalState: { isOpen: false, url: '', alt: '' },
    liveStreamModalOpen: false,
    mobileMenuOpen: false,
    toasts: [],

    setTheme: (newTheme) => {
      storage.set(THEME_STORAGE_KEY, newTheme);
      set({ theme: newTheme });

      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        if (newTheme === 'dark') {
          root.classList.add('dark');
        } else if (newTheme === 'light') {
          root.classList.remove('dark');
        } else {
          const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (systemDark) root.classList.add('dark');
          else root.classList.remove('dark');
        }
      }
    },

    updateSettings: (updates) => {
      set((state) => {
        const updated = { ...state.settings, ...updates };
        storage.set(SETTINGS_STORAGE_KEY, updated);
        if (updates.theme) {
          get().setTheme(updates.theme);
        }
        return { settings: updated };
      });
    },

    setCreatePostModalOpen: (open) => set({ createPostModalOpen: open }),
    setLiveStreamModalOpen: (open) => set({ liveStreamModalOpen: open }),
    
    openStoryViewer: (index) =>
      set({ storyViewerState: { isOpen: true, activeIndex: index } }),
    
    closeStoryViewer: () =>
      set({ storyViewerState: { isOpen: false, activeIndex: 0 } }),
      
    openShareModal: (post) =>
      set({ shareModalState: { isOpen: true, post } }),
      
    closeShareModal: () =>
      set({ shareModalState: { isOpen: false, post: null } }),
      
    openMediaModal: (url, alt = '') =>
      set({ mediaModalState: { isOpen: true, url, alt } }),
      
    closeMediaModal: () =>
      set({ mediaModalState: { isOpen: false, url: '', alt: '' } }),

    setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

    showToast: (message, type = 'info') => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
      const newToast: ToastItem = { id, message, type };

      set((state) => ({ toasts: [...state.toasts, newToast] }));

      setTimeout(() => {
        get().removeToast(id);
      }, 3500);
    },

    removeToast: (id) => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    },
  };
});
