'use client';

import React, { useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { RightSidebar } from './RightSidebar';
import { MobileNavbar } from './MobileNavbar';
import { CreatePostModal } from '@/components/feed/CreatePostModal';
import { StoryViewerModal } from '@/components/stories/StoryViewerModal';
import { ShareModal } from '@/components/posts/ShareModal';
import { ImagePreviewModal } from '@/components/ui/ImagePreviewModal';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { FloatingQuickChat } from '@/components/messenger/FloatingQuickChat';
import { LiveStreamModal } from '@/components/live/LiveStreamModal';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter, usePathname } from 'next/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showRightSidebar?: boolean;
}

export function MainLayout({
  children,
  showSidebar = true,
  showRightSidebar = true,
}: MainLayoutProps) {
  const { theme } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Apply theme class to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) root.classList.add('dark');
        else root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Auth redirect check
  useEffect(() => {
    if (!isAuthenticated && pathname !== '/login' && pathname !== '/register') {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router]);

  // If on login or register, do not show top header or sidebars
  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
        {children}
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)]">
      {/* Top Header */}
      <Header />

      {/* Main 3-Column Container */}
      <div className="flex-1 flex justify-between w-full max-w-[1920px] mx-auto pb-16 md:pb-0">
        {/* Left Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Center Main Content */}
        <main className="flex-1 flex justify-center w-full min-w-0">
          {children}
        </main>

        {/* Right Sidebar */}
        {showRightSidebar && <RightSidebar />}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavbar />

      {/* Global Modals & Notifications */}
      <CreatePostModal />
      <StoryViewerModal />
      <ShareModal />
      <ImagePreviewModal />
      <ToastContainer />
      <FloatingQuickChat />
      <LiveStreamModal />
    </div>
  );
}
