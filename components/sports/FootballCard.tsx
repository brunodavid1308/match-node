import { Trophy, Tv, Calendar, Info, Clock } from 'lucide-react';
import Image from 'next/image';
import type { SportEvent } from '@/types';
import { CardContainer } from '@/components/ui/CardContainer';

interface FootballCardProps {
    event: SportEvent;
}

export function FootballCard({ event }: FootballCardProps) {
    const isLive = event.status === 'live';
    const isFinished = event.status === 'finished';
    const isPast = isLive || isFinished;
    const metadata = event.metadata || {};
    const competition = metadata.competition || 'La Liga';
    const competitionLogo = metadata.competition_logo;
    const homeLogo = metadata.home_logo;
    const awayLogo = metadata.away_logo;

    // Scores with fallback
    const score = metadata.score || '0-0';
    const [homeScore, awayScore] = score.split('-');

    // Split title into teams
    const teams = event.title.split(' vs ');
    const homeTeamName = teams[0] || 'Local';
    const awayTeamName = teams[1] || 'Visitante';

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
            glowColor="blue"
            className="group/card"
        >
            {/* Top Bar: Competition & Status */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 p-1.5 overflow-hidden">
                        {competitionLogo ? (
                            <Image
                                src={competitionLogo}
                                alt={competition}
                                fill
                                className="object-contain p-1"
                            />
                        ) : (
                            <Trophy className="w-4 h-4 text-slate-500" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] leading-none mb-1">
                            {competition}
                        </span>
                        <span className="text-xs font-medium text-slate-400 uppercase leading-none">
                            Matchday {metadata.matchday || 'Live'}
                        </span>
                    </div>
                </div>

                {isLive && (
                    <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                        <span className="flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                        </span>
                        <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">Live</span>
                    </div>
                )}
            </div>

            {/* Scoreboard Area */}
            <div className="flex items-center justify-between gap-4 mb-8">
                {/* Home Team */}
                <div className="flex-1 flex flex-col items-center gap-3">
                    <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 p-3 transition-transform duration-500 group-hover/card:scale-110">
                        {homeLogo ? (
                            <Image src={homeLogo} alt={homeTeamName} fill className="object-contain p-3" />
                        ) : (
                            <span className="text-xl font-black text-slate-700">{homeTeamName[0]}</span>
                        )}
                    </div>
                    <span className="text-[11px] font-black text-white uppercase text-center tracking-tight leading-tight max-w-[80px]">
                        {homeTeamName}
                    </span>
                </div>

                {/* Score / Time */}
                <div className="flex flex-col items-center justify-center min-w-[80px]">
                    {isPast ? (
                        <div className="flex items-center gap-1">
                            <span className="text-4xl font-mono-figures font-black text-white tracking-tighter">{homeScore}</span>
                            <span className="text-2xl font-black text-slate-700">:</span>
                            <span className="text-4xl font-mono-figures font-black text-white tracking-tighter">{awayScore}</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">VS</span>
                            <span className="text-2xl font-mono-figures font-black text-white tracking-tighter">
                                {metadata.is_time_confirmed === false || timeString === '00:00' ? 'TBD' : timeString}
                            </span>
                        </div>
                    )}
                </div>

                {/* Away Team */}
                <div className="flex-1 flex flex-col items-center gap-3">
                    <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 p-3 transition-transform duration-500 group-hover/card:scale-110">
                        {awayLogo ? (
                            <Image src={awayLogo} alt={awayTeamName} fill className="object-contain p-3" />
                        ) : (
                            <span className="text-xl font-black text-slate-700">{awayTeamName[0]}</span>
                        )}
                    </div>
                    <span className="text-[11px] font-black text-white uppercase text-center tracking-tight leading-tight max-w-[80px]">
                        {awayTeamName}
                    </span>
                </div>
            </div>

            {/* Match Stats & Info */}
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {isFinished ? 'Finalizado' : 'Programado'}
                    </span>
                    <span className="text-[11px] font-black text-white uppercase">
                        {dateString}
                    </span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1 text-right">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-end gap-1">
                        Canal <Tv className="w-2.5 h-2.5 text-blue-500/50" />
                    </span>
                    <span className="text-[11px] font-black text-blue-400 uppercase truncate">
                        {event.channel}
                    </span>
                </div>
            </div>

            {/* Match Progress (Live or Finished) */}
            {isPast ? (
                <div className="mt-6 pt-5 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${isFinished ? 'text-slate-500' : 'text-blue-400'}`}>
                            {isFinished ? 'Final' : (metadata.period || 'En juego')}
                        </span>
                        <div className="flex items-center gap-1.5">
                            {!isFinished && (
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                                </span>
                            )}
                            <span className={`text-[11px] font-mono-figures font-black italic ${isFinished ? 'text-slate-500' : 'text-white'}`}>
                                {isFinished ? 'FT' : (metadata.minute || "0'")}
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${
                                isFinished 
                                ? 'bg-slate-700' 
                                : 'bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                            }`}
                            style={{ width: isFinished ? '100%' : (metadata.progress || '0%') }}
                        />
                    </div>
                </div>
            ) : (
                <div className="mt-4 flex items-center gap-2 py-2 px-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <Info className="w-3 h-3 text-blue-500/70" />
                    <span className="text-[10px] font-bold text-blue-500/70 uppercase">
                        Localización: {metadata.venue || 'Estadi Olímpic Lluís Companys'}
                    </span>
                </div>
            )}
        </CardContainer>
    );
}
