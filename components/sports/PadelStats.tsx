'use client';

import { TrendingUp, Award, Target, Hash } from 'lucide-react';
import type { PadelMatch } from '@/types';

interface PadelStatsProps {
    matches: PadelMatch[];
}

export function PadelStats({ matches }: PadelStatsProps) {
    const totalMatches = matches.length;
    const wins = matches.filter(m => m.win).length;
    const losses = totalMatches - wins;
    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

    const stats = [
        {
            label: 'Partidos',
            value: totalMatches,
            icon: Hash,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
        },
        {
            label: 'Victorias',
            value: wins,
            icon: Award,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10'
        },
        {
            label: 'Derrotas',
            value: losses,
            icon: Target,
            color: 'text-red-400',
            bg: 'bg-red-400/10'
        },
        {
            label: 'Win Rate',
            value: `${winRate}%`,
            icon: TrendingUp,
            color: 'text-amber-400',
            bg: 'bg-amber-400/10'
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat) => (
                <div key={stat.label} className="glass-panel-pro rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl group hover:scale-105 transition-all duration-300 pointer-events-none">
                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} mb-4 flex items-center justify-center border border-white/5`}>
                        <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                    <p className="text-3xl font-black text-white tracking-tighter tabular-nums">{stat.value}</p>
                </div>
            ))}
        </div>
    );
}
