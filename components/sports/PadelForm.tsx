'use client';

import { useState } from 'react';
import { Users, Calendar, Hash, Plus } from 'lucide-react';
import { usePadel } from '@/hooks';
import { CardContainer } from '@/components/ui/CardContainer';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function PadelForm() {
    const { addMatch } = usePadel();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [opponents, setOpponents] = useState('');
    const [result, setResult] = useState('');
    const [win, setWin] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addMatch({
                opponents,
                result,
                win,
                date_played: date
            });
            // Reset form
            setOpponents('');
            setResult('');
            setWin(true);
        } catch (err) {
            console.error('Error adding match:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-bold";

    return (
        <div className="glass-panel-pro rounded-[2.5rem] p-0 relative overflow-hidden group">
            {/* Header glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

            <form onSubmit={handleSubmit} className="p-10 space-y-10">
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Plus className="w-5 h-5 text-emerald-400" />
                        </div>
                        Nuevo Partido
                    </h3>
                </div>

                <div className="space-y-8">
                    {/* Opponents */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2.5 ml-1">
                            <Users className="w-4 h-4" />
                            Oponentes
                        </label>
                        <input
                            type="text"
                            required
                            value={opponents}
                            onChange={(e) => setOpponents(e.target.value)}
                            placeholder="Ej: Bruno y David"
                            className={inputClasses}
                        />
                    </div>

                    {/* Result & Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2.5 ml-1">
                                <Hash className="w-4 h-4" />
                                Marcador
                            </label>
                            <input
                                type="text"
                                required
                                value={result}
                                onChange={(e) => setResult(e.target.value)}
                                placeholder="6-4 / 6-2"
                                className={cn(inputClasses, "font-mono text-xs")}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2.5 ml-1">
                                <Calendar className="w-4 h-4" />
                                Fecha
                            </label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={cn(inputClasses, "text-xs")}
                            />
                        </div>
                    </div>

                    {/* Win/Loss Selector */}
                    <div className="p-1.5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 flex gap-2">
                        <button
                            type="button"
                            onClick={() => setWin(true)}
                            className={cn(
                                "flex-1 py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                win
                                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
                            )}
                        >
                            Victoria
                        </button>
                        <button
                            type="button"
                            onClick={() => setWin(false)}
                            className={cn(
                                "flex-1 py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                !win
                                    ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
                            )}
                        >
                            Derrota
                        </button>
                    </div>

                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        variant="emerald"
                        className="w-full py-7 shadow-lg shadow-emerald-500/10"
                        size="lg"
                    >
                        Guardar Resultado
                    </Button>
                </div>
            </form>
        </div>
    );
}
