import { create } from 'zustand';
import { Group } from '@/types';
import { mockGroups } from '@/data/groups';
import { storage } from '@/lib/storage';

const GROUPS_STORAGE_KEY = 'fb_groups';

interface GroupState {
  groups: Group[];
  toggleJoinGroup: (groupId: string) => void;
}

export const useGroupStore = create<GroupState>((set) => {
  const initial = storage.get<Group[]>(GROUPS_STORAGE_KEY, mockGroups);

  return {
    groups: initial,
    toggleJoinGroup: (groupId) => {
      set((state) => {
        const updated = state.groups.map((g) => {
          if (g.id === groupId) {
            const nextIsMember = !g.isMember;
            return {
              ...g,
              isMember: nextIsMember,
              memberCount: nextIsMember ? g.memberCount + 1 : g.memberCount - 1,
            };
          }
          return g;
        });
        storage.set(GROUPS_STORAGE_KEY, updated);
        return { groups: updated };
      });
    },
  };
});
