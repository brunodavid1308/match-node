import { createClient } from '@supabase/supabase-js';
import type { Profile, PadelMatch, PadelMatchInput } from '@/types';

// Environment variables (set in .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
});

// Profile helpers
export async function getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
    return data;
}

export async function updateProfile(
    userId: string,
    updates: Partial<Profile>
): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error updating profile:', error);
        return null;
    }
    return data;
}

// Padel match helpers
export async function getPadelMatches(userId: string): Promise<PadelMatch[]> {
    const { data, error } = await supabase
        .from('padel_matches')
        .select('*')
        .eq('user_id', userId)
        .order('date_played', { ascending: false });

    if (error) {
        console.error('Error fetching padel matches:', error);
        return [];
    }
    return data || [];
}

export async function createPadelMatch(
    userId: string,
    match: PadelMatchInput
): Promise<PadelMatch | null> {
    const { data, error } = await supabase
        .from('padel_matches')
        .insert({ ...match, user_id: userId })
        .select()
        .single();

    if (error) {
        console.error('Error creating padel match:', error);
        return null;
    }
    return data;
}

export async function deletePadelMatch(matchId: string): Promise<boolean> {
    const { error } = await supabase
        .from('padel_matches')
        .delete()
        .eq('id', matchId);

    if (error) {
        console.error('Error deleting padel match:', error);
        return false;
    }
    return true;
}
