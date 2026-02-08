'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts';
import { ProtectedRoute } from '@/components/auth';
import { Navbar } from '@/components/shared';
import {
    ArrowLeft,
    User,
    Bell,
    Flag,
    Trophy,
    Gamepad2,
    Volleyball,
    Save,
    Loader2,
    CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
    const router = useRouter();
    const { user, profile, refreshProfile } = useAuth();

    const [username, setUsername] = useState(profile?.username || '');
    const [preferences, setPreferences] = useState(
        profile?.preferences || { f1: true, football: true, lol: true, tennis: true }
    );
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        if (!user) return;

        setIsSaving(true);
        setSaved(false);

        const { error } = await supabase
            .from('profiles')
            .update({
                username,
                preferences,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

        if (!error) {
            await refreshProfile();
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }

        setIsSaving(false);
    };

    const togglePreference = (key: keyof typeof preferences) => {
        setPreferences((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const sportOptions = [
        { key: 'f1' as const, label: 'Fórmula 1', icon: Flag, color: 'emerald' as const },
        { key: 'football' as const, label: 'FC Barcelona', icon: Trophy, color: 'blue' as const },
        { key: 'lol' as const, label: 'KOI eSports', icon: Gamepad2, color: 'purple' as const },
        { key: 'tennis' as const, label: 'Carlos Alcaraz', icon: Volleyball, color: 'lime' as const },
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-950">
                <Navbar />

                <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-6 mb-12">
                        <Link
                            href="/"
                            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all duration-300 shadow-xl"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                                    Configuración
                                </h1>
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">
                                Personaliza tu Centro de Control
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Profile Section */}
                        <section className="glass-panel-pro rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                            {/* Inner subtle glow */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <User className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Perfil</h2>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Identidad de usuario</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Username */}
                                <div className="space-y-3">
                                    <label htmlFor="username" className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2.5 ml-1">
                                        Nombre de usuario
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-bold"
                                    />
                                </div>

                                {/* Email (read-only) */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2.5 ml-1">
                                        Email corporativo
                                    </label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full px-5 py-4 bg-white/[0.01] border border-white/5 rounded-2xl text-sm text-slate-600 cursor-not-allowed font-bold"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Preferences Section */}
                        <section className="glass-panel-pro rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                            {/* Inner subtle glow */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                    <Bell className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Sincronización</h2>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Fuentes de datos activas</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {sportOptions.map((sport) => {
                                    const Icon = sport.icon;
                                    const isEnabled = preferences[sport.key];
                                    const colorClasses = {
                                        emerald: 'bg-emerald-500',
                                        blue: 'bg-blue-500',
                                        purple: 'bg-purple-500',
                                        lime: 'bg-lime-500',
                                    };
                                    const iconColors = {
                                        emerald: 'text-emerald-400',
                                        blue: 'text-blue-400',
                                        purple: 'text-purple-400',
                                        lime: 'text-lime-400',
                                    };

                                    return (
                                        <button
                                            key={sport.key}
                                            onClick={() => togglePreference(sport.key)}
                                            className={cn(
                                                "flex items-center justify-between w-full p-5 rounded-2xl border transition-all duration-300 group/item",
                                                isEnabled
                                                    ? "bg-white/[0.04] border-white/10 shadow-lg"
                                                    : "bg-white/[0.01] border-white/5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors border border-white/5",
                                                    isEnabled ? "bg-white/[0.05]" : "bg-transparent"
                                                )}>
                                                    <Icon className={cn("w-5 h-5", isEnabled ? iconColors[sport.color] : "text-slate-600")} />
                                                </div>
                                                <span className="text-xs font-black text-white uppercase tracking-widest">{sport.label}</span>
                                            </div>
                                            <div
                                                className={cn(
                                                    "w-14 h-8 rounded-full p-1.5 transition-all duration-500 relative",
                                                    isEnabled ? colorClasses[sport.color] : "bg-slate-800"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "w-5 h-5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-500 transform",
                                                        isEnabled ? "translate-x-6" : "translate-x-0"
                                                    )}
                                                />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={cn(
                                "w-full py-5 px-6 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs transition-all duration-300 flex items-center justify-center gap-4 relative overflow-hidden group shadow-2xl hover:scale-[1.02] active:scale-[0.98]",
                                saved
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                    : "bg-emerald-500 text-slate-950"
                            )}
                        >
                            {!saved && <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}

                            <div className="relative flex items-center justify-center gap-4">
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Actualizando...</span>
                                    </>
                                ) : saved ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        <span>¡Perimetrado!</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                        <span>Guardar Configuración</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
