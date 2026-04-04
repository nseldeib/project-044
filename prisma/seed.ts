// Seed script for populating the database with demo data.
//
// Run with: npx tsx prisma/seed.ts
// Or:       npm run db:seed
//
// IMPORTANT: This file must use the same adapter pattern as app/lib/prisma.ts.
// Do NOT use `new PrismaClient()` without the adapter — Prisma 7 requires it.

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.todo.deleteMany();

  // Seed with demo data
  await prisma.todo.createMany({
    data: [
      { title: 'Set up the project', completed: true },
      { title: 'Build the first feature' },
      { title: 'Add more scenarios' },
    ],
  });

  const count = await prisma.todo.count();
  console.log(`Seeded ${count} todos`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
