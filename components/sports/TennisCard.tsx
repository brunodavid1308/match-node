import { Timer, Tv, Calendar, Trophy, Zap, Info, Clock } from 'lucide-react';
import type { SportEvent } from '@/types';
import { CardContainer } from '@/components/ui/CardContainer';

interface TennisCardProps {
    event: SportEvent;
}

export function TennisCard({ event }: TennisCardProps) {
    const metadata = event.metadata || {};
    const isLive = event.status === 'live';
    const isFinished = event.status === 'finished';

    const tournament = metadata.tournament || 'ATP Tour';
    const opponent = metadata.opponent_name || 'Por definir';
    const surface = metadata.surface || 'Pista Principal';
    const score = metadata.score || '0-0';
    const currentGame = metadata.current_game;

    // Opponent Initials
    const opponentInitial = opponent !== 'Por definir'
        ? opponent.split(/[\s.]+/).filter(Boolean).map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    // Format time
    const eventDate = new Date(event.time);
    const timeString = eventDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    const dateString = eventDate.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    });

    return (
        <CardContainer
            isLive={isLive}
            glowColor="lime"
            className="group/card"
        >
            {/* Top Bar: Category & Status */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-lime-500/10 border border-lime-500/20 p-1.5 overflow-hidden">
                        <Trophy className="w-4 h-4 text-lime-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-lime-400 uppercase tracking-[0.2em] leading-none mb-1">
                            Tennis ATP
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 uppercase leading-none truncate max-w-[120px]">
                            {tournament}
                        </span>
                    </div>
                </div>

                {isLive ? (
                    <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                        <span className="flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                        </span>
                        <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">Live</span>
                    </div>
                ) : isFinished ? (
                    <div className="px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/10 uppercase text-[9px] font-bold text-slate-500">
                        Finalizado
                    </div>
                ) : (
                    <div className="px-2 py-0.5 rounded-full bg-lime-500/10 border border-lime-500/20 uppercase text-[9px] font-bold text-lime-400">
                        Próximamente
                    </div>
                )}
            </div>

            {/* Players Area */}
            <div className="flex items-center justify-between gap-4 mb-8">
                {/* Carlos Alcaraz */}
                <div className="flex-1 flex flex-col items-center gap-3">
                    <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-lime-600 to-emerald-500 p-0.5 shadow-lg group-hover/card:scale-110 transition-transform duration-500">
                        <div className="w-full h-full rounded-[14px] bg-slate-900/40 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-xl font-black text-white">CA</span>
                        </div>
                        <div className="absolute -bottom-1.5 -right-1.5 bg-amber-500 rounded-full p-1.5 border-2 border-slate-900 shadow-xl">
                            <Zap className="w-2.5 h-2.5 text-white" />
                        </div>
                    </div>
                    <span className="text-[11px] font-black text-white uppercase text-center tracking-tight leading-tight">
                        C. Alcaraz
                    </span>
                </div>

                {/* Score / VS */}
                <div className="flex flex-col items-center justify-center min-w-[70px]">
                    {isLive || isFinished ? (
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-4xl font-mono-figures font-black text-white tracking-tighter tabular-nums">{score}</span>
                            <span className="text-[9px] font-black text-lime-400 uppercase tracking-widest">Sets</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">vs</span>
                            <span className="text-2xl font-mono-figures font-black text-white tracking-tighter">
                                {timeString}
                            </span>
                        </div>
                    )}
                </div>

                {/* Opponent */}
                <div className="flex-1 flex flex-col items-center gap-3">
                    <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 p-3 transition-transform duration-500 group-hover/card:scale-110">
                        <div className="w-full h-full rounded-xl bg-slate-800/50 flex items-center justify-center">
                            <span className="text-xl font-black text-slate-600">{opponentInitial}</span>
                        </div>
                    </div>
                    <span className="text-[11px] font-black text-white uppercase text-center tracking-tight leading-tight truncate max-w-[80px]">
                        {opponent}
                    </span>
                </div>
            </div>

            {/* Match Context Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {isFinished ? 'Finalizado' : 'Programado'}
                    </span>
                    <span className="text-[10px] font-black text-white uppercase">
                        {dateString}
                    </span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1 text-right">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-end gap-1">
                        Canal <Tv className="w-2.5 h-2.5 text-lime-500/50" />
                    </span>
                    <span className="text-[10px] font-black text-lime-400 uppercase truncate">
                        {event.channel}
                    </span>
                </div>
            </div>

            {/* Surface/Live Game */}
            {isLive && currentGame ? (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-500 uppercase leading-none mb-1">Juego Actual</span>
                            <span className="text-xl font-mono-figures font-black text-lime-400 leading-none tabular-nums">
                                {currentGame}
                            </span>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <span className="text-[9px] font-bold text-slate-500 uppercase leading-none mb-1">Superficie</span>
                            <span className="text-[10px] font-black text-white uppercase">{surface}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-2 flex items-center gap-2 py-2 px-3 rounded-xl bg-lime-500/5 border border-lime-500/10">
                    <Info className="w-3 h-3 text-lime-500/70" />
                    <span className="text-[9px] font-black text-lime-600 uppercase">
                        Superficie: {surface}
                    </span>
                </div>
            )}
        </CardContainer>
    );
}
