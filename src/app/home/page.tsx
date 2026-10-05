'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StoryCarousel } from '@/components/stories/StoryCarousel';
import { CreatePostCard } from '@/components/feed/CreatePostCard';
import { LiveFeedBanner } from '@/components/feed/LiveFeedBanner';
import { PostCard } from '@/components/posts/PostCard';
import { useFeedStore } from '@/stores/feed-store';

export default function HomePage() {
  const { posts } = useFeedStore();

  return (
    <MainLayout showSidebar={true} showRightSidebar={true}>
      <div className="w-full max-w-[640px] px-2 sm:px-4 py-4 space-y-4">
        {/* Stories Horizontal Carousel */}
        <StoryCarousel />

        {/* Create Post Composer Trigger */}
        <CreatePostCard />

        {/* Live Feed Alert Banner (appears when mock incoming posts arrive) */}
        <LiveFeedBanner />

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
