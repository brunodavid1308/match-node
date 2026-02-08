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

    // Simplified Profile Fetch
    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data as Profile;
        } catch (err: any) {
            console.error('[Auth] Error fetching profile:', err.message);
            return null;
        }
    }, []);

    const refreshProfile = useCallback(async () => {
        if (user) {
            const profileData = await fetchProfile(user.id);
            setProfile(profileData);
        }
    }, [user, fetchProfile]);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;

                if (initialSession) {
                    setSession(initialSession);
                    setUser(initialSession.user);

                    // Fetch profile (created by DB trigger)
                    const profileData = await fetchProfile(initialSession.user.id);
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
                    const profileData = await fetchProfile(currentSession.user.id);
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
    }, [fetchProfile]);

    // Sign up
    const signUp = async (email: string, password: string, username?: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                },
            },
        });

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
