import { create } from 'zustand';
import { User } from '@/types';
import { currentUser, mockUsers } from '@/data/users';
import { storage } from '@/lib/storage';

interface AuthState {
  user: User;
  isAuthenticated: boolean;
  login: (email: string) => boolean;
  register: (name: string, email: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AUTH_STORAGE_KEY = 'fb_auth_user';
const AUTH_STATUS_KEY = 'fb_auth_status';

export const useAuthStore = create<AuthState>((set) => {
  // Initial state check
  const savedUser = storage.get<User>(AUTH_STORAGE_KEY, currentUser);
  const savedStatus = storage.get<boolean>(AUTH_STATUS_KEY, true);

  return {
    user: savedUser,
    isAuthenticated: savedStatus,

    login: (email: string) => {
      // Find matching mock user or use current user
      const found = mockUsers.find((u) => u.email?.toLowerCase() === email.toLowerCase()) || {
        ...currentUser,
        email: email,
      };
      storage.set(AUTH_STORAGE_KEY, found);
      storage.set(AUTH_STATUS_KEY, true);
      set({ user: found, isAuthenticated: true });
      return true;
    },

    register: (name: string, email: string) => {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, ''),
        email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        bio: 'Hello! I just joined Facebook.',
        isOnline: true,
        friendsCount: 0,
        followersCount: 0,
        followingCount: 0,
        joinedDate: 'Joined Just now',
      };
      storage.set(AUTH_STORAGE_KEY, newUser);
      storage.set(AUTH_STATUS_KEY, true);
      set({ user: newUser, isAuthenticated: true });
      return true;
    },

    logout: () => {
      storage.set(AUTH_STATUS_KEY, false);
      set({ isAuthenticated: false });
    },

    updateProfile: (updates: Partial<User>) => {
      set((state) => {
        const updated = { ...state.user, ...updates };
        storage.set(AUTH_STORAGE_KEY, updated);
        return { user: updated };
      });
    },
  };
});
