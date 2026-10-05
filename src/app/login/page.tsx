'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { showToast } = useUIStore();

  const [email, setEmail] = useState('victor@example.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter an email address', 'error');
      return;
    }
    login(email);
    showToast('Logged in successfully! Welcome back.', 'success');
    router.push('/home');
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    login(demoEmail);
    showToast(`Logged in as ${demoEmail}`, 'success');
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none">
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-6xl mx-auto w-full gap-8 lg:gap-16 pt-8 pb-12">
        {/* Brand Left Column */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black text-[var(--fb-blue)] tracking-tight">
            facebook
          </h1>
          <p className="text-xl sm:text-2xl text-[var(--text-primary)] font-medium leading-snug max-w-lg">
            Connect with friends and the world around you on Facebook.
          </p>
          <div className="pt-4 text-xs text-[var(--text-muted)] space-y-1">
            <p className="font-semibold text-[var(--text-secondary)]">Demo Accounts (Click to test):</p>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => handleQuickLogin('victor@example.com')}
                className="px-2.5 py-1 rounded-md bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] font-medium text-[var(--text-primary)] transition-colors"
              >
                Victor Khorn (You)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('alice@example.com')}
                className="px-2.5 py-1 rounded-md bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] font-medium text-[var(--text-primary)] transition-colors"
              >
                Alice Johnson
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('bob@example.com')}
                className="px-2.5 py-1 rounded-md bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] font-medium text-[var(--text-primary)] transition-colors"
              >
                Bob Martinez
              </button>
            </div>
          </div>
        </div>

        {/* Login Box Right Column */}
        <div className="w-full max-w-md">
          <div className="bg-[var(--bg-surface)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--border-subtle)] space-y-4">
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Email address or phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[var(--bg-input)] text-sm border border-[var(--border-subtle)] focus:outline-hidden focus:ring-2 focus:ring-[var(--fb-blue)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[var(--bg-input)] text-sm border border-[var(--border-subtle)] focus:outline-hidden focus:ring-2 focus:ring-[var(--fb-blue)] text-[var(--text-primary)]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] text-white font-bold text-base transition-colors shadow-md cursor-pointer"
              >
                Log In
              </button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() =>
                  showToast(
                    'Password reset simulated. Use any password to log in.',
                    'info'
                  )
                }
                className="text-xs text-[var(--fb-blue)] hover:underline font-semibold"
              >
                Forgotten password?
              </button>
            </div>

            <div className="h-[1px] bg-[var(--border-subtle)]" />

            <div className="text-center pt-2">
              <Link
                href="/register"
                className="inline-block px-5 py-3 rounded-xl bg-[#42b72a] hover:bg-[#36a420] text-white font-bold text-sm transition-colors shadow-md"
              >
                Create new account
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-[var(--text-muted)] mt-6">
            <span className="font-bold text-[var(--text-primary)]">Create a Page</span> for a celebrity, brand or business.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-[11px] text-[var(--text-muted)] space-y-2 border-t border-[var(--border-subtle)] pt-4">
        <p className="flex flex-wrap gap-x-3 gap-y-1">
          <span>English (US)</span>
          <span>Español</span>
          <span>Français (France)</span>
          <span>中文(简体)</span>
          <span>العربية</span>
          <span>Português (Brasil)</span>
          <span>Italiano</span>
          <span>Deutsch</span>
        </p>
        <p>Meta © 2026 • Frontend Simulation Only</p>
      </footer>
    </div>
  );
}
