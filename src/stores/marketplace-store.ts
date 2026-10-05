import { create } from 'zustand';
import { MarketplaceItem, MarketplaceCategory } from '@/types';
import { mockMarketplaceItems } from '@/data/marketplace';
import { storage } from '@/lib/storage';

const MARKETPLACE_STORAGE_KEY = 'fb_marketplace_items';

interface MarketplaceState {
  items: MarketplaceItem[];
  selectedCategory: MarketplaceCategory | 'All';
  searchQuery: string;
  setSelectedCategory: (cat: MarketplaceCategory | 'All') => void;
  setSearchQuery: (query: string) => void;
  toggleSaveItem: (id: string) => void;
}

export const useMarketplaceStore = create<MarketplaceState>((set) => {
  const initial = storage.get<MarketplaceItem[]>(MARKETPLACE_STORAGE_KEY, mockMarketplaceItems);

  return {
    items: initial,
    selectedCategory: 'All',
    searchQuery: '',

    setSelectedCategory: (cat) => set({ selectedCategory: cat }),
    setSearchQuery: (query) => set({ searchQuery: query }),

    toggleSaveItem: (id) => {
      set((state) => {
        const updated = state.items.map((item) =>
          item.id === id ? { ...item, isSaved: !item.isSaved } : item
        );
        storage.set(MARKETPLACE_STORAGE_KEY, updated);
        return { items: updated };
      });
    },
  };
});
