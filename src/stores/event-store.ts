import { create } from 'zustand';
import { EventItem } from '@/types';
import { mockEvents } from '@/data/events';
import { storage } from '@/lib/storage';

const EVENTS_STORAGE_KEY = 'fb_events';

interface EventState {
  events: EventItem[];
  filter: 'all' | 'going' | 'interested';
  setFilter: (f: 'all' | 'going' | 'interested') => void;
  toggleStatus: (eventId: string, status: 'going' | 'interested') => void;
}

export const useEventStore = create<EventState>((set) => {
  const initial = storage.get<EventItem[]>(EVENTS_STORAGE_KEY, mockEvents);

  return {
    events: initial,
    filter: 'all',
    setFilter: (filter) => set({ filter }),

    toggleStatus: (eventId, status) => {
      set((state) => {
        const updated = state.events.map((ev) => {
          if (ev.id !== eventId) return ev;

          const current = ev.userStatus;
          let newStatus: 'going' | 'interested' | null = status;
          let goingCount = ev.goingCount;
          let interestedCount = ev.interestedCount;

          if (current === status) {
            // Cancel status
            newStatus = null;
            if (status === 'going') goingCount = Math.max(0, goingCount - 1);
            if (status === 'interested') interestedCount = Math.max(0, interestedCount - 1);
          } else {
            // Switching from other or none
            if (current === 'going') goingCount = Math.max(0, goingCount - 1);
            if (current === 'interested') interestedCount = Math.max(0, interestedCount - 1);

            if (status === 'going') goingCount += 1;
            if (status === 'interested') interestedCount += 1;
          }

          return {
            ...ev,
            userStatus: newStatus,
            goingCount,
            interestedCount,
          };
        });

        storage.set(EVENTS_STORAGE_KEY, updated);
        return { events: updated };
      });
    },
  };
});
