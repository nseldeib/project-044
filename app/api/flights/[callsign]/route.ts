import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ callsign: string }> }
) {
  try {
    const { callsign } = await params;
    const flight = await prisma.flight.findUnique({
      where: { callsign: callsign.toUpperCase() },
      include: {
        origin: true,
        destination: true,
        alerts: { orderBy: { createdAt: 'desc' } },
        watchlistItems: true,
      },
    });

    if (!flight) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    return NextResponse.json(flight);
  } catch (error) {
    console.error('Failed to fetch flight:', error);
    return NextResponse.json({ error: 'Failed to fetch flight' }, { status: 500 });
  }
}
