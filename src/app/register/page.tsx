'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const { showToast } = useUIStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email) {
      showToast('Please fill in your name and email', 'error');
      return;
    }
    const fullName = `${firstName} ${lastName}`.trim();
    register(fullName, email);
    showToast(`Welcome to Facebook, ${firstName}!`, 'success');
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-4xl font-black text-[var(--fb-blue)]">facebook</h1>
        </div>

        <div className="bg-[var(--bg-surface)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--border-subtle)] space-y-4">
          <div className="border-b border-[var(--border-subtle)] pb-3">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Create a new account
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              It&apos;s quick and easy.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] text-xs sm:text-sm border border-[var(--border-subtle)] focus:outline-hidden focus:ring-1 focus:ring-[var(--fb-blue)] text-[var(--text-primary)]"
              />
              <input
                type="text"
                placeholder="Surname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] text-xs sm:text-sm border border-[var(--border-subtle)] focus:outline-hidden focus:ring-1 focus:ring-[var(--fb-blue)] text-[var(--text-primary)]"
              />
            </div>

            <input
              type="email"
              placeholder="Mobile number or email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] text-xs sm:text-sm border border-[var(--border-subtle)] focus:outline-hidden focus:ring-1 focus:ring-[var(--fb-blue)] text-[var(--text-primary)]"
            />

            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 rounded-lg bg-[var(--bg-input)] text-xs sm:text-sm border border-[var(--border-subtle)] focus:outline-hidden focus:ring-1 focus:ring-[var(--fb-blue)] text-[var(--text-primary)]"
            />

            {/* Birthday mock fields */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                Date of birth
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select className="p-2 rounded-lg bg-[var(--bg-input)] text-xs border border-[var(--border-subtle)]">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select className="p-2 rounded-lg bg-[var(--bg-input)] text-xs border border-[var(--border-subtle)]">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <select className="p-2 rounded-lg bg-[var(--bg-input)] text-xs border border-[var(--border-subtle)]">
                  {Array.from({ length: 50 }, (_, i) => 2026 - i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gender mock options */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                <label className="flex items-center justify-between p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] cursor-pointer">
                  <span>Female</span>
                  <input type="radio" name="gender" defaultChecked />
                </label>
                <label className="flex items-center justify-between p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] cursor-pointer">
                  <span>Male</span>
                  <input type="radio" name="gender" />
                </label>
                <label className="flex items-center justify-between p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] cursor-pointer">
                  <span>Custom</span>
                  <input type="radio" name="gender" />
                </label>
              </div>
            </div>

            <p className="text-[10px] text-[var(--text-muted)] leading-tight pt-1">
              By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy.
            </p>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#42b72a] hover:bg-[#36a420] text-white font-bold text-sm transition-colors shadow-md mt-2"
            >
              Sign Up
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[var(--border-subtle)]">
            <Link
              href="/login"
              className="text-xs font-semibold text-[var(--fb-blue)] hover:underline"
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
