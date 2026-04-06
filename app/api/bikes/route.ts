import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const stations = await prisma.bikeStation.findMany({
      orderBy: { name: 'asc' },
    });

    const totalBikes = stations.reduce((sum, s) => sum + s.bikesAvailable, 0);
    const totalDocks = stations.reduce((sum, s) => sum + s.docksAvailable, 0);
    const stationsLow = stations.filter((s) => s.bikesAvailable < 3).length;
    const stationsEmpty = stations.filter((s) => s.bikesAvailable === 0 && s.isRenting).length;

    const summary = {
      totalStations: stations.length,
      totalBikes,
      totalDocks,
      stationsLow,
      stationsEmpty,
    };

    return NextResponse.json({ stations, summary });
  } catch (error) {
    console.error('Failed to fetch bike stations:', error);
    return NextResponse.json({ error: 'Failed to fetch bike stations' }, { status: 500 });
  }
}
