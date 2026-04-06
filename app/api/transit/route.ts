import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const lines = await prisma.subwayLine.findMany({
      orderBy: { lineId: 'asc' },
      include: {
        trains: { orderBy: { updatedAt: 'desc' } },
      },
    });

    const linesWithIssues = lines.filter((l) => l.status !== 'GOOD_SERVICE').length;
    const suspended = lines.filter((l) => l.status === 'SUSPENDED').length;
    const totalTrains = lines.reduce((sum, l) => sum + l.trains.length, 0);

    const summary = {
      totalLines: lines.length,
      linesWithIssues,
      suspended,
      totalTrains,
    };

    return NextResponse.json({ lines, summary });
  } catch (error) {
    console.error('Failed to fetch transit data:', error);
    return NextResponse.json({ error: 'Failed to fetch transit data' }, { status: 500 });
  }
}
