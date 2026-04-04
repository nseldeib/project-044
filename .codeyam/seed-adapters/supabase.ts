/**
 * CodeYam Seed Adapter for Supabase.
 *
 * Seeds the database and optionally signs in a user for authenticated scenarios.
 *
 * Usage: npx tsx .codeyam/seed-adapter.ts <path-to-seed-data.json>
 *
 * Input JSON format:
 * {
 *   "tableName": [{ "column": "value", ... }, ...],
 *   "_auth": {                          // optional
 *     "email": "alice@example.com",
 *     "password": "test123"             // optional — default used if omitted
 *   }
 * }
 *
 * When _auth is present, the adapter:
 * 1. Creates the user if they don't exist (auto-confirms email)
 * 2. Builds a synthetic JWT with far-future expiry (no real sign-in needed)
 * 3. Writes session cookies + auth mocks to .codeyam/tmp/seed-session.json
 *    so the CodeYam proxy can inject them into the browser
 *
 * The password field is optional — if omitted, a default dev password is used.
 * No real JWTs are stored; the preload module intercepts all auth API calls.
 *
 * Data operations use direct PostgreSQL (pg) for speed — TRUNCATE CASCADE
 * and batched INSERT are ~2x faster than individual PostgREST HTTP calls.
 *
 * Requirements:
 * - DATABASE_URL env var with a PostgreSQL connection string (session pooler recommended)
 * - A Supabase project URL (https://<ref>.supabase.co) in any env var
 * - A secret key (sb_secret_... or legacy eyJ... service_role JWT) in any env var
 *
 * The adapter scans ALL env vars by value pattern for Supabase URL and secret key —
 * no specific naming required. DATABASE_URL must be set explicitly.
 */

import { createClient } from '@supabase/supabase-js';
import { Prisma } from '@prisma/client';
import pg from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const { Client } = pg;

/**
 * Scan all env vars for values matching a pattern.
 * Returns ALL unique matches (not just the first) so callers can disambiguate.
 */
function findAllEnvByPattern(pattern: RegExp): string[] {
  const matches = new Set<string>();
  for (const value of Object.values(process.env)) {
    if (value && pattern.test(value)) matches.add(value);
  }
  return [...matches];
}

/**
 * For legacy Supabase JWTs, decode the payload to check the `role` claim.
 * Returns the role string ("service_role", "anon", etc.) or undefined.
 */
function getJwtRole(jwt: string): string | undefined {
  try {
    const payload = jwt.split('.')[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return decoded.role;
  } catch {
    return undefined;
  }
}

// Detect Supabase credentials by value pattern, not env var name.
// This works regardless of what the user named their env vars.
const supabaseUrl = findAllEnvByPattern(
  /^https:\/\/[a-z0-9]+\.supabase\.co\b/,
)[0];

// New-format keys are unambiguous by prefix
const newSecretKey = findAllEnvByPattern(/^sb_secret_/)[0];

// Legacy JWT keys — disambiguate by decoding the role claim
const legacyJwts = findAllEnvByPattern(
  /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
);
const legacyServiceRole = legacyJwts.find(
  (jwt) => getJwtRole(jwt) === 'service_role',
);

const secretKey = newSecretKey || legacyServiceRole;

if (!supabaseUrl || !secretKey) {
  console.error(
    'Could not find Supabase credentials in environment variables.',
  );
  console.error(
    'Looking for: a URL matching https://<ref>.supabase.co and a key starting with sb_secret_ (or a service_role JWT)',
  );
  console.error(
    'Add them to .env.local — the seed adapter scans all env vars by value pattern.',
  );
  process.exit(1);
}

// DATABASE_URL for direct PostgreSQL access (session pooler recommended for speed)
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || !databaseUrl.startsWith('postgresql://')) {
  console.error('DATABASE_URL must be set to a PostgreSQL connection string.');
  console.error(
    'Use the session pooler connection string (port 5432) from your Supabase dashboard.',
  );
  process.exit(1);
}

// Admin client for user management only (uses secret key to bypass RLS)
const supabase = createClient(supabaseUrl, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Derive the project ref from the URL for cookie naming
// e.g. "https://abcdefgh.supabase.co" → "abcdefgh"
function getProjectRef(): string {
  try {
    const hostname = new URL(supabaseUrl!).hostname;
    return hostname.split('.')[0];
  } catch {
    return 'unknown';
  }
}

/**
 * Build a mapping from lowercased seed-data keys to actual PostgreSQL table names.
 * Prisma creates tables with the model name (PascalCase) unless @@map is used.
 * PostgreSQL requires the exact table name, so we need this translation.
 */
function buildTableNameMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const model of Prisma.dmmf.datamodel.models) {
    // dbName is set when @@map is used, otherwise null → use model name
    const dbName = (model as any).dbName || model.name;
    // Map lowercased model name → actual table name
    const lowered = model.name.charAt(0).toLowerCase() + model.name.slice(1);
    map[lowered] = dbName;
    map[model.name] = dbName; // Also map PascalCase for safety
  }
  return map;
}

/**
 * Build column name mapping from Prisma field names to database column names.
 * Prisma uses camelCase field names but generates snake_case columns unless @map is used.
 */
function buildColumnMap(tableName: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const model of Prisma.dmmf.datamodel.models) {
    const dbName = (model as any).dbName || model.name;
    if (dbName !== tableName) continue;
    for (const field of model.fields) {
      if (field.kind === 'object') continue; // Skip relation fields
      const colName = (field as any).dbName || field.name;
      map[field.name] = colName;
    }
    break;
  }
  return map;
}

async function seedTables(seed: Record<string, unknown[]>) {
  if (Object.keys(seed).length === 0) return;

  const tableMap = buildTableNameMap();

  // Discover ALL models from the Prisma schema — not just the tables in the seed data.
  // This ensures FK-dependent tables are cleared even when the seed only contains
  // the parent table's data.
  const allTables = Prisma.dmmf.datamodel.models.map(
    (m) => (m as any).dbName || m.name,
  );

  console.log(
    `Clearing ${allTables.length} tables, seeding: ${Object.keys(seed).join(', ')}`,
  );

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    // TRUNCATE all tables in one statement — CASCADE handles FK dependencies
    // automatically, so table order doesn't matter. Much faster than
    // individual DELETE FROM queries via PostgREST.
    const quoted = allTables.map((t) => `"${t}"`).join(', ');
    await client.query(`TRUNCATE ${quoted} CASCADE`);
    console.log(`  Cleared ${allTables.length} tables`);

    // Reset auto-increment sequences so IDs start from 1 on each scenario switch.
    // Without this, IDs keep climbing and hardcoded URLs like /drinks/1 break.
    for (const table of allTables) {
      try {
        await client.query(
          `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), 1, false)`,
        );
      } catch {
        // Table may not have an 'id' serial column — skip
      }
    }

    // Insert seed data using batched INSERT for speed
    for (const [seedKey, rows] of Object.entries(seed)) {
      if (!Array.isArray(rows) || rows.length === 0) continue;
      const table = tableMap[seedKey] || seedKey;
      const columnMap = buildColumnMap(table);

      // Get column names from the first row's keys, mapped to DB column names
      const fieldNames = Object.keys(rows[0] as Record<string, unknown>);
      const dbColumns = fieldNames.map((f) => columnMap[f] || f);
      const quotedCols = dbColumns.map((c) => `"${c}"`).join(', ');

      // Build parameterized VALUES clause for all rows at once
      const params: unknown[] = [];
      const valueClauses: string[] = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i] as Record<string, unknown>;
        const placeholders: string[] = [];
        for (const field of fieldNames) {
          params.push(row[field]);
          placeholders.push(`$${params.length}`);
        }
        valueClauses.push(`(${placeholders.join(', ')})`);
      }

      await client.query(
        `INSERT INTO "${table}" (${quotedCols}) VALUES ${valueClauses.join(', ')}`,
        params,
      );
      console.log(`  Seeded ${rows.length} rows into ${table}`);
    }
  } finally {
    await client.end();
  }
}

/**
 * Export mode: dump current database state to a JSON file.
 * Used by CodeYam to save interactive changes back to scenario seed data.
 *
 * Usage: npx tsx .codeyam/seed-adapter.ts --export <output-path.json>
 */
async function exportData(outputPath: string) {
  const tableMap = buildTableNameMap();
  const modelNames = Prisma.dmmf.datamodel.models.map((m) => m.name);

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    const seed: Record<string, unknown[]> = {};
    for (const model of modelNames) {
      const camelCase = model.charAt(0).toLowerCase() + model.slice(1);
      const table = tableMap[camelCase] || model;
      try {
        const result = await client.query(`SELECT * FROM "${table}"`);
        if (result.rows.length > 0) {
          seed[camelCase] = result.rows;
        }
      } catch {
        // Skip tables that can't be queried
      }
    }

    fs.writeFileSync(outputPath, JSON.stringify(seed, null, 2));
    console.log(`Exported ${Object.keys(seed).length} tables`);
  } finally {
    await client.end();
  }
}

/**
 * Build a minimal JWT with a far-future expiry.
 * The signature is fake — it doesn't matter because the CodeYam preload module
 * intercepts the Supabase auth validation endpoint and returns mock data.
 */
function buildFakeJwt(userId: string, email: string): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: userId,
    email,
    role: 'authenticated',
    aud: 'authenticated',
    exp: 9999999999,
    iat: Math.floor(Date.now() / 1000),
  };
  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');
  return `${encode(header)}.${encode(payload)}.codeyam-mock-signature`;
}

/**
 * Build a Supabase user response object matching the /auth/v1/user endpoint format.
 */
function buildUserResponse(user: { id: string; email?: string }) {
  return {
    id: user.id,
    aud: 'authenticated',
    role: 'authenticated',
    email: user.email || '',
    email_confirmed_at: new Date().toISOString(),
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {},
    created_at: new Date().toISOString(),
  };
}

const DEFAULT_AUTH_PASSWORD = 'codeyam-dev-password-123!';

/**
 * Handle auth: create user, build synthetic session, write session cookies.
 * Returns the user ID so callers can replace __AUTH_USER_ID__ placeholders in seed data.
 *
 * No real sign-in is performed — the session cookie uses a synthetic JWT with
 * far-future expiry, and externalApis mocks intercept all Supabase auth API calls.
 * This avoids storing real tokens (security risk + expiration) in scenario files.
 */
async function handleAuth(auth: {
  email: string;
  password?: string;
}): Promise<string> {
  const email = auth.email;
  const password = auth.password || DEFAULT_AUTH_PASSWORD;

  // Create user if they don't exist (auto-confirm email)
  // We still need the auth.users row for PostgREST FK relationships.
  const { data: createData, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  let userId: string;

  if (createError) {
    if (createError.message.includes('already been registered')) {
      // User exists — look up their ID
      const { data: listData } = await supabase.auth.admin.listUsers();
      const existingUser = listData?.users?.find((u) => u.email === email);
      if (existingUser) {
        userId = existingUser.id;
        console.log(`  Found existing user ${email} (user: ${userId})`);
      } else {
        console.error(
          `  User ${email} reported as registered but not found in listUsers`,
        );
        process.exit(1);
      }
    } else {
      console.error(`  Failed to create auth user: ${createError.message}`);
      process.exit(1);
    }
  } else {
    userId = createData!.user.id;
    console.log(`  Created user ${email} (user: ${userId})`);
  }

  // Build synthetic JWT and mock responses — no real sign-in needed.
  // The preload module intercepts server-side getUser() calls so Next.js
  // middleware returns the mock user without hitting real Supabase.
  const fakeJwt = buildFakeJwt(userId!, email);
  const userResponse = buildUserResponse({ id: userId!, email });

  const projectRef = getProjectRef();
  const sessionOutput = {
    cookies: [
      {
        name: `sb-${projectRef}-auth-token`,
        value: JSON.stringify({
          access_token: fakeJwt,
          refresh_token: 'codeyam-mock-refresh-token',
          token_type: 'bearer',
          expires_in: 315360000,
          expires_at: 9999999999,
        }),
        path: '/',
        sameSite: 'Lax' as const,
      },
    ],
    externalApis: {
      [`${supabaseUrl}/auth/v1/user`]: {
        body: userResponse,
        status: 200,
      },
      [`${supabaseUrl}/auth/v1/token`]: {
        body: {
          access_token: fakeJwt,
          token_type: 'bearer',
          expires_in: 315360000,
          expires_at: 9999999999,
          refresh_token: 'codeyam-mock-refresh-token',
          user: userResponse,
        },
        status: 200,
      },
    },
  };

  const outputDir = path.join(process.cwd(), '.codeyam', 'tmp');
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'seed-session.json');
  fs.writeFileSync(outputPath, JSON.stringify(sessionOutput, null, 2));
  console.log(`  Session cookies + auth mocks written to ${outputPath}`);

  return userId!;
}

/**
 * Replace __AUTH_USER_ID__ placeholders in seed data with the actual Supabase user ID.
 * This lets scenarios reference the authenticated user in foreign key columns (e.g. user_id)
 * without knowing the UUID ahead of time.
 */
function replaceAuthPlaceholders(
  seed: Record<string, unknown[]>,
  userId: string,
): Record<string, unknown[]> {
  const json = JSON.stringify(seed);
  const replaced = json.replace(/__AUTH_USER_ID__/g, userId);
  return JSON.parse(replaced);
}

async function main() {
  const seedDataPath = process.argv[2];
  if (!seedDataPath) {
    console.error('Usage: npx tsx .codeyam/seed-adapter.ts <seed-data.json>');
    process.exit(1);
  }

  const raw = fs.readFileSync(seedDataPath, 'utf-8');
  const data = JSON.parse(raw);

  // Separate auth config from table data
  const auth = data._auth;
  let seed: Record<string, unknown[]> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === '_auth') continue;
    seed[key] = value as unknown[];
  }

  // Auth first: we need the user ID to replace __AUTH_USER_ID__ placeholders
  // in seed data (e.g. for user_id foreign key columns with Supabase RLS)
  if (auth) {
    const userId = await handleAuth(
      auth as { email: string; password?: string },
    );
    seed = replaceAuthPlaceholders(seed, userId);
  }

  await seedTables(seed);

  console.log('Seed complete');
}

if (process.argv[2] === '--export') {
  exportData(process.argv[3]).catch((e) => {
    console.error('Seed adapter export error:', e);
    process.exit(1);
  });
} else {
  main().catch((e) => {
    console.error('Seed adapter error:', e);
    process.exit(1);
  });
}
