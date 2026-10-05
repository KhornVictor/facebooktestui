import { Comment } from '@/types';
import { mockUsers } from './users';

export const mockComments: Comment[] = [
  // Post 1 comments
  {
    id: 'c1_1',
    postId: 'post_1',
    author: mockUsers[2], // Bob
    content: 'The new sub-pixel borders look super clean on Retina displays! Huge improvement. 🔥',
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    reactions: { like: 12, love: 3 },
    userReaction: 'like',
    replies: [
      {
        id: 'c1_1_r1',
        postId: 'post_1',
        author: mockUsers[1], // Alice
        content: 'Thanks Bob! The anti-aliasing took quite a bit of tuning with the WebKit team.',
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        reactions: { like: 5, care: 1 },
        userReaction: null,
      },
      {
        id: 'c1_1_r2',
        postId: 'post_1',
        author: mockUsers[0], // Victor
        content: 'I agree, the transition animation feels buttery smooth too.',
        createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        reactions: { like: 4, love: 2 },
        userReaction: 'love',
      },
    ],
  },
  {
    id: 'c1_2',
    postId: 'post_1',
    author: mockUsers[16], // Paula
    content: 'Love the contrast ratio on dark mode! Are you using OKLCH color spaces under the hood?',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    reactions: { like: 8, wow: 2 },
    userReaction: null,
    replies: [
      {
        id: 'c1_2_r1',
        postId: 'post_1',
        author: mockUsers[1], // Alice
        content: 'Yes! OKLCH with perceptual lightness curves for uniform luminosity across themes.',
        createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
        reactions: { like: 6, love: 4 },
        userReaction: 'like',
      },
    ],
  },
  {
    id: 'c1_3',
    postId: 'post_1',
    author: mockUsers[4], // Diana
    content: 'The typography hierarchy is stunning Alice! Great work.',
    createdAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
    reactions: { like: 5, love: 1 },
    userReaction: null,
  },

  // Post 2 comments
  {
    id: 'c2_1',
    postId: 'post_2',
    author: mockUsers[11], // Kevin
    content: '45 miles of gravel is no joke! Did you ride up Jester Hill?',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    reactions: { like: 4, haha: 1 },
    userReaction: null,
    replies: [
      {
        id: 'c2_1_r1',
        postId: 'post_2',
        author: mockUsers[2], // Bob
        content: 'Haha yes, my quads were burning on that 22% grade section!',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        reactions: { haha: 6, like: 2 },
        userReaction: 'haha',
      },
    ],
  },
  {
    id: 'c2_2',
    postId: 'post_2',
    author: mockUsers[6], // Fiona
    content: 'I hope there were breakfast tacos waiting at the finish line! 🌮',
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    reactions: { love: 9, like: 3 },
    userReaction: 'love',
  },

  // Post 3 comments
  {
    id: 'c3_1',
    postId: 'post_3',
    author: mockUsers[0], // Victor
    content: '3.4x speedup on local models is monumental Charlie! Are the draft weights shared or quantized separately?',
    createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    reactions: { like: 14, wow: 3 },
    userReaction: 'like',
    replies: [
      {
        id: 'c3_1_r1',
        postId: 'post_3',
        author: mockUsers[3], // Charlie
        content: 'Separately quantized at 4-bit with AWQ! Draft model runs entirely in L2 cache.',
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        reactions: { like: 11, wow: 5 },
        userReaction: null,
      },
    ],
  },
  {
    id: 'c3_2',
    postId: 'post_3',
    author: mockUsers[21], // Victor Stone
    content: 'Can this run in real-time on robotic edge compute like Jetson Orin?',
    createdAt: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    reactions: { like: 6 },
    userReaction: null,
    replies: [
      {
        id: 'c3_2_r1',
        postId: 'post_3',
        author: mockUsers[3], // Charlie
        content: 'Tested on Jetson Orin Nano yesterday, hits 28 tokens/sec without throttling!',
        createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
        reactions: { love: 8, wow: 4 },
        userReaction: 'love',
      },
    ],
  },

  // Post 4 comments
  {
    id: 'c4_1',
    postId: 'post_4',
    author: mockUsers[10], // Julia
    content: 'Cannon Beach in misty weather is unbeatable. The framing of Haystack Rock here is majestic!',
    createdAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    reactions: { like: 15, love: 8 },
    userReaction: 'love',
  },
  {
    id: 'c4_2',
    postId: 'post_4',
    author: mockUsers[17], // Quinn
    content: 'The lighting gradient across the water is pure art. Incredible capture Diana.',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    reactions: { like: 7, love: 3 },
    userReaction: null,
  },

  // Post 5 comments
  {
    id: 'c5_1',
    postId: 'post_5',
    author: mockUsers[1], // Alice
    content: 'That egg yolk looks unreal! Drop the recipe please 🤤',
    createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    reactions: { love: 18, like: 5 },
    userReaction: 'love',
    replies: [
      {
        id: 'c5_1_r1',
        postId: 'post_5',
        author: mockUsers[6], // Fiona
        content: '6 minutes 15 seconds in boiling water with a splash of vinegar, ice bath immediately, then 24hr marinade in mirin, soy sauce, and dashi!',
        createdAt: new Date(Date.now() - 1000 * 60 * 290).toISOString(),
        reactions: { love: 16, care: 5 },
        userReaction: 'care',
      },
    ],
  },
  {
    id: 'c5_2',
    postId: 'post_5',
    author: mockUsers[2], // Bob
    content: 'My invitation must have gotten lost in the mail! Save a bowl for me!',
    createdAt: new Date(Date.now() - 1000 * 60 * 310).toISOString(),
    reactions: { haha: 12, like: 3 },
    userReaction: 'haha',
  },

  // Post 6 comments
  {
    id: 'c6_1',
    postId: 'post_6',
    author: mockUsers[16], // Paula
    content: 'Well deserved Victor! The developer experience of your library is top tier.',
    createdAt: new Date(Date.now() - 1000 * 60 * 440).toISOString(),
    reactions: { like: 21, love: 9 },
    userReaction: 'love',
  },
  {
    id: 'c6_2',
    postId: 'post_6',
    author: mockUsers[3], // Charlie
    content: 'To 10k and beyond! 🚀 Proud to have been an early contributor.',
    createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    reactions: { like: 15, love: 6 },
    userReaction: 'like',
  },
  {
    id: 'c6_3',
    postId: 'post_6',
    author: mockUsers[7], // George
    content: 'We use it in our internal game telemetry dashboard every day. Congrats!',
    createdAt: new Date(Date.now() - 1000 * 60 * 390).toISOString(),
    reactions: { like: 9 },
    userReaction: null,
  },

  // Post 7 comments
  {
    id: 'c7_1',
    postId: 'post_7',
    author: mockUsers[5], // Ethan
    content: 'The lighting bloom is so atmospheric! What engine are you using?',
    createdAt: new Date(Date.now() - 1000 * 60 * 550).toISOString(),
    reactions: { like: 4 },
    userReaction: null,
  },

  // Post 8 comments
  {
    id: 'c8_1',
    postId: 'post_8',
    author: mockUsers[4], // Diana
    content: 'Urban farming is such vital work Hannah. Beautiful harvest!',
    createdAt: new Date(Date.now() - 1000 * 60 * 660).toISOString(),
    reactions: { like: 11, care: 4 },
    userReaction: null,
  },

  // Post 9 comments
  {
    id: 'c9_1',
    postId: 'post_9',
    author: mockUsers[18], // Rachel
    content: 'Adding Mount Batur to my bucket list right now! Unbelievable colors.',
    createdAt: new Date(Date.now() - 1000 * 60 * 800).toISOString(),
    reactions: { love: 14, like: 6 },
    userReaction: 'love',
  },

  // Post 10 comments
  {
    id: 'c10_1',
    postId: 'post_10',
    author: mockUsers[2], // Bob
    content: 'Sub 6:20 miles for 18 miles is flying! You are ready for Boston.',
    createdAt: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
    reactions: { like: 8, wow: 3 },
    userReaction: 'like',
  },

  // Post 11 comments
  {
    id: 'c11_1',
    postId: 'post_11',
    author: mockUsers[15], // Oliver
    content: 'Love to see scalable ocean tech deployed in the wild. Great work Nina!',
    createdAt: new Date(Date.now() - 1000 * 60 * 1050).toISOString(),
    reactions: { like: 9, love: 3 },
    userReaction: null,
  },

  // Post 12 comments
  {
    id: 'c12_1',
    postId: 'post_12',
    author: mockUsers[0], // Victor
    content: 'Preach! Container queries with `@container` completely changed how we build component libraries.',
    createdAt: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
    reactions: { like: 16, love: 5 },
    userReaction: 'like',
  },

  // Post 15 comments
  {
    id: 'c15_1',
    postId: 'post_15',
    author: mockUsers[3], // Charlie
    content: 'Andromeda always gives me chills. 1 trillion stars in that swirl.',
    createdAt: new Date(Date.now() - 1000 * 60 * 1750).toISOString(),
    reactions: { like: 22, wow: 11 },
    userReaction: 'wow',
  },
  {
    id: 'c15_2',
    postId: 'post_15',
    author: mockUsers[10], // Julia
    content: 'One of the best astrophotography shots I have seen in years Tara!',
    createdAt: new Date(Date.now() - 1000 * 60 * 1700).toISOString(),
    reactions: { love: 15, like: 7 },
    userReaction: 'love',
  },

  // Post 21 comments
  {
    id: 'c21_1',
    postId: 'post_21',
    author: mockUsers[5], // Ethan
    content: 'Picking up an egg without cracking it takes serious strain-gauge calibration! Respect!',
    createdAt: new Date(Date.now() - 1000 * 60 * 3300).toISOString(),
    reactions: { like: 12, wow: 6 },
    userReaction: 'like',
  },

  // Post 26 comments
  {
    id: 'c26_1',
    postId: 'post_26',
    author: mockUsers[1], // Alice
    content: 'The ear on that sourdough loaf! Absolute perfection.',
    createdAt: new Date(Date.now() - 1000 * 60 * 4800).toISOString(),
    reactions: { love: 13, like: 4 },
    userReaction: 'love',
  },

  // Post 27 comments
  {
    id: 'c27_1',
    postId: 'post_27',
    author: mockUsers[2], // Bob
    content: 'Off-by-one errors: keeping software engineers humble since 1950. 😂',
    createdAt: new Date(Date.now() - 1000 * 60 * 5100).toISOString(),
    reactions: { haha: 35, like: 12 },
    userReaction: 'haha',
  },
  {
    id: 'c27_2',
    postId: 'post_27',
    author: mockUsers[16], // Paula
    content: 'Every single time! Followed by staring into the ceiling for 10 minutes.',
    createdAt: new Date(Date.now() - 1000 * 60 * 5050).toISOString(),
    reactions: { haha: 22, like: 8 },
    userReaction: 'haha',
  },

  // Post 30 comments
  {
    id: 'c30_1',
    postId: 'post_30',
    author: mockUsers[13], // Marcus
    content: 'Try ambient modular synth records or Brian Eno! Best focus music for coding.',
    createdAt: new Date(Date.now() - 1000 * 60 * 6000).toISOString(),
    reactions: { like: 8, love: 3 },
    userReaction: 'love',
  },
];
