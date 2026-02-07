'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { PadelMatch, PadelMatchInput } from '@/types';

export function usePadel() {
    const [matches, setMatches] = useState<PadelMatch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMatches = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error: fetchError } = await supabase
                .from('padel_matches')
                .select('*')
                .order('date_played', { ascending: false });

            if (fetchError) throw fetchError;
            setMatches(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addMatch = async (input: PadelMatchInput) => {
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error('User not authenticated');

            const { data, error: insertError } = await supabase
                .from('padel_matches')
                .insert([{
                    ...input,
                    user_id: userData.user.id
                }])
                .select()
                .single();

            if (insertError) throw insertError;
            setMatches(prev => [data, ...prev]);
            return data;
        } catch (err: any) {
            throw err;
        }
    };

    const deleteMatch = async (id: string) => {
        try {
            const { error: deleteError } = await supabase
                .from('padel_matches')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            setMatches(prev => prev.filter(m => m.id !== id));
        } catch (err: any) {
            throw err;
        }
    };

    useEffect(() => {
        fetchMatches();
    }, [fetchMatches]);

    return {
        matches,
        isLoading,
        error,
        addMatch,
        deleteMatch,
        refetch: fetchMatches
    };
}
