import { Story } from '@/types';
import { mockUsers } from './users';

export const mockStories: Story[] = [
  {
    id: 'story_me',
    author: mockUsers[0], // Victor
    mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isViewed: false,
    textOverlay: 'Shipping the new dark mode engine! 🚀✨',
  },
  {
    id: 'story_1',
    author: mockUsers[1], // Alice
    mediaUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isViewed: false,
    textOverlay: 'Coffee & design vibes ☕📐',
  },
  {
    id: 'story_2',
    author: mockUsers[2], // Bob
    mediaUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    isViewed: false,
    textOverlay: 'Trail run view 🏃‍♂️⛰️',
  },
  {
    id: 'story_3',
    author: mockUsers[3], // Charlie
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isViewed: false,
    textOverlay: 'Cluster metrics looking green 🟢',
  },
  {
    id: 'story_4',
    author: mockUsers[4], // Diana
    mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    isViewed: false,
    textOverlay: 'Sunset over Mount Rainier 🌄',
  },
  {
    id: 'story_5',
    author: mockUsers[6], // Fiona
    mediaUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    isViewed: false,
    textOverlay: 'Crispy wood-fired sourdough pizza 🍕',
  },
  {
    id: 'story_6',
    author: mockUsers[7], // George
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    isViewed: false,
    textOverlay: 'Pixel shader experiment ✨🕹️',
  },
  {
    id: 'story_7',
    author: mockUsers[8], // Hannah
    mediaUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    isViewed: true,
    textOverlay: 'Greenhouse mornings 🌿🌱',
  },
  {
    id: 'story_8',
    author: mockUsers[10], // Julia
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    isViewed: true,
    textOverlay: 'Beach walks in Nusa Dua 🌊',
  },
  {
    id: 'story_9',
    author: mockUsers[11], // Kevin
    mediaUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    isViewed: true,
    textOverlay: 'Pacing the tempo mile ⏱️💨',
  },
  {
    id: 'story_10',
    author: mockUsers[12], // Laura
    mediaUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
    isViewed: true,
    textOverlay: 'Roman ruins in Bath 🏛️',
  },
  {
    id: 'story_11',
    author: mockUsers[13], // Marcus
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    isViewed: true,
    textOverlay: 'Analog synth patch session 🎹',
  },
  {
    id: 'story_12',
    author: mockUsers[14], // Nina
    mediaUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 550).toISOString(),
    isViewed: true,
    textOverlay: 'Sensor deployment ready! 🌊⚡',
  },
  {
    id: 'story_13',
    author: mockUsers[16], // Paula
    mediaUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    isViewed: true,
    textOverlay: 'Clean code & clean desk 💻',
  },
  {
    id: 'story_14',
    author: mockUsers[17], // Quinn
    mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 650).toISOString(),
    isViewed: true,
    textOverlay: 'Berlin symmetry 🏢📐',
  },
  {
    id: 'story_15',
    author: mockUsers[18], // Rachel
    mediaUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
    isViewed: true,
    textOverlay: 'New collection moodboard 👗✨',
  },
  {
    id: 'story_16',
    author: mockUsers[19], // Sam
    mediaUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 750).toISOString(),
    isViewed: true,
    textOverlay: 'Sunset formation flight ✈️🌅',
  },
  {
    id: 'story_17',
    author: mockUsers[20], // Tara
    mediaUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 800).toISOString(),
    isViewed: true,
    textOverlay: 'Observatory dome opening 🌌🔭',
  },
  {
    id: 'story_18',
    author: mockUsers[21], // Victor Stone
    mediaUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 850).toISOString(),
    isViewed: true,
    textOverlay: 'Testing robotic arm calibration 🦾',
  },
  {
    id: 'story_19',
    author: mockUsers[5], // Ethan
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
    isViewed: true,
    textOverlay: 'Key generation entropy test 🔐',
  },
];
