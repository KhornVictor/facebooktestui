'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isOnline?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-2xl',
};

const onlineIndicatorSizes = {
  xs: 'w-1.5 h-1.5 bottom-0 right-0 border',
  sm: 'w-2.5 h-2.5 bottom-0 right-0 border-2',
  md: 'w-3 h-3 bottom-0 right-0 border-2',
  lg: 'w-3.5 h-3.5 bottom-0.5 right-0.5 border-2',
  xl: 'w-4 h-4 bottom-1 right-1 border-2',
  '2xl': 'w-5 h-5 bottom-1.5 right-1.5 border-3',
};

export function Avatar({
  src,
  alt = 'User avatar',
  size = 'md',
  isOnline,
  className,
  onClick,
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 rounded-full select-none cursor-pointer',
        sizeClasses[size],
        className
      )}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}

      {isOnline && (
        <span
          className={cn(
            'absolute rounded-full bg-[#31a24c] border-[var(--bg-surface)] ring-0 z-10',
            onlineIndicatorSizes[size]
          )}
          title="Online"
        />
      )}
    </div>
  );
}
