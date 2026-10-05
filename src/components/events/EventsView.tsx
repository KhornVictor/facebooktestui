'use client';

import React, { useState } from 'react';
import { useEventStore } from '@/stores/event-store';
import { useUIStore } from '@/stores/ui-store';
import { EventItem } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import {
  Calendar,
  MapPin,
  Clock,
  Check,
  Star,
  Share2,
  Search,
  Users,
} from 'lucide-react';

export function EventsView() {
  const { events, filter, setFilter, toggleStatus } = useEventStore();
  const { showToast } = useUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const filteredEvents = events.filter((ev) => {
    if (filter === 'going' && ev.userStatus !== 'going') return false;
    if (filter === 'interested' && ev.userStatus !== 'interested') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ev.title.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Events
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Discover conferences, meetups, and adventures happening around you
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center bg-[var(--bg-input)] rounded-full px-3 py-1.5 w-60">
            <Search className="w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-[var(--text-primary)] focus:outline-hidden ml-2 w-full"
            />
          </div>

          {/* Filters */}
          <div className="flex bg-[var(--bg-input)] rounded-lg p-1 text-xs font-semibold">
            {(['all', 'going', 'interested'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-md capitalize transition-colors ${
                  filter === tab
                    ? 'bg-[var(--bg-surface)] text-[var(--fb-blue)] shadow-xs'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="group bg-[var(--bg-surface)] rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Event Cover Photo */}
              <div
                className="relative h-44 bg-zinc-800 cursor-pointer overflow-hidden"
                onClick={() => setSelectedEvent(event)}
              >
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold">
                  {event.category}
                </span>
              </div>

              {/* Event Content */}
              <div className="p-4 space-y-2">
                <p className="text-xs font-bold text-rose-500 uppercase tracking-wide">
                  {event.date}
                </p>

                <h3
                  className="font-bold text-base text-[var(--text-primary)] hover:underline cursor-pointer line-clamp-1"
                  onClick={() => setSelectedEvent(event)}
                >
                  {event.title}
                </h3>

                <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </p>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {event.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] pt-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>
                    {event.goingCount.toLocaleString()} going •{' '}
                    {event.interestedCount.toLocaleString()} interested
                  </span>
                </div>
              </div>
            </div>

            {/* Event Response Buttons */}
            <div className="p-4 pt-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  toggleStatus(event.id, 'going');
                  showToast(
                    event.userStatus === 'going'
                      ? 'Removed status'
                      : "You're marked as Going! 🎟️",
                    'success'
                  );
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  event.userStatus === 'going'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-[var(--bg-hover)] text-[var(--text-primary)] hover:bg-[var(--bg-active)]'
                }`}
              >
                <Check className="w-4 h-4" />
                Going
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleStatus(event.id, 'interested');
                  showToast(
                    event.userStatus === 'interested'
                      ? 'Removed status'
                      : "You're marked as Interested! ⭐",
                    'info'
                  );
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  event.userStatus === 'interested'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-[var(--bg-hover)] text-[var(--text-primary)] hover:bg-[var(--bg-active)]'
                }`}
              >
                <Star className="w-4 h-4" />
                Interested
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title="Event Details"
          maxWidth="xl"
        >
          <div className="space-y-4">
            <div className="h-56 w-full overflow-hidden bg-zinc-900">
              <img
                src={selectedEvent.coverImage}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 pt-0 space-y-4">
              <div>
                <p className="text-xs font-bold text-rose-500 uppercase">
                  {selectedEvent.date} • {selectedEvent.time}
                </p>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mt-1">
                  {selectedEvent.title}
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  {selectedEvent.location}
                </p>
              </div>

              <div className="p-3 bg-[var(--bg-main)] rounded-xl space-y-2 text-xs">
                <p className="font-bold text-[var(--text-primary)]">About this event</p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Host info */}
              <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-subtle)]">
                <Avatar src={selectedEvent.host.avatar} alt={selectedEvent.host.name} size="md" />
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Event Hosted by</p>
                  <p className="text-xs font-bold text-[var(--text-primary)]">
                    {selectedEvent.host.name}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleStatus(selectedEvent.id, 'going');
                    showToast("You're marked as Going! 🎟️", 'success');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedEvent.userStatus === 'going'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[var(--fb-blue)] hover:bg-[var(--fb-blue-hover)] text-white'
                  }`}
                >
                  {selectedEvent.userStatus === 'going' ? '✓ You are Going' : 'Attend Event'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('Event link copied to clipboard!', 'success');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[var(--bg-hover)] text-xs font-semibold flex items-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
