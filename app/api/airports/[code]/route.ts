import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const airport = await prisma.airport.findUnique({
      where: { iata: code.toUpperCase() },
    });

    if (!airport) {
      return NextResponse.json({ error: 'Airport not found' }, { status: 404 });
    }

    const [departures, arrivals] = await Promise.all([
      prisma.flight.findMany({
        where: { originId: airport.id },
        include: { origin: true, destination: true },
        orderBy: { departureTime: 'asc' },
      }),
      prisma.flight.findMany({
        where: { destinationId: airport.id },
        include: { origin: true, destination: true },
        orderBy: { arrivalTime: 'asc' },
      }),
    ]);

    return NextResponse.json({ airport, departures, arrivals });
  } catch (error) {
    console.error('Failed to fetch airport:', error);
    return NextResponse.json({ error: 'Failed to fetch airport' }, { status: 500 });
  }
}
