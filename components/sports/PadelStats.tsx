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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                    <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} mb-2`}>
                        <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                </div>
            ))}
        </div>
    );
}
