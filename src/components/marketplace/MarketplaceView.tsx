'use client';

import React, { useState } from 'react';
import { useMarketplaceStore } from '@/stores/marketplace-store';
import { useMessengerStore } from '@/stores/messenger-store';
import { useUIStore } from '@/stores/ui-store';
import { MarketplaceItem, MarketplaceCategory } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  MapPin,
  MessageCircle,
  Share2,
  Tag,
  ShieldCheck,
} from 'lucide-react';

const categories: (MarketplaceCategory | 'All')[] = [
  'All',
  'Electronics',
  'Computers',
  'Phones',
  'Vehicles',
  'Home',
  'Clothing',
];

export function MarketplaceView() {
  const router = useRouter();
  const {
    items,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    toggleSaveItem,
  } = useMarketplaceStore();
  const { getOrCreateConversationWithUser, setActiveConversation } = useMessengerStore();
  const { showToast } = useUIStore();

  const [selectedProduct, setSelectedProduct] = useState<MarketplaceItem | null>(null);

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleContactSeller = (product: MarketplaceItem) => {
    const convId = getOrCreateConversationWithUser(product.seller);
    setActiveConversation(convId);
    showToast(`Opening chat with seller ${product.seller.name}...`, 'info');
    setSelectedProduct(null);
    router.push('/messenger');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Marketplace
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Buy and sell items locally in your community
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center bg-[var(--bg-input)] rounded-full px-3 py-1.5 w-full sm:w-72">
          <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <input
            type="text"
            placeholder="Search Marketplace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-[var(--text-primary)] focus:outline-hidden ml-2 w-full"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[var(--fb-blue)] text-white shadow-xs'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-subtle)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-[var(--bg-surface)] rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Image Container with bookmark button */}
            <div
              className="relative aspect-square bg-zinc-800 overflow-hidden cursor-pointer"
              onClick={() => setSelectedProduct(item)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveItem(item.id);
                  showToast(
                    item.isSaved ? 'Removed from saved' : 'Saved item to your list',
                    'success'
                  );
                }}
                className="absolute top-2 right-2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
                title={item.isSaved ? 'Unsave' : 'Save'}
              >
                {item.isSaved ? (
                  <BookmarkCheck className="w-4 h-4 text-[var(--fb-blue)]" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>

              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold">
                {item.condition}
              </span>
            </div>

            {/* Info details */}
            <div
              className="p-3 space-y-1 cursor-pointer"
              onClick={() => setSelectedProduct(item)}
            >
              <p className="font-extrabold text-base text-[var(--text-primary)]">
                ${item.price.toLocaleString()}
              </p>
              <p className="text-xs font-semibold text-[var(--text-primary)] line-clamp-1 group-hover:underline">
                {item.title}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{item.location}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title="Item details"
          maxWidth="2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="h-64 md:h-full bg-zinc-900 overflow-hidden">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)] leading-snug">
                    {selectedProduct.title}
                  </h2>
                  <p className="text-2xl font-black text-[var(--fb-blue)] mt-1">
                    ${selectedProduct.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Listed in {selectedProduct.location} • {selectedProduct.category}
                  </p>
                </div>

                <div className="p-3 bg-[var(--bg-main)] rounded-xl text-xs space-y-1.5">
                  <p className="font-bold text-[var(--text-primary)]">Condition: {selectedProduct.condition}</p>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Seller info card */}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-subtle)]">
                  <Avatar
                    src={selectedProduct.seller.avatar}
                    alt={selectedProduct.seller.name}
                    size="md"
                    isOnline={selectedProduct.seller.isOnline}
                  />
                  <div>
                    <p className="text-xs font-bold">{selectedProduct.seller.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      Verified seller
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleContactSeller(selectedProduct)}
                  className="w-full py-2.5 rounded-xl bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message Seller
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      toggleSaveItem(selectedProduct.id);
                      showToast(
                        selectedProduct.isSaved ? 'Item unsaved' : 'Item saved to your list',
                        'success'
                      );
                    }}
                    className="flex-1 py-2 rounded-xl bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {selectedProduct.isSaved ? (
                      <>
                        <BookmarkCheck className="w-4 h-4 text-[var(--fb-blue)]" /> Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" /> Save
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      showToast('Item link copied to clipboard!', 'success');
                    }}
                    className="flex-1 py-2 rounded-xl bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
