// Types matching the SQL schema from architecture-plan.md

// User profile (from public.profiles table)
export interface Profile {
  id: string;
  updated_at: string | null;
  username: string | null;
  preferences: UserPreferences;
}

export interface UserPreferences {
  f1: boolean;
  football: boolean;
  lol: boolean;
  tennis: boolean;
}

// Padel match (from public.padel_matches table)
export interface PadelMatch {
  id: string;
  created_at: string;
  user_id: string;
  opponents: string;
  result: string;
  win: boolean;
  date_played: string;
}

// Sport types
export type SportType = 'f1' | 'football' | 'lol' | 'tennis';
export type EventStatus = 'upcoming' | 'live' | 'finished';

// Current event from database (current_events table)
export interface CurrentEvent {
  id: string;
  sport_type: SportType;
  title: string;
  start_time: string;
  status: EventStatus;
  channel: string | null;
  metadata: SportEventMetadata;
  created_at: string;
  updated_at: string;
}

// Transformed event for UI components (normalized format)
export interface SportEvent {
  id: string;
  type: SportType;
  title: string;
  time: string;
  status: EventStatus;
  channel: string;
  metadata: SportEventMetadata;
}

export interface SportEventMetadata {
  [key: string]: any;
  // Football specific
  score?: string;
  home_logo?: string;
  away_logo?: string;
  competition?: string;
  competition_logo?: string;
  venue?: string;
  minute?: string;
  period?: string;
  progress?: string;
  // F1 specific
  is_alonso_magic?: boolean;
  lap?: string;
  position?: string;
  circuit_logo?: string;
  country_flag?: string;
  session_type?: string;
  circuit_name?: string;
  // LoL specific
  twitch_url?: string;
  team_playing?: string;
  status_text?: string;
  game_info?: string;
  // Tennis specific
  player?: string;
  tournament?: string;
  current_game?: string;
  is_time_confirmed?: boolean;
}

// Padel form input
export interface PadelMatchInput {
  opponents: string;
  result: string;
  win: boolean;
  date_played: string;
}

// Database row types for Supabase
export type CurrentEventRow = CurrentEvent;
export type ProfileRow = Profile;
export type PadelMatchRow = PadelMatch;
