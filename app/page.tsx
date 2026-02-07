import { createClient } from '@supabase/supabase-js';
import DashboardClient from './DashboardClient';
import { CurrentEvent, SportEvent } from '@/types';

// Initialize Supabase client for Server Side Fetching
// Note: We use a fresh client to avoid state issues, though for public data it's less critical.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

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

async function getInitialEvents(): Promise<SportEvent[]> {
    try {
        // Query 1: F1 (Limited to next 5 events)
        const f1Query = supabase
            .from('current_events')
            .select('*')
            .eq('sport_type', 'f1')
            .order('start_time', { ascending: true })
            .limit(5);

        // Query 2: Other sports
        const otherQuery = supabase
            .from('current_events')
            .select('*')
            .neq('sport_type', 'f1')
            .order('start_time', { ascending: true })
            .limit(50);

        const [f1Result, otherResult] = await Promise.all([f1Query, otherQuery]);

        const combinedData = [
            ...(f1Result.data || []),
            ...(otherResult.data || [])
        ] as CurrentEvent[];

        // Sort combined data by time
        combinedData.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

        return combinedData.map(transformEvent);
    } catch (error) {
        console.error('Error fetching initial events:', error);
        return [];
    }
}

export default async function Page() {
    const events = await getInitialEvents();

    return (
        <DashboardClient initialEvents={events} />
    );
}
