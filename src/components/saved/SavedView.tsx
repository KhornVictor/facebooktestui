'use client';

import React, { useState } from 'react';
import { useFeedStore } from '@/stores/feed-store';
import { useMarketplaceStore } from '@/stores/marketplace-store';
import { useUIStore } from '@/stores/ui-store';
import { PostCard } from '@/components/posts/PostCard';
import { Bookmark, BookmarkCheck, ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';

export function SavedView() {
  const { posts, toggleSavePost } = useFeedStore();
  const { items, toggleSaveItem } = useMarketplaceStore();
  const { showToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'marketplace'>('all');

  const savedPosts = posts.filter((p) => p.isSaved);
  const savedProducts = items.filter((i) => i.isSaved);

  const totalSaved = savedPosts.length + savedProducts.length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Saved Items
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {totalSaved} items bookmarked for later
          </p>
        </div>

        <div className="flex bg-[var(--bg-input)] rounded-lg p-1 text-xs font-semibold">
          {[
            { id: 'all', label: `All (${totalSaved})` },
            { id: 'posts', label: `Posts (${savedPosts.length})` },
            { id: 'marketplace', label: `Marketplace (${savedProducts.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-[var(--bg-surface)] text-[var(--fb-blue)] shadow-xs'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {totalSaved === 0 ? (
        <div className="p-16 text-center text-[var(--text-muted)] space-y-2 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)]">
          <Bookmark className="w-12 h-12 mx-auto opacity-30" />
          <h3 className="font-bold text-lg text-[var(--text-primary)]">
            No saved items yet
          </h3>
          <p className="text-xs">
            Click the save option on any post or marketplace item to store it here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Saved Marketplace Items */}
          {(activeTab === 'all' || activeTab === 'marketplace') &&
            savedProducts.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--text-muted)]">
                  Marketplace Items ({savedProducts.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedProducts.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] shadow-xs"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-[var(--text-primary)] truncate">
                          {item.title}
                        </p>
                        <p className="text-xs font-black text-[var(--fb-blue)]">
                          ${item.price.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] mt-1">
                          {item.location}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          toggleSaveItem(item.id);
                          showToast('Removed from saved items', 'info');
                        }}
                        className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-rose-500"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Saved Posts */}
          {(activeTab === 'all' || activeTab === 'posts') &&
            savedPosts.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--text-muted)]">
                  Saved Posts ({savedPosts.length})
                </h3>
                <div className="space-y-4">
                  {savedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
