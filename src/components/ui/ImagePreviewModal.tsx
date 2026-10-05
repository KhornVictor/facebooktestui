'use client';

import React from 'react';
import { useUIStore } from '@/stores/ui-store';
import { X } from 'lucide-react';

export function ImagePreviewModal() {
  const { mediaModalState, closeMediaModal } = useUIStore();

  if (!mediaModalState.isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 animate-pop-in select-none"
      onClick={closeMediaModal}
    >
      <button
        type="button"
        onClick={closeMediaModal}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
        title="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={mediaModalState.url}
          alt={mediaModalState.alt || 'Full preview'}
          className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-xl"
        />
        {mediaModalState.alt && (
          <p className="mt-2 text-center text-sm text-zinc-300">
            {mediaModalState.alt}
          </p>
        )}
      </div>
    </div>
  );
}
