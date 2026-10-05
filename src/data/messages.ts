import { Conversation, Message } from '@/types';
import { mockUsers, currentUser } from './users';

export const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    participants: [currentUser, mockUsers[1]], // Alice
    isGroup: false,
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(), // 3m ago
  },
  {
    id: 'conv_2',
    participants: [currentUser, mockUsers[2]], // Bob
    isGroup: false,
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'conv_3',
    participants: [currentUser, mockUsers[3]], // Charlie
    isGroup: false,
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'conv_4',
    participants: [currentUser, mockUsers[1], mockUsers[16], mockUsers[2]], // Frontend Guild
    isGroup: true,
    groupName: 'Frontend Architecture Guild ⚡',
    groupAvatar: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80',
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'conv_5',
    participants: [currentUser, mockUsers[4]], // Diana
    isGroup: false,
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'conv_6',
    participants: [currentUser, mockUsers[6]], // Fiona
    isGroup: false,
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'conv_7',
    participants: [currentUser, mockUsers[7]], // George
    isGroup: false,
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: 'conv_8',
    participants: [currentUser, mockUsers[8]], // Hannah
    isGroup: false,
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
  {
    id: 'conv_9',
    participants: [currentUser, mockUsers[10]], // Julia
    isGroup: false,
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
  {
    id: 'conv_10',
    participants: [currentUser, mockUsers[11]], // Kevin
    isGroup: false,
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
  },
  {
    id: 'conv_11',
    participants: [currentUser, mockUsers[14]], // Nina
    isGroup: false,
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
  },
  {
    id: 'conv_12',
    participants: [currentUser, mockUsers[16]], // Paula
    isGroup: false,
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
  },
  {
    id: 'conv_13',
    participants: [currentUser, mockUsers[18]], // Rachel
    isGroup: false,
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
  },
  {
    id: 'conv_14',
    participants: [currentUser, mockUsers[2], mockUsers[11], mockUsers[4]], // Hiking crew
    isGroup: true,
    groupName: 'Pacific Northwest Hikers 🥾🌲',
    groupAvatar: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=150&auto=format&fit=crop&q=80',
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
  },
  {
    id: 'conv_15',
    participants: [currentUser, mockUsers[3], mockUsers[21], mockUsers[5]], // AI Systems Lab
    isGroup: true,
    groupName: 'Autonomous Systems & Edge AI 🤖',
    groupAvatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&auto=format&fit=crop&q=80',
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 800).toISOString(),
  },
];

export const mockMessages: Message[] = [
  // Conversation 1 (Alice Johnson)
  {
    id: 'm1_1',
    conversationId: 'conv_1',
    senderId: 'user_1',
    text: 'Hey Victor! Have you seen the updated design tokens for the theme system?',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    status: 'read',
  },
  {
    id: 'm1_2',
    conversationId: 'conv_1',
    senderId: 'user_me',
    text: 'Hey Alice! Yes, I was just looking at the Figma component specs. The micro-interactions and elevation variables look so much tighter.',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    status: 'read',
    reactions: [{ emoji: '👍', userId: 'user_1' }],
  },
  {
    id: 'm1_3',
    conversationId: 'conv_1',
    senderId: 'user_1',
    text: 'Awesome! Did you get a chance to check how the responsive layout behaves on mobile foldables?',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    status: 'read',
  },
  {
    id: 'm1_4',
    conversationId: 'conv_1',
    senderId: 'user_me',
    text: 'Tested on both dual-screen and narrow viewports. Split pane works like a charm without any content squishing! 📱',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    status: 'read',
    reactions: [{ emoji: '❤️', userId: 'user_1' }],
  },
  {
    id: 'm1_5',
    conversationId: 'conv_1',
    senderId: 'user_1',
    text: 'That is incredible news! Here is the updated preview banner for the design review.',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    status: 'delivered',
    attachments: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
        name: 'design-tokens-v2.png',
        size: '1.4 MB',
      },
    ],
  },
  {
    id: 'm1_6',
    conversationId: 'conv_1',
    senderId: 'user_1',
    text: 'Let me know if we can do a quick 5-min sync before the sprint demo! ✨',
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    status: 'delivered',
  },

  // Conversation 2 (Bob Martinez)
  {
    id: 'm2_1',
    conversationId: 'conv_2',
    senderId: 'user_2',
    text: 'Yo Victor! Are you free for a trail ride this Saturday morning?',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: 'read',
  },
  {
    id: 'm2_2',
    conversationId: 'conv_2',
    senderId: 'user_me',
    text: 'Hey Bob! Definitely down. Are we hitting Barton Creek Greenbelt or Walnut Creek?',
    createdAt: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
    status: 'read',
  },
  {
    id: 'm2_3',
    conversationId: 'conv_2',
    senderId: 'user_2',
    text: 'Walnut Creek! The northern loop got paved with new gravel berms, super fast and fun.',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: 'read',
    reactions: [{ emoji: '🔥', userId: 'user_me' }],
  },
  {
    id: 'm2_4',
    conversationId: 'conv_2',
    senderId: 'user_me',
    text: 'Count me in! Meet at the trailhead around 8:00 AM?',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    status: 'read',
  },
  {
    id: 'm2_5',
    conversationId: 'conv_2',
    senderId: 'user_2',
    text: 'Perfect. Tacos and espresso afterwards! 🌮☕',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    status: 'read',
    reactions: [{ emoji: '❤️', userId: 'user_me' }],
  },

  // Conversation 3 (Charlie Zhang)
  {
    id: 'm3_1',
    conversationId: 'conv_3',
    senderId: 'user_3',
    text: 'Victor, I checked out your benchmark repo for client-side state hydration.',
    createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    status: 'read',
  },
  {
    id: 'm3_2',
    conversationId: 'conv_3',
    senderId: 'user_me',
    text: 'Nice! Any bottleneck that stood out when testing 10,000 entities?',
    createdAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    status: 'read',
  },
  {
    id: 'm3_3',
    conversationId: 'conv_3',
    senderId: 'user_3',
    text: 'Object.freeze() overhead during serialization was adding ~12ms. Using structural sharing with Immer or Zustand slices cut that down to sub-1ms.',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    status: 'read',
    reactions: [{ emoji: '😮', userId: 'user_me' }],
  },
  {
    id: 'm3_4',
    conversationId: 'conv_3',
    senderId: 'user_3',
    text: 'Just pushed a PR with the micro-benchmark suite for your review!',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'delivered',
  },

  // Conversation 4 (Frontend Guild)
  {
    id: 'm4_1',
    conversationId: 'conv_4',
    senderId: 'user_16', // Paula
    text: 'Morning everyone! Reminder that we are adopting Tailwind v4 for all new feature modules starting this sprint.',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    status: 'read',
  },
  {
    id: 'm4_2',
    conversationId: 'conv_4',
    senderId: 'user_1', // Alice
    text: 'Super excited! The build times with the new Lightning CSS compiler are mindblowing.',
    createdAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    status: 'read',
    reactions: [{ emoji: '🚀', userId: 'user_me' }],
  },
  {
    id: 'm4_3',
    conversationId: 'conv_4',
    senderId: 'user_me',
    text: 'Confirmed, hot-reload is instant even on our heaviest dashboard views.',
    createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    status: 'read',
  },
  {
    id: 'm4_4',
    conversationId: 'conv_4',
    senderId: 'user_2', // Bob
    text: 'Docs are linked in the channel description for anyone migrating legacy CSS modules.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    status: 'read',
  },

  // Conversation 5 (Diana Prince)
  {
    id: 'm5_1',
    conversationId: 'conv_5',
    senderId: 'user_4',
    text: 'Victor! The gallery photography prints arrived from the lab.',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    status: 'read',
  },
  {
    id: 'm5_2',
    conversationId: 'conv_5',
    senderId: 'user_4',
    text: 'The Hahnemühle cotton rag paper captures every single tone of the coastal mist.',
    createdAt: new Date(Date.now() - 1000 * 60 * 280).toISOString(),
    status: 'read',
    attachments: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        name: 'cannon-beach-print.jpg',
      },
    ],
  },
  {
    id: 'm5_3',
    conversationId: 'conv_5',
    senderId: 'user_me',
    text: 'That looks museum-grade Diana! Can not wait to hang mine up.',
    createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    status: 'read',
    reactions: [{ emoji: '❤️', userId: 'user_4' }],
  },
  {
    id: 'm5_4',
    conversationId: 'conv_5',
    senderId: 'user_4',
    text: 'Dropping it off at your studio tomorrow afternoon! 📦',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: 'read',
  },

  // Conversation 6 (Fiona Gallagher)
  {
    id: 'm6_1',
    conversationId: 'conv_6',
    senderId: 'user_6',
    text: 'Hey! Are you still doing the homemade pasta workshop this Sunday?',
    createdAt: new Date(Date.now() - 1000 * 60 * 350).toISOString(),
    status: 'read',
  },
  {
    id: 'm6_2',
    conversationId: 'conv_6',
    senderId: 'user_me',
    text: 'Yes! Bringing my brass pasta roller and semolina flour.',
    createdAt: new Date(Date.now() - 1000 * 60 * 310).toISOString(),
    status: 'read',
    reactions: [{ emoji: '🎉', userId: 'user_6' }],
  },
  {
    id: 'm6_3',
    conversationId: 'conv_6',
    senderId: 'user_6',
    text: 'Amazing, I have 3 aged Parmigiano Reggiano wheels ready to grate! 🧀',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: 'read',
  },

  // Conversation 7 (George Miller)
  {
    id: 'm7_1',
    conversationId: 'conv_7',
    senderId: 'user_7',
    text: 'Did you check the WebAssembly build of our physics engine?',
    createdAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    status: 'read',
  },
  {
    id: 'm7_2',
    conversationId: 'conv_7',
    senderId: 'user_me',
    text: 'Tested 5,000 rigid bodies colliding at 60 FPS in Chrome and Safari. Zero stutter!',
    createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    status: 'read',
    reactions: [{ emoji: '🔥', userId: 'user_7' }],
  },
  {
    id: 'm7_3',
    conversationId: 'conv_7',
    senderId: 'user_7',
    text: 'Let us gooo! We can launch the playtest next week.',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    status: 'read',
  },

  // Conversation 8 (Hannah Abbott)
  {
    id: 'm8_1',
    conversationId: 'conv_8',
    senderId: 'user_8',
    text: 'Victor, do you know anyone who needs hydroponic sensors for vertical farming?',
    createdAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    status: 'read',
  },
  {
    id: 'm8_2',
    conversationId: 'conv_8',
    senderId: 'user_me',
    text: 'Yes! Nina was actually looking for moisture telemetry sensors for her green project.',
    createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    status: 'read',
  },
  {
    id: 'm8_3',
    conversationId: 'conv_8',
    senderId: 'user_8',
    text: 'Connected with her! Thank you so much for introducing us.',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    status: 'read',
    reactions: [{ emoji: '🌿', userId: 'user_me' }],
  },

  // Conversation 9 (Julia Roberts)
  {
    id: 'm9_1',
    conversationId: 'conv_9',
    senderId: 'user_10',
    text: 'Heading to Kyoto for the autumn maple festival next month! Any tea houses you recommend?',
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    status: 'read',
  },
  {
    id: 'm9_2',
    conversationId: 'conv_9',
    senderId: 'user_me',
    text: 'You have to visit Ippodo Tea near Kyoto Imperial Palace! Their ceremonial matcha is unmatched.',
    createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    status: 'read',
    reactions: [{ emoji: '🍵', userId: 'user_10' }],
  },
  {
    id: 'm9_3',
    conversationId: 'conv_9',
    senderId: 'user_10',
    text: 'Bookmarked! Will bring back some fresh matcha powder for you! 🍵',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    status: 'read',
  },

  // Conversation 10 (Kevin Vance)
  {
    id: 'm10_1',
    conversationId: 'conv_10',
    senderId: 'user_11',
    text: 'What heart rate monitor strap are you using for long runs?',
    createdAt: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
    status: 'read',
  },
  {
    id: 'm10_2',
    conversationId: 'conv_10',
    senderId: 'user_me',
    text: 'Polar H10! Dual Bluetooth channels + ANT+ makes it rock solid.',
    createdAt: new Date(Date.now() - 1000 * 60 * 550).toISOString(),
    status: 'read',
  },
  {
    id: 'm10_3',
    conversationId: 'conv_10',
    senderId: 'user_11',
    text: 'Just ordered it. Appreciate the tip man!',
    createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    status: 'read',
    reactions: [{ emoji: '👍', userId: 'user_me' }],
  },

  // Conversation 11 (Nina Patel)
  {
    id: 'm11_1',
    conversationId: 'conv_11',
    senderId: 'user_14',
    text: 'Hey Victor! Hannah sent over the sensor calibration profiles. They work flawlessly!',
    createdAt: new Date(Date.now() - 1000 * 60 * 800).toISOString(),
    status: 'read',
  },
  {
    id: 'm11_2',
    conversationId: 'conv_11',
    senderId: 'user_me',
    text: 'Glad to hear that! How is the solar battery life holding up in salt mist?',
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    status: 'read',
  },
  {
    id: 'm11_3',
    conversationId: 'conv_11',
    senderId: 'user_14',
    text: 'No degradation even after 3 weeks submerged in the tidal basin. 🌊⚡',
    createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    status: 'read',
    reactions: [{ emoji: '🙌', userId: 'user_me' }],
  },

  // Conversation 12 (Paula Deen)
  {
    id: 'm12_1',
    conversationId: 'conv_12',
    senderId: 'user_16',
    text: 'Reviewing your CSS architecture slides for tomorrow conference keynote.',
    createdAt: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
    status: 'read',
  },
  {
    id: 'm12_2',
    conversationId: 'conv_12',
    senderId: 'user_me',
    text: 'Feel free to tweak any diagrams! The slide on cascade layers seems to resonate best.',
    createdAt: new Date(Date.now() - 1000 * 60 * 750).toISOString(),
    status: 'read',
  },
  {
    id: 'm12_3',
    conversationId: 'conv_12',
    senderId: 'user_16',
    text: 'It is super clear. The audience is going to love it! 👏',
    createdAt: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
    status: 'read',
    reactions: [{ emoji: '❤️', userId: 'user_me' }],
  },

  // Conversation 13 (Rachel Green)
  {
    id: 'm13_1',
    conversationId: 'conv_13',
    senderId: 'user_18',
    text: 'Victor! We are setting up the lookbook site for Fashion Week.',
    createdAt: new Date(Date.now() - 1000 * 60 * 1000).toISOString(),
    status: 'read',
  },
  {
    id: 'm13_2',
    conversationId: 'conv_13',
    senderId: 'user_me',
    text: 'Need high-res image zoom or 3D model viewer for garments?',
    createdAt: new Date(Date.now() - 1000 * 60 * 800).toISOString(),
    status: 'read',
  },
  {
    id: 'm13_3',
    conversationId: 'conv_13',
    senderId: 'user_18',
    text: 'Smooth pinch-to-zoom with progressive JPEG loading would be perfect! 👗✨',
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    status: 'read',
    reactions: [{ emoji: '✨', userId: 'user_me' }],
  },

  // Conversation 14 (Pacific Northwest Hikers)
  {
    id: 'm14_1',
    conversationId: 'conv_14',
    senderId: 'user_4', // Diana
    text: 'Trail conditions update for Mount Si: dry snow near the summit ridge, microspikes recommended!',
    createdAt: new Date(Date.now() - 1000 * 60 * 1100).toISOString(),
    status: 'read',
  },
  {
    id: 'm14_2',
    conversationId: 'conv_14',
    senderId: 'user_2', // Bob
    text: 'Got my trekking poles and thermos ready. Bringing hot cider for everyone!',
    createdAt: new Date(Date.now() - 1000 * 60 * 950).toISOString(),
    status: 'read',
    reactions: [{ emoji: '☕', userId: 'user_me' }],
  },
  {
    id: 'm14_3',
    conversationId: 'conv_14',
    senderId: 'user_11', // Kevin
    text: 'Trailhead departure 6:45 AM sharp so we catch the sunrise above the cloud inversion.',
    createdAt: new Date(Date.now() - 1000 * 60 * 850).toISOString(),
    status: 'read',
  },
  {
    id: 'm14_4',
    conversationId: 'conv_14',
    senderId: 'user_me',
    text: 'See you all there at dawn! 🥾🌲',
    createdAt: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
    status: 'read',
  },

  // Conversation 15 (Autonomous Systems & Edge AI)
  {
    id: 'm15_1',
    conversationId: 'conv_15',
    senderId: 'user_3', // Charlie
    text: 'New ROS2 node with ONNX runtime is streaming at 90 FPS with 4ms latency.',
    createdAt: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
    status: 'read',
  },
  {
    id: 'm15_2',
    conversationId: 'conv_15',
    senderId: 'user_21', // Victor Stone
    text: 'Robotic gripper feedback loop is locked with zero phase jitter!',
    createdAt: new Date(Date.now() - 1000 * 60 * 1050).toISOString(),
    status: 'read',
  },
  {
    id: 'm15_3',
    conversationId: 'conv_15',
    senderId: 'user_5', // Ethan
    text: 'Enclave encryption keys verified for over-the-air firmware updates.',
    createdAt: new Date(Date.now() - 1000 * 60 * 950).toISOString(),
    status: 'read',
  },
  {
    id: 'm15_4',
    conversationId: 'conv_15',
    senderId: 'user_me',
    text: 'Telemetry telemetry dashboard is syncing smoothly. Ready for the hardware test rig! 🤖🚀',
    createdAt: new Date(Date.now() - 1000 * 60 * 800).toISOString(),
    status: 'read',
    reactions: [{ emoji: '🔥', userId: 'user_3' }],
  },
];

// Attach lastMessage to each conversation
mockConversations.forEach((conv) => {
  const msgs = mockMessages.filter((m) => m.conversationId === conv.id);
  if (msgs.length > 0) {
    conv.lastMessage = msgs[msgs.length - 1];
    conv.updatedAt = conv.lastMessage.createdAt;
  }
});

export const mockReplies = [
  "Hey! Doing great, thanks for checking in!",
  "That sounds fantastic! Let's do it 😄",
  "Totally agree with you on that one!",
  "I'll take a look at it right away.",
  "Haha so true 😂",
  "Let me know when you're free to catch up!",
  "Just saw your latest post, looks awesome! 🔥",
  "Sending you the files in a minute.",
  "Count me in for sure! 👍",
  "That makes a lot of sense. Good catch!",
];
