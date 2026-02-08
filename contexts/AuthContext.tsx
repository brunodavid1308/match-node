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

    // Reliable Profile Fetch with Retry
    const fetchProfile = useCallback(async (userId: string, retryCount = 0): Promise<Profile | null> => {
        try {
            console.log(`[Auth] Fetching profile for ${userId} (attempt ${retryCount + 1})`);

            // We use maybeSingle() to avoid throwing a 406/PGRST116 error if it doesn't exist yet
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (error) throw error;

            // If not found and we have retries left, wait and try again
            if (!data && retryCount < 5) {
                console.log('[Auth] Profile not found yet, retrying in 1.5s...');
                await new Promise(resolve => setTimeout(resolve, 1500));
                return fetchProfile(userId, retryCount + 1);
            }

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
        try {
            console.log('[Auth] Signing out...');
            // We use { scope: 'local' } to ensure the local session is cleared 
            // even if the server call fails or is blocked
            const { error } = await supabase.auth.signOut({ scope: 'local' });
            if (error) console.error('[Auth] SignOut Error:', error.message);
        } catch (err: any) {
            console.error('[Auth] Unexpected error during signout:', err.message);
        } finally {
            // Always clear state and redirect
            setUser(null);
            setSession(null);
            setProfile(null);
            console.log('[Auth] Local session cleared, redirecting...');
            window.location.href = '/login';
        }
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
