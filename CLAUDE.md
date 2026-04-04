# CodeYam Editor Project

This project is being built with CodeYam's Code + Data Editor. The core principle is **code and data are developed together** — every component should have scenario data that drives what it renders.

## Architecture: Components + Scenarios

### Component Structure

Build with a clear component hierarchy so individual components can be previewed in isolation:

```
app/
  components/
    Dashboard.tsx        ← page-level component
    TaskList.tsx         ← displays a list, gets data from API or props
    TaskCard.tsx         ← single item, pure props
    EmptyState.tsx       ← shown when no data
```

Each component should accept props that let it be rendered independently. Avoid components that can only work when deeply embedded — they should be previewable on their own with mock data.

### Scenarios

A **scenario** is a named set of data that drives how the app renders. Scenarios exist at two levels:

- **App-level scenarios**: Full application state — what the database contains, what API responses return. Example: "Empty Dashboard", "Dashboard with 50 Tasks", "Dashboard with Overdue Tasks"
- **Component-level scenarios**: Props for a single component in isolation. Example: "TaskCard - Default", "TaskCard - Overdue", "TaskCard - Completed"

**Name scenarios by data state** ("Rich Data", "Empty", "Mobile"), not by feature. When adding a feature, enhance an existing scenario's data — rename it if the scope has grown.

**Only create scenarios for states the current code can render.** If you seed 10 articles but the app doesn't have an article list component yet, the screenshot will show an empty page — that's a broken scenario. After registering, always view the captured screenshot to verify the data is actually visible.

**Always register scenarios with CodeYam** using the CLI:

```bash
# Small inline JSON:
codeyam editor register '{"name":"TaskCard - Default","componentName":"TaskCard","url":"/isolated-components/TaskCard?s=Default","dimensions":["<name from screenSizes>"]}'

# Large JSON — use the Write tool to write to .codeyam/tmp/scenario.json, then:
codeyam editor register @.codeyam/tmp/scenario.json
```

**To list existing scenarios:** `codeyam editor scenarios`

### Database First

Use a real database (SQLite + Prisma recommended) from the start. This lets scenarios represent different database states rather than just static prop variations:

- Each scenario can seed the database with different data
- API routes naturally return different results per scenario
- This is closer to real-world behavior than prop mocking alone

### Zooming In and Out

The CodeYam Editor supports zooming between the full app view and isolated component views:

- **Zoomed out**: See the whole app running with scenario data flowing through the database and APIs
- **Zoomed in**: See a single component rendered in isolation with specific props

Build components so they work at both zoom levels. A `TaskCard` should render correctly whether it's inside the full app or previewed alone with mock props.

## Workflow

1. Build a component
2. Create scenarios with rich, realistic data that thoroughly exercises the component:
   - Happy path with diverse, realistic content (not just "Test Item 1", "Test Item 2")
   - Empty state (no data, first-time user)
   - Rich data (many items, all optional fields populated, varied lengths and categories)
   - Edge cases if they surface naturally from diverse data
3. Register the scenarios with CodeYam
4. Preview each scenario to verify the component handles all states
5. Repeat for the next component, building up scenario coverage

## Key Conventions

- Component files go in `app/components/` (or `src/components/`)
- One component per file, default export
- Components accept props that can be provided by scenarios
- Database seed scripts go in `prisma/seeds/` (one per scenario when using DB-level scenarios)
- MSW handler files go in `.codeyam/msw-handlers/` (one per scenario for API mocking)

## Design System

If `.codeyam/design-system.md` exists, it contains the project's design tokens and brand guidelines. The editor step instructions will automatically show its contents inline — you don't need to read the file separately.

- Define **every** design token as a CSS custom property in `globals.css` — not just colors:
  - Colors: `--bg-surface`, `--text-primary`, `--accent-green-a`, etc.
  - Typography: `--text-xs: 12px`, `--text-sm: 14px`, `--text-lg: 18px`, etc.
  - Font weights: `--font-weight-normal: 400`, `--font-weight-medium: 500`, `--font-weight-semibold: 600`
  - Spacing: `--spacing-xs: 4px`, `--spacing-sm: 8px`, `--spacing-md: 12px`, `--spacing-lg: 16px`, etc.
  - Border radius, shadows, and transitions
- Components must reference tokens — **zero hardcoded px values** for font-size, padding, margin, gap, or colors
  - Bad: `fontSize: 14`, `padding: '12px 16px'`, `gap: 8`
  - Good: `fontSize: 'var(--text-sm)'`, `padding: 'var(--spacing-md) var(--spacing-lg)'`, `gap: 'var(--spacing-sm)'`
- This ensures the entire app updates when the design system changes

## Avoiding Permission Prompts

These patterns cause unnecessary approval prompts in Claude Code. Follow these rules:

### Writing JSON files — use the Write tool, not bash

**BAD** (triggers "expansion obfuscation" security warning due to braces+quotes in heredoc):

```bash
cat > /tmp/scenario.json << 'EOF'
{"name":"My Scenario","localStorage":{"key":"[{\"id\":\"1\"}]"}}
EOF
```

**GOOD** (Write tool is pre-approved, no bash prompt):
Use the **Write tool** to create `.codeyam/tmp/scenario.json`, then register:

```bash
codeyam editor register @.codeyam/tmp/scenario.json
```

### Listing scenarios — use the CLI subcommand

**BAD** (triggers bash approval):

```bash
cat .codeyam/editor-scenarios/*.json | grep -o '"name":"[^"]*"'
ls .codeyam/editor-scenarios/*.json
```

**GOOD** (pre-approved):

```bash
codeyam editor scenarios
```

### Database schema changes — never force-reset

**BAD** (destructive, triggers approval, drops all data):

```bash
npx prisma db push --force-reset
```

**GOOD** (preserves data by providing defaults for new required columns):

```prisma
userId Int @default(0)   // existing rows get 0
```

Then: `npm run db:push`

If you must add a required column without a default, make it optional (`Int?`) or provide a `@default()` value. Never destroy user data with `--force-reset`.
