import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const airports = await prisma.airport.findMany({
      orderBy: { iata: 'asc' },
    });
    return NextResponse.json(airports);
  } catch (error) {
    console.error('Failed to fetch airports:', error);
    return NextResponse.json({ error: 'Failed to fetch airports' }, { status: 500 });
  }
}
