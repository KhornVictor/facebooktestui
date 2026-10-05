import { create } from 'zustand';
import { Notification, NotificationType, User } from '@/types';
import { mockNotifications } from '@/data/notifications';
import { storage } from '@/lib/storage';
import { playNotificationSound } from '@/lib/utils';

const NOTIF_STORAGE_KEY = 'fb_notifications';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (data: {
    type: NotificationType;
    actor: User;
    message: string;
    targetId?: string;
    targetType?: 'post' | 'profile' | 'group' | 'conversation';
  }) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => {
  const initial = storage.get<Notification[]>(NOTIF_STORAGE_KEY, mockNotifications);
  const unread = initial.filter((n) => !n.isRead).length;

  return {
    notifications: initial,
    unreadCount: unread,

    markAsRead: (id) => {
      set((state) => {
        const updated = state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        );
        const count = updated.filter((n) => !n.isRead).length;
        storage.set(NOTIF_STORAGE_KEY, updated);
        return { notifications: updated, unreadCount: count };
      });
    },

    markAllAsRead: () => {
      set((state) => {
        const updated = state.notifications.map((n) => ({ ...n, isRead: true }));
        storage.set(NOTIF_STORAGE_KEY, updated);
        return { notifications: updated, unreadCount: 0 };
      });
    },

    deleteNotification: (id) => {
      set((state) => {
        const updated = state.notifications.filter((n) => n.id !== id);
        const count = updated.filter((n) => !n.isRead).length;
        storage.set(NOTIF_STORAGE_KEY, updated);
        return { notifications: updated, unreadCount: count };
      });
    },

    addNotification: (data) => {
      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        type: data.type,
        actor: data.actor,
        message: data.message,
        targetId: data.targetId,
        targetType: data.targetType,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      playNotificationSound();

      set((state) => {
        const updated = [newNotif, ...state.notifications];
        const count = updated.filter((n) => !n.isRead).length;
        storage.set(NOTIF_STORAGE_KEY, updated);
        return { notifications: updated, unreadCount: count };
      });
    },
  };
});
