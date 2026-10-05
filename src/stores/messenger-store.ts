import { create } from 'zustand';
import { Conversation, Message, MessageAttachment, User } from '@/types';
import { mockConversations, mockMessages, mockReplies } from '@/data/messages';
import { currentUser } from '@/data/users';
import { storage } from '@/lib/storage';
import { playNotificationSound } from '@/lib/utils';

const CONV_STORAGE_KEY = 'fb_messenger_conversations';
const MSG_STORAGE_KEY = 'fb_messenger_messages';

interface MessengerState {
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  activeFloatingChatUserId: string | null;
  typingConversations: Record<string, boolean>;

  setActiveConversation: (id: string | null) => void;
  setActiveFloatingChat: (userId: string | null) => void;
  getOrCreateConversationWithUser: (user: User) => string;

  sendMessage: (
    conversationId: string,
    text: string,
    attachments?: MessageAttachment[],
    replyToId?: string,
    replyToText?: string
  ) => void;

  editMessage: (messageId: string, newText: string) => void;
  deleteMessage: (messageId: string) => void;
  reactToMessage: (messageId: string, emoji: string, userId?: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  simulateLiveReply: (conversationId: string, customReply?: string) => void;
}

export const useMessengerStore = create<MessengerState>((set, get) => {
  const initialConversations = storage.get<Conversation[]>(
    CONV_STORAGE_KEY,
    mockConversations
  );
  const initialMessages = storage.get<Message[]>(MSG_STORAGE_KEY, mockMessages);

  return {
    conversations: initialConversations,
    messages: initialMessages,
    activeConversationId: initialConversations[0]?.id || null,
    activeFloatingChatUserId: null,
    typingConversations: {},

    setActiveConversation: (id) => {
      set({ activeConversationId: id });
      if (id) {
        get().markConversationAsRead(id);
      }
    },

    setActiveFloatingChat: (userId) => {
      set({ activeFloatingChatUserId: userId });
    },

    getOrCreateConversationWithUser: (user: User) => {
      const state = get();
      // Check if conversation already exists
      const existing = state.conversations.find(
        (c) => !c.isGroup && c.participants.some((p) => p.id === user.id)
      );

      if (existing) {
        return existing.id;
      }

      // Create new conversation
      const newConvId = `conv_${Date.now()}`;
      const newConv: Conversation = {
        id: newConvId,
        participants: [currentUser, user],
        isGroup: false,
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
      };

      const updated = [newConv, ...state.conversations];
      storage.set(CONV_STORAGE_KEY, updated);
      set({ conversations: updated, activeConversationId: newConvId });
      return newConvId;
    },

    sendMessage: (conversationId, text, attachments = [], replyToId, replyToText) => {
      const newMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        conversationId,
        senderId: currentUser.id,
        text,
        attachments: attachments.length > 0 ? attachments : undefined,
        createdAt: new Date().toISOString(),
        status: 'sent',
        reactions: [],
        replyToId,
        replyToText,
      };

      // Optimistically append message
      set((state) => {
        const updatedMessages = [...state.messages, newMessage];
        const updatedConversations = state.conversations.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessage: newMessage,
              updatedAt: newMessage.createdAt,
            };
          }
          return c;
        });

        // Sort conversations with recent on top
        updatedConversations.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        storage.set(MSG_STORAGE_KEY, updatedMessages);
        storage.set(CONV_STORAGE_KEY, updatedConversations);

        return {
          messages: updatedMessages,
          conversations: updatedConversations,
        };
      });

      // Simulate status transition: sent -> delivered
      setTimeout(() => {
        set((state) => {
          const updatedMessages = state.messages.map((m) =>
            m.id === newMessage.id ? { ...m, status: 'delivered' as const } : m
          );
          storage.set(MSG_STORAGE_KEY, updatedMessages);
          return { messages: updatedMessages };
        });
      }, 800);

      // Trigger simulated response from recipient
      get().simulateLiveReply(conversationId);
    },

    editMessage: (messageId, newText) => {
      set((state) => {
        const updatedMessages = state.messages.map((m) =>
          m.id === messageId ? { ...m, text: newText } : m
        );
        storage.set(MSG_STORAGE_KEY, updatedMessages);
        return { messages: updatedMessages };
      });
    },

    deleteMessage: (messageId) => {
      set((state) => {
        const updatedMessages = state.messages.filter((m) => m.id !== messageId);
        storage.set(MSG_STORAGE_KEY, updatedMessages);
        return { messages: updatedMessages };
      });
    },

    reactToMessage: (messageId, emoji, userId = currentUser.id) => {
      set((state) => {
        const updatedMessages = state.messages.map((m) => {
          if (m.id !== messageId) return m;

          const existingReactions = m.reactions || [];
          const userReactionIndex = existingReactions.findIndex(
            (r) => r.userId === userId
          );

          const newReactions = [...existingReactions];

          if (userReactionIndex > -1) {
            if (newReactions[userReactionIndex].emoji === emoji) {
              // Remove reaction
              newReactions.splice(userReactionIndex, 1);
            } else {
              // Update reaction
              newReactions[userReactionIndex] = { emoji, userId };
            }
          } else {
            // Add reaction
            newReactions.push({ emoji, userId });
          }

          return { ...m, reactions: newReactions };
        });

        storage.set(MSG_STORAGE_KEY, updatedMessages);
        return { messages: updatedMessages };
      });
    },

    markConversationAsRead: (conversationId) => {
      set((state) => {
        const updatedConversations = state.conversations.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c
        );

        const updatedMessages = state.messages.map((m) =>
          m.conversationId === conversationId && m.senderId !== currentUser.id
            ? { ...m, status: 'read' as const }
            : m
        );

        storage.set(CONV_STORAGE_KEY, updatedConversations);
        storage.set(MSG_STORAGE_KEY, updatedMessages);

        return {
          conversations: updatedConversations,
          messages: updatedMessages,
        };
      });
    },

    simulateLiveReply: (conversationId, customReply) => {
      const state = get();
      const conversation = state.conversations.find((c) => c.id === conversationId);
      if (!conversation) return;

      // Pick participant who is not currentUser
      const respondent =
        conversation.participants.find((p) => p.id !== currentUser.id) ||
        conversation.participants[0];

      // Delay before typing starts (1.2s - 2.2s)
      const typingDelay = 1200 + Math.random() * 1000;
      setTimeout(() => {
        // Set typing indicator
        set((s) => ({
          typingConversations: { ...s.typingConversations, [conversationId]: true },
        }));

        // Typing duration (1.5s - 2.8s)
        const responseDelay = 1500 + Math.random() * 1300;
        setTimeout(() => {
          // Clear typing
          set((s) => {
            const nextTyping = { ...s.typingConversations };
            delete nextTyping[conversationId];
            return { typingConversations: nextTyping };
          });

          // Generate reply text
          const replyText =
            customReply ||
            mockReplies[Math.floor(Math.random() * mockReplies.length)];

          const incomingMessage: Message = {
            id: `msg_reply_${Date.now()}`,
            conversationId,
            senderId: respondent.id,
            text: replyText,
            createdAt: new Date().toISOString(),
            status: 'delivered',
            reactions: [],
          };

          const isCurrentlyViewing = get().activeConversationId === conversationId;

          // Sound effect
          playNotificationSound();

          set((s) => {
            const updatedMessages = [...s.messages, incomingMessage];
            const updatedConversations = s.conversations.map((c) => {
              if (c.id === conversationId) {
                return {
                  ...c,
                  lastMessage: incomingMessage,
                  unreadCount: isCurrentlyViewing ? 0 : c.unreadCount + 1,
                  updatedAt: incomingMessage.createdAt,
                };
              }
              return c;
            });

            updatedConversations.sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );

            storage.set(MSG_STORAGE_KEY, updatedMessages);
            storage.set(CONV_STORAGE_KEY, updatedConversations);

            return {
              messages: updatedMessages,
              conversations: updatedConversations,
            };
          });
        }, responseDelay);
      }, typingDelay);
    },
  };
});
