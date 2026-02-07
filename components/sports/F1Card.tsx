import { Flame, MapPin, Timer, Tv, Flag, Info } from 'lucide-react';
import Image from 'next/image';
import type { SportEvent } from '@/types';
import { CardContainer } from '@/components/ui/CardContainer';

interface F1CardProps {
    event: SportEvent;
}

export function F1Card({ event }: F1CardProps) {
    const metadata = event.metadata || {};
    const isAlonsoMagic = metadata.is_alonso_magic;
    const isLive = event.status === 'live';
    const countryFlag = metadata.country_flag;
    const session = metadata.session_type || 'Race';
    const gpName = event.title.split(' - ')[0] || event.title;

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
            glowColor="emerald"
            className={isAlonsoMagic ? 'ring-2 ring-emerald-500/20' : ''}
        >
            {/* Top Bar: Event Category & Status */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-6 overflow-hidden rounded-md border border-white/10 flex items-center justify-center bg-slate-900/50">
                        {countryFlag ? (
                            <Image
                                src={countryFlag}
                                alt="Country"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <Flag className="w-3 h-3 text-slate-500" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] leading-none mb-1">
                            F1 Professional
                        </span>
                        <span className="text-xs font-medium text-slate-400 uppercase leading-none">
                            {session}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isAlonsoMagic && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                            <Flame className="w-3 h-3 text-amber-500" />
                            <span className="text-[9px] font-black text-amber-500 uppercase tracking-tighter italic">Alonso Magic</span>
                        </div>
                    )}
                    {isLive && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                            <span className="flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                            </span>
                            <span className="text-[9px] font-bold text-red-500 uppercase">Live</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content: Circuit Info */}
            <div className="mb-8">
                <h3 className="text-2xl font-black text-white leading-[1.1] mb-2 group-hover:text-emerald-400 transition-colors">
                    {gpName}
                </h3>
                <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3 h-3 text-emerald-500/70" />
                    <span className="text-[10px] font-bold uppercase tracking-wide">
                        {metadata.circuit_name || 'Circuit de la Comunitat Valenciana'}
                    </span>
                </div>
            </div>

            {/* Professional Data Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <Timer className="w-2.5 h-2.5" /> Programado
                    </span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-mono-figures font-black text-white tracking-tight">
                            {timeString}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                            GMT+1
                        </span>
                    </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <Tv className="w-2.5 h-2.5 text-emerald-500/50" /> Canal
                    </span>
                    <span className="text-sm font-black text-white uppercase truncate">
                        {event.channel}
                    </span>
                </div>
            </div>

            {/* Live Progress or Date section */}
            {isLive ? (
                <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-500 uppercase leading-none mb-1">Position</span>
                                <span className="text-lg font-mono-figures font-black text-emerald-400 leading-none">
                                    {metadata.position || 'P1'}
                                </span>
                            </div>
                            <div className="w-px h-6 bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-500 uppercase leading-none mb-1">Lap</span>
                                <span className="text-lg font-mono-figures font-black text-white leading-none">
                                    {metadata.lap || '1/53'}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Race Progress</span>
                            <span className="text-sm font-mono-figures font-black text-white">{metadata.progress || '0%'}</span>
                        </div>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 transition-all duration-1000 animate-pulse-slow"
                            style={{ width: metadata.progress || '0%' }}
                        />
                    </div>
                </div>
            ) : (
                <div className="mt-2 flex items-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <Info className="w-3 h-3 text-emerald-500/70" />
                    <span className="text-[10px] font-bold text-emerald-500/70 uppercase">
                        Próximo evento el {dateString}
                    </span>
                </div>
            )}
        </CardContainer>
    );
}
