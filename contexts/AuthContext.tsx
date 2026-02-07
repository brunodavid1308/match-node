'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    ReactNode,
} from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    isLoading: boolean;
    signUp: (email: string, password: string, username?: string) => Promise<{ error: AuthError | null }>;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch or create user profile
    const fetchOrCreateProfile = useCallback(async (userId: string, email?: string) => {
        console.log('[Auth] Fetching profile for:', userId);

        // Timeout para el perfil
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout perfil')), 5000)
        );

        try {
            // Usamos select normal sin .single() para evitar el error 406
            const { data, error } = (await Promise.race([
                supabase.from('profiles').select('*').eq('id', userId).limit(1),
                timeoutPromise
            ])) as any;

            if (error) {
                // Si el error es que la tabla no existe
                if (error.message?.includes('does not exist')) {
                    console.warn('[Auth] Profile table missing. Using default.');
                    return {
                        id: userId,
                        username: email?.split('@')[0] || 'usuario',
                        preferences: { f1: true, football: true, lol: true, tennis: true },
                        updated_at: new Date().toISOString()
                    } as Profile;
                }
                throw error;
            }

            const profileData = data && data.length > 0 ? data[0] : null;

            if (!profileData) {
                console.log('[Auth] Profile not found, creating default state');
                return {
                    id: userId,
                    username: email?.split('@')[0] || 'usuario',
                    preferences: { f1: true, football: true, lol: true, tennis: true },
                    updated_at: new Date().toISOString()
                } as Profile;
            }

            console.log('[Auth] Profile loaded successfully');
            return profileData as Profile;
        } catch (err: any) {
            console.error('[Auth] Profile error:', err.message);
            // Fallback para no bloquear la app
            return {
                id: userId,
                username: email?.split('@')[0] || 'usuario',
                preferences: { f1: true, football: true, lol: true, tennis: true },
                updated_at: new Date().toISOString()
            } as Profile;
        }
    }, []);

    // Refresh profile data
    const refreshProfile = useCallback(async () => {
        if (user) {
            const profileData = await fetchOrCreateProfile(user.id, user.email);
            setProfile(profileData);
        }
    }, [user, fetchOrCreateProfile]);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;

                if (initialSession) {
                    setSession(initialSession);
                    setUser(initialSession.user);

                    // Fetch or create profile
                    const profileData = await fetchOrCreateProfile(
                        initialSession.user.id,
                        initialSession.user.email
                    );
                    setProfile(profileData);
                }
            } catch (error) {
                console.error('Auth Init Error:', error);
            } finally {
                console.log('Auth initialized');
                setIsLoading(false);
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, currentSession) => {
                console.log('Auth State Change:', event);
                setSession(currentSession);
                setUser(currentSession?.user ?? null);

                if (currentSession?.user) {
                    const profileData = await fetchOrCreateProfile(
                        currentSession.user.id,
                        currentSession.user.email
                    );
                    setProfile(profileData);
                } else {
                    setProfile(null);
                }

                setIsLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchOrCreateProfile]);

    // Sign up
    const signUp = async (email: string, password: string, username?: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                },
            },
        });

        if (!error && data.user) {
            // Create profile immediately
            await supabase.from('profiles').upsert({
                id: data.user.id,
                username: username || email.split('@')[0],
                updated_at: new Date().toISOString(),
                preferences: { f1: true, football: true, lol: true, tennis: true },
            });
        }

        return { error };
    };

    // Sign in
    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        return { error };
    };

    // Sign out
    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
        // Force redirect to login
        window.location.href = '/login';
    };

    const value: AuthContextType = {
        user,
        session,
        profile,
        isLoading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
