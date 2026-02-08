'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts';
import { Zap, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { signIn, user, isLoading: isAuthLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthLoading && user) {
            router.push('/');
        }
    }, [user, isAuthLoading, router]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error: authError } = await signIn(email, password);

        if (authError) {
            setError(authError.message);
            setIsLoading(false);
        } else {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative w-full max-w-md z-10 animate-fade-in">
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6 group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-blue-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-100 transition-all duration-700 scale-90 group-hover:scale-110" />
                        <div className="relative flex items-center justify-center w-full h-full rounded-2xl bg-slate-950 border border-white/10 group-hover:border-white/20 transition-all duration-500">
                            <Zap className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                        MatchNode<span className="text-emerald-500">.</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                            Centro de Acceso
                        </span>
                        <div className="w-1 h-1 rounded-full bg-slate-800" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                            v2.0
                        </span>
                    </div>
                </div>

                {/* Form Card */}
                <div className="glass-panel-pro rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                    {/* Inner subtle glow */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

                    <div className="mb-8">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2 flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                            Iniciar Sesión
                        </h2>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest pl-4">
                            Continúa hacia tu plan
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-8 p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-start gap-4 animate-slide-up">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] font-bold text-red-400 uppercase tracking-tight leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2.5">
                            <label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                <Mail className="w-3.5 h-3.5" />
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    required
                                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-bold"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2.5">
                            <label htmlFor="password" className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                <Lock className="w-3.5 h-3.5" />
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-bold"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 px-6 relative group/btn overflow-hidden rounded-2xl bg-emerald-500 transition-all duration-300 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                            <div className="relative flex items-center justify-center gap-3">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                                        <span className="text-slate-950 font-black uppercase tracking-widest text-xs">Accediendo...</span>
                                    </>
                                ) : (
                                    <span className="text-slate-950 font-black uppercase tracking-widest text-xs">Entrar al Plan</span>
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-10 flex items-center gap-4">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">o</span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>

                    {/* Sign up link */}
                    <div className="text-center">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                            ¿No tienes cuenta?{' '}
                            <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 transition-colors ml-1">
                                Únete al equipo
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
