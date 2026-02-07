# Magic Dashboard - Design System

## 1. Core Palette (Sports Themed)

| Token | Helper | Hex | Usage |
|-------|--------|-----|-------|
| `--f1` | `emerald` | `#10b981` | Formula 1 (Aston Martin style) |
| `--barca` | `blue/red` | `#3b82f6` | FC Barcelona (Blaugrana accents) |
| `--koi` | `purple` | `#a855f7` | KOI eSports |
| `--tennis` | `lime` | `#84cc16` | Carlos Alcaraz (Tennis Ball) |
| `--padel` | `teal` | `#14b8a6` | Padel (Court color) |

## 2. Backgrounds (Dark Mode)

| Token | Class | Hex | Description |
|-------|-------|-----|-------------|
| `bg-slate-950` | `bg-slate-950` | `#020617` | Main Application Background |
| `bg-slate-900` | `bg-slate-900` | `#0f172a` | Card / Sidebar Background |
| `bg-slate-800` | `bg-slate-800` | `#1e293b` | Borders / Separators |

## 3. Typography (Geist)

- **Headings**: `font-sans font-bold tracking-tight`
- **Body**: `font-sans text-slate-400`
- **Numbers/Data**: `font-mono tracking-wider`

## 4. Effects (Glassmorphism)

- **Card Glass**: `bg-slate-900/50 backdrop-blur-xl border border-slate-800/50`
- **Hover Glow**: `hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]` (varies by sport)

## 5. Animation (Micro-interactions)

- **Duration**: `duration-300` standard
- **Easing**: `ease-out`
- **Scale**: `hover:scale-[1.02]` for cards

## 6. Accessibility Rules

- **Focus Rings**: `focus-visible:ring-2 focus-visible:ring-emerald-500`
- **Contrast**: Text always `text-slate-100` or `text-white` on dark backgrounds.
- **Touch**: Targets min `44px` height.
