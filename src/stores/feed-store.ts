import { create } from 'zustand';
import { Post, Comment, ReactionType, User } from '@/types';
import { mockPosts } from '@/data/posts';
import { mockComments } from '@/data/comments';
import { mockUsers, currentUser } from '@/data/users';
import { storage } from '@/lib/storage';

const POSTS_STORAGE_KEY = 'fb_feed_posts';
const COMMENTS_STORAGE_KEY = 'fb_feed_comments';

interface FeedState {
  posts: Post[];
  comments: Comment[];
  newPostsQueue: Post[];
  
  createPost: (postData: {
    content: string;
    image?: string;
    video?: string;
    feeling?: string;
    location?: string;
    privacy?: 'public' | 'friends' | 'only_me';
    author?: User;
  }) => Post;
  
  editPost: (id: string, content: string) => void;
  deletePost: (id: string) => void;
  reactToPost: (id: string, reaction: ReactionType) => void;
  toggleSavePost: (id: string) => void;
  
  addComment: (postId: string, content: string, parentId?: string | null, author?: User) => Comment;
  editComment: (commentId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  reactToComment: (commentId: string, reaction: ReactionType) => void;
  
  sharePost: (post: Post, shareText?: string, author?: User) => void;
  
  simulateIncomingPost: () => void;
  applyNewPostsQueue: () => void;
}

export const useFeedStore = create<FeedState>((set, get) => {
  const initialPosts = storage.get<Post[]>(POSTS_STORAGE_KEY, mockPosts);
  const initialComments = storage.get<Comment[]>(COMMENTS_STORAGE_KEY, mockComments);

  return {
    posts: initialPosts,
    comments: initialComments,
    newPostsQueue: [],

    createPost: (postData) => {
      const newPost: Post = {
        id: `post_${Date.now()}`,
        author: postData.author || currentUser,
        content: postData.content,
        image: postData.image,
        video: postData.video,
        feeling: postData.feeling,
        location: postData.location,
        privacy: postData.privacy || 'public',
        createdAt: new Date().toISOString(),
        reactions: {},
        userReaction: null,
        commentsCount: 0,
        sharesCount: 0,
        isSaved: false,
      };

      set((state) => {
        const updatedPosts = [newPost, ...state.posts];
        storage.set(POSTS_STORAGE_KEY, updatedPosts);
        return { posts: updatedPosts };
      });

      return newPost;
    },

    editPost: (id, content) => {
      set((state) => {
        const updatedPosts = state.posts.map((p) =>
          p.id === id ? { ...p, content } : p
        );
        storage.set(POSTS_STORAGE_KEY, updatedPosts);
        return { posts: updatedPosts };
      });
    },

    deletePost: (id) => {
      set((state) => {
        const updatedPosts = state.posts.filter((p) => p.id !== id);
        storage.set(POSTS_STORAGE_KEY, updatedPosts);
        return { posts: updatedPosts };
      });
    },

    reactToPost: (id, reaction) => {
      set((state) => {
        const updatedPosts = state.posts.map((post) => {
          if (post.id !== id) return post;

          const currentReaction = post.userReaction;
          const reactions = { ...post.reactions };

          // If clicking the same reaction, remove it
          if (currentReaction === reaction) {
            reactions[reaction] = Math.max(0, (reactions[reaction] || 1) - 1);
            if (reactions[reaction] === 0) delete reactions[reaction];
            return {
              ...post,
              reactions,
              userReaction: null,
            };
          }

          // If changing reaction from an existing one
          if (currentReaction) {
            reactions[currentReaction] = Math.max(0, (reactions[currentReaction] || 1) - 1);
            if (reactions[currentReaction] === 0) delete reactions[currentReaction];
          }

          // Add new reaction
          reactions[reaction] = (reactions[reaction] || 0) + 1;

          return {
            ...post,
            reactions,
            userReaction: reaction,
          };
        });

        storage.set(POSTS_STORAGE_KEY, updatedPosts);
        return { posts: updatedPosts };
      });
    },

    toggleSavePost: (id) => {
      set((state) => {
        const updatedPosts = state.posts.map((p) =>
          p.id === id ? { ...p, isSaved: !p.isSaved } : p
        );
        storage.set(POSTS_STORAGE_KEY, updatedPosts);
        return { posts: updatedPosts };
      });
    },

    addComment: (postId, content, parentId = null, author = currentUser) => {
      const newComment: Comment = {
        id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        postId,
        author,
        content,
        createdAt: new Date().toISOString(),
        reactions: {},
        userReaction: null,
        parentId,
        replies: [],
      };

      set((state) => {
        let updatedComments: Comment[];

        if (parentId) {
          // Add as reply
          updatedComments = state.comments.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), newComment],
              };
            }
            return c;
          });
        } else {
          updatedComments = [newComment, ...state.comments];
        }

        // Increment post comment count
        const updatedPosts = state.posts.map((p) =>
          p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p
        );

        storage.set(COMMENTS_STORAGE_KEY, updatedComments);
        storage.set(POSTS_STORAGE_KEY, updatedPosts);

        return { comments: updatedComments, posts: updatedPosts };
      });

      return newComment;
    },

    editComment: (commentId, content) => {
      set((state) => {
        const updateInList = (list: Comment[]): Comment[] =>
          list.map((c) => {
            if (c.id === commentId) return { ...c, content };
            if (c.replies && c.replies.length > 0) {
              return { ...c, replies: updateInList(c.replies) };
            }
            return c;
          });

        const updatedComments = updateInList(state.comments);
        storage.set(COMMENTS_STORAGE_KEY, updatedComments);
        return { comments: updatedComments };
      });
    },

    deleteComment: (commentId) => {
      set((state) => {
        let targetPostId = '';
        const filterList = (list: Comment[]): Comment[] =>
          list
            .filter((c) => {
              if (c.id === commentId) {
                targetPostId = c.postId;
                return false;
              }
              return true;
            })
            .map((c) => {
              if (c.replies && c.replies.length > 0) {
                return { ...c, replies: filterList(c.replies) };
              }
              return c;
            });

        const updatedComments = filterList(state.comments);

        const updatedPosts = state.posts.map((p) =>
          p.id === targetPostId ? { ...p, commentsCount: Math.max(0, p.commentsCount - 1) } : p
        );

        storage.set(COMMENTS_STORAGE_KEY, updatedComments);
        storage.set(POSTS_STORAGE_KEY, updatedPosts);

        return { comments: updatedComments, posts: updatedPosts };
      });
    },

    reactToComment: (commentId, reaction) => {
      set((state) => {
        const updateInList = (list: Comment[]): Comment[] =>
          list.map((c) => {
            if (c.id === commentId) {
              const currentReaction = c.userReaction;
              const reactions = { ...c.reactions };

              if (currentReaction === reaction) {
                reactions[reaction] = Math.max(0, (reactions[reaction] || 1) - 1);
                if (reactions[reaction] === 0) delete reactions[reaction];
                return { ...c, reactions, userReaction: null };
              }

              if (currentReaction) {
                reactions[currentReaction] = Math.max(0, (reactions[currentReaction] || 1) - 1);
                if (reactions[currentReaction] === 0) delete reactions[currentReaction];
              }

              reactions[reaction] = (reactions[reaction] || 0) + 1;
              return { ...c, reactions, userReaction: reaction };
            }

            if (c.replies && c.replies.length > 0) {
              return { ...c, replies: updateInList(c.replies) };
            }
            return c;
          });

        const updatedComments = updateInList(state.comments);
        storage.set(COMMENTS_STORAGE_KEY, updatedComments);
        return { comments: updatedComments };
      });
    },

    sharePost: (sourcePost, shareText = '', author = currentUser) => {
      const newPost: Post = {
        id: `post_share_${Date.now()}`,
        author,
        content: shareText,
        privacy: 'public',
        createdAt: new Date().toISOString(),
        reactions: {},
        userReaction: null,
        commentsCount: 0,
        sharesCount: 0,
        sharedPost: sourcePost,
      };

      set((state) => {
        // Increment source post sharesCount
        const updatedPosts = [
          newPost,
          ...state.posts.map((p) =>
            p.id === sourcePost.id ? { ...p, sharesCount: p.sharesCount + 1 } : p
          ),
        ];
        storage.set(POSTS_STORAGE_KEY, updatedPosts);
        return { posts: updatedPosts };
      });
    },

    simulateIncomingPost: () => {
      // Pick random author other than current user
      const eligibleUsers = mockUsers.filter((u) => u.id !== currentUser.id);
      const randomUser = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];

      const sampleContents = [
        'Just pushed an update to our open source compiler! Check out the release notes. 🚀⚡',
        'Incredible sunset over the bay tonight. Grateful for simple moments like this. 🌅',
        'Coffee tasting session with the design team: natural Ethiopian beans won hands down! ☕',
        'Who else is attending the Next.js meetup tomorrow evening? Would love to connect!',
        'Testing our latest deep learning model for real-time edge processing. Latency dropped by 40%!',
      ];
      const randomContent = sampleContents[Math.floor(Math.random() * sampleContents.length)];

      const incomingPost: Post = {
        id: `live_post_${Date.now()}`,
        author: randomUser,
        content: randomContent,
        privacy: 'public',
        createdAt: new Date().toISOString(),
        reactions: { like: 1 },
        commentsCount: 0,
        sharesCount: 0,
      };

      set((state) => ({
        newPostsQueue: [incomingPost, ...state.newPostsQueue],
      }));
    },

    applyNewPostsQueue: () => {
      set((state) => {
        if (state.newPostsQueue.length === 0) return state;
        const updatedPosts = [...state.newPostsQueue, ...state.posts];
        storage.set(POSTS_STORAGE_KEY, updatedPosts);
        return {
          posts: updatedPosts,
          newPostsQueue: [],
        };
      });
    },
  };
});
