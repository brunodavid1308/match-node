'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Menu,
    X,
    Zap,
    Settings,
    LogOut,
    User,
    Target,
    Search,
    Bell
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts';
import { cn } from '@/lib/utils';

interface NavbarProps {
    activeSection?: string;
}

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Zap, color: 'text-emerald-400', href: '/' },
    { id: 'padel', label: 'Padel', icon: Target, color: 'text-blue-400', href: '/padel' },
];

export function Navbar({ activeSection }: NavbarProps) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, profile, signOut } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = async () => {
        setIsUserMenuOpen(false);
        await signOut();
    };

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
            scrolled
                ? "py-3 bg-slate-950/40 backdrop-blur-2xl border-b border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                : "py-6 bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                <div className="flex items-center justify-between">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-blue-600 rounded-xl blur-lg opacity-40 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-110" />
                            <div className="relative flex items-center justify-center w-11 h-11 rounded-[14px] bg-slate-950 border border-white/10 group-hover:border-white/20 transition-all duration-500">
                                <Zap className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-white tracking-tighter uppercase leading-none">
                                MatchNode
                                <span className="text-emerald-500">.</span>
                            </span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1 leading-none">
                                El Plan v2.0
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Glass Pill */}
                    <div className="hidden md:flex items-center gap-1.5 p-1.5 rounded-[1.25rem] bg-white/[0.02] border border-white/5 backdrop-blur-md">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-tight transition-all duration-300",
                                        isActive
                                            ? "bg-white/[0.05] text-white border border-white/10 shadow-lg"
                                            : "text-slate-500 hover:text-white hover:bg-white/[0.03]"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", isActive ? item.color : "text-slate-600")} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search Action */}
                        <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 text-slate-500 hover:text-white hover:bg-white/[0.05] transition-all">
                            <Search className="w-4.5 h-4.5" />
                        </button>

                        {/* Notifications */}
                        <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 text-slate-500 hover:text-white hover:bg-white/[0.05] transition-all relative">
                            <Bell className="w-4.5 h-4.5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-slate-950" />
                        </button>

                        <div className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block" />

                        {/* User Profile */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-[1.1rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group"
                                >
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-emerald-500 to-blue-600 p-[1px]">
                                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                            <User className="w-4 h-4 text-emerald-400" />
                                        </div>
                                    </div>
                                    <span className="hidden sm:block text-xs font-black text-white uppercase tracking-tight">
                                        {profile?.username || user.email?.split('@')[0]}
                                    </span>
                                </button>

                                {/* Dropdown Menu - Pro Glass */}
                                {isUserMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                                        <div className="absolute right-0 mt-3 w-64 z-50 glass-panel-pro p-2 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="px-4 py-4 border-b border-white/5 mb-2">
                                                <p className="text-xs font-black text-white uppercase tracking-widest leading-none mb-1">
                                                    {profile?.username || 'Usuario'}
                                                </p>
                                                <p className="text-[10px] text-slate-500 truncate font-mono tracking-tighter">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <button
                                                    onClick={() => router.push('/settings')}
                                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-[11px] font-black uppercase text-slate-400 hover:text-white hover:bg-white/[0.03] rounded-xl transition-all"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    Configuración
                                                </button>
                                                <button
                                                    onClick={handleSignOut}
                                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-[11px] font-black uppercase text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Cerrar sesión
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            >
                                Login
                            </Link>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden flex items-center justify-center w-11 h-11 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-400"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation - Pro Glass */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-x-4 top-24 z-[100] p-4 glass-panel-pro rounded-3xl animate-in zoom-in-95 duration-300">
                    <div className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-tight transition-all",
                                        isActive
                                            ? "bg-white/[0.05] text-white border border-white/10"
                                            : "text-slate-500 hover:bg-white/[0.02] hover:text-white"
                                    )}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Icon className={cn("w-5 h-5", isActive ? item.color : "")} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
