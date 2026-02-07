import { Gamepad2, Tv, Calendar, Info, Clock, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import type { SportEvent } from '@/types';
import { CardContainer } from '@/components/ui/CardContainer';

interface LoLCardProps {
    event: SportEvent;
}

export function LoLCard({ event }: LoLCardProps) {
    const metadata = event.metadata || {};
    const isLive = event.status === 'live';
    const isFinished = event.status === 'finished';

    // Metadata fields
    const twitchUrl = metadata.twitch_url;
    const enemyLogo = metadata.enemy_logo;
    const enemyName = metadata.enemy_name || 'Rival';
    const score = metadata.score || '0-0';
    const tournament = metadata.tournament || 'LoL';
    const stage = metadata.stage || 'Match';
    const format = metadata.game_info || 'Bo1';

    const koiLogo = "https://cdn-api.pandascore.co/images/team/image/126536/movistar_ko_ilogo_square.png";

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
            glowColor="purple"
            className="group/card"
        >
            {/* Top Bar: Tournament & Status */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 p-1.5 overflow-hidden">
                        <Gamepad2 className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] leading-none mb-1">
                            {tournament}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 uppercase leading-none">
                            {stage} • {format}
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
                    <div className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 uppercase text-[9px] font-bold text-purple-400">
                        Scheduled
                    </div>
                )}
            </div>

            {/* Matchup: KOI vs Enemy */}
            <div className="flex items-center justify-between gap-4 mb-8">
                {/* KOI */}
                <div className="flex-1 flex flex-col items-center gap-3">
                    <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 p-3 transition-transform duration-500 group-hover/card:scale-110">
                        <Image src={koiLogo} alt="KOI" fill className="object-contain p-3 drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]" />
                    </div>
                    <span className="text-[11px] font-black text-white uppercase text-center tracking-tight leading-tight">
                        Movistar KOI
                    </span>
                </div>

                {/* VS / Score */}
                <div className="flex flex-col items-center justify-center min-w-[80px]">
                    {isLive || isFinished ? (
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-4xl font-mono-figures font-black text-white tracking-tighter tabular-nums">{score}</span>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${isLive ? 'text-red-500 animate-pulse' : 'text-slate-600'}`}>
                                {isLive ? 'En Juego' : 'Final'}
                            </span>
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
                        {enemyLogo ? (
                            <Image src={enemyLogo} alt={enemyName} fill className="object-contain p-3" />
                        ) : (
                            <span className="text-xl font-black text-slate-700">VS</span>
                        )}
                    </div>
                    <span className="text-[11px] font-black text-white uppercase text-center tracking-tight leading-tight truncate max-w-[80px]">
                        {enemyName}
                    </span>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> Programado
                    </span>
                    <span className="text-[10px] font-black text-white uppercase">
                        {dateString}
                    </span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1 text-right">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-end gap-1">
                        Vía <Tv className="w-2.5 h-2.5 text-purple-500/50" />
                    </span>
                    <span className="text-[10px] font-black text-purple-400 uppercase truncate">
                        {event.channel}
                    </span>
                </div>
            </div>

            {/* Twitch Link or Info */}
            {twitchUrl ? (
                <a
                    href={twitchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-[#6441a5]/10 border border-[#6441a5]/20 text-[#a970ff] hover:bg-[#6441a5]/20 transition-all group/btn"
                >
                    <div className="flex items-center gap-2">
                        <Tv className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Ver en Twitch.tv</span>
                    </div>
                    <ExternalLink className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </a>
            ) : (
                <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                    <Info className="w-3 h-3 text-purple-500/70" />
                    <span className="text-[10px] font-black text-purple-400/70 uppercase">
                        Partida de Temporada Regular
                    </span>
                </div>
            )}
        </CardContainer>
    );
}
