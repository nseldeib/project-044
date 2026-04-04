/**
 * CodeYam Seed Adapter for Prisma + SQLite.
 *
 * Reads a JSON seed data file (path passed as CLI arg), wipes all tables,
 * then inserts the seed data using Prisma.
 *
 * Usage: npx tsx .codeyam/seed-adapter.ts <path-to-seed-data.json>
 *
 * The JSON file has the format:
 * {
 *   "type": "application",
 *   "seed": {
 *     "tableName": [{ "column": "value", ... }, ...]
 *   },
 *   "externalApis": { ... }  // optional, not used by this adapter
 * }
 */

import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as fs from 'fs';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const seedDataPath = process.argv[2];
  if (!seedDataPath) {
    console.error('Usage: npx tsx .codeyam/seed-adapter.ts <seed-data.json>');
    process.exit(1);
  }

  const raw = fs.readFileSync(seedDataPath, 'utf-8');
  const data = JSON.parse(raw);
  const seed = data.seed || data;

  // Discover ALL models from the Prisma schema — not just the tables in the seed data.
  // This ensures FK-dependent tables (e.g., Passenger → Flight) are cleared even when
  // the seed only contains the parent table's data.
  const allModels = Prisma.dmmf.datamodel.models.map(
    (m) => m.name.charAt(0).toLowerCase() + m.name.slice(1),
  );

  // Run everything in a single transaction for atomicity and speed.
  // SQLite auto-commits each statement by default — wrapping in a transaction
  // avoids per-statement fsync and is significantly faster for bulk operations.
  await prisma.$transaction(async (tx) => {
    // Disable foreign key checks during wipe+insert — allows deleting in any
    // order and avoids FK constraint errors during the brief window between
    // clearing parent and child tables.
    await tx.$executeRawUnsafe('PRAGMA foreign_keys = OFF');

    // Wipe ALL tables in the schema (not just seeded ones)
    for (const table of [...allModels].reverse()) {
      try {
        await (tx as any)[table].deleteMany();
      } catch {
        // Table may not exist in current schema — skip
      }
    }

    // Batch-reset auto-increment counters for ALL tables.
    // Without this, SQLite IDs keep climbing across scenario switches,
    // causing hardcoded URLs like /drinks/1 to 404.
    const seqNames = allModels
      .flatMap((t) => [`'${t}'`, `'${t.charAt(0).toUpperCase() + t.slice(1)}'`])
      .join(', ');
    try {
      await tx.$executeRawUnsafe(
        `DELETE FROM sqlite_sequence WHERE name IN (${seqNames})`,
      );
    } catch {
      // sqlite_sequence may not exist — safe to ignore
    }

    // Insert seed data
    for (const [table, rows] of Object.entries(seed)) {
      if (!Array.isArray(rows) || rows.length === 0) continue;
      try {
        await (tx as any)[table].createMany({ data: rows });
        console.log(`  Seeded ${rows.length} rows into ${table}`);
      } catch (err) {
        console.error(
          `  Failed to seed ${table}: ${err instanceof Error ? err.message : err}`,
        );
        process.exit(1);
      }
    }

    // Re-enable foreign key checks
    await tx.$executeRawUnsafe('PRAGMA foreign_keys = ON');
  });

  console.log('Seed complete');
}

/**
 * Export mode: dump current database state to a JSON file.
 * Used by CodeYam to save interactive changes back to scenario seed data.
 *
 * Usage: npx tsx .codeyam/seed-adapter.ts --export <output-path.json>
 */
async function exportData(outputPath: string) {
  const modelNames = Prisma.dmmf.datamodel.models.map((m) => m.name);

  const seed: Record<string, unknown[]> = {};
  for (const model of modelNames) {
    const camelCase = model.charAt(0).toLowerCase() + model.slice(1);
    try {
      const rows = await (prisma as any)[camelCase].findMany();
      if (rows.length > 0) {
        seed[camelCase] = rows;
      }
    } catch {
      // Skip tables that can't be queried
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(seed, null, 2));
  console.log(`Exported ${Object.keys(seed).length} tables`);
}

if (process.argv[2] === '--export') {
  exportData(process.argv[3])
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error('Seed adapter export error:', e);
      process.exit(1);
    });
} else {
  main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error('Seed adapter error:', e);
      process.exit(1);
    });
}
