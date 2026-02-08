'use client';

import { Trophy, Users, Calendar, Trash2 } from 'lucide-react';
import type { PadelMatch } from '@/types';
import { usePadel } from '@/hooks';
import { useState } from 'react';
import { CardContainer } from '@/components/ui/CardContainer';
import { cn } from '@/lib/utils';

interface PadelMatchCardProps {
    match: PadelMatch;
}

export function PadelMatchCard({ match }: PadelMatchCardProps) {
    const { deleteMatch } = usePadel();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('¿Seguro que quieres borrar este partido?')) return;
        setIsDeleting(true);
        try {
            await deleteMatch(match.id);
        } catch (err) {
            setIsDeleting(false);
        }
    };

    const dateStr = new Date(match.date_played).toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    }).replace('.', '');

    return (
        <div className={cn(
            "glass-panel-pro rounded-[2rem] relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98]",
            match.win ? "hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]" : "hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]"
        )}>
            {/* Dynamic Status Bar */}
            <div className={cn(
                "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-40",
                match.win ? "text-emerald-500" : "text-red-500"
            )} />

            <div className="p-7 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 border shadow-inner",
                            match.win
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                        )}>
                            <Trophy className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                            <span className={cn(
                                "text-[11px] font-black uppercase tracking-[0.2em] block mb-0.5",
                                match.win ? "text-emerald-400" : "text-red-500"
                            )}>
                                {match.win ? 'Victory' : 'Defeat'}
                            </span>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-slate-600" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{dateStr}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="opacity-0 group-hover:opacity-100 p-2.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                        aria-label="Borrar partido"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-6 flex-grow">
                    <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-all duration-500">
                            <Users className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="min-w-0 flex-grow py-1">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] leading-none mb-2">Oponentess</p>
                            <p className="text-sm font-black text-white truncate uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{match.opponents}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center">
                    <div className="px-8 py-3 bg-white/[0.02] rounded-2xl border border-white/5 shadow-inner group-hover:bg-white/[0.05] transition-all duration-500">
                        <span className="text-2xl font-black text-white font-mono tracking-tighter tabular-nums">{match.result}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
