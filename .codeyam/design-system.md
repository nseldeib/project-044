# Design System: Mission Control

## Aesthetic
Minimalist, modern, high-information-density. Inspired by NASA mission control displays and Top Gun HUD interfaces. Dark cockpit backgrounds, precision typography, tactical data grids. Every element should feel like it belongs in a F/A-18 cockpit or the ISS control room.

## Base Library
- **shadcn/ui** — use shadcn components as the foundation (Button, Card, Badge, Table, Dialog, etc.)
- Tailwind CSS 4 for utility classes
- Custom CSS tokens defined in `globals.css`

## Color Palette

### Backgrounds (dark, layered)
```css
--bg-base: #03060f;          /* near-black deep space */
--bg-surface: #080d1a;       /* card/panel background */
--bg-elevated: #0d1525;      /* elevated panels, modals */
--bg-overlay: #111b2e;       /* hover states, overlays */
--bg-border: #1a2540;        /* border color */
```

### Accent — Amber HUD (primary)
```css
--accent-amber: #f59e0b;     /* amber HUD — primary accent */
--accent-amber-dim: #b45309; /* muted amber for secondary elements */
--accent-amber-glow: rgba(245, 158, 11, 0.12); /* ambient glow */
--accent-amber-a: rgba(245, 158, 11, 0.8);
```

### Accent — Electric Blue (data/nav)
```css
--accent-blue: #38bdf8;      /* electric blue — data highlights */
--accent-blue-dim: #0284c7;  /* muted blue */
--accent-blue-glow: rgba(56, 189, 248, 0.10);
```

### Accent — Mission Green (status/online)
```css
--accent-green: #4ade80;     /* mission green — online/ok states */
--accent-green-dim: #16a34a;
--accent-green-glow: rgba(74, 222, 128, 0.10);
```

### Status Colors
```css
--status-critical: #ef4444;  /* red — alert/critical */
--status-warning: #f59e0b;   /* amber — warning */
--status-nominal: #4ade80;   /* green — nominal/ok */
--status-info: #38bdf8;      /* blue — informational */
--status-neutral: #64748b;   /* gray — inactive */
```

### Text
```css
--text-primary: #e2e8f0;     /* main text — off-white */
--text-secondary: #94a3b8;   /* secondary — steel blue-gray */
--text-muted: #475569;       /* muted — dark gray */
--text-accent: #f59e0b;      /* amber for callouts */
--text-inverse: #03060f;     /* dark text on light bg */
```

## Typography

### Font Stack
- **Display/Headers:** `'Inter'`, system-ui (clean, modern)
- **Data/Monospace:** `'JetBrains Mono'`, `'Fira Code'`, monospace — for flight codes, coordinates, telemetry values
- **Body:** `'Inter'`, system-ui

```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Scale
```css
--text-2xs: 10px;   /* micro labels, badges */
--text-xs: 12px;    /* captions, metadata */
--text-sm: 13px;    /* secondary text, table cells */
--text-base: 14px;  /* body text */
--text-md: 15px;    /* slightly larger body */
--text-lg: 16px;    /* card titles */
--text-xl: 18px;    /* section headers */
--text-2xl: 22px;   /* page headers */
--text-3xl: 28px;   /* hero numbers */
--text-4xl: 36px;   /* large KPI displays */
```

### Weights
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-black: 800;
```

### Letter Spacing (tactical look)
```css
--tracking-tight: -0.02em;
--tracking-normal: 0;
--tracking-wide: 0.04em;    /* use for all-caps labels */
--tracking-wider: 0.08em;   /* use for status badges, codes */
--tracking-widest: 0.12em;  /* tactical headers */
```

## Spacing
```css
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-10: 40px;
--spacing-12: 48px;
--spacing-16: 64px;
```

## Border Radius
```css
--radius-none: 0px;
--radius-sm: 2px;    /* tight, tactical */
--radius-md: 4px;    /* cards */
--radius-lg: 6px;    /* modals, panels */
--radius-xl: 8px;    /* large panels */
--radius-full: 9999px; /* pills, badges */
```

## Shadows & Glow
```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.5);
--shadow-md: 0 4px 12px rgba(0,0,0,0.6);
--shadow-lg: 0 8px 32px rgba(0,0,0,0.7);
--shadow-amber: 0 0 20px rgba(245, 158, 11, 0.15);
--shadow-blue: 0 0 20px rgba(56, 189, 248, 0.12);
--shadow-green: 0 0 20px rgba(74, 222, 128, 0.12);
```

## Borders
```css
--border-subtle: 1px solid #1a2540;     /* default panel border */
--border-default: 1px solid #243050;   /* card border */
--border-accent: 1px solid #f59e0b;    /* amber accent border */
--border-blue: 1px solid #38bdf8;      /* blue data border */
```

## Transitions
```css
--transition-fast: 100ms ease;
--transition-base: 200ms ease;
--transition-slow: 350ms ease;
```

## Component Conventions

### Cards / Panels
- Dark bg: `var(--bg-surface)` or `var(--bg-elevated)`
- Border: `var(--border-subtle)` — thin, precise
- Optional left accent bar using `border-left: 3px solid var(--accent-amber)` for highlighted panels
- No rounded corners on data tables (sharp = tactical)
- Use `--radius-md` for cards

### Data Display
- Monospace font for all flight numbers, codes, coordinates, times, distances
- Tabular data: tight rows, alternating subtle bg (`var(--bg-overlay)` every other row)
- Status indicators: colored dots + text, never just color alone

### Badges / Status Pills
- All-caps, monospace, letter-spacing wide
- Background: 10% opacity of status color, border: status color
- Example: `NOMINAL`, `EN ROUTE`, `DELAYED`, `LANDED`

### Buttons
- Primary: amber background, dark text — `bg: var(--accent-amber)`, `color: var(--text-inverse)`
- Secondary: transparent with amber border
- Destructive: subtle red
- Ghost: transparent, text only

### Navigation
- Sidebar or top nav — dark bg, amber active indicator
- Active nav item: left border amber `3px solid var(--accent-amber)`, slightly brighter text
- Icons: thin-line style (Lucide React)

### Maps / Globe
- Dark map tiles or dark SVG globe
- Flight paths: amber or blue lines with glow effect
- Aircraft markers: small geometric indicators (triangles), amber colored

## shadcn/ui Token Overrides
Override shadcn CSS variables in `globals.css` to match this system:
```css
--background: 3 6 15;           /* --bg-base */
--foreground: 226 232 240;      /* --text-primary */
--card: 8 13 26;                /* --bg-surface */
--card-foreground: 226 232 240;
--primary: 245 158 11;          /* amber */
--primary-foreground: 3 6 15;
--secondary: 17 27 46;          /* --bg-overlay */
--secondary-foreground: 148 163 184;
--muted: 17 27 46;
--muted-foreground: 71 85 105;
--accent: 245 158 11;
--accent-foreground: 3 6 15;
--border: 26 37 64;             /* --bg-border */
--ring: 245 158 11;
--radius: 4px;
```

## Patterns to Avoid
- No white backgrounds
- No pastel colors
- No rounded-xl on data tables
- No hardcoded px values in components — use CSS variables
- No decorative elements that don't convey information
- Keep it lean: every element earns its space
