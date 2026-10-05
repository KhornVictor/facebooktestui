import { create } from 'zustand';
import { FriendRequest, User } from '@/types';
import { mockUsers, currentUser } from '@/data/users';
import { storage } from '@/lib/storage';

const FRIENDS_STORAGE_KEY = 'fb_friends_list';
const REQUESTS_STORAGE_KEY = 'fb_friend_requests';

interface FriendState {
  friends: User[];
  friendRequests: FriendRequest[];
  friendSuggestions: User[];
  acceptRequest: (requestId: string) => void;
  declineRequest: (requestId: string) => void;
  sendFriendRequest: (userId: string) => void;
  removeFriend: (userId: string) => void;
}

const initialFriendRequests: FriendRequest[] = [
  {
    id: 'req_1',
    user: mockUsers[13], // Marcus Brody
    mutualFriends: 22,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'req_2',
    user: mockUsers[15], // Oliver Queen
    mutualFriends: 17,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'req_3',
    user: mockUsers[17], // Quinn Snyder
    mutualFriends: 11,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

// Friends initially are subset of mockUsers
const initialFriends: User[] = [
  mockUsers[1],
  mockUsers[2],
  mockUsers[3],
  mockUsers[4],
  mockUsers[5],
  mockUsers[6],
  mockUsers[7],
  mockUsers[8],
  mockUsers[9],
  mockUsers[10],
  mockUsers[11],
  mockUsers[12],
  mockUsers[14],
  mockUsers[16],
  mockUsers[18],
  mockUsers[19],
  mockUsers[20],
  mockUsers[21],
];

// Friend suggestions
const initialSuggestions: User[] = [
  mockUsers[13],
  mockUsers[15],
  mockUsers[17],
];

export const useFriendStore = create<FriendState>((set, get) => {
  const savedFriends = storage.get<User[]>(FRIENDS_STORAGE_KEY, initialFriends);
  const savedRequests = storage.get<FriendRequest[]>(REQUESTS_STORAGE_KEY, initialFriendRequests);

  return {
    friends: savedFriends,
    friendRequests: savedRequests,
    friendSuggestions: initialSuggestions,

    acceptRequest: (requestId) => {
      set((state) => {
        const req = state.friendRequests.find((r) => r.id === requestId);
        if (!req) return state;

        const updatedFriends = [req.user, ...state.friends];
        const updatedRequests = state.friendRequests.filter((r) => r.id !== requestId);

        storage.set(FRIENDS_STORAGE_KEY, updatedFriends);
        storage.set(REQUESTS_STORAGE_KEY, updatedRequests);

        return {
          friends: updatedFriends,
          friendRequests: updatedRequests,
        };
      });
    },

    declineRequest: (requestId) => {
      set((state) => {
        const updatedRequests = state.friendRequests.filter((r) => r.id !== requestId);
        storage.set(REQUESTS_STORAGE_KEY, updatedRequests);
        return { friendRequests: updatedRequests };
      });
    },

    sendFriendRequest: (userId) => {
      set((state) => {
        const updatedSuggestions = state.friendSuggestions.filter((u) => u.id !== userId);
        return { friendSuggestions: updatedSuggestions };
      });
    },

    removeFriend: (userId) => {
      set((state) => {
        const updatedFriends = state.friends.filter((u) => u.id !== userId);
        storage.set(FRIENDS_STORAGE_KEY, updatedFriends);
        return { friends: updatedFriends };
      });
    },
  };
});
