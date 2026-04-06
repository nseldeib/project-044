import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const flights = await prisma.flight.findMany({
      include: {
        origin: true,
        destination: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(flights);
  } catch (error) {
    console.error('Failed to fetch flights:', error);
    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
  }
}
