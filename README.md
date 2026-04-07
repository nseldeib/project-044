# VECTOR — Movement Intelligence Platform

Real-time multi-modal movement tracker for NYC and global air traffic. Track live aircraft positions (OpenSky Network), Citi Bike station availability, and NYC MTA subway status — all in a single tactical command interface with a NASA mission control aesthetic.

## Setup

Run the setup script to install dependencies, initialize the database, and seed it with demo data:

```bash
npm run setup
```

## Development

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Live Data Sources

VECTOR integrates two free public APIs — no API keys required:

| Source | Data | Endpoint |
|--------|------|----------|
| [OpenSky Network](https://opensky-network.org) | Real-time global aircraft positions | `POST /api/flights/sync` (called automatically on the Air Traffic page) |
| [Citi Bike GBFS](https://gbfs.citibikenyc.com) | NYC bike station availability | `GET /api/bikes` (syncs automatically, cached 60s) |

Map tiles are served via Carto Dark Matter through a server-side tile proxy at `/api/tiles` to avoid CORS issues in screenshot capture.

## Using CodeYam Editor

This project was built with [CodeYam](https://codeyam.com). To launch the editor:

```bash
codeyam editor
```

The editor provides a live preview alongside a Claude Code terminal for iterating on the app.

## Database

This project uses SQLite via Prisma. Common commands:

```bash
npm run db:push    # Apply schema changes and generate Prisma client
npm run db:seed    # Seed the database with demo data
npm run db:reset   # Reset database: drop, recreate, and re-seed
```

## Scripts

| Script             | Description                                  |
| ------------------ | -------------------------------------------- |
| `npm run setup`    | One-line project setup (install + db + seed) |
| `npm run dev`      | Start the development server                 |
| `npm run build`    | Build for production                         |
| `npm run test`     | Run tests                                    |
| `npm run db:push`  | Apply Prisma schema changes                  |
| `npm run db:seed`  | Seed the database                            |
| `npm run db:reset` | Reset and re-seed the database               |
