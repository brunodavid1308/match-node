'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { SportEvent, CurrentEvent, SportType, UserPreferences } from '@/types';

interface UseEventsOptions {
    preferences?: UserPreferences | null;
    initialData?: SportEvent[];
}

interface UseEventsReturn {
    events: SportEvent[];
    isLoading: boolean;
    error: string | null;
    lastUpdated: string | null;
    refetch: () => Promise<void>;
}

// Transform database row to UI format
function transformEvent(row: CurrentEvent): SportEvent {
    return {
        id: row.id,
        type: row.sport_type,
        title: row.title,
        time: row.start_time,
        status: row.status,
        channel: row.channel || '',
        metadata: row.metadata || {},
    };
}

// Filter events by user preferences
function filterByPreferences(
    events: SportEvent[],
    preferences?: UserPreferences | null
): SportEvent[] {
    if (!preferences) return events;

    return events.filter((event) => {
        switch (event.type) {
            case 'f1':
                return preferences.f1;
            case 'football':
                return preferences.football;
            case 'lol':
                return preferences.lol;
            case 'tennis':
                return preferences.tennis;
            default:
                return true;
        }
    });
}

export function useEvents(options: UseEventsOptions = {}): UseEventsReturn {
    const { preferences, initialData } = options;

    const [allEvents, setAllEvents] = useState<SportEvent[]>(initialData || []);
    const [isLoading, setIsLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(initialData ? new Date().toISOString() : null);

    // Fetch events from database
    const fetchEvents = useCallback(async () => {
        console.log('[useEvents] Fetching events...');
        setIsLoading(true);
        setError(null);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        // Creamos una promesa de timeout para no quedarnos bloqueados
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout: El servidor de Supabase no responde')), 8000)
        );

        try {
            console.log('[useEvents] Sending queries to current_events table...');

            // Query 1: F1 (Limitado a los próximos 5 eventos -> 1 GP completo)
            const f1Query = supabase
                .from('current_events')
                .select('*')
                .eq('sport_type', 'f1')
                .order('start_time', { ascending: true })
                .limit(5);

            // Query 2: Resto de deportes (Sin límite estricto o lìmite alto)
            const otherSportsQuery = supabase
                .from('current_events')
                .select('*')
                .neq('sport_type', 'f1') // Todo lo que NO sea F1
                .order('start_time', { ascending: true })
                .limit(50);

            // Ejecutamos ambas en paralelo
            const [f1Result, otherResult] = await Promise.all([f1Query, otherSportsQuery]);

            if (f1Result.error) throw f1Result.error;
            if (otherResult.error) throw otherResult.error;

            const combinedData = [...(f1Result.data || []), ...(otherResult.data || [])];

            // Ordenamos el resultado combinado por fecha
            combinedData.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

            console.log('[useEvents] Success! Records found:', combinedData.length);
            const transformed = combinedData.map(transformEvent);
            setAllEvents(transformed);
            setLastUpdated(new Date().toISOString());
        } catch (err: any) {
            console.error('[useEvents] Fatal Error:', err.message);
            setError(err.message || 'Error desconocido al conectar con la base de datos');
            // Fallback a array vacío para que la UI no se quede cargando
            setAllEvents([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        if (!initialData) {
            fetchEvents();
        }
    }, [fetchEvents, initialData]);

    // Real-time subscription
    useEffect(() => {
        console.log('Initializing Realtime channel...');
        const channel = supabase
            .channel('current_events_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'current_events',
                },
                (payload) => {
                    console.log('Real-time payload received:', payload.eventType);

                    if (payload.eventType === 'INSERT') {
                        const newEvent = transformEvent(payload.new as CurrentEvent);
                        setAllEvents((prev) => {
                            // EVITAR DUPLICADOS: Comprobar si ya existe
                            if (prev.find(e => e.id === newEvent.id)) return prev;

                            return [...prev, newEvent].sort(
                                (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
                            );
                        });
                    } else if (payload.eventType === 'UPDATE') {
                        console.log('[useEvents] UPDATE received. New data:', payload.new);
                        const updatedRow = payload.new as CurrentEvent;
                        const updatedEvent = transformEvent(updatedRow);

                        setAllEvents((prev) =>
                            prev.map((e) => {
                                if (e.id === updatedEvent.id) {
                                    // Creamos un objeto totalmente nuevo para forzar a React a detectar cambios en metadata
                                    return {
                                        ...updatedEvent,
                                        metadata: { ...updatedEvent.metadata }
                                    };
                                }
                                return e;
                            })
                        );
                    } else if (payload.eventType === 'DELETE') {
                        const deletedId = (payload.old as { id: string }).id;
                        setAllEvents((prev) => prev.filter((e) => e.id !== deletedId));
                    }

                    setLastUpdated(new Date().toISOString());
                }
            )
            .subscribe((status) => {
                console.log('Realtime subscription status:', status);
                if (status === 'CHANNEL_ERROR') {
                    console.warn('Realtime connection failed. The dashboard will continue with static data.');
                }
            });

        return () => {
            console.log('Cleaning up Realtime channel');
            supabase.removeChannel(channel);
        };
    }, []);

    // Filter events by preferences
    const events = filterByPreferences(allEvents, preferences);

    return {
        events,
        isLoading,
        error,
        lastUpdated,
        refetch: fetchEvents,
    };
}

// Helper to filter events by type
export function filterEventsByType(
    events: SportEvent[],
    type: SportType
): SportEvent[] {
    return events.filter((event) => event.type === type);
}

// Helper to get events by status
export function filterEventsByStatus(
    events: SportEvent[],
    status: SportEvent['status']
): SportEvent[] {
    return events.filter((event) => event.status === status);
}
