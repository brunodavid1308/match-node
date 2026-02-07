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
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Trophy className="w-8 h-8 text-emerald-400" />
                            Mis Partidos de Pádel
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Registra tus resultados y sigue tu progreso en la pista.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                            <p className="text-sm">Error: {error}</p>
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
