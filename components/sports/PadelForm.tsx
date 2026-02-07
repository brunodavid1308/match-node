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

    const inputClasses = "w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-bold";

    return (
        <CardContainer className="p-0">
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Plus className="w-4 h-4 text-emerald-400" />
                        </div>
                        Nuevo Partido
                    </h3>
                </div>

                <div className="space-y-6">
                    {/* Opponents */}
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Users className="w-3.5 h-3.5" />
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Hash className="w-3.5 h-3.5" />
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
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" />
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
                    <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-white/[0.02] border border-white/5">
                        <button
                            type="button"
                            onClick={() => setWin(true)}
                            className={cn(
                                "py-3 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all",
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
                                "py-3 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all",
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
                        className="w-full"
                        size="lg"
                    >
                        Guardar Resultado
                    </Button>
                </div>
            </form>
        </CardContainer>
    );
}
