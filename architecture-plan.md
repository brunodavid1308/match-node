# ARCHITECTURE PLAN: MatchNode (El Plan Dashboard)

## 1. DESCRIPCIÓN DEL PROYECTO
Sistema de control centralizado para un desarrollador web. La aplicación agrega eventos deportivos en tiempo real y gestiona estadísticas personales de Padel.

### Áreas de Interés:
- **Fútbol:** Seguimiento del FC Barcelona.
- **eSports:** Partidos de KOI (LEC/LVP).
- **Tenis:** Próximos partidos de Carlos Alcaraz.
- **Fórmula 1:** Sesiones de GP con foco en Fernando Alonso (Aston Martin).
- **Padel:** CRUD personal de partidos y estadísticas.

---

## 2. ESPECIFICACIONES TÉCNICAS
- **Framework:** Next.js 14+ (App Router).
- **Estilos:** Tailwind CSS + Lucide React para iconos.
- **Backend de Datos:** n8n (Orquestador de APIs externas).
- **Base de Datos & Auth:** Supabase (Postgres).
- **Despliegue:** VPS con Dokploy + Docker.

---

## 3. ESQUEMA DE BASE DE DATOS (SQL)
Ejecutar este script en el SQL Editor de Supabase:

```sql
-- Extensiones
create extension if not exists "uuid-ossp";

-- Perfiles de usuario
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  username text unique,
  preferences jsonb default '{"f1": true, "football": true, "lol": true, "tennis": true}'::jsonb
);

-- Partidos de Padel
create table public.padel_matches (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now() not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  opponents text not null,
  result text not null,
  win boolean default true,
  date_played date default current_date
);

-- Habilitar RLS
alter table public.profiles enable row level security;
alter table public.padel_matches enable row level security;

-- Políticas
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can manage own matches" on public.padel_matches for all using (auth.uid() = user_id);

4. ESTRUCTURA DE ARCHIVOS
Plaintext

/
├── app/
│   ├── (auth)/             # Login y Registro
│   ├── (dashboard)/        # Layout principal protegido
│   │   ├── page.tsx        # Dashboard (MatchNode)
│   │   └── padel/          # Gestión de partidos
│   └── layout.tsx
├── components/
│   ├── sports/
│   │   ├── F1Card.tsx      # Estilo Aston Martin (Emerald/Gold)
│   │   ├── LoLCard.tsx     # Enlace a Twitch de KOI/Ibai
│   │   └── FootballCard.tsx
│   ├── padel/
│   │   ├── PadelForm.tsx   # Modal para añadir partidos
│   │   └── PadelStats.tsx  # Gráficas de victorias/derrotas
│   └── shared/
│       └── Navbar.tsx
├── hooks/
│   └── useMatchData.ts     # Fetcher centralizado hacia n8n
├── lib/
│   └── supabase.ts         # Cliente de Supabase
└── types/
    └── index.ts            # Interfaces de TypeScript
5. CONTRATO DE DATOS (N8N WEBHOOK)
La aplicación espera que n8n devuelva un array con este formato:

JSON

[
  {
    "id": "event_01",
    "type": "f1",
    "title": "GP de Bahrein - Qualy",
    "time": "2026-03-01T16:00:00Z",
    "status": "upcoming",
    "channel": "DAZN F1",
    "metadata": {
      "is_alonso_magic": true
    }
  }
]
6. REQUISITOS DE DISEÑO (TAILWIND)
Tema: Dark Mode (Slate 950).

F1 Card: Borde border-emerald-500 si is_alonso_magic es true.

Barça Card: Degradado sutil bg-gradient-to-br from-blue-900/20 to-red-900/20.

Interacciones: Hover effects con scale-105 y transiciones suaves.

7. CONFIGURACIÓN DOKPLOY (DOCKERFILE)
Dockerfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]