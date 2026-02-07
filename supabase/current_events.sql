-- ============================================
-- CURRENT_EVENTS TABLE FOR MATCHNODE DASHBOARD
-- Execute this in Supabase SQL Editor
-- ============================================

-- Tabla de eventos deportivos (poblada por n8n)
create table public.current_events (
  id uuid default uuid_generate_v4() primary key,
  sport_type text not null check (sport_type in ('f1', 'football', 'lol', 'tennis')),
  title text not null,
  start_time timestamp with time zone not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'live', 'finished')),
  channel text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Índices para queries frecuentes
create index idx_current_events_sport on current_events(sport_type);
create index idx_current_events_status on current_events(status);
create index idx_current_events_start_time on current_events(start_time);

-- RLS: Lectura pública, escritura solo service_role (n8n)
alter table public.current_events enable row level security;
create policy "Anyone can read events" on current_events for select using (true);

-- Trigger auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger current_events_updated_at
  before update on current_events
  for each row execute function update_updated_at();

-- Habilitar Realtime para esta tabla
alter publication supabase_realtime add table current_events;

-- ============================================
-- DATOS DE PRUEBA (opcional, para testing)
-- ============================================

insert into current_events (sport_type, title, start_time, status, channel, metadata) values
  ('f1', 'GP de Bahrein - Qualifying', '2026-03-01T16:00:00Z', 'upcoming', 'DAZN F1', '{"is_alonso_magic": true}'),
  ('f1', 'GP de Bahrein - Race', '2026-03-02T16:00:00Z', 'upcoming', 'DAZN F1', '{"is_alonso_magic": true}'),
  ('football', 'FC Barcelona vs Real Madrid', '2026-02-15T21:00:00Z', 'upcoming', 'Movistar LaLiga', '{"team": "FC Barcelona", "opponent": "Real Madrid", "competition": "La Liga"}'),
  ('football', 'FC Barcelona vs Manchester City', '2026-02-07T21:00:00Z', 'live', 'Movistar Champions', '{"team": "FC Barcelona", "opponent": "Manchester City", "competition": "Champions League", "score": "2-1"}'),
  ('lol', 'KOI vs G2 Esports - LEC Spring', '2026-02-08T18:00:00Z', 'upcoming', 'Twitch', '{"twitch_url": "https://www.twitch.tv/ibai", "team_playing": "KOI"}'),
  ('tennis', 'Carlos Alcaraz vs Sinner - Australian Open', '2026-02-10T09:00:00Z', 'upcoming', 'Eurosport', '{"player": "Carlos Alcaraz", "tournament": "Australian Open"}');
