// Example API route using Prisma.
// Import prisma from the singleton — do NOT create a new PrismaClient here.

import { prisma } from '@/app/lib/prisma';

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return Response.json(todos);
}

export async function POST(request: Request) {
  const { title } = await request.json();
  const todo = await prisma.todo.create({ data: { title } });
  return Response.json(todo);
}
