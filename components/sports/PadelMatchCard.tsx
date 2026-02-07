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
        <CardContainer
            className="group"
            glowColor={match.win ? 'emerald' : 'red'}
        >
            <div className="p-5 flex flex-col h-full">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500",
                            match.win
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-500 border border-red-500/20"
                        )}>
                            <Trophy className="w-4.5 h-4.5" />
                        </div>
                        <span className={cn(
                            "text-[11px] font-black uppercase tracking-[0.1em]",
                            match.win ? "text-emerald-400" : "text-red-500"
                        )}>
                            {match.win ? 'Victory' : 'Defeat'}
                        </span>
                    </div>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        aria-label="Borrar partido"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-5 flex-grow">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                            <Users className="w-4.5 h-4.5 text-slate-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1.5">Oposición</p>
                            <p className="text-[13px] font-black text-white truncate uppercase tracking-tight">{match.opponents}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-slate-600" />
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-tighter">{dateStr}</span>
                    </div>
                    <div className="px-4 py-1.5 bg-white/[0.03] rounded-xl border border-white/5 shadow-inner">
                        <span className="text-sm font-black text-white font-mono tracking-tighter">{match.result}</span>
                    </div>
                </div>
            </div>
        </CardContainer>
    );
}
