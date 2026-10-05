export type ReactionType = 'like' | 'love' | 'care' | 'haha' | 'wow' | 'sad' | 'angry';

export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar: string;
  coverImage?: string;
  bio?: string;
  isOnline: boolean;
  lastActive?: string;
  location?: string;
  workplace?: string;
  education?: string;
  relationshipStatus?: string;
  mutualFriends?: number;
  friendsCount?: number;
  followersCount?: number;
  followingCount?: number;
  joinedDate?: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  video?: string;
  feeling?: string;
  location?: string;
  taggedUsers?: string[];
  privacy: 'public' | 'friends' | 'only_me';
  createdAt: string;
  reactions: {
    like?: number;
    love?: number;
    care?: number;
    haha?: number;
    wow?: number;
    sad?: number;
    angry?: number;
  };
  userReaction?: ReactionType | null;
  commentsCount: number;
  sharesCount: number;
  isSaved?: boolean;
  isLive?: boolean;
  liveViewers?: number;
  sharedPost?: Post;
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
  reactions: {
    like?: number;
    love?: number;
    care?: number;
    haha?: number;
    wow?: number;
    sad?: number;
    angry?: number;
  };
  userReaction?: ReactionType | null;
  parentId?: string | null;
  replies?: Comment[];
}

export interface Story {
  id: string;
  author: User;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: string;
  isViewed: boolean;
  textOverlay?: string;
}

export interface MessageAttachment {
  type: 'image' | 'file';
  url: string;
  name?: string;
  size?: string;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  attachments?: MessageAttachment[];
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
  reactions?: MessageReaction[];
  replyToId?: string;
  replyToText?: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export type NotificationType =
  | 'friend_request'
  | 'friend_accepted'
  | 'post_reaction'
  | 'comment'
  | 'reply'
  | 'mention'
  | 'group_activity'
  | 'birthday'
  | 'messenger';

export interface Notification {
  id: string;
  type: NotificationType;
  actor: User;
  message: string;
  targetId?: string;
  targetType?: 'post' | 'profile' | 'group' | 'conversation';
  isRead: boolean;
  createdAt: string;
}

export interface FriendRequest {
  id: string;
  user: User;
  mutualFriends: number;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  coverImage: string;
  avatar: string;
  description: string;
  privacy: 'public' | 'private';
  memberCount: number;
  isMember: boolean;
  category: string;
  postsCount: number;
}

export type MarketplaceCategory =
  | 'Electronics'
  | 'Clothing'
  | 'Vehicles'
  | 'Home'
  | 'Computers'
  | 'Phones'
  | 'Other';

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  category: MarketplaceCategory;
  image: string;
  images?: string[];
  description: string;
  seller: User;
  isSaved: boolean;
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
  createdAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  coverImage: string;
  date: string;
  time: string;
  location: string;
  description: string;
  host: User;
  interestedCount: number;
  goingCount: number;
  userStatus?: 'going' | 'interested' | null;
  category: string;
}

export interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  privacyPosts: 'public' | 'friends' | 'only_me';
  privacyRequests: 'everyone' | 'friends_of_friends';
  privacyMessages: 'everyone' | 'friends';
  notificationsPush: boolean;
  notificationsEmail: boolean;
  notificationsMessenger: boolean;
}

export type LiveEvent =
  | 'NEW_POST'
  | 'NEW_MESSAGE'
  | 'FRIEND_REQUEST'
  | 'REACTION'
  | 'COMMENT';
