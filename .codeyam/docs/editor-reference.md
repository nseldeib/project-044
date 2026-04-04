# .codeyam/ Directory Reference

This file documents the `.codeyam/` internals and CLI commands. Consult this when you're stuck on scenario registration, audit failures, preview issues, or understanding what files do what.

## Directory Structure

### Committed Files (shared across clones)

- `config.json` — Project configuration: slug, screen sizes, default viewport, feature metadata
- `editor-scenarios/` — Scenario JSON files with seed data, localStorage, MSW handlers, and metadata
- `scenarios-manifest.json` — Index of all scenarios for database sync on fresh clones
- `design-system.md` — Design tokens and brand guidelines (if present)
- `glossary.json` — Entity glossary built during extraction steps
- `msw-handlers/` — MSW handler files for API mocking (one per scenario)
- `seed-adapters/` — Seed adapter templates for database seeding

### Gitignored Files (machine-local)

- `db.sqlite3` / `db.sqlite3-wal` / `db.sqlite3-shm` — SQLite database (rebuilt on clone via `codeyam editor`)
- `secrets.json` — API keys (Anthropic, etc.)
- `server.json` / `server-state.json` — Background server process state
- `queue.json` — Analysis job queue state
- `active-scenario.json` — Currently active scenario for the preview
- `editor-step.json` — Current editor workflow step number
- `editor-user-prompt.txt` — The user's feature request text
- `claude-session-id.txt` — Claude Code session ID for step tracking
- `editor-mode-context.md` / `dev-mode-context.md` — Generated context for Claude
- `logs/` — Server and analysis logs
- `llm-calls/` — LLM call recordings
- `captures/` — Playwright screenshot captures
- `results/` — Analysis results
- `tmp/` — Temporary files (use for large scenario JSON)
- `rules/` — Auto-installed Claude rules
- `bin/` — Helper scripts and hooks

## CLI Command Reference

All commands use the pattern `codeyam editor <subcommand>`.

### Scenario Management

| Command                                 | Description                                                |
| --------------------------------------- | ---------------------------------------------------------- |
| `codeyam editor register '<json>'`      | Register a scenario (inline JSON or `@path/to/file.json`)  |
| `codeyam editor scenarios`              | List all registered scenarios                              |
| `codeyam editor delete <scenarioId>`    | Delete a scenario by ID                                    |
| `codeyam editor scenario-coverage`      | Verify all affected scenarios are fresh after code changes |
| `codeyam editor validate-seed '<json>'` | Validate seed data structure                               |

### Preview & Verification

| Command                           | Description                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------- |
| `codeyam editor preview '<json>'` | Navigate preview — **must include `dimension`** (e.g., `{"path":"/route","dimension":"Desktop"}`) |
| `codeyam editor client-errors`    | Show client-side errors from the preview iframe                                                   |
| `codeyam editor audit`            | Check that glossary entries have registered scenarios and tests                                   |

### Entity Analysis

| Command                                          | Description                                                            |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| `codeyam editor analyze-imports [file...]`       | Build the import dependency graph (optionally scope to specific files) |
| `codeyam editor dependents <EntityName>`         | Find all entities that import a given entity                           |
| `codeyam editor isolate "ComponentA ComponentB"` | Create isolation route directories for components                      |

### Server

| Command                     | Description             |
| --------------------------- | ----------------------- |
| `codeyam editor dev-server` | Query dev server status |

### Workflow

| Command                                                 | Description                                                     |
| ------------------------------------------------------- | --------------------------------------------------------------- |
| `codeyam editor <1-18>`                                 | Jump to a specific editor workflow step                         |
| `codeyam editor steps`                                  | Show setup overview or cycle progress                           |
| `codeyam editor change <feature>`                       | Start the change workflow for modifying features                |
| `codeyam editor sync`                                   | Import scenarios from manifest into database (used after clone) |
| `codeyam editor migrate [step\|next\|complete\|status]` | Run migration workflow steps                                    |

## Scenario Registration Patterns

### Component-Level Scenario

```json
{
  "name": "TaskCard - Overdue",
  "componentName": "TaskCard",
  "url": "/isolated-components/TaskCard?s=Overdue",
  "dimensions": ["Desktop"]
}
```

### App-Level Scenario

```json
{
  "name": "Dashboard with Tasks",
  "url": "/",
  "dimensions": ["Desktop"],
  "seedData": {
    "tasks": [{ "id": 1, "title": "Ship feature", "status": "in_progress" }]
  },
  "localStorage": { "user": "{\"name\":\"Alice\"}" }
}
```

### Large JSON — Use a Tmp File

Write JSON to `.codeyam/tmp/scenario.json` using the **Write tool**, then:

```bash
codeyam editor register @.codeyam/tmp/scenario.json
```

### Re-registration

Registering a scenario with the same name replaces the existing one. No need to delete first.

### Dimensions

Dimension names come from `screenSizes` in `.codeyam/config.json`. Common values: `"Desktop"`, `"Mobile"`, `"Tablet"`. Every scenario and preview command must specify a dimension.

## Troubleshooting

### Audit gate blocking step 8+

The audit checks that every glossary entity has at least one scenario and passes tests. Fix by:

1. Run `codeyam editor audit` to see which entities are missing coverage
2. Register scenarios for uncovered entities
3. Fix any failing tests
4. Re-run audit — do NOT loop `audit` and `analyze-imports` repeatedly

### Scenarios showing empty/blank pages or error pages

The scenario renders a URL but the page has no visible content, or shows an error page. Common causes:

- **URL references IDs that don't exist in the seed data**: The URL contains a dynamic segment (e.g., `/items/abc-123`) but the seed data creates records with different IDs. Check the register output for `API response error` lines — they show the exact API call that failed and the server's response.
- **Seed data doesn't match the code**: The seeded data has fields the component doesn't read, or the component expects data the seed doesn't provide
- **Missing API route**: The component fetches from an API that doesn't exist yet
- **Component not exported or not mounted**: The isolation route doesn't render the component
- **Only create scenarios for states the current code can render** — if the component isn't built yet, the screenshot will be blank

### Client errors in preview

Run `codeyam editor client-errors` to see errors from the preview. There are three types:

- **Console errors** (`Page console.error:`): JavaScript runtime errors — missing env vars, import errors, schema mismatches
- **HTTP errors** (`HTTP error: status=NNN`): The page URL itself returned a non-2xx status (e.g., 404 page not found)
- **API response errors** (`API response error: GET /api/... → NNN`): An API call made during page load returned a non-2xx status, with the server's response body included

API response errors are the most actionable — they show the exact endpoint that failed and what the server returned. When you see one, read the scenario's seed data and verify that the IDs in the URL match IDs created by the seed. For example, if the URL is `/page/items/abc-123` but the seed creates items with ID `item-1`, the API call to `/api/items/abc-123` will return 404.

### Dependents returning nothing

`codeyam editor dependents <Entity>` requires the import graph to be built first. Run:

```bash
codeyam editor analyze-imports                           # all entities
codeyam editor analyze-imports app/components/Foo.tsx    # single file
codeyam editor analyze-imports app/components/Foo.tsx app/components/Bar.tsx  # multiple files
```

Then retry `dependents`. The import graph persists in the database.

### Database missing after clone

This is expected — `db.sqlite3` is gitignored. Running `codeyam editor` detects this state (config.json exists, DB doesn't) and automatically runs `init --force` to rebuild the database and sync scenarios from the manifest.

### Dev server not starting

Check if another process holds the port:

1. Look at `.codeyam/server-state.json` for the PID and port
2. Kill any stale process
3. Restart with `codeyam editor` (the editor command starts the server)

### Step validation errors

Each step has prerequisites. If a step refuses to run:

1. Run `codeyam editor steps` to see which steps are complete
2. Complete the prerequisite steps first
3. Don't skip steps — the workflow is sequential

### Dimension mismatch

If previews look wrong or captures fail:

- Check `screenSizes` in `.codeyam/config.json` for valid dimension names
- Scenario `dimensions` must reference names defined in `screenSizes`
- Preview commands must also include `dimension` — don't omit it

### Preview not updating

If changes aren't reflected in the preview:

- The dev server may need to rebuild — check terminal output for compilation errors
- Hard-refresh the preview: `codeyam editor preview '{"path":"<current-path>","dimension":"<dimension>","forceRefresh":true}'`
- Check `codeyam editor client-errors` for runtime errors blocking render

## Anti-Patterns

**Don't loop audit/analyze-imports.** If audit fails, fix the underlying issues (missing scenarios, failing tests). Running audit repeatedly without fixing anything wastes time.

**Don't use `prisma db push --force-reset`.** This drops all data. Instead, add `@default()` values for new required columns, or make them optional (`Int?`). Use `npm run db:push`.

**Don't hardcode viewport dimensions.** Always reference named dimensions from `screenSizes` in config.json (e.g., `"Desktop"`). Don't use raw pixel values like `1440x900`.

**Don't use bash heredocs for JSON.** Braces and quotes in heredocs trigger Claude Code security warnings. Use the **Write tool** to create `.codeyam/tmp/scenario.json`, then `codeyam editor register @.codeyam/tmp/scenario.json`.

**Don't blanket-ignore `.codeyam` in `.gitignore`.** Only machine-local files are ignored with granular patterns. Shared files (`config.json`, `editor-scenarios/`, etc.) must be committable.

**Don't register scenarios for unbuilt features.** If the component or page doesn't exist yet, the scenario will capture a blank page. Build the component first, then create scenarios for what it actually renders.
