'use client';

import { Navbar, SkeletonCard, DashboardSkeleton } from '@/components/shared';
import { ProtectedRoute } from '@/components/auth';
import { F1Card, FootballCard, LoLCard, TennisCard } from '@/components/sports';
import { useEvents, filterEventsByType } from '@/hooks';
import { useAuth } from '@/contexts';
import {
  RefreshCw,
  Loader2,
  Clock,
  Zap,
  Wifi,
  Calendar,
  Flag,
  Trophy,
  Gamepad2,
  Volleyball,
  Info
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const FILTER_CATEGORIES = [
  { id: 'all', label: 'Todos', icon: Zap, color: 'emerald' },
  { id: 'f1', label: 'F1', icon: Flag, color: 'emerald' },
  { id: 'football', label: 'Barça', icon: Trophy, color: 'blue' },
  { id: 'lol', label: 'KOI', icon: Gamepad2, color: 'purple' },
  { id: 'tennis', label: 'Tennis', icon: Volleyball, color: 'lime' },
];

import { SportEvent } from '@/types';

interface DashboardClientProps {
  initialEvents: SportEvent[];
}

export default function DashboardClient({ initialEvents }: DashboardClientProps) {
  const { profile, user, isLoading: authLoading } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');

  // States to control visibility for each section
  const [showAllF1, setShowAllF1] = useState(false);
  const [showAllFootball, setShowAllFootball] = useState(false);
  const [showAllLoL, setShowAllLoL] = useState(false);
  const [showAllTennis, setShowAllTennis] = useState(false);

  const { events, isLoading, error, lastUpdated, refetch } = useEvents({
    preferences: profile?.preferences || { f1: true, football: true, lol: true, tennis: true },
    initialData: initialEvents
  });

  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

  const isThisWeek = (eventTime: string) => new Date(eventTime) <= oneWeekFromNow;

  // Raw events by type
  const rawF1 = filterEventsByType(events, 'f1');
  const rawFootball = filterEventsByType(events, 'football');
  const rawLoL = filterEventsByType(events, 'lol');
  const rawTennis = filterEventsByType(events, 'tennis');

  // Filtered events for the UI
  const getF1Events = () => {
    if (rawF1.length === 0) return [];

    // 1. Find the earliest upcoming or live event
    const now = new Date();
    const upcomingOrLive = [...rawF1]
      .filter(e => e.status === 'live' || new Date(e.time) >= now)
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    if (upcomingOrLive.length === 0) return [];

    // 2. Extract the location/GP name from the title (e.g., "Bahrain" from "Bahrain - Practice")
    const nextGP = upcomingOrLive[0].title.split(' - ')[0];

    // 3. Return all events that belong to that same Grand Prix location
    return rawF1.filter(e => e.title.startsWith(nextGP));
  };

  const f1Events = showAllF1 ? rawF1 : getF1Events();
  const footballEvents = showAllFootball ? rawFootball : rawFootball.filter(e => e.status === 'live' || isThisWeek(e.time));
  const lolEvents = showAllLoL ? rawLoL : rawLoL.filter(e => e.status === 'live' || isThisWeek(e.time));
  const tennisEvents = showAllTennis ? rawTennis : rawTennis.filter(e => e.status === 'live' || isThisWeek(e.time));

  // Toggles check
  const hasHiddenF1 = rawF1.length > f1Events.length;
  const hasHiddenFootball = rawFootball.length > footballEvents.length;
  const hasHiddenLoL = rawLoL.length > lolEvents.length;
  const hasHiddenTennis = rawTennis.length > tennisEvents.length;

  // Format last updated time
  const formattedLastUpdated = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
    : null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950">
        <Navbar />

        {/* Main content */}
        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                  Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest leading-none">
                  Centro de Control
                </p>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  Live Schedule
                </span>
              </div>
            </div>

            {/* Refresh & Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="hidden sm:inline">Live Sync</span>
              </div>

              {formattedLastUpdated && (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formattedLastUpdated}</span>
                </div>
              )}
              <button
                onClick={refetch}
                disabled={isLoading}
                className="group flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 text-slate-500 hover:text-white hover:bg-white/[0.05] transition-all disabled:opacity-50"
                title="Actualizar datos"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                ) : (
                  <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                )}
              </button>
            </div>
          </div>

          {/* Filter Bar - Premium Glass Pill */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar py-2">
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
              {FILTER_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeFilter === cat.id;

                const activeColors: Record<string, string> = {
                  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
                  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]',
                  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]',
                  lime: 'bg-lime-500/10 text-lime-400 border-lime-500/20 shadow-[0_0_15px_rgba(132,204,22,0.15)]',
                };

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFilter(cat.id)}
                    className={cn(
                      "flex items-center gap-2.5 px-5 py-2.5 rounded-[14px] transition-all duration-300 whitespace-nowrap border",
                      isActive
                        ? `${activeColors[cat.color]} border-opacity-100 scale-105 z-10 font-black text-white`
                        : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/[0.02]"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "" : "opacity-50")} />
                    <span className="text-[11px] font-black uppercase tracking-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
              <p className="text-sm font-bold flex items-center gap-2">
                <Info className="w-4 h-4" /> Error al sincronizar: {error}
              </p>
            </div>
          )}

          {/* Unified Bento Grid */}
          {isLoading && events.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <SkeletonCard className="lg:col-span-2 lg:row-span-2" />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard className="lg:col-span-2" />
              <SkeletonCard />
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
              {/* Prioritize Live Events and then sort by time */}
              {[...events]
                .filter(e => activeFilter === 'all' || e.type === activeFilter)
                .sort((a, b) => {
                  if (a.status === 'live' && b.status !== 'live') return -1;
                  if (a.status !== 'live' && b.status === 'live') return 1;
                  return new Date(a.time).getTime() - new Date(b.time).getTime();
                })
                .map((event) => {
                  // Bento Logic: 
                  // F1 and Football are "heavy" cards (2 columns)
                  // LoL and Tennis are "light" cards (1 column)
                  const isHeavy = event.type === 'f1' || event.type === 'football';
                  const gridSpan = isHeavy ? 'md:col-span-2 lg:col-span-2' : 'md:col-span-1 lg:col-span-1';

                  return (
                    <div key={event.id} className={gridSpan}>
                      {event.type === 'f1' && <F1Card event={event} />}
                      {event.type === 'football' && <FootballCard event={event} />}
                      {event.type === 'lol' && <LoLCard event={event} />}
                      {event.type === 'tennis' && <TennisCard event={event} />}
                    </div>
                  );
                })}
            </div>
          ) : (
            /* Empty state specifically for when everything is loaded but there's absolutely NO content */
            <div className="flex flex-col items-center justify-center py-24 text-center glass-panel-pro rounded-[2rem] border-white/5 bg-white/[0.01]">
              <div className="w-24 h-24 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6">
                <Zap className="w-10 h-10 text-slate-700" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                No hay eventos detectados
              </h3>
              <p className="text-slate-500 max-w-sm text-sm leading-relaxed px-6">
                El sistema está monitorizando fuentes en tiempo real. Los eventos aparecerán automáticamente cuando sean detectados por la IA.
              </p>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
