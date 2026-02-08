'use client';

import { Navbar } from '@/components/shared';
import { ProtectedRoute } from '@/components/auth';
import { PadelForm, PadelMatchCard, PadelStats } from '@/components/sports';
import { usePadel } from '@/hooks';
import { Trophy, Calendar, Plus, MessageSquare, Loader2 } from 'lucide-react';

export default function PadelPage() {
    const { matches, isLoading, error } = usePadel();

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-950">
                <Navbar />

                <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                                <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                                    Mis Partidos
                                </h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="text-sm font-black text-slate-500 uppercase tracking-widest leading-none">
                                    Pádel Pro
                                </p>
                                <div className="w-1 h-1 rounded-full bg-slate-700" />
                                <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                    <Trophy className="w-3 h-3" />
                                    Match History
                                </span>
                            </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                </span>
                                <span className="hidden sm:inline">Stats Sync</span>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
                            <p className="text-sm font-bold flex items-center gap-2">
                                Error: {error}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Stats & List */}
                        <div className="lg:col-span-2 space-y-8">
                            <PadelStats matches={matches} />

                            <section>
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-emerald-400" />
                                    Historial de Partidos
                                </h2>

                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                                        <p className="text-slate-500 font-medium">Cargando partidos...</p>
                                    </div>
                                ) : matches.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {matches.map((match) => (
                                            <PadelMatchCard key={match.id} match={match} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-12 text-center">
                                        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <MessageSquare className="w-8 h-8 text-slate-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2">Aún no hay partidos</h3>
                                        <p className="text-slate-400 max-w-xs mx-auto">
                                            Empieza a registrar tus victorias (y derrotas) usando el formulario.
                                        </p>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Right Column: Form */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <PadelForm />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
