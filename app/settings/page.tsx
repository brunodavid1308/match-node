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
                    <div className="flex items-center gap-4 mb-8">
                        <Link
                            href="/"
                            className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Configuración</h1>
                            <p className="text-slate-400 text-sm">Personaliza tu dashboard</p>
                        </div>
                    </div>

                    {/* Profile Section */}
                    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Perfil</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                                    Nombre de usuario
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Email (read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full px-4 py-3 bg-slate-800/30 border border-slate-700/50 rounded-xl text-slate-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Preferences Section */}
                    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Preferencias</h2>
                                <p className="text-sm text-slate-400">Elige qué deportes ver</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {sportOptions.map((sport) => {
                                const Icon = sport.icon;
                                const isEnabled = preferences[sport.key];
                                const colorClasses = {
                                    emerald: 'bg-emerald-500 border-emerald-500',
                                    blue: 'bg-blue-500 border-blue-500',
                                    purple: 'bg-purple-500 border-purple-500',
                                    lime: 'bg-lime-500 border-lime-500',
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
                                        className={`
                      flex items-center justify-between w-full p-4 rounded-xl border transition-all
                      ${isEnabled
                                                ? 'bg-slate-800/80 border-slate-700'
                                                : 'bg-slate-800/30 border-slate-800 opacity-60'
                                            }
                    `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-5 h-5 ${iconColors[sport.color]}`} />
                                            <span className="font-medium text-white">{sport.label}</span>
                                        </div>
                                        <div
                                            className={`
                        w-12 h-7 rounded-full p-1 transition-colors
                        ${isEnabled ? colorClasses[sport.color] : 'bg-slate-700'}
                      `}
                                        >
                                            <div
                                                className={`
                          w-5 h-5 rounded-full bg-white shadow-md transition-transform
                          ${isEnabled ? 'translate-x-5' : 'translate-x-0'}
                        `}
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
                        className={`
              w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200
              flex items-center justify-center gap-2
              ${saved
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
                            }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Guardando...
                            </>
                        ) : saved ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                ¡Guardado!
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Guardar cambios
                            </>
                        )}
                    </button>
                </main>
            </div>
        </ProtectedRoute>
    );
}
