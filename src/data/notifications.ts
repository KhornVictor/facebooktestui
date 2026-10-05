import { Notification } from '@/types';
import { mockUsers } from './users';

export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    type: 'post_reaction',
    actor: mockUsers[1], // Alice
    message: 'reacted to your post: "Excited to announce that our new open-source dashboard..."',
    targetId: 'post_6',
    targetType: 'post',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'notif_2',
    type: 'comment',
    actor: mockUsers[2], // Bob
    message: 'commented on your post: "I agree, the transition animation feels buttery smooth..."',
    targetId: 'post_6',
    targetType: 'post',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: 'notif_3',
    type: 'friend_request',
    actor: mockUsers[13], // Marcus
    message: 'sent you a friend request.',
    targetId: 'user_13',
    targetType: 'profile',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: 'notif_4',
    type: 'mention',
    actor: mockUsers[3], // Charlie
    message: 'mentioned you in a comment: "@Victor Khorn check out this benchmark on..."',
    targetId: 'post_3',
    targetType: 'post',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
  },
  {
    id: 'notif_5',
    type: 'group_activity',
    actor: mockUsers[16], // Paula
    message: 'posted in Frontend Architecture Guild: "Reminder that we are adopting Tailwind v4..."',
    targetId: 'group_1',
    targetType: 'group',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
  },
  {
    id: 'notif_6',
    type: 'friend_accepted',
    actor: mockUsers[14], // Nina
    message: 'accepted your friend request.',
    targetId: 'user_14',
    targetType: 'profile',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
  },
  {
    id: 'notif_7',
    type: 'birthday',
    actor: mockUsers[4], // Diana
    message: 'has a birthday today! Wish her a happy birthday.',
    targetId: 'user_4',
    targetType: 'profile',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 260).toISOString(),
  },
  {
    id: 'notif_8',
    type: 'post_reaction',
    actor: mockUsers[6], // Fiona
    message: 'loved your photo from Cannon Beach.',
    targetId: 'post_4',
    targetType: 'post',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
  },
  {
    id: 'notif_9',
    type: 'reply',
    actor: mockUsers[1], // Alice
    message: 'replied to your comment: "Separately quantized at 4-bit with AWQ!..."',
    targetId: 'post_3',
    targetType: 'post',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
  },
  {
    id: 'notif_10',
    type: 'messenger',
    actor: mockUsers[1], // Alice
    message: 'sent you a message with an attachment.',
    targetId: 'conv_1',
    targetType: 'conversation',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
  },
  {
    id: 'notif_11',
    type: 'post_reaction',
    actor: mockUsers[7], // George
    message: 'and 14 others reacted to your shared post.',
    targetId: 'post_6',
    targetType: 'post',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 550).toISOString(),
  },
  {
    id: 'notif_12',
    type: 'friend_request',
    actor: mockUsers[15], // Oliver
    message: 'sent you a friend request.',
    targetId: 'user_15',
    targetType: 'profile',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 620).toISOString(),
  },
  {
    id: 'notif_13',
    type: 'group_activity',
    actor: mockUsers[8], // Hannah
    message: 'shared a new post in Urban Gardening Collective.',
    targetId: 'group_4',
    targetType: 'group',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
  },
  {
    id: 'notif_14',
    type: 'comment',
    actor: mockUsers[10], // Julia
    message: 'commented on your status update: "Kyoto recommendation saved!..."',
    targetId: 'post_9',
    targetType: 'post',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 800).toISOString(),
  },
  {
    id: 'notif_15',
    type: 'post_reaction',
    actor: mockUsers[11], // Kevin
    message: 'celebrated your milestone: "10,000 GitHub Stars".',
    targetId: 'post_6',
    targetType: 'post',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
  },
  {
    id: 'notif_16',
    type: 'mention',
    actor: mockUsers[18], // Rachel
    message: 'tagged you in a photo from San Francisco Design Week.',
    targetId: 'post_13',
    targetType: 'post',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 1050).toISOString(),
  },
  {
    id: 'notif_17',
    type: 'birthday',
    actor: mockUsers[2], // Bob
    message: 'has a birthday coming up tomorrow.',
    targetId: 'user_2',
    targetType: 'profile',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
  },
  {
    id: 'notif_18',
    type: 'friend_accepted',
    actor: mockUsers[20], // Tara
    message: 'accepted your friend request.',
    targetId: 'user_20',
    targetType: 'profile',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 1350).toISOString(),
  },
  {
    id: 'notif_19',
    type: 'group_activity',
    actor: mockUsers[21], // Victor Stone
    message: 'posted an event in Autonomous Systems & Edge AI.',
    targetId: 'group_6',
    targetType: 'group',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 1500).toISOString(),
  },
  {
    id: 'notif_20',
    type: 'post_reaction',
    actor: mockUsers[5], // Ethan
    message: 'liked your security checklist recommendations.',
    targetId: 'post_17',
    targetType: 'post',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 1700).toISOString(),
  },
  {
    id: 'notif_21',
    type: 'friend_request',
    actor: mockUsers[17], // Quinn
    message: 'sent you a friend request.',
    targetId: 'user_17',
    targetType: 'profile',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 1900).toISOString(),
  },
];
